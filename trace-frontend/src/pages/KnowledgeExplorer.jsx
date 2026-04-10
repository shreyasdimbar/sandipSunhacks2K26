import { FileText, Clock, User, ChevronRight, Search, Filter, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import { useState } from 'react';

const MOCK_DATA = [
  {
    id: 1,
    title: 'Project Phoenix Scope Change',
    type: 'Email',
    typeColor: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    author: 'Sarah Jenkins',
    date: 'Oct 24, 2023',
    extract: 'We have decided to pivot the Phoenix batch to focus primarily on high-throughput rather than latency. This aligns with the Q4 revenue targets.',
    chunks: 3,
  },
  {
    id: 2,
    title: 'Binder Switch Approval',
    type: 'Slack',
    typeColor: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    author: 'Mark Turner',
    date: 'Oct 25, 2023',
    extract: 'Approved the binder switch for Q3. Need to inform the ops team about potential humidity risks with Lactose.',
    chunks: 2,
  },
  {
    id: 3,
    title: 'Weekly Sync: Backend Infrastructure',
    type: 'Meeting',
    typeColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    author: 'Dev Team',
    date: 'Oct 26, 2023',
    extract: 'Latency issues discussed. Given Phoenix scope change from throughput-first approach, this is expected behavior in staging.',
    chunks: 5,
  },
  {
    id: 4,
    title: 'Formulation Design v3.2',
    type: 'Document',
    typeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    author: 'Dr. Ananya Rao',
    date: 'Oct 27, 2023',
    extract: 'Updated formulation spec incorporating Cellulose binder choice. Lactose was rejected due to crystallisation above 75% relative humidity.',
    chunks: 8,
  },
];

export default function KnowledgeExplorer() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = MOCK_DATA.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.extract.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/15 shadow-glow-sm">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-100">Knowledge Explorer</h1>
              <p className="text-sm text-gray-500">Browse ingested source documents driving TRACE reasoning</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 flex items-center gap-2">
              <Database className="w-3 h-3 text-primary" />
              <span className="text-sm font-semibold text-primary">{filtered.length}</span>
              <span className="text-[11px] text-gray-400 font-medium">documents</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="mb-6"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            id="explorer-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents, authors, or content..."
            className="w-full bg-surface/60 border border-white/[0.06] rounded-xl pl-11 pr-12 py-3 text-[14px] text-gray-200 placeholder-gray-600 focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/15 transition-all"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/[0.04] transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Document list */}
      <div className="space-y-3">
        {filtered.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index + 0.15, duration: 0.35 }}
          >
            <Card className="group hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
              <div className="p-5 flex items-start gap-4">
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center shrink-0 border border-primary/10 group-hover:bg-primary/12 group-hover:border-primary/20 transition-colors">
                  <FileText className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <h3 className="font-semibold text-gray-100 truncate group-hover:text-white transition-colors">{item.title}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border shrink-0 ${item.typeColor}`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-[13px] text-gray-400 mb-3 line-clamp-2 leading-relaxed">{item.extract}</p>
                  <div className="flex items-center gap-5 text-[11px] text-gray-500 font-medium">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3 h-3" /> {item.author}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> {item.date}
                    </span>
                    <span className="flex items-center gap-1.5 text-primary/50">
                      <Database className="w-3 h-3" /> {item.chunks} chunks
                    </span>
                  </div>
                </div>

                {/* Chevron */}
                <button className="h-10 w-10 flex items-center justify-center rounded-xl text-gray-600 group-hover:text-primary group-hover:bg-primary/8 transition-all shrink-0">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Search className="w-10 h-10 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No documents match your search</p>
          <p className="text-gray-600 text-sm mt-1">Try different keywords or clear the filter</p>
        </div>
      )}
    </div>
  );
}
