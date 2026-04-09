/**
 * TRACE Vector Service
 *
 * Manages the ChromaDB connection, embedding generation,
 * document storage, and similarity search.
 */

import { ChromaClient } from "chromadb";
import { OpenAIEmbeddings } from "@langchain/openai";
import { logInfo, logError } from "../utils/logger.js";

// ── Configuration ───────────────────────────────────────────────────
const COLLECTION_NAME = "trace_memory";
const TOP_K = 6;

// ── Singletons ──────────────────────────────────────────────────────
let chromaClient = null;
let collection = null;
let embeddings = null;

/**
 * Initialise ChromaDB client + OpenAI embeddings.
 * Safe to call multiple times — reuses existing instances.
 */
export async function initVectorService() {
  if (collection && embeddings) return;

  try {
    chromaClient = new ChromaClient({
      path: process.env.CHROMA_URL || "http://localhost:8000",
    });

    collection = await chromaClient.getOrCreateCollection({
      name: COLLECTION_NAME,
    });

    embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "text-embedding-3-small",
    });

    logInfo("VECTOR_SERVICE_INIT", { collection: COLLECTION_NAME, status: "connected" });
  } catch (error) {
    logError("VECTOR_SERVICE_INIT", error);
    throw error;
  }
}

/**
 * Store pre-chunked documents in ChromaDB.
 *
 * @param {Array<{ content: string, metadata: object }>} chunks
 * @param {string} messageId - Parent message ID (used as ID prefix).
 */
export async function storeChunks(chunks, messageId) {
  await initVectorService();

  try {
    const ids = chunks.map((_, i) => `${messageId}_chunk_${i}`);
    const documents = chunks.map((c) => c.content);
    const metadatas = chunks.map((c) => c.metadata);

    const vectors = await embeddings.embedDocuments(documents);

    await collection.add({ ids, documents, metadatas, embeddings: vectors });

    logInfo("VECTOR_STORE", { messageId, chunksStored: chunks.length });
  } catch (error) {
    logError("VECTOR_STORE", error, { messageId });
    throw error;
  }
}

/**
 * Retrieve the top-K most similar chunks for a query.
 *
 * @param {string} query          - Natural-language question.
 * @param {number} [topK=TOP_K]   - Number of results.
 * @returns {Promise<string[]>}   - Array of matching text chunks.
 */
export async function retrieveChunks(query, topK = TOP_K) {
  await initVectorService();

  try {
    const queryVector = await embeddings.embedQuery(query);

    const results = await collection.query({
      queryEmbeddings: [queryVector],
      nResults: topK,
    });

    const docs = results.documents?.[0] ?? [];
    logInfo("VECTOR_RETRIEVE", { query, resultsFound: docs.length });
    return docs;
  } catch (error) {
    logError("VECTOR_RETRIEVE", error, { query });
    throw error;
  }
}
