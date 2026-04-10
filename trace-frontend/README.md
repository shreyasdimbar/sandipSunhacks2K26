# TRACE - Frontend

TRACE (Trace Reasoning And Context Engine) is an organizational intelligence system UI designed for modern, startup-grade workflows.

## Features

- **Query / Chat Interface**: ChatGPT-like conversational UI to ask questions about company decisions. Features Framer Motion animations and animated AI typing indicators.
- **Data Ingestion**: Admin panel to manually inject unstructured text (e.g. Emails, Slack logs, meetings) to the TRACE system.
- **Knowledge Explorer**: Browse pre-ingested document extracts and context that power TRACE's logic.
- **Decision Graph**: Visually simulate decision chains (Person → Decision → Reason → Downstream Event) using clean, lightweight CSS/Flexbox nodes.
- **Demo Mode**: Readily available pre-filled questions on the main query dashboard for instant hackathon demonstrations.

## Tech Stack

- React + Vite
- Tailwind CSS (Styling & Dark Mode)
- Framer Motion (Smooth micro-animations)
- Lucide React (Icons)
- Axios (API Communication)

## Connecting to Backend

The frontend defaults to querying the local TRACE backend at `http://localhost:3000`.
Communication happens through the `src/services/api.js` file using Axios:
- `POST /api/query`: Submits query text to the AI reasoning engine.
- `POST /api/ingest`: Pushes raw context/documents to the database.

## How to Run

1. Make sure you have NodeJS installed.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the frontend app at `http://localhost:5173`. Make sure your backend node server is running on `port 3000`.
