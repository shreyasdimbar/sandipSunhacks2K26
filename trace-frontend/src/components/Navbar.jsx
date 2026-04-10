import { Bell, Menu, User } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="h-16 bg-surface/80 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-4 sticky top-0 z-10 shrink-0 md:px-8">
      <div className="flex items-center md:hidden">
        <button className="p-2 text-gray-400 hover:text-white rounded-md hover:bg-white/5 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <span className="ml-3 text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          TRACE
        </span>
      </div>
      
      <div className="hidden md:flex flex-1 items-center">
        {/* Placeholder for potential top nav items or breadcrumbs */}
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border border-surface"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
            <User className="w-4 h-4 text-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}
