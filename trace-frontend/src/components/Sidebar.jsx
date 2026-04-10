import { NavLink } from 'react-router-dom';
import { MessageSquare, UploadCloud, FileText, Network } from 'lucide-react';
import { cn } from '../utils/cn';

const navItems = [
  { path: '/', label: 'Query', icon: MessageSquare },
  { path: '/ingest', label: 'Ingest', icon: UploadCloud },
  { path: '/explorer', label: 'Explorer', icon: FileText },
  { path: '/graph', label: 'Graph', icon: Network },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-full bg-surface border-r border-gray-800 flex flex-col hidden md:flex shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <div className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          TRACE
        </div>
        <div className="ml-2 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
          OS
        </div>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 group relative",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    "w-5 h-5",
                    isActive ? "text-primary flex-shrink-0" : "text-gray-400 group-hover:text-gray-300"
                  )}
                />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-800 text-xs text-gray-500">
        Trace Reasoning And Context Engine
      </div>
    </aside>
  );
}
