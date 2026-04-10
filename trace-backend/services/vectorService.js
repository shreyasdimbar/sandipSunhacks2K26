/**
 * TRACE Vector Service
 *
 * Manages the ChromaDB connection, embedding generation,
 * document storage, and similarity search.
 */

import { ChromaClient } from "chromadb";
import { OpenAIEmbeddings } from "@langchain/openai";
import { logInfo, logError, logWarn } from "../utils/logger.js";

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
  // If already initialised, return immediately
  if (collection && embeddings) return;

  try {
    // 1. Validate OpenAI API Key
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes("...")) {
      throw new Error("Missing or invalid OPENAI_API_KEY in environment variables.");
    }

    // 2. Initialise Embeddings
    if (!embeddings) {
      embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: "text-embedding-3-small",
      });
    }

    // 3. Initialise Chroma Client
    if (!chromaClient) {
      const chromaPath = process.env.CHROMA_URL || "http://localhost:8000";
      chromaClient = new ChromaClient({ path: chromaPath });
      logInfo("VECTOR_CLIENT_CREATED", { path: chromaPath });
    }

    // 4. Initialise Collection
    // We wrap this in a check to avoid redundant calls if it succeeded once
    if (!collection) {
      try {
        collection = await chromaClient.getOrCreateCollection({
          name: COLLECTION_NAME,
          // metadata: { "hnsw:space": "cosine" } // Optional: ensure cosine similarity
        });
        logInfo("VECTOR_COLLECTION_READY", { name: COLLECTION_NAME });
      } catch (connErr) {
        logError("CHROMA_CONNECTION_FAILED", connErr);
        throw new Error(`Failed to connect to ChromaDB at ${process.env.CHROMA_URL || "http://localhost:8000"}. Ensure the server is running.`);
      }
    }

    logInfo("VECTOR_SERVICE_INIT_SUCCESS", { status: "ready" });
  } catch (error) {
    logError("VECTOR_SERVICE_INIT_ERROR", error);
    // Reset state on failure so retry logic works correctly next time
    collection = null;
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
  if (!chunks || chunks.length === 0) return;
  
  await initVectorService();

  try {
    const ids = chunks.map((_, i) => `${messageId}_chunk_${i}`);
    const documents = chunks.map((c) => c.content);
    const metadatas = chunks.map((c) => c.metadata || {});

    // Generate embeddings via LangChain
    const vectors = await embeddings.embedDocuments(documents);

    // Store in Chroma
    await collection.add({
      ids,
      embeddings: vectors,
      metadatas,
      documents,
    });

    logInfo("VECTOR_STORE_SUCCESS", { messageId, chunksStored: chunks.length });
  } catch (error) {
    logError("VECTOR_STORE_ERROR", error, { messageId });
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
  if (!query) return [];

  await initVectorService();

  try {
    // Generate query embedding
    const queryVector = await embeddings.embedQuery(query);

    // Search Chroma
    const results = await collection.query({
      queryEmbeddings: [queryVector],
      nResults: topK,
    });

    // Extract documents from results
    const docs = results.documents?.[0] ?? [];
    logInfo("VECTOR_RETRIEVE_SUCCESS", { query, resultsFound: docs.length });
    return docs;
  } catch (error) {
    logError("VECTOR_RETRIEVE_ERROR", error, { query });
    throw error;
  }
}

