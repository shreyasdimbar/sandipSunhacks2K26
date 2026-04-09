/**
 * TRACE Graph Service
 *
 * Manages the Neo4j connection, node/relationship creation,
 * and decision-chain retrieval queries.
 */

import neo4j from "neo4j-driver";
import { logInfo, logError } from "../utils/logger.js";

// ── Singleton ───────────────────────────────────────────────────────
let driver = null;

/**
 * Initialise the Neo4j driver. Safe to call multiple times.
 */
export function initGraphService() {
  if (driver) return;

  const uri = process.env.NEO4J_URI || "bolt://localhost:7687";
  const user = process.env.NEO4J_USER || "neo4j";
  const password = process.env.NEO4J_PASSWORD || "password";

  driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  logInfo("GRAPH_SERVICE_INIT", { uri, user, status: "connected" });
}

/**
 * Open a new Neo4j session.
 */
function getSession() {
  initGraphService();
  return driver.session();
}

/**
 * Run a Cypher query inside a managed session.
 * Automatically closes the session after execution.
 *
 * @param {string} cypher  - Cypher query string.
 * @param {object} params  - Query parameters.
 * @returns {Promise<import("neo4j-driver").QueryResult>}
 */
async function runQuery(cypher, params = {}) {
  const session = getSession();
  try {
    return await session.run(cypher, params);
  } finally {
    await session.close();
  }
}

// ─────────────────────────────────────────────────────────────────────
//  Node creation
// ─────────────────────────────────────────────────────────────────────

export async function createPersonNode(name) {
  try {
    await runQuery(`MERGE (p:Person {name: $name}) RETURN p`, { name });
    logInfo("GRAPH_NODE", { type: "Person", name });
  } catch (error) {
    logError("GRAPH_NODE_Person", error, { name });
    throw error;
  }
}

export async function createDecisionNode(id, description) {
  try {
    await runQuery(
      `MERGE (d:Decision {id: $id}) SET d.description = $description RETURN d`,
      { id, description }
    );
    logInfo("GRAPH_NODE", { type: "Decision", id, description });
  } catch (error) {
    logError("GRAPH_NODE_Decision", error, { id });
    throw error;
  }
}

export async function createReasonNode(text) {
  try {
    await runQuery(`MERGE (r:Reason {text: $text}) RETURN r`, { text });
    logInfo("GRAPH_NODE", { type: "Reason", text });
  } catch (error) {
    logError("GRAPH_NODE_Reason", error, { text });
    throw error;
  }
}

export async function createEventNode(description) {
  try {
    await runQuery(
      `MERGE (e:Event {description: $description}) RETURN e`,
      { description }
    );
    logInfo("GRAPH_NODE", { type: "Event", description });
  } catch (error) {
    logError("GRAPH_NODE_Event", error, { description });
    throw error;
  }
}

