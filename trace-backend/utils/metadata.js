/**
 * TRACE Metadata Generation Utility
 *
 * Generates standardised metadata objects for documents, chunks,
 * and graph nodes throughout the TRACE pipeline.
 */

import { v4 as uuidv4 } from "uuid";

/**
 * Generate a unique message ID.
 * @returns {string} UUID v4
 */
export function generateMessageId() {
  return uuidv4();
}

/**
 * Generate a unique decision ID.
 * @returns {string} UUID v4
 */
export function generateDecisionId() {
  return uuidv4();
}

/**
 * Build chunk metadata from ingestion input.
 *
 * @param {object} params
 * @param {string} params.messageId
 * @param {string} params.source
 * @param {string} params.author
 * @param {string} params.timestamp
 * @returns {object} Standardised metadata for ChromaDB storage.
 */
export function buildChunkMetadata({ messageId, source, author, timestamp }) {
  return {
    messageId,
    source,
    author,
    timestamp,
    ingestedAt: new Date().toISOString(),
  };
}

/**
 * Build a document summary for response payloads.
 *
 * @param {object} params
 * @param {string} params.messageId
 * @param {string} params.source
 * @param {string} params.author
 * @param {number} params.chunkCount
 * @param {object|null} params.graphResult
 * @returns {object}
 */
export function buildIngestResponse({
  messageId,
  source,
  author,
  chunkCount,
  graphResult,
}) {
  return {
    status: "stored in TRACE memory",
    messageId,
    source,
    author,
    vectorChunks: chunkCount,
    graph: graphResult,
  };
}
