import { useState } from 'react';
import { UploadCloud, CheckCircle2 } from 'lucide-react';
import Card from '../components/Card';
import { ingestData } from '../services/api';

export default function IngestPage() {
  const [formData, setFormData] = useState({
    text: '',
    source: 'email',
    author: '',
    timestamp: new Date().toISOString().slice(0, 16)
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      await ingestData(formData);
      setStatus('success');
      setFormData(prev => ({ ...prev, text: '' }));
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 relative">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Ingest Data</h1>
        <p className="text-gray-400">Manually insert context, decisions, or raw logs into the TRACE network.</p>
      </div>

      <Card className="p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <UploadCloud className="w-64 h-64 text-primary" />
        </div>
        
        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Raw Content</label>
            <textarea
              required
              rows={5}
              value={formData.text}
              onChange={(e) => setFormData({...formData, text: e.target.value})}
              placeholder="Paste email thread, slack conversation, or meeting notes..."
              className="w-full bg-background border border-gray-700 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Source Type</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({...formData, source: e.target.value})}
                className="w-full bg-background border border-gray-700 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all appearance-none"
              >
                <option value="email">Email Thread</option>
                <option value="slack">Slack / Chat</option>
                <option value="meeting">Meeting Notes</option>
                <option value="document">Formal Document</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Author / Submitter</label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                placeholder="e.g. Alice Smith"
                className="w-full bg-background border border-gray-700 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-300">Timestamp</label>
              <input
                type="datetime-local"
                required
                value={formData.timestamp}
                onChange={(e) => setFormData({...formData, timestamp: e.target.value})}
                className="w-full bg-background border border-gray-700 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <div>
              {status === 'success' && (
                <span className="flex items-center text-green-400 text-sm font-medium animate-in fade-in zoom-in duration-300">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Data ingested successfully
                </span>
              )}
              {status === 'error' && (
                <span className="text-red-400 text-sm font-medium animate-in fade-in">
                  Failed to ingest data. Check backend connection.
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-primary hover:bg-primary/90 text-white transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
            >
              {status === 'loading' ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 
                  Ingesting...
                </span>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" /> Ingest Data
                </>
              )}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
