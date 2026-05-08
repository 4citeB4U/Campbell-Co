/*
LEEWAY HEADER — DO NOT REMOVE

REGION: UI
TAG: UI.SRC.COMPONENTS.AVO_CONCIERGE.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = AvoConcierge.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/components/AvoConcierge.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation, matchPath } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Loader2, Sparkles, ShieldCheck, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useProductExperience } from '../context/ProductExperienceContext';
import { getConciergeResponse } from '../services/conciergeService';
import { MASTER_PRODUCTS } from '../constants';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

export default function AvoConcierge() {
  const navigate = useNavigate();
  const location = useLocation();
  const { products } = useProductExperience();
  
  const selectedProduct = useMemo(() => {
    const match = matchPath({ path: "/product/:slug" }, location.pathname);
    if (match?.params.slug) {
      return MASTER_PRODUCTS.find(p => p.slug === match.params.slug);
    }
    return null;
  }, [location.pathname]);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Good afternoon. I am Concierge Avo, your concierge to the House of Campbell. Whether you seek technical precision or the narrative behind our latest artifacts, I am here to guide you." 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    const result = await getConciergeResponse(userMsg, selectedProduct || undefined, products);
    
    // Process Function Calls
    if (result.functionCalls) {
      for (const call of result.functionCalls) {
        if (call.name === 'select_artifact') {
          const artifactId = (call.args as any).artifactId as string;
          const product = products.find(p => p.id === artifactId);
          if (product) {
            navigate(`/product/${product.slug}`);
            setMessages(prev => [...prev, { role: 'assistant', content: `Opening the ${product.title} spotlight for you now.` }]);
          }
        }
        if (call.name === 'navigate_to') {
          const path = (call.args as any).path as string;
          const lowerPath = path.toLowerCase();
          if (lowerPath.includes('shop') || lowerPath.includes('collection')) navigate('/shop');
          else if (lowerPath.includes('diamond') || lowerPath.includes('guide')) navigate('/diamonds');
          else if (lowerPath.includes('checkout') || lowerPath.includes('buy')) navigate('/checkout');
          else navigate('/');
          
          setMessages(prev => [...prev, { role: 'assistant', content: `Taking you to our ${path} registry.` }]);
        }
        if (call.name === 'compare_artifacts') {
          const artifactIds = (call.args as any).artifactIds as string[];
          const comparedProducts = products.filter(p => artifactIds.includes(p.id));
          if (comparedProducts.length > 0) {
            setMessages(prev => [...prev, { role: 'assistant', content: `Preparing a side-by-side analysis of these ${comparedProducts.length} artifacts: ${comparedProducts.map(p => p.title).join(', ')}...` }]);
          }
        }
      }
    }

    setMessages(prev => [...prev, { role: 'assistant', content: result.text }]);
    setIsTyping(false);
  };

  return (
    <>
      {/* Floating Trigger */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-10 right-10 z-[110] w-16 h-16 bg-gold text-black-pure flex items-center justify-center rounded-full shadow-[0_10px_40px_rgba(212,175,55,0.4)] hover:scale-110 transition-all group"
          >
            <MessageSquare size={24} strokeWidth={1.5} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full animate-ping" />
            <span className="absolute right-full mr-6 py-2 px-4 bg-black-pure border border-gold/20 text-[9px] uppercase tracking-[0.4em] text-gold font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
               Consult Avo
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Global Concierge Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-10 right-10 z-[120] w-[450px] h-[700px] bg-black-pure border border-gold/30 shadow-[0_30px_100px_rgba(0,0,0,1)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 bg-[#050505] border-b border-gold/10 flex justify-between items-center relative">
               <div className="flex items-center gap-6">
                  <div className="w-10 h-10 border border-gold flex items-center justify-center rounded-sm">
                     <span className="text-gold font-serif text-xl">C</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[10px] uppercase tracking-[0.5em] text-gold font-black">Concierge Avo</span>
                     <span className="text-[8px] uppercase tracking-[0.3em] text-white/30 font-black flex items-center gap-2">
                        Online <div className="w-1 h-1 bg-green-500 rounded-full" />
                     </span>
                  </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="text-white/30 hover:text-white transition-colors">
                  <X size={20} strokeWidth={1} />
               </button>
               {/* Accent Line */}
               <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-20" />
            </div>

            {/* Conversation Flow */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8 bg-[#020202]"
            >
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-sm p-6 shadow-2xl ${
                    msg.role === 'user' 
                    ? 'bg-gold text-black-pure font-black tracking-wider text-[11px]' 
                    : 'bg-white/5 text-white/90 italic font-serif border border-gold/10 text-[12px] leading-relaxed'
                  }`}>
                    {msg.content}
                    {msg.role === 'assistant' && idx === 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {['Diamond Grading', 'Ethical Sourcing', 'Gift Selection'].map(hint => (
                          <button 
                            key={hint} 
                            onClick={() => { setInput(`Enlighten me about ${hint}`); }}
                            className="bg-black-pure/40 border border-gold/20 px-3 py-1.5 text-[8px] uppercase tracking-[0.2em] text-gold hover:bg-gold hover:text-black-pure transition-all"
                          >
                            {hint}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-4 bg-white/5 px-6 py-4 rounded-sm border border-gold/5">
                    <Loader2 size={12} className="text-gold animate-spin" />
                    <span className="text-[9px] uppercase tracking-[0.5em] text-white/30 font-black">Concierge Avo is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Context Awareness Bar */}
            {selectedProduct && (
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                className="bg-gold/5 border-y border-gold/10 px-8 py-4 flex items-center justify-between"
              >
                 <div className="flex items-center gap-4">
                    <Sparkles size={10} className="text-gold" />
                    <span className="text-[9px] uppercase tracking-[0.4em] text-white/60 font-black">Focusing on {selectedProduct.title}</span>
                 </div>
                 <button 
                  onClick={() => setInput(`Tell me specifically about this ${selectedProduct.title}`)}
                  className="text-[8px] uppercase tracking-[0.2em] text-gold underline font-black"
                >
                   Query Piece
                 </button>
              </motion.div>
            )}

            {/* Input System */}
            <div className="p-8 bg-[#050505] border-t border-gold/20">
               <div className="flex gap-4 p-4 bg-black-pure border border-gold/20 focus-within:border-gold transition-colors">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Speak with the concierge..."
                    className="flex-1 bg-transparent text-[11px] uppercase tracking-[0.3em] text-white outline-none placeholder:text-white/10"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={isTyping}
                    className="text-gold hover:scale-110 disabled:opacity-30 transition-transform p-1"
                  >
                     <Send size={18} strokeWidth={1} />
                  </button>
               </div>
               <div className="mt-6 flex justify-between items-center opacity-30">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={10} />
                    <span className="text-[8px] uppercase tracking-[0.2em] font-black">Private Line</span>
                  </div>
                  <span className="text-[8px] uppercase tracking-[0.2em] font-black">House of Campbell</span>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
