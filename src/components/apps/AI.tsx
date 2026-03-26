import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, User, Bot, Terminal, Cpu, Zap, MessageSquare, Trash2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';

interface Message {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "Hello! I am **Nebulabs AI**, your integrated assistant. How can I help you today?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg, timestamp: new Date() }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const stream = await ai.models.generateContentStream({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: "You are Nebulabs AI, the built-in assistant for Nebulabs OS 2. You are helpful, sleek, and technically proficient. Keep responses concise and relevant to an OS environment. Use markdown for formatting."
        }
      });

      let fullResponse = "";
      setMessages(prev => [...prev, { role: 'ai', content: "", timestamp: new Date() }]);

      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) {
          fullResponse += text;
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last.role === 'ai') {
              return [...prev.slice(0, -1), { ...last, content: fullResponse }];
            }
            return prev;
          });
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: "Error connecting to Nebulabs AI services. Please check your connection.", timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'ai', content: "Chat cleared. How else can I help you?", timestamp: new Date() }]);
  };

  return (
    <div className="h-full flex flex-col bg-[#050505] text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b border-white/5 flex items-center px-6 gap-4 bg-black/40 backdrop-blur-xl">
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
          style={{ backgroundColor: 'var(--os-accent)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
        >
          <Sparkles size={16} className="text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-bold tracking-tight">Nebulabs AI</h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">System Assistant • v2.0</p>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 text-gray-500 hover:text-red-400 transition-colors"
          title="Clear Chat"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-auto p-6 space-y-8 scroll-smooth"
      >
        {messages.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i} 
            className={`flex gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xl"
              style={{ 
                backgroundColor: msg.role === 'user' ? 'var(--os-accent)' : 'rgba(255,255,255,0.05)',
                border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)'
              }}
            >
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} style={{ color: 'var(--os-accent)' }} />}
            </div>
            <div className={`flex flex-col gap-2 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 px-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  {msg.role === 'user' ? 'User' : 'Nebulabs AI'}
                </span>
                <span className="text-[9px] text-gray-700">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div 
                className={`p-5 rounded-2xl text-sm leading-relaxed shadow-2xl ${msg.role === 'user' ? 'text-white rounded-tr-none' : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'}`}
                style={{ backgroundColor: msg.role === 'user' ? 'var(--os-accent)' : undefined }}
              >
                <div className="markdown-body prose prose-invert prose-sm max-w-none">
                  <Markdown>{msg.content}</Markdown>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && messages[messages.length - 1].role === 'user' && (
          <div className="flex justify-start gap-5">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <Bot size={20} className="animate-pulse" style={{ color: 'var(--os-accent)' }} />
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-2 items-center">
              <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: 'var(--os-accent)' }} />
              <div className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.2s]" style={{ backgroundColor: 'var(--os-accent)' }} />
              <div className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.4s]" style={{ backgroundColor: 'var(--os-accent)' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-black/40 border-t border-white/5 backdrop-blur-2xl">
        <div className="relative max-w-4xl mx-auto">
          <input
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 pr-16 outline-none transition-all text-sm placeholder:text-gray-600 shadow-inner focus:ring-1"
            style={{ boxShadow: '0 0 0 1px var(--os-accent)' }}
            placeholder="Ask Nebulabs AI anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 p-3 text-white rounded-xl transition-all disabled:opacity-30 disabled:grayscale shadow-lg active:scale-95"
            style={{ backgroundColor: 'var(--os-accent)' }}
          >
            {isLoading ? <Zap size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
        <div className="mt-4 flex justify-center gap-6 text-[9px] font-bold text-gray-600 uppercase tracking-widest">
          <div className="flex items-center gap-1.5"><Terminal size={10} /> System Integrated</div>
          <div className="flex items-center gap-1.5"><Cpu size={10} /> Neural Engine v2</div>
          <div className="flex items-center gap-1.5"><MessageSquare size={10} /> Real-time Response</div>
        </div>
      </div>
    </div>
  );
};

export default AI;

