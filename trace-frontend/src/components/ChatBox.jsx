import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble';
import Loader from './Loader';
import { queryTRACE } from '../services/api';

const suggestedQuestions = [
  "Why did Phoenix batch fail?",
  "Who approved binder switch?",
  "What decisions were made about Phoenix?",
];

export default function ChatBox() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

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
      // MOCK query if backend is not actually there, or attempt actual call
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
        answer: "Sorry, I couldn't connect to the TRACE backend. Please ensure the API is running.",
        sources: {}
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Welcome to TRACE
          </h1>
          <p className="text-gray-400 max-w-md text-center mb-10 text-[15px]">
            Trace Reasoning And Context Engine. Ask questions to explore company decisions and knowledge.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 max-w-2xl">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(q);
                  handleSubmit(null, q);
                }}
                className="px-4 py-2.5 rounded-xl bg-surface border border-gray-800 text-sm text-gray-300 hover:bg-white/5 hover:border-gray-600 transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto w-full pb-32 pt-8">
          <AnimatePresence>
            {messages.map((m, i) => (
              <MessageBubble key={i} message={m} isAi={m.isAi} />
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="flex w-full gap-4 max-w-4xl mx-auto py-6 px-4 md:px-0">
               <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 text-primary">
                 <Sparkles className="w-4 h-4" />
               </div>
               <div className="bg-surface border border-gray-800 rounded-2xl px-5 py-4 flex items-center shadow-sm">
                  <Loader />
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input Form Area */}
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-background via-background to-transparent pt-10 pb-6 px-4">
        <form 
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
          <div className="relative bg-surface rounded-2xl border border-gray-700 shadow-xl overflow-hidden focus-within:border-primary/50 transition-colors">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask TRACE about decisions, meetings, or context..."
              className="w-full bg-transparent text-gray-100 placeholder-gray-500 px-6 py-4 outline-none text-[15px]"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white disabled:opacity-50 disabled:hover:bg-primary/10 disabled:hover:text-primary transition-all active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="text-center mt-3 text-[11px] text-gray-500 font-medium tracking-wide">
            TRACE may make mistakes. Verify critical reasoning.
          </div>
        </form>
      </div>
    </div>
  );
}
