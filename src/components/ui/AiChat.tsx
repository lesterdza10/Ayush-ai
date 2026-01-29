'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AiChatProps {
  profileData: any;
}

export function AiChat({ profileData }: AiChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial greeting message
  useEffect(() => {
    const greeting: Message = {
      id: 'greeting-' + Date.now(),
      role: 'assistant',
      content: `Hello ${profileData.name}! 👋 I'm your Ayurvedic health consultant. Based on your profile, your dominant dosha is **${
        profileData.vata > profileData.pitta && profileData.vata > profileData.kapha
          ? 'Vata'
          : profileData.pitta > profileData.kapha
            ? 'Pitta'
            : 'Kapha'
      }** (Vata: ${profileData.vata}%, Pitta: ${profileData.pitta}%, Kapha: ${profileData.kapha}%). 

Feel free to ask me anything about your health, wellness practices, diet recommendations, yoga, stress management, or any other Ayurvedic topics!`,
      timestamp: new Date(),
    };
    setMessages([greeting]);
  }, [profileData]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    // Optimistically update UI with the new user message
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // IMPORTANT: Include the latest user message in the payload so that
      // the final turn Gemini sees is always a `user` role.
      const messagesForApi = [...messages, userMessage];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messagesForApi.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          profileData: {
            name: profileData.name,
            age: profileData.age,
            gender: profileData.gender,
            vata: profileData.vata,
            pitta: profileData.pitta,
            kapha: profileData.kapha,
            sleepQuality: profileData.sleepQuality,
            stressLevel: profileData.stressLevel,
            digestion: profileData.digestion,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to send message');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: 'msg-' + Date.now() + '-ai',
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-slate-700 dark:to-slate-600 border border-cyan-200 dark:border-cyan-500/30 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 text-white">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span className="text-xl">💬</span>
          Chat with Ayurvedic AI Consultant
        </h2>
        <p className="text-xs text-cyan-100 mt-1">
          Ask questions about your health, wellness practices, and Ayurvedic recommendations
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, idx) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-cyan-500 text-white rounded-br-none'
                  : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-slate-700 rounded-bl-none'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.role === 'assistant' ? (
                  // Parse markdown bold for assistant messages
                  message.content.split(/\*\*(.+?)\*\*/g).map((part, i) =>
                    i % 2 === 1 ? (
                      <strong key={i}>{part}</strong>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )
                ) : (
                  message.content
                )}
              </p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-700 rounded-bl-none">
              <div className="flex gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  className="w-2 h-2 bg-cyan-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                  className="w-2 h-2 bg-blue-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-cyan-500 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-sm border border-red-200 dark:border-red-800"
        >
          {error}
        </motion.div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 dark:border-slate-600 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Ask me anything about your health..."
            className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
          >
            <Send size={18} />
            Send
          </button>
        </div>
      </form>
    </motion.div>
  );
}
