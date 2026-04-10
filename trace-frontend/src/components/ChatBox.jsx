import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, ArrowRight, Brain, Network, FileSearch } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble';
import Loader from './Loader';
import { queryTRACE } from '../services/api';

const suggestedQuestions = [
  { text: "Why did Phoenix batch fail?", icon: Brain },
  { text: "Who approved the binder switch?", icon: FileSearch },
  { text: "What decisions were made about Phoenix?", icon: Network },
];

export default function ChatBox() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e, overrideQuery = null) => {
    e?.preventDefault();
    const textToSubmit = overrideQuery || query;
    if (!textToSubmit.trim() || isLoading) return;

    const userMessage = { text: textToSubmit, isAi: false };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await queryTRACE(textToSubmit);
      const aiMessage = {
        isAi: true,
        answer: response.answer || "I found some information regarding your query.",
        sources: response.sources || {}
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage = {
        isAi: true,
        answer: "I couldn't connect to the TRACE backend. Please ensure the API server is running on port 3000.",
        sources: {}
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">

      {/* Empty State — Welcome Screen */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-secondary/[0.03] rounded-full blur-[100px]" />
          </div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative mb-8"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/15 shadow-glow animate-float">
              <Sparkles className="w-9 h-9 text-primary" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success flex items-center justify-center border-2 border-background">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl font-extrabold mb-3 text-gradient">
              Ask TRACE Anything
            </h1>
            <p className="text-gray-400 max-w-md text-[15px] leading-relaxed">
              Trace organizational decisions, reasoning chains, and contextual knowledge across your company.
            </p>
          </motion.div>

          {/* Suggested Questions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl w-full"
          >
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                id={`suggested-question-${i}`}
                onClick={() => {
                  setQuery(q.text);
                  handleSubmit(null, q.text);
                }}
                className="group flex flex-col items-start gap-3 p-4 rounded-2xl bg-surface/60 border border-white/[0.06] text-left hover:bg-surface hover:border-white/[0.1] hover:shadow-card transition-all duration-300 active:scale-[0.98]"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/15 group-hover:bg-primary/15 transition-colors">
                  <q.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-[13px] text-gray-300 font-medium leading-snug group-hover:text-gray-100 transition-colors">
                  {q.text}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </motion.div>
        </div>
      ) : (
        /* Messages List */
        <div className="flex-1 overflow-y-auto w-full pb-36 pt-4">
          <AnimatePresence>
            {messages.map((m, i) => (
              <MessageBubble key={i} message={m} isAi={m.isAi} />
            ))}
          </AnimatePresence>

          {isLoading && (
            <div className="flex w-full gap-3.5 max-w-4xl mx-auto py-5 px-4 md:px-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/20 shadow-glow-sm shrink-0">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-primary/60">
                  TRACE AI
                </span>
                <div className="bg-surface border border-white/[0.06] rounded-2xl px-5 py-4 shadow-card">
                  <Loader />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input Area */}
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-background via-background/95 to-transparent pt-8 pb-5 px-4 z-20">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto relative group"
        >
          {/* Glow effect behind input */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/15 via-secondary/10 to-accent/15 blur-xl opacity-0 group-hover:opacity-60 group-focus-within:opacity-100 transition-opacity duration-500 rounded-3xl" />

          <div className="relative glass-strong rounded-2xl shadow-elevated overflow-hidden focus-within:border-primary/30 transition-all">
            <input
              ref={inputRef}
              id="query-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about decisions, meetings, context, or anything..."
              className="w-full bg-transparent text-gray-100 placeholder-gray-500 pl-5 pr-14 py-4 outline-none text-[15px] font-medium"
              disabled={isLoading}
            />
            <button
              id="query-submit-btn"
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white disabled:opacity-30 disabled:from-gray-700 disabled:to-gray-700 hover:shadow-glow-sm transition-all active:scale-90"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <p className="text-center mt-3 text-[11px] text-gray-600 font-medium tracking-wide">
            TRACE uses AI reasoning. Always verify critical decisions.
          </p>
        </form>
      </div>
    </div>
  );
}
