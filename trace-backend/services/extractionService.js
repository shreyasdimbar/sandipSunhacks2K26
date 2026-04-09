/**
 * TRACE Extraction Service
 *
 * LLM-based reasoning extraction — kept for backward compatibility.
 * The primary extraction logic now lives in utils/entityExtractor.js
 * and is orchestrated by services/ingestionService.js.
 *
 * This module re-exports extractEntities for any code that still
 * imports from this path.
 */

export { extractEntities as extractReasoning } from "../utils/entityExtractor.js";
