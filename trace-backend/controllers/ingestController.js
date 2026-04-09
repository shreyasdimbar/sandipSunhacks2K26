/**
 * TRACE Ingest Controller
 *
 * POST /api/ingest
 *
 * Validates input and delegates to the ingestion service which handles
 * the full dual-memory pipeline (ChromaDB + Neo4j).
 */

import { ingestMessage } from "../services/ingestionService.js";
import { logRequest, logError } from "../utils/logger.js";

export async function ingestData(req, res) {
  const { text, source, author, timestamp } = req.body;

  // ── Validate required fields ──────────────────────────────────────
  const missing = [];
  if (!text)      missing.push("text");
  if (!source)    missing.push("source");
  if (!author)    missing.push("author");
  if (!timestamp) missing.push("timestamp");

  if (missing.length > 0) {
    return res.status(400).json({
      status: "error",
      message: `Missing required field(s): ${missing.join(", ")}`,
    });
  }

  try {
    const result = await ingestMessage({ text, source, author, timestamp });

    logRequest("POST /api/ingest", {
      messageId: result.messageId,
      chunks: result.vectorChunks,
      graphStored: !!result.graph,
    });

    return res.status(200).json({
      status: "stored in TRACE memory",
      ...result,
    });
  } catch (error) {
    logError("POST /api/ingest", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to ingest into TRACE memory",
      detail: error.message,
    });
  }
}
