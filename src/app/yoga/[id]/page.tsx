'use client';

import React, { useState, useEffect, use, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { yogaExercises } from '@/types/yoga'; 
import { Button } from '@/components/ui/Button';
import { Send, ArrowLeft, Sparkles, Bot, Info, Heart } from 'lucide-react';
import { useRouter, notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default function YogaDetailPage({ params }: Props) {
  const router = useRouter();
  
  // Unwrap params for Next.js 15+
  const { id } = use(params);
  const yoga = yogaExercises.find(y => y.id === id);
  
  // State Management
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', content: `Namaste! I am your Yoga Sage. How can I guide your practice of ${yoga?.name} today?` }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!yoga) return notFound();

  const handleQuery = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg, 
          context: `User is viewing ${yoga.name} (${yoga.sanskritName}). 
                    Benefits: ${yoga.benefits.join(', ')}. 
                    Dosha focus: ${yoga.dosha}. 
                    Answer health questions through the lens of this pose.` 
        }),
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.text || "The Sage is currently in deep meditation. Please try again." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "Connection to the wisdom scrolls lost. Check your network." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col lg:flex-row p-4 md:p-8 gap-6 lg:gap-12">
      
      {/* LEFT SIDE: Pose Information Card */}
      <div className="w-full lg:w-5/12 flex flex-col h-full">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-6 group w-fit"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          <span className="text-sm font-medium">Back to Library</span>
        </button>

        <div className="bg-slate-900/50 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col sticky top-8">
          <div className="relative h-[300px] md:h-[400px]">
            <img 
              src={yoga.image} 
              alt={yoga.name} 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
            <div className="absolute bottom-6 left-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-cyan-500/20 text-cyan-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-cyan-500/30 uppercase tracking-widest">
                  {yoga.dosha} Focus
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{yoga.name}</h1>
              <p className="text-xl text-cyan-400 italic font-medium mt-1">{yoga.sanskritName}</p>
            </div>
          </div>

          <div className="p-8 space-y-6 bg-slate-900/80 backdrop-blur-md">
            <div>
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
                <Heart className="w-3 h-3 text-red-500" /> Ayurvedic Benefits
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {yoga.benefits.map((benefit, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl text-sm text-gray-300 flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-cyan-500/5 rounded-2xl border border-cyan-500/10">
              <p className="text-xs text-cyan-200/70 leading-relaxed flex gap-2">
                <Info className="w-4 h-4 shrink-0" />
                {yoga.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Interactive Chat Sage */}
      <div className="w-full lg:w-7/12 flex flex-col h-[600px] lg:h-[85vh] bg-slate-900/30 rounded-[3rem] border border-white/5 backdrop-blur-sm overflow-hidden shadow-inner">
        
        {/* Scrollable Message Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scroll-smooth scrollbar-hide"
        >
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`relative max-w-[85%] md:max-w-[75%]`}>
                {msg.role === 'ai' && (
                  <div className="flex items-center gap-2 mb-2 ml-2">
                    <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                    <span className="text-[10px] font-black text-cyan-500/60 uppercase tracking-widest">Sage Wisdom</span>
                  </div>
                )}
                
                <div className={`p-5 md:p-6 rounded-[2rem] text-sm md:text-base leading-relaxed shadow-2xl relative ${
                  msg.role === 'user' 
                  ? 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-tr-none' 
                  : 'bg-white text-slate-900 rounded-tl-none font-medium'
                }`}>
                  {msg.content}
                  
                  {/* Cartoon Cloud Tail */}
                  <div className={`absolute top-0 w-6 h-6 transform -translate-y-1/2 ${
                    msg.role === 'user' 
                    ? '-right-1.5 border-l-[20px] border-l-blue-700 border-b-[20px] border-b-transparent' 
                    : '-left-1.5 border-r-[20px] border-r-white border-b-[20px] border-b-transparent'
                  }`} />
                </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3 items-center text-cyan-400 text-[11px] font-bold uppercase tracking-widest ml-4">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></span>
              </div>
              The Sage is contemplating...
            </div>
          )}
        </div>

        {/* Input Dock */}
        <div className="p-6 md:p-8 bg-slate-950/80 backdrop-blur-xl border-t border-white/5">
          <div className="max-w-3xl mx-auto relative group">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
              placeholder={`Ask about ${yoga.name} or your health...`}
              className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-5 pr-16 text-white focus:outline-none focus:ring-2 ring-cyan-500/40 transition-all placeholder:text-gray-600 text-sm md:text-base shadow-2xl"
            />
            <button 
              onClick={handleQuery}
              disabled={isTyping}
              className="absolute right-3 top-3 bottom-3 px-6 bg-cyan-600 rounded-2xl hover:bg-cyan-500 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}