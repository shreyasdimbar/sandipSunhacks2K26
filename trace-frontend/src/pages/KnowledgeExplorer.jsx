import { FileText, Clock, User, ChevronRight } from 'lucide-react';
import Card from '../components/Card';

const MOCK_DATA = [
  { id: 1, title: 'Project Phoenix Scope Change', type: 'Email', author: 'Sarah Jenkins', date: 'Oct 24, 2023', extract: 'We have decided to pivot the Phoenix batch to focus primarily on high-throughput rather than latency.' },
  { id: 2, title: 'Binder Switch Approval', type: 'Slack', author: 'Mark T.', date: 'Oct 25, 2023', extract: 'Approved the binder switch for Q3. Need to inform the ops team.' },
  { id: 3, title: 'Weekly Sync: Backend', type: 'Meeting', author: 'Dev Team', date: 'Oct 26, 2023', extract: 'Latency issues discussed. Given Phoenix scope change, this is expected.' },
];

export default function KnowledgeExplorer() {
  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Knowledge Explorer</h1>
          <p className="text-gray-400">Browse ingested source documents driving TRACE reasoning.</p>
        </div>
        <div className="bg-surface border border-gray-800 rounded-lg px-4 py-2 flex items-center shadow-sm">
          <span className="text-sm font-medium"><span className="text-primary">{MOCK_DATA.length}</span> Documents</span>
        </div>
      </div>

      <div className="grid gap-4">
        {MOCK_DATA.map((item) => (
          <Card key={item.id} className="group hover:-translate-y-0.5 transition-all duration-300">
            <div className="p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 text-primary">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4 mb-1">
                  <h3 className="font-semibold text-gray-100 truncate">{item.title}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-gray-800 text-gray-300 shrink-0">
                    {item.type}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{item.extract}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                  <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {item.author}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {item.date}</span>
                </div>
              </div>
              <button className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-500 group-hover:text-primary transition-colors shrink-0">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
