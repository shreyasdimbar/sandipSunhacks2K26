import { motion } from 'framer-motion';
import { Sparkles, User, FileText, Zap } from 'lucide-react';
import { cn } from '../utils/cn';

export default function MessageBubble({ message, isAi }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        "flex w-full gap-3.5 max-w-4xl mx-auto py-5 px-4 md:px-0",
        isAi ? "flex-row" : "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
          isAi
            ? "bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 shadow-glow-sm"
            : "bg-surface-light border border-white/[0.06]"
        )}
      >
        {isAi ? (
          <Sparkles className="w-4 h-4 text-primary" />
        ) : (
          <User className="w-4 h-4 text-gray-400" />
        )}
      </div>

      {/* Content */}
      <div className={cn("flex-1 min-w-0 space-y-3", !isAi && "flex flex-col items-end")}>
        {/* Sender label */}
        <span className={cn(
          "text-[11px] font-semibold uppercase tracking-wider",
          isAi ? "text-primary/60" : "text-gray-500"
        )}>
          {isAi ? 'TRACE AI' : 'You'}
        </span>

        {/* Message bubble */}
        <div
          className={cn(
            "rounded-2xl px-5 py-3.5 text-[14.5px] leading-relaxed max-w-[90%]",
            isAi
              ? "bg-surface border border-white/[0.06] text-gray-200 shadow-card"
              : "bg-gradient-to-r from-primary to-primary-light text-white shadow-glow-sm"
          )}
        >
          <p className="whitespace-pre-wrap">{message.answer || message.text}</p>
        </div>

        {/* Sources section */}
        {isAi && message.sources && (
          (message.sources.documents?.length > 0 || message.sources.decisions?.length > 0) && (
            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Sources</span>
              <div className="flex gap-2 flex-wrap">
                {message.sources.documents?.map((doc, i) => (
                  <span
                    key={`doc-${i}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-light border border-white/[0.06] text-[11px] text-gray-400 font-medium hover:border-white/[0.1] transition-colors cursor-default"
                  >
                    <FileText className="w-3 h-3 text-gray-500" />
                    {doc.source || `Document ${i + 1}`}
                  </span>
                ))}
                {message.sources.decisions?.map((dec, i) => (
                  <span
                    key={`dec-${i}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/10 border border-secondary/15 text-[11px] text-secondary font-medium cursor-default"
                  >
                    <Zap className="w-3 h-3" />
                    {dec.decision || 'Decision'}
                  </span>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </motion.div>
  );
}