export async function createDocumentNode(messageId, source) {
  try {
    await runQuery(
      `MERGE (doc:Document {messageId: $messageId}) SET doc.source = $source RETURN doc`,
      { messageId, source }
    );
    logInfo("GRAPH_NODE", { type: "Document", messageId, source });
  } catch (error) {
    logError("GRAPH_NODE_Document", error, { messageId });
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────
//  Relationship creation
// ─────────────────────────────────────────────────────────────────────

export async function linkPersonToDecision(personName, decisionId) {
  try {
    await runQuery(
      `MATCH (p:Person {name: $personName})
       MATCH (d:Decision {id: $decisionId})
       MERGE (p)-[:MADE]->(d)`,
      { personName, decisionId }
    );
    logInfo("GRAPH_REL", { type: "MADE", from: personName, to: decisionId });
  } catch (error) {
    logError("GRAPH_REL_MADE", error);
    throw error;
  }
}

export async function linkDecisionToReason(decisionId, reasonText) {
  try {
    await runQuery(
      `MATCH (d:Decision {id: $decisionId})
       MATCH (r:Reason {text: $reasonText})
       MERGE (d)-[:BASED_ON]->(r)`,
      { decisionId, reasonText }
    );
    logInfo("GRAPH_REL", { type: "BASED_ON", from: decisionId, to: reasonText });
  } catch (error) {
    logError("GRAPH_REL_BASED_ON", error);
    throw error;
  }
}

export async function linkDecisionToDocument(decisionId, messageId) {
  try {
    await runQuery(
      `MATCH (d:Decision {id: $decisionId})
       MATCH (doc:Document {messageId: $messageId})
       MERGE (d)-[:MENTIONED_IN]->(doc)`,
      { decisionId, messageId }
    );
    logInfo("GRAPH_REL", { type: "MENTIONED_IN", from: decisionId, to: messageId });
  } catch (error) {
    logError("GRAPH_REL_MENTIONED_IN", error);
    throw error;
  }
}

export async function linkEventToDecision(eventDescription, decisionId) {
  try {
    await runQuery(
      `MATCH (e:Event {description: $eventDescription})
       MATCH (d:Decision {id: $decisionId})
       MERGE (e)-[:CAUSED_BY]->(d)`,
      { eventDescription, decisionId }
    );
    logInfo("GRAPH_REL", { type: "CAUSED_BY", from: eventDescription, to: decisionId });
  } catch (error) {
    logError("GRAPH_REL_CAUSED_BY", error);
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────
//  Query helpers
// ─────────────────────────────────────────────────────────────────────

/**
 * Retrieve decision chains from Neo4j matching the question.
 */
export async function getRelatedDecisions(question, limit = 10) {
  try {
    const result = await runQuery(
      `MATCH (p:Person)-[:MADE]->(d:Decision)
       OPTIONAL MATCH (d)-[:BASED_ON]->(r:Reason)
       OPTIONAL MATCH (e:Event)-[:CAUSED_BY]->(d)
       OPTIONAL MATCH (d)-[:MENTIONED_IN]->(doc:Document)
       WHERE toLower(d.description) CONTAINS toLower($keyword)
          OR toLower(r.text)        CONTAINS toLower($keyword)
          OR toLower(p.name)        CONTAINS toLower($keyword)
       RETURN p.name        AS person,
              d.description AS decision,
              r.text        AS reason,
              e.description AS event,
              doc.messageId AS documentId,
              doc.source    AS source
       LIMIT $limit`,
      { keyword: question, limit: neo4j.int(limit) }
    );

    const records = result.records.map((r) => ({
      person:     r.get("person"),
      decision:   r.get("decision"),
      reason:     r.get("reason")     ?? null,
      event:      r.get("event")      ?? null,
      documentId: r.get("documentId") ?? null,
      source:     r.get("source")     ?? null,
    }));

    logInfo("GRAPH_QUERY", { question, results: records.length });
    return records;
  } catch (error) {
    logError("GRAPH_QUERY", error, { question });
    throw error;
  }
}

/**
 * Retrieve ALL decision chains (no keyword filter).
 */
export async function getAllDecisions(limit = 10) {
  try {
    const result = await runQuery(
      `MATCH (p:Person)-[:MADE]->(d:Decision)
       OPTIONAL MATCH (d)-[:BASED_ON]->(r:Reason)
       OPTIONAL MATCH (e:Event)-[:CAUSED_BY]->(d)
       OPTIONAL MATCH (d)-[:MENTIONED_IN]->(doc:Document)
       RETURN p.name        AS person,
              d.description AS decision,
              r.text        AS reason,
              e.description AS event,
              doc.messageId AS documentId,
              doc.source    AS source
       LIMIT $limit`,
      { limit: neo4j.int(limit) }
    );

    return result.records.map((r) => ({
      person:     r.get("person"),
      decision:   r.get("decision"),
      reason:     r.get("reason")     ?? null,
      event:      r.get("event")      ?? null,
      documentId: r.get("documentId") ?? null,
      source:     r.get("source")     ?? null,
    }));
  } catch (error) {
    logError("GRAPH_QUERY_ALL", error);
    throw error;
  }
}
