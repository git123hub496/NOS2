import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Hash, Users, MessageSquare } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { useOSStore } from '../../store';

interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  createdAt: any;
}

const Chat: React.FC = () => {
  const { user } = useOSStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'global_chat'),
      orderBy('createdAt', 'asc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'global_chat');
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;

    const text = input.trim();
    setInput("");

    try {
      await addDoc(collection(db, 'global_chat'), {
        text,
        userId: user.uid,
        userName: user.displayName || 'Anonymous User',
        userPhoto: user.photoURL || '',
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'global_chat');
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b border-white/5 flex items-center px-6 gap-4 bg-black/20">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
          <Hash size={18} />
        </div>
        <div>
          <h2 className="text-sm font-bold">Global Chat</h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Nebulabs Network • Real-time</p>
        </div>
        <div className="ml-auto flex items-center gap-4 text-gray-500">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Live
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-auto p-6 space-y-6 scroll-smooth"
      >
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-gray-500 text-xs uppercase tracking-widest">
            Connecting to Nebula Network...
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-600 text-xs gap-4">
            <MessageSquare size={48} className="opacity-10" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.userId === user?.uid;
            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id} 
                className={`flex gap-4 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${isMe ? 'bg-blue-600' : 'bg-white/5 border border-white/10'}`}>
                  {msg.userPhoto ? (
                    <img src={msg.userPhoto} alt={msg.userName} className="w-full h-full rounded-xl object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User size={20} className={isMe ? 'text-white' : 'text-gray-400'} />
                  )}
                </div>
                <div className={`flex flex-col gap-1.5 max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{msg.userName}</span>
                    <span className="text-[9px] text-gray-600">
                      {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                    </span>
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-xl ${
                    isMe 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-black/40 border-t border-white/5 backdrop-blur-xl">
        <div className="relative max-w-4xl mx-auto">
          <input
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 pr-16 outline-none focus:border-blue-500/50 transition-all text-sm placeholder:text-gray-600 shadow-inner"
            placeholder="Type a message to the network..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-2 top-2 p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all disabled:opacity-30 disabled:grayscale shadow-lg active:scale-95"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
