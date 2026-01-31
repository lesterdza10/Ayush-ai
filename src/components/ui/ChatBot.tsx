'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, User, Bot } from 'lucide-react';

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Matches the working demo's history structure
  const [history, setHistory] = useState<any[]>([
    { role: "model", parts: [{ text: "Namaste! I am your AYUSH AI Sage. How can I guide you today?" }] }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;
      const res = await fetch(`/api/users/profile?userId=${userId}`);
      if (res.ok) setUserProfile(await res.json());
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput('');
    
    // Add user message to local history
    const newHistory = [...history, { role: "user", parts: [{ text: userMsg }] }];
    setHistory(newHistory);
    setIsTyping(true);

    try {
      const context = userProfile 
        ? `User ${userProfile.name} is ${userProfile.bodyType} type.` 
        : "";

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg, 
          context: context,
          history: newHistory // Send full history to API
        }),
      });

      const data = await res.json();
      
      if (data.text) {
        setHistory(prev => [...prev, { role: "model", parts: [{ text: data.text }] }]);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setHistory(prev => [...prev, { role: "model", parts: [{ text: "The Sage is currently in silence. Please try again." }] }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[350px] h-[500px] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            <div className="p-4 bg-gradient-to-r from-cyan-600 to-blue-600 flex justify-between items-center text-white">
              <span className="font-bold flex items-center gap-2"><Sparkles className="w-4 h-4"/> AYUSH Sage</span>
              <button onClick={() => setIsOpen(false)}><X className="w-5 h-5" /></button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
              {history.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-[13px] ${
                    msg.role === 'user' ? 'bg-cyan-600 text-white rounded-tr-none' : 'bg-white/10 text-gray-200 rounded-tl-none'
                  }`}>
                    {msg.parts[0].text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-[10px] text-cyan-400 animate-pulse uppercase tracking-widest">Sage is thinking...</div>}
            </div>

            <div className="p-4 bg-slate-900 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask something..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:ring-1 ring-cyan-500"
              />
              <button onClick={handleSend} className="p-2 bg-cyan-600 rounded-xl hover:bg-cyan-500 transition-colors">
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl border-2 border-white/20 text-white"
      >
        {isOpen ? <X /> : <MessageCircle />}
      </button>
    </div>
  );
};