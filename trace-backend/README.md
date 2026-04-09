# TRACE — Trace Reasoning And Context Engine

**TRACE** is a real-time organizational intelligence system that collects knowledge from company emails, chats, meeting transcripts, and documents, then answers any question about company operations using AI.

---

## What Can You Ask TRACE?

```
"Why did we choose this vendor?"
"Who approved the binder switch?"
"What meetings discussed humidity risks?"
"What changed in the formulation design?"
"What breaks if we change this decision?"
```

TRACE answers using evidence from two memory systems and LLM reasoning.

---

## Architecture

```
                         ┌─────────────────────────┐
                         │     User Question        │
                         └────────────┬────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                                    ▼
           ┌───────────────┐                    ┌───────────────┐
           │ Vector Memory │                    │  Graph Memory │
           │  (ChromaDB)   │                    │   (Neo4j)     │
           └───────┬───────┘                    └───────┬───────┘
                   │ Top 6 semantic chunks              │ Decision chains
                   └─────────────────┬──────────────────┘
                                     ▼
                           ┌─────────────────┐
                           │  Context Fusion  │
                           └────────┬────────┘
                                    ▼
                           ┌─────────────────┐
                           │  LLM Reasoning  │
                           │  (GPT-4o-mini)  │
                           └────────┬────────┘
                                    ▼
                           ┌─────────────────┐
                           │   AI Answer     │
                           │   + Sources     │
                           └─────────────────┘
```

### Ingest Pipeline

```
POST /api/ingest
        │
        ├───────────────────────────┐
        ▼                           ▼
  ┌──────────────┐          ┌──────────────────┐
  │ Text Chunking│          │ Entity Extraction│
  │ (500 / 100)  │          │ (LLM via LangChain)
  └──────┬───────┘          └────────┬─────────┘
         ▼                           ▼
  ┌──────────────┐          ┌──────────────────┐
  │  Embeddings  │          │  Neo4j Nodes     │
  │  (OpenAI)    │          │  Person, Decision│
  └──────┬───────┘          │  Reason, Event   │
         ▼                  │  Document        │
  ┌──────────────┐          └────────┬─────────┘
  │  ChromaDB    │                   ▼
  │  Storage     │          ┌──────────────────┐
  └──────────────┘          │  Neo4j Relations │
                            │  MADE, BASED_ON  │
                            │  CAUSED_BY       │
                            │  MENTIONED_IN    │
                            └──────────────────┘
```

### Query Intelligence Pipeline

```
POST /api/query
        │
        ├───────────────────────────┐
        ▼                           ▼
  ┌──────────────┐          ┌──────────────────┐
  │  ChromaDB    │          │   Neo4j Cypher   │
  │  Similarity  │          │   Query          │
  │  Search      │          └────────┬─────────┘
  └──────┬───────┘                   │
         │   Top 6 chunks            │  Decision chains
         └───────────┬───────────────┘
                     ▼
            Context Fusion
                     │
                     ▼
            LLM Reasoning (GPT-4o-mini)
                     │
                     ▼
            { answer, sources }
```

---

## Tech Stack

| Layer              | Technology              |
| ------------------ | ----------------------- |
| Runtime            | Node.js                 |
| Framework          | Express.js              |
| Modules            | ES Modules              |
| Vector Database    | ChromaDB                |
| Graph Database     | Neo4j                   |
| LLM Framework      | LangChain               |
| Embeddings         | OpenAI text-embedding-3-small |
| LLM Reasoning      | OpenAI GPT-4o-mini      |
| Config             | dotenv                  |

---

## Setup Instructions

### 1. Clone & Install

```bash
cd sandipSunhacks2K26/trace-backend
npm install
```

### 2. Start ChromaDB

```bash
docker run -d -p 8000:8000 chromadb/chroma
```

### 3. Start Neo4j

```bash
docker run -d \
  --name neo4j \
  -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/password \
  neo4j:latest
```

Neo4j Browser: http://localhost:7474

### 4. Configure Environment

Edit `.env`:

```env
PORT=3000
OPENAI_API_KEY=sk-...your-key...
OPENAI_MODEL=gpt-4o-mini
CHROMA_URL=http://localhost:8000
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password
LOG_LEVEL=INFO
```

### 5. Start the Server

```bash
npm start
```

Output:

```
🚀  TRACE server is running on http://localhost:3000
    Trace Reasoning And Context Engine  v2.0.0
```

---

## API Documentation

### `GET /`

Health check endpoint.

**Response:**

```json
{
  "app": "TRACE",
  "fullName": "Trace Reasoning And Context Engine",
  "status": "running",
  "version": "2.0.0"
}
```

---

### `POST /api/ingest`

