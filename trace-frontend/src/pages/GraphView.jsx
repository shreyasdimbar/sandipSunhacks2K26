import { User, Zap, MessageSquare, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GraphView() {
  return (
    <div className="h-full flex flex-col p-6 md:p-10 relative overflow-hidden">
      <div className="mb-10 z-10">
        <h1 className="text-3xl font-bold mb-2">Decision Graph</h1>
        <p className="text-gray-400">Visualizing the causal chain of decisions across the organization.</p>
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10 w-full max-w-5xl mx-auto">
        
        {/* Simple static representation of a graph */}
        <div className="flex flex-col md:flex-row items-center justify-center w-full gap-4 md:gap-0">
          
          {/* Person */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center bg-surface border border-gray-700 rounded-2xl p-6 w-48 shadow-xl relative z-20 group hover:border-primary/50 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mb-4 border border-blue-500/30">
              <User className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-center mb-1">Sarah Jenkins</h3>
            <p className="text-xs text-gray-500 text-center">VP Engineering</p>
          </motion.div>

          <div className="h-12 w-0.5 md:w-16 md:h-0.5 bg-gradient-to-b md:bg-gradient-to-r from-gray-700 to-primary/50 relative z-10 animate-pulse"></div>

          {/* Decision */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center bg-surface border border-primary/40 rounded-2xl p-6 w-56 shadow-[0_0_30px_rgba(99,102,241,0.1)] relative z-20"
          >
            <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4 border border-primary/30">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-center mb-1">Pivot Phoenix Scope</h3>
            <p className="text-xs text-primary/80 text-center px-2 bg-primary/10 rounded-full py-0.5 mb-2 mt-1">Decision</p>
          </motion.div>

          <div className="h-12 w-0.5 md:w-16 md:h-0.5 bg-gradient-to-b md:bg-gradient-to-r from-primary/50 to-secondary/50 relative z-10 animate-pulse"></div>

          {/* Reason */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center bg-surface border border-gray-700 rounded-xl p-5 w-48 shadow-xl relative z-20 group hover:border-secondary/50 transition-colors"
          >
             <div className="w-10 h-10 bg-secondary/20 text-secondary rounded-full flex items-center justify-center mb-3 border border-secondary/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-sm text-center mb-1">Focus on throughput over latency</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">Reasoning</p>
          </motion.div>

          <div className="h-12 w-0.5 md:w-16 md:h-0.5 bg-gradient-to-b md:bg-gradient-to-r from-secondary/50 to-orange-500/50 relative z-10 animate-pulse"></div>

          {/* Event */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col items-center bg-surface border border-gray-700 rounded-xl p-5 w-48 shadow-xl relative z-20 group hover:border-orange-500/50 transition-colors"
          >
            <div className="w-10 h-10 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center mb-3 border border-orange-500/30">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-sm text-center mb-1">Latency spikes in Q3 staging</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">Downstream Event</p>
          </motion.div>

        </div>
      </div>

      {/* Decorative background grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>
    </div>
  );
}
