/**
 * TRACE Ingestion Service
 *
 * Orchestrates the full ingest pipeline:
 *
 *   Text Input → Chunk → Embed → ChromaDB
 *                      → Extract Entities → Neo4j (nodes + relationships)
 */

import { chunkText } from "../utils/chunker.js";
import { extractEntities } from "../utils/entityExtractor.js";
import {
  buildChunkMetadata,
  generateMessageId,
  generateDecisionId,
} from "../utils/metadata.js";
import { logInfo, logError, logWarn } from "../utils/logger.js";
import { storeChunks } from "./vectorService.js";
import {
  createPersonNode,
  createDecisionNode,
  createReasonNode,
  createEventNode,
  createDocumentNode,
  linkPersonToDecision,
  linkDecisionToReason,
  linkDecisionToDocument,
  linkEventToDecision,
} from "./graphService.js";

/**
 * Run the full ingestion pipeline for a single message.
 *
 * @param {object}  params
 * @param {string}  params.text
 * @param {string}  params.source
 * @param {string}  params.author
 * @param {string}  params.timestamp
 * @returns {Promise<object>} Ingestion result summary.
 */
export async function ingestMessage({ text, source, author, timestamp }) {
  const messageId = generateMessageId();

  // ═══════════════════════════════════════════════════════════════════
  //  1.  VECTOR MEMORY — Chunk → Embed → ChromaDB
  // ═══════════════════════════════════════════════════════════════════
  const metadata = buildChunkMetadata({ messageId, source, author, timestamp });
  const chunks = await chunkText(text, metadata);
  await storeChunks(chunks, messageId);

  logInfo("INGEST_VECTOR_DONE", { messageId, chunks: chunks.length });

  // ═══════════════════════════════════════════════════════════════════
  //  2.  GRAPH MEMORY — Extract Entities → Neo4j
  // ═══════════════════════════════════════════════════════════════════
  let graphResult = null;

  try {
    const entities = await extractEntities(text, author);

    if (entities.decision) {
      const decisionId = generateDecisionId();

      // Create nodes
      for (const person of entities.persons) {
        await createPersonNode(person);
      }
      await createDecisionNode(decisionId, entities.decision);
      await createDocumentNode(messageId, source);

      // Relationships: each person MADE the decision
      for (const person of entities.persons) {
        await linkPersonToDecision(person, decisionId);
      }

      // Decision MENTIONED_IN Document
      await linkDecisionToDocument(decisionId, messageId);

      // Decision BASED_ON Reason
      if (entities.reason) {
        await createReasonNode(entities.reason);
        await linkDecisionToReason(decisionId, entities.reason);
      }

      // Event CAUSED_BY Decision
      if (entities.event) {
        await createEventNode(entities.event);
        await linkEventToDecision(entities.event, decisionId);
      }

      graphResult = {
        decisionId,
        decision: entities.decision,
        reason: entities.reason,
        event: entities.event,
        persons: entities.persons,
      };

      logInfo("INGEST_GRAPH_DONE", { messageId, decisionId });
    } else {
      logWarn("INGEST_GRAPH_SKIP", { messageId, reason: "No decision extracted" });
    }
  } catch (graphError) {
    // Graph failure is non-blocking — vector memory is already persisted
    logError("INGEST_GRAPH_FAILED", graphError, { messageId });
  }

  return {
    messageId,
    source,
    author,
    vectorChunks: chunks.length,
    graph: graphResult,
  };
}
