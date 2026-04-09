/**
 * TRACE — Trace Reasoning And Context Engine
 *
 * Express server entry point.
 *
 * Responsibilities:
 *   • Load environment variables
 *   • Initialise Express middleware (CORS, JSON, request logging)
 *   • Connect to ChromaDB (vector memory)
 *   • Connect to Neo4j   (graph memory)
 *   • Register API routes
 *   • Start HTTP server
 */

import "dotenv/config";
import express from "express";
import cors from "cors";

import { requestLoggerMiddleware, logInfo, logError } from "./utils/logger.js";
import { initVectorService } from "./services/vectorService.js";
import { initGraphService } from "./services/graphService.js";
import ingestRoutes from "./routes/ingest.js";
import queryRoutes from "./routes/query.js";

// ── Initialise Express ──────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(requestLoggerMiddleware);

// ── Root health check ───────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({
    app: "TRACE",
    fullName: "Trace Reasoning And Context Engine",
    status: "running",
    version: "2.0.0",
  });
});

// ── API routes ──────────────────────────────────────────────────────
app.use("/api/ingest", ingestRoutes);
app.use("/api/query", queryRoutes);

// ── Global error handler ────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  logError("UNHANDLED_ERROR", err);
  res.status(500).json({
    status: "error",
    message: "Internal server error",
    detail: err.message,
  });
});

// ── Start server & connect databases ────────────────────────────────
async function start() {
  try {
    // Connect to databases (non-blocking — server starts even if DBs are down)
    try {
      await initVectorService();
      logInfo("STARTUP", { service: "ChromaDB", status: "connected" });
    } catch (vecErr) {
      logError("STARTUP_CHROMA", vecErr);
      console.warn("⚠️  ChromaDB not available — vector memory will fail until connected.");
    }

    try {
      initGraphService();
      logInfo("STARTUP", { service: "Neo4j", status: "connected" });
    } catch (graphErr) {
      logError("STARTUP_NEO4J", graphErr);
      console.warn("⚠️  Neo4j not available — graph memory will fail until connected.");
    }

    app.listen(PORT, () => {
      console.log(`\n🚀  TRACE server is running on http://localhost:${PORT}`);
      console.log(`    Trace Reasoning And Context Engine  v2.0.0\n`);
    });
  } catch (error) {
    logError("STARTUP_FATAL", error);
    process.exit(1);
  }
}

start();
