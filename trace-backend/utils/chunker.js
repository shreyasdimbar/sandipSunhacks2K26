/**
 * TRACE Text Chunking Utility
 *
 * Splits raw text into overlapping chunks suitable for embedding.
 * Uses LangChain's RecursiveCharacterTextSplitter under the hood.
 */

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const DEFAULT_CHUNK_SIZE = 500;
const DEFAULT_CHUNK_OVERLAP = 100;

/**
 * Split text into chunks with attached metadata.
 *
 * @param {string}  text                    - Raw input text.
 * @param {object}  metadata                - Metadata attached to every chunk.
 * @param {object}  [options]               - Optional overrides.
 * @param {number}  [options.chunkSize]      - Max characters per chunk.
 * @param {number}  [options.chunkOverlap]   - Overlap between consecutive chunks.
 * @returns {Promise<Array<{ content: string, metadata: object }>>}
 */
export async function chunkText(text, metadata = {}, options = {}) {
  const {
    chunkSize = DEFAULT_CHUNK_SIZE,
    chunkOverlap = DEFAULT_CHUNK_OVERLAP,
  } = options;

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
  });

  const docs = await splitter.createDocuments([text]);

  return docs.map((doc, index) => ({
    content: doc.pageContent,
    metadata: {
      ...metadata,
      chunkIndex: index,
      chunkTotal: docs.length,
    },
  }));
}
