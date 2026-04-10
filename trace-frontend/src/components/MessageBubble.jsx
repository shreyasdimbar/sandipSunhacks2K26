import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { cn } from '../utils/cn';

export default function MessageBubble({ message, isAi }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex w-full gap-4 max-w-4xl mx-auto py-6 px-4 md:px-0",
        isAi ? "flex-row" : "flex-row-reverse"
      )}
    >
      <div 
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
          isAi 
            ? "bg-primary/20 border-primary/30 text-primary" 
            : "bg-surface border-gray-700 text-gray-300"
        )}
      >
        {isAi ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
      </div>
      
      <div className={cn(
        "flex-1 space-y-4",
        !isAi && "text-right"
      )}>
        <div className={cn(
          "inline-block rounded-2xl px-5 py-3 text-[15px] leading-relaxed shadow-sm",
          isAi 
            ? "bg-surface border border-gray-800 text-gray-200" 
            : "bg-primary text-white"
        )}>
          {message.answer || message.text}
        </div>
        
        {/* If AI has sources, display them nicely */}
        {isAi && message.sources && (message.sources.documents?.length > 0 || message.sources.decisions?.length > 0) && (
          <div className="flex gap-2 flex-wrap mt-3">
            {message.sources.documents?.map((doc, i) => (
              <span key={`doc-${i}`} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-400">
                📄 {doc.source || 'Document'}
              </span>
            ))}
            {message.sources.decisions?.map((dec, i) => (
              <span key={`dec-${i}`} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary/10 border border-secondary/20 text-xs text-secondary">
                ⚡ Decision
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
