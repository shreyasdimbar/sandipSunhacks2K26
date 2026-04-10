import { Bell, Search, Zap } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/': 'Query Engine',
  '/ingest': 'Ingest Data',
  '/explorer': 'Knowledge Explorer',
  '/graph': 'Decision Graph',
};

export default function Navbar() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'TRACE';

  return (
    <header className="h-14 glass-strong border-b border-white/[0.04] flex items-center justify-between px-5 sticky top-0 z-30 shrink-0 md:px-6">
      {/* Left — Page title */}
      <div className="flex items-center gap-3">
        <div className="md:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-bold text-xs">T</span>
          </div>
          <span className="text-sm font-bold text-gradient">TRACE</span>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
          <h2 className="text-sm font-semibold text-gray-300">{title}</h2>
        </div>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-2">
        {/* Status pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-light/50 border border-white/[0.04] mr-1">
          <Zap className="w-3 h-3 text-primary" />
          <span className="text-[11px] font-medium text-gray-400">GPT-4o-mini</span>
        </div>

        {/* Search */}
        <button
          id="navbar-search-btn"
          className="p-2 text-gray-500 hover:text-gray-300 hover:bg-white/[0.04] rounded-lg transition-all"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button
          id="navbar-notifications-btn"
          className="p-2 text-gray-500 hover:text-gray-300 hover:bg-white/[0.04] rounded-lg transition-all relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent rounded-full" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-white/[0.06] mx-1" />

        {/* Avatar */}
        <button
          id="navbar-user-btn"
          className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-white/[0.06] hover:border-primary/30 transition-colors"
        >
          <span className="text-xs font-semibold text-primary-light">P</span>
        </button>
      </div>
    </header>
  );
}
