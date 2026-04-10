import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import QueryPage from './pages/QueryPage';
import IngestPage from './pages/IngestPage';
import KnowledgeExplorer from './pages/KnowledgeExplorer';
import GraphView from './pages/GraphView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<QueryPage />} />
          <Route path="ingest" element={<IngestPage />} />
          <Route path="explorer" element={<KnowledgeExplorer />} />
          <Route path="graph" element={<GraphView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
