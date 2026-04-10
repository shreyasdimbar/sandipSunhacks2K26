import { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, FileText, Clock, User2, Tag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/Card';
import { ingestData } from '../services/api';

const sourceOptions = [
  { value: 'email', label: 'Email Thread', icon: '📧' },
  { value: 'slack', label: 'Slack / Chat', icon: '💬' },
  { value: 'meeting', label: 'Meeting Notes', icon: '📋' },
  { value: 'document', label: 'Formal Document', icon: '📄' },
];

export default function IngestPage() {
  const [formData, setFormData] = useState({
    text: '',
    source: 'email',
    author: '',
    timestamp: new Date().toISOString().slice(0, 16)
  });
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await ingestData(formData);
      setResult(res);
      setStatus('success');
      setFormData(prev => ({ ...prev, text: '' }));
      setTimeout(() => {
        setStatus('idle');
        setResult(null);
      }, 5000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const charCount = formData.text.length;

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/15 shadow-glow-sm">
            <UploadCloud className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-100">Ingest Data</h1>
            <p className="text-sm text-gray-500">Feed knowledge into TRACE's dual-memory system</p>
          </div>
        </div>
      </motion.div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.45 }}
      >
        <Card className="relative overflow-hidden">
          {/* Subtle shimmer decoration */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">

            {/* Raw Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                  <FileText className="w-3.5 h-3.5 text-gray-500" />
                  Raw Content
                </label>
                <span className={`text-[11px] font-medium transition-colors ${charCount > 0 ? 'text-gray-400' : 'text-gray-600'}`}>
                  {charCount > 0 ? `${charCount} characters` : 'Required'}
                </span>
              </div>
              <textarea
                id="ingest-text-input"
                required
                rows={6}
                value={formData.text}
                onChange={(e) => setFormData({...formData, text: e.target.value})}
                placeholder="Paste email thread, Slack conversation, meeting transcript, or document content..."
                className="w-full bg-background/60 border border-white/[0.06] rounded-xl px-4 py-3.5 text-gray-200 text-[14px] leading-relaxed focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 focus:bg-background/80 transition-all resize-none placeholder-gray-600"
              />
            </div>

            {/* Source Type — Visual selector */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                <Tag className="w-3.5 h-3.5 text-gray-500" />
                Source Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {sourceOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData({...formData, source: opt.value})}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-sm font-medium transition-all ${
                      formData.source === opt.value
                        ? 'bg-primary/10 border-primary/30 text-primary shadow-glow-sm'
                        : 'bg-background/40 border-white/[0.06] text-gray-400 hover:bg-white/[0.02] hover:border-white/[0.1]'
                    }`}
                  >
                    <span className="text-lg">{opt.icon}</span>
                    <span className="text-[12px]">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Author & Timestamp */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                  <User2 className="w-3.5 h-3.5 text-gray-500" />
                  Author
                </label>
                <input
                  id="ingest-author-input"
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  placeholder="e.g. Alice Smith"
                  className="w-full bg-background/60 border border-white/[0.06] rounded-xl px-4 py-3 text-gray-200 text-[14px] focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all placeholder-gray-600"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                  Timestamp
                </label>
                <input
                  id="ingest-timestamp-input"
                  type="datetime-local"
                  required
                  value={formData.timestamp}
                  onChange={(e) => setFormData({...formData, timestamp: e.target.value})}
                  className="w-full bg-background/60 border border-white/[0.06] rounded-xl px-4 py-3 text-gray-200 text-[14px] focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            {/* Submit & Status */}
            <div className="pt-3 flex items-center justify-between gap-4">
              <AnimatePresence mode="wait">
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-success text-sm font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Ingested into TRACE memory</span>
                    {result?.vectorChunks && (
                      <span className="text-[11px] text-gray-500 ml-1">
                        ({result.vectorChunks} chunks)
                      </span>
                    )}
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-danger text-sm font-medium"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>Connection failed. Is the backend running?</span>
                  </motion.div>
                )}
                {(status === 'idle' || status === 'loading') && <div />}
              </AnimatePresence>

              <button
                id="ingest-submit-btn"
                type="submit"
                disabled={status === 'loading'}
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-primary to-primary-light text-white hover:shadow-glow transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {status === 'loading' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    Ingest Data
                  </>
                )}
              </button>
            </div>
          </form>
        </Card>
      </motion.div>

      {/* Info section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-surface/30 border border-white/[0.04]"
      >
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div className="text-[13px] text-gray-500 leading-relaxed">
          <span className="text-gray-400 font-medium">How it works:</span> TRACE splits your content into semantic chunks, generates embeddings via OpenAI, and stores them in ChromaDB. Simultaneously, it extracts entities (people, decisions, events) and builds a knowledge graph in Neo4j.
        </div>
      </motion.div>
    </div>
  );
}
