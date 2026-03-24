import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Monitor, 
  Settings as SettingsIcon, 
  Terminal as TerminalIcon, 
  Globe, 
  Sparkles, 
  FileText,
  Search,
  Power,
  User as UserIcon,
  ChevronRight,
  RotateCcw,
  LogOut
} from 'lucide-react';
import { useOSStore, AppId } from '../store';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const StartMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { openApp, isLiteMode, powerOff, restart, user, setUser } = useOSStore();
  const [search, setSearch] = useState("");
  const [isPowerMenuOpen, setIsPowerMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      if (!user?.isLocal) {
        await signOut(auth);
      }
      setUser(null);
      onClose();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  if (!isOpen) return null;

  const apps: { id: AppId; name: string; icon: React.ReactNode; color: string }[] = [
    { id: 'explorer', name: 'File Explorer', icon: <FileText size={20} />, color: 'text-yellow-500' },
    { id: 'browser', name: 'Web Browser', icon: <Globe size={20} />, color: 'text-blue-400' },
    { id: 'terminal', name: 'Terminal', icon: <TerminalIcon size={20} />, color: 'text-green-500' },
    { id: 'ai', name: 'Nebulabs AI', icon: <Sparkles size={20} />, color: 'text-purple-500' },
    { id: 'notepad', name: 'Notepad', icon: <FileText size={20} />, color: 'text-gray-400' },
    { id: 'settings', name: 'Settings', icon: <SettingsIcon size={20} />, color: 'text-blue-500' },
  ];

  const filteredApps = apps.filter(app => app.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={`fixed bottom-14 left-2 w-96 h-[500px] z-[1000] flex flex-col overflow-hidden window-shadow ${isLiteMode ? 'bg-[#1a1a1a] border border-[#333]' : 'glass-dark rounded-2xl border border-white/10'}`}
    >
      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
          <input
            autoFocus
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 outline-none focus:border-blue-500/50 transition-colors text-sm"
            placeholder="Search apps, files, and settings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Apps Grid */}
      <div className="flex-1 overflow-auto px-4 pb-4">
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">Pinned Apps</h3>
        <div className="grid grid-cols-3 gap-2">
          {filteredApps.map((app) => (
            <button
              key={app.id}
              onClick={() => { openApp(app.id, app.name); onClose(); }}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/5 transition-colors group"
            >
              <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform ${app.color}`}>
                {app.icon}
              </div>
              <span className="text-[11px] text-gray-300 text-center">{app.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-white/5 flex items-center justify-between border-t border-white/5 relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <UserIcon size={16} />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium">{user?.displayName || 'Nebulabs User'}</span>
            <span className="text-[10px] text-gray-500">{user?.isLocal ? 'Local Account' : 'Google Account'}</span>
          </div>
        </div>
        
        <div className="relative">
          <AnimatePresence>
            {isPowerMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="absolute bottom-full right-0 mb-2 w-40 glass-dark border border-white/10 rounded-xl overflow-hidden shadow-2xl"
              >
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-xs text-gray-300 transition-colors"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
                <button 
                  onClick={() => { restart(); onClose(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-xs text-gray-300 transition-colors"
                >
                  <RotateCcw size={14} />
                  Restart
                </button>
                <button 
                  onClick={() => { powerOff(); onClose(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-xs text-red-400 transition-colors"
                >
                  <Power size={14} />
                  Shut Down
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={() => setIsPowerMenuOpen(!isPowerMenuOpen)}
            className={`p-2 rounded-lg transition-colors ${isPowerMenuOpen ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
          >
            <Power size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default StartMenu;