Submit a knowledge fragment. TRACE stores it in both vector memory (ChromaDB) and graph memory (Neo4j).

**Request:**

```json
{
  "text": "We switched from Cellulose to Lactose to save ₹80 Lakhs per batch.",
  "source": "email",
  "author": "Vikram Malhotra",
  "timestamp": "2023-06-15"
}
```

**Response:**

```json
{
  "status": "stored in TRACE memory",
  "messageId": "a1b2c3d4-...",
  "source": "email",
  "author": "Vikram Malhotra",
  "vectorChunks": 1,
  "graph": {
    "decisionId": "e5f6g7h8-...",
    "decision": "Switch binder from Cellulose to Lactose",
    "reason": "Cost savings of ₹80 Lakhs per batch",
    "event": null,
    "persons": ["Vikram Malhotra"]
  }
}
```

---

### `POST /api/query`

Ask any question about company operations.

**Request:**

```json
{
  "question": "Why did we switch the Phoenix binder?"
}
```

**Response:**

```json
{
  "question": "Why did we switch the Phoenix binder?",
  "answer": "The binder was switched from Cellulose to Lactose by Vikram Malhotra to achieve cost savings of ₹80 Lakhs per batch. The original choice of Cellulose by Dr Ananya was based on the fact that Lactose crystallizes above 75% humidity. The switch later caused tablet disintegration when products were stored in high-humidity conditions.",
  "sources": {
    "documents": [
      { "index": 1, "text": "We chose Cellulose as binder due to humidity stability..." },
      { "index": 2, "text": "Phoenix batch showed 12% moisture deviation..." }
    ],
    "decisions": [
      {
        "person": "Dr Ananya",
        "decision": "Use Cellulose as binder",
        "reason": "Lactose unstable above 75% humidity",
        "event": null,
        "documentId": "abc-123",
        "source": "slack"
      },
      {
        "person": "Vikram Malhotra",
        "decision": "Switch binder to Lactose",
        "reason": "Cost savings of ₹80 Lakhs",
        "event": "Tablet disintegration",
        "documentId": "def-456",
        "source": "email"
      }
    ]
  }
}
```

---

## Example Queries

| Question | What TRACE Does |
| --- | --- |
| "Why did we choose this vendor?" | Retrieves decision chains + supporting documents |
| "Who approved the binder switch?" | Finds Person→MADE→Decision relationships |
| "What meetings discussed Phoenix?" | Searches vector memory for relevant fragments |
| "What changed in the formulation?" | Traces decision timeline from graph |
| "What breaks if we change this?" | Follows CAUSED_BY edges in the knowledge graph |

---

## Graph Schema

**Nodes:**

| Node       | Properties                |
| ---------- | ------------------------- |
| `Person`   | `name`                    |
| `Decision` | `id`, `description`       |
| `Reason`   | `text`                    |
| `Event`    | `description`             |
| `Document` | `messageId`, `source`     |

**Relationships:**

```
(Person)   ─[:MADE]──────────→ (Decision)
(Decision) ─[:BASED_ON]──────→ (Reason)
(Decision) ─[:MENTIONED_IN]──→ (Document)
(Event)    ─[:CAUSED_BY]─────→ (Decision)
```

---

## Project Structure

```
trace-backend/
├── app.js                          # Express server — startup, middleware, routes
├── .env                            # Environment variables
├── package.json                    # Dependencies & scripts
├── README.md                       # This file
├── LICENSE                         # License
│
├── controllers/
│   ├── ingestController.js         # POST /api/ingest — validates & delegates
│   └── queryController.js          # POST /api/query  — validates & delegates
│
├── routes/
│   ├── ingest.js                   # Router for /api/ingest
│   └── query.js                    # Router for /api/query
│
├── services/
│   ├── vectorService.js            # ChromaDB — embeddings, storage, retrieval
│   ├── graphService.js             # Neo4j — nodes, relationships, queries
│   ├── ingestionService.js         # Orchestrates full ingest pipeline
│   ├── queryEngine.js              # Orchestrates full query pipeline + LLM
│   └── extractionService.js        # Legacy re-export (backward compat)
│
└── utils/
    ├── logger.js                   # Structured logging with levels
    ├── chunker.js                  # Text splitting (LangChain)
    ├── entityExtractor.js          # LLM entity extraction
    └── metadata.js                 # ID generation & metadata builders
```

---

## Error Handling

- All controllers wrap service calls in try/catch and return structured JSON errors
- Service failures are logged with `logError()` and include stack traces
- Graph memory failures during ingestion are **non-blocking** — vector memory is always persisted
- Database connection failures at startup emit warnings but don't crash the server
- Global Express error handler catches unhandled exceptions

---

## License

MIT
