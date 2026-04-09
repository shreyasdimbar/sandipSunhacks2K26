/**
 * TRACE Query Intelligence Engine
 *
 * Orchestrates the full query pipeline:
 *
 *   Question → Vector Retrieval (ChromaDB)
 *            → Graph Retrieval  (Neo4j)
 *            → Context Fusion
 *            → LLM Reasoning    (GPT-4o-mini)
 *            → Structured Response
 */

import { ChatOpenAI } from "@langchain/openai";
import { retrieveChunks } from "./vectorService.js";
import { getRelatedDecisions, getAllDecisions } from "./graphService.js";
import { logInfo, logError, logWarn } from "../utils/logger.js";

// ── LLM singleton ───────────────────────────────────────────────────
let llm = null;

function getLLM() {
  if (!llm) {
    llm = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.3,
    });
  }
  return llm;
}

// ── Constants ───────────────────────────────────────────────────────
const VECTOR_TOP_K = 6;
const GRAPH_LIMIT = 10;

// ─────────────────────────────────────────────────────────────────────
//  1  Context Retrieval
// ─────────────────────────────────────────────────────────────────────

async function getVectorContext(question) {
  try {
    const chunks = await retrieveChunks(question, VECTOR_TOP_K);
    logInfo("QE_VECTOR", { question, results: chunks.length });
    return chunks;
  } catch (error) {
    logWarn("QE_VECTOR_FAIL", { question, error: error.message });
    return [];
  }
}

async function getGraphContext(question) {
  try {
    let decisions = await getRelatedDecisions(question, GRAPH_LIMIT);

    if (decisions.length === 0) {
      decisions = await getAllDecisions(GRAPH_LIMIT);
    }

    logInfo("QE_GRAPH", { question, results: decisions.length });
    return decisions;
  } catch (error) {
    logWarn("QE_GRAPH_FAIL", { question, error: error.message });
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────
//  2  Context Fusion
// ─────────────────────────────────────────────────────────────────────

function fuseContext(vectorChunks, graphDecisions) {
  let fused = "";

  // Vector knowledge
  if (vectorChunks.length > 0) {
    fused += "VECTOR KNOWLEDGE (semantic documents):\n";
    vectorChunks.forEach((chunk, i) => {
      fused += `  [${i + 1}] ${chunk}\n`;
    });
    fused += "\n";
  } else {
    fused += "VECTOR KNOWLEDGE: No relevant documents found.\n\n";
  }

  // Graph knowledge
  if (graphDecisions.length > 0) {
    fused += "GRAPH KNOWLEDGE (decision chains):\n";
    graphDecisions.forEach((d, i) => {
      let line = `  [${i + 1}] ${d.person} MADE decision: "${d.decision}"`;
      if (d.reason) line += ` BASED ON: "${d.reason}"`;
      if (d.event)  line += ` | Event: "${d.event}"`;
      if (d.source) line += ` | Source: ${d.source}`;
      fused += line + "\n";
    });
    fused += "\n";
  } else {
    fused += "GRAPH KNOWLEDGE: No decision chains found.\n\n";
  }

  return fused;
}

// ─────────────────────────────────────────────────────────────────────
//  3  LLM Reasoning
// ─────────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are TRACE — Trace Reasoning And Context Engine.
You are an AI system that understands company knowledge, decisions, discussions, and operational context.

Using the provided knowledge, answer the user's question.

Rules:
• Answer using evidence from the provided context only.
• Use graph relationships to explain decision chains when relevant.
• If the question asks about decisions, explain who made the decision, why, and the consequences.
• If the question asks about knowledge, summarize relevant discussions clearly.
• If the question asks about impact, explain downstream consequences.
• If context is insufficient, say so honestly — do not hallucinate.
• Structure your answer clearly with paragraphs. Be concise but thorough.
• When citing sources, mention the document source type and author if available.`;

async function reason(question, fusedContext) {
  const userPrompt = `CONTEXT:\n${fusedContext}\nUSER QUESTION:\n${question}`;

  try {
    const model = getLLM();
    const response = await model.invoke([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user",   content: userPrompt },
    ]);

    logInfo("QE_LLM", { question, answerLen: response.content.length });
    return response.content;
  } catch (error) {
    logError("QE_LLM", error, { question });
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────
//  4  Source Attribution
// ─────────────────────────────────────────────────────────────────────

function buildSources(vectorChunks, graphDecisions) {
  const documents = vectorChunks.map((chunk, i) => ({
    index: i + 1,
    text: chunk,
  }));

  const decisions = graphDecisions.map((d) => ({
    person:     d.person,
    decision:   d.decision,
    reason:     d.reason  ?? null,
    event:      d.event   ?? null,
    documentId: d.documentId ?? null,
    source:     d.source  ?? null,
  }));

  return { documents, decisions };
}

// ─────────────────────────────────────────────────────────────────────
//  Public API
// ─────────────────────────────────────────────────────────────────────

/**
 * Run the full TRACE Intelligence Query pipeline.
 *
 * @param {string} question
 * @returns {Promise<{ question: string, answer: string, sources: object }>}
 */
export async function queryIntelligence(question) {
  logInfo("QE_START", { question });

  // 1. Parallel retrieval
  const [vectorChunks, graphDecisions] = await Promise.all([
    getVectorContext(question),
    getGraphContext(question),
  ]);

  // 2. Fuse
  const fusedContext = fuseContext(vectorChunks, graphDecisions);

  // 3. Reason
  let answer;
  try {
    answer = await reason(question, fusedContext);
  } catch (_err) {
    answer =
      "TRACE reasoning engine encountered an error. Returning raw context instead.\n\n" +
      fusedContext;
  }

  // 4. Sources
  const sources = buildSources(vectorChunks, graphDecisions);

  logInfo("QE_COMPLETE", {
    question,
    vectorResults: vectorChunks.length,
    graphResults: graphDecisions.length,
    answerLen: answer.length,
  });

  return { question, answer, sources };
}
