import { NavLink, useLocation } from 'react-router-dom';
import { MessageSquare, UploadCloud, FileText, Network, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/', label: 'Query Engine', icon: MessageSquare, description: 'Ask TRACE anything' },
  { path: '/ingest', label: 'Ingest Data', icon: UploadCloud, description: 'Feed knowledge' },
  { path: '/explorer', label: 'Explorer', icon: FileText, description: 'Browse sources' },
  { path: '/graph', label: 'Decision Graph', icon: Network, description: 'Trace causality' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "h-full bg-surface/50 border-r border-white/[0.04] flex flex-col shrink-0 transition-all duration-300 ease-in-out relative hidden md:flex",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center px-5 border-b border-white/[0.04] shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-glow-sm">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
              >
                <span className="text-lg font-bold text-gradient">TRACE</span>
                <span className="px-1.5 py-0.5 rounded-md bg-primary/15 text-primary text-[10px] font-semibold tracking-wider uppercase">
                  v2
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 py-4 space-y-1", collapsed ? "px-2" : "px-3")}>
        <div className={cn("mb-4", collapsed ? "px-0" : "px-3")}>
          {!collapsed && (
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em]">
              Navigation
            </span>
          )}
        </div>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                collapsed ? "p-3 justify-center" : "px-3 py-2.5",
                isActive
                  ? "bg-primary/10 text-primary shadow-glow-sm"
                  : "text-gray-400 hover:bg-white/[0.03] hover:text-gray-200"
              )}
            >
              <item.icon
                className={cn(
                  "w-[18px] h-[18px] shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-gray-500 group-hover:text-gray-300"
                )}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col min-w-0 overflow-hidden"
                  >
                    <span className="truncate">{item.label}</span>
                    {isActive && (
                      <span className="text-[10px] text-primary/60 font-normal truncate">
                        {item.description}
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Collapsed tooltip */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1 rounded-md bg-surface-light border border-white/[0.06] text-xs font-medium text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-elevated">
                  {item.label}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-surface-light border border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-surface hover:border-white/[0.12] transition-all z-50 shadow-card"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Footer */}
      <div className={cn("p-4 border-t border-white/[0.04] shrink-0", collapsed && "px-2")}>
        {!collapsed ? (
          <div className="flex items-center gap-3 px-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-[11px] text-gray-500 font-medium">System Online</span>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
}
