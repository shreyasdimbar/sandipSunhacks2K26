/**
 * TRACE Query Controller
 *
 * POST /api/query
 *
 * Validates input and delegates to the query engine which handles
 * vector retrieval + graph retrieval + LLM reasoning.
 */

import { queryIntelligence } from "../services/queryEngine.js";
import { logRequest, logError } from "../utils/logger.js";

export async function queryTrace(req, res) {
  const { question } = req.body;

  // ── Validate ──────────────────────────────────────────────────────
  if (!question) {
    return res.status(400).json({
      status: "error",
      message: "Missing required field: question",
    });
  }

  try {
    const result = await queryIntelligence(question);

    logRequest("POST /api/query", {
      question,
      answerLength: result.answer.length,
      documents: result.sources.documents.length,
      decisions: result.sources.decisions.length,
    });

    return res.status(200).json(result);
  } catch (error) {
    logError("POST /api/query", error);

    return res.status(500).json({
      status: "error",
      message: "TRACE intelligence query failed",
      detail: error.message,
    });
  }
}
