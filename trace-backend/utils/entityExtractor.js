/**
 * TRACE Entity Extraction Utility
 *
 * Uses an LLM (via LangChain) to extract structured entities
 * (decision, reason, event, persons) from company communications.
 */

import { ChatOpenAI } from "@langchain/openai";
import { logError, logInfo } from "./logger.js";

let llm = null;

function getLLM() {
  if (!llm) {
    llm = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0,
    });
  }
  return llm;
}

/**
 * Extract structured entities from a company communication.
 *
 * @param {string} text   - The raw communication.
 * @param {string} author - The author / sender.
 * @returns {Promise<{
 *   persons:  string[],
 *   decision: string | null,
 *   reason:   string | null,
 *   event:    string | null
 * }>}
 */
export async function extractEntities(text, author) {
  const prompt = `Analyze the following company communication and extract structured entities.

Author: ${author}

Communication:
"""
${text}
"""

Extract:
1. persons  — Array of all people mentioned (include the author). Return as JSON array of strings.
2. decision — What decision was made or proposed? (short phrase, or null)
3. reason   — Why was this decision made? (short phrase, or null)
4. event    — Any event, incident, or consequence mentioned? (short phrase, or null)

Return ONLY valid JSON with no markdown fences:
{
  "persons": ["..."],
  "decision": "..." or null,
  "reason": "..." or null,
  "event": "..." or null
}`;

  try {
    const model = getLLM();
    const response = await model.invoke(prompt);
    const content = response.content.trim();
    const parsed = JSON.parse(content);

    // Ensure author is always included in persons
    const persons = Array.isArray(parsed.persons) ? parsed.persons : [];
    if (!persons.includes(author)) {
      persons.unshift(author);
    }

    const result = {
      persons,
      decision: parsed.decision || null,
      reason: parsed.reason || null,
      event: parsed.event || null,
    };

    logInfo("ENTITY_EXTRACTION_SUCCESS", {
      author,
      decision: result.decision,
      personsCount: result.persons.length,
    });

    return result;
  } catch (error) {
    logError("ENTITY_EXTRACTION_FAILED", error, { author });

    // Return minimal fallback so the pipeline continues
    return {
      persons: [author],
      decision: null,
      reason: null,
      event: null,
    };
  }
}
