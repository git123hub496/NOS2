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
  LogOut,
  ShoppingBag,
  Calculator,
  Trash2,
  Mail,
  Map,
  Activity,
  Calendar,
  Smartphone,
  MessageSquare,
  Palette,
  Gamepad2,
  Bomb,
  RefreshCw,
  MessageCircle,
  Info,
  Camera,
  Tv,
  StickyNote,
  Type,
  Car,
  ChevronLeft
} from 'lucide-react';
import { useOSStore, AppId } from '../store';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const StartMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { 
    openApp, isLiteMode, powerOff, restart, user, setUser, 
    pinnedStartAppIds, togglePinStartApp, pinnedAppIds, togglePinApp
  } = useOSStore();
  const [search, setSearch] = useState("");
  const [isPowerMenuOpen, setIsPowerMenuOpen] = useState(false);
  const [view, setView] = useState<'pinned' | 'all'>('pinned');
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, appId: AppId } | null>(null);

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

  const allApps: { id: AppId; name: string; icon: React.ReactNode; color: string }[] = [
    { id: 'store', name: 'App Store', icon: <ShoppingBag size={20} />, color: 'text-pink-500' },
    { id: 'explorer', name: 'File Explorer', icon: <FileText size={20} />, color: 'text-yellow-500' },
    { id: 'settings', name: 'Settings', icon: <SettingsIcon size={20} />, color: 'text-gray-400' },
    { id: 'ai', name: 'AI Assistant', icon: <MessageSquare size={20} />, color: 'text-purple-500' },
    { id: 'notepad', name: 'Notes', icon: <FileText size={20} />, color: 'text-blue-400' },
    { id: 'calculator', name: 'Calculator', icon: <Calculator size={20} />, color: 'text-orange-500' },
    { id: 'browser', name: 'Nebula Browser', icon: <Globe size={20} />, color: 'text-blue-500' },
    { id: 'recycle-bin', name: 'Recycle Bin', icon: <Trash2 size={20} />, color: 'text-gray-500' },
    { id: 'mail', name: 'Nebula Mail', icon: <Mail size={20} />, color: 'text-blue-300' },
    { id: 'maps', name: 'Nebula Maps', icon: <Map size={20} />, color: 'text-green-500' },
    { id: 'process-manager', name: 'System Monitor', icon: <Activity size={20} />, color: 'text-red-500' },
    { id: 'calendar', name: 'Calendar', icon: <Calendar size={20} />, color: 'text-red-400' },
    { id: 'phone', name: 'Nebula Phone', icon: <Smartphone size={20} />, color: 'text-green-400' },
    { id: 'shop', name: 'Shop Nebulabs', icon: <ShoppingBag size={20} />, color: 'text-pink-400' },
    { id: 'themes', name: 'Themes', icon: <Palette size={20} />, color: 'text-purple-400' },
    { id: 'games', name: 'Nebula Games', icon: <Gamepad2 size={20} />, color: 'text-indigo-400' },
    { id: 'minesweeper', name: 'Minesweeper', icon: <Bomb size={20} />, color: 'text-gray-400' },
    { id: 'update', name: 'System Update', icon: <RefreshCw size={20} />, color: 'text-blue-400' },
    { id: 'chat', name: 'Nebula Chat', icon: <MessageCircle size={20} />, color: 'text-green-400' },
    { id: 'info', name: 'System Info', icon: <Info size={20} />, color: 'text-blue-300' },
    { id: 'camera', name: 'Nebula Camera', icon: <Camera size={20} />, color: 'text-gray-300' },
    { id: 'tv', name: 'Nebula TV', icon: <Tv size={20} />, color: 'text-red-500' },
    { id: 'sticky-notes', name: 'Sticky Notes', icon: <StickyNote size={20} />, color: 'text-yellow-400' },
    { id: 'fonts', name: 'Fonts', icon: <Type size={20} />, color: 'text-gray-200' },
    { id: 'car', name: 'Nebula Drive', icon: <Car size={20} />, color: 'text-gray-400' },
    { id: 'terminal', name: 'Terminal', icon: <TerminalIcon size={20} />, color: 'text-green-500' },
  ];

  const pinnedApps = allApps.filter(app => pinnedStartAppIds.includes(app.id));
  const filteredApps = (view === 'pinned' ? pinnedApps : allApps).filter(app => 
    app.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleContextMenu = (e: React.MouseEvent, appId: AppId) => {
    e.preventDefault();
    const menuWidth = 160; // w-40
    const menuHeight = 80; // Approx height for 2 options
    
    let x = e.clientX;
    let y = e.clientY;
    
    if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 10;
    if (y + menuHeight > window.innerHeight) y = window.innerHeight - menuHeight - 10;
    
    setContextMenu({ x, y, appId });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={`fixed bottom-14 left-2 w-[400px] h-[550px] z-[1000] flex flex-col overflow-hidden window-shadow ${isLiteMode ? 'bg-[#1a1a1a] border border-[#333]' : 'glass-dark rounded-2xl border border-white/10'}`}
      onClick={() => setContextMenu(null)}
    >
      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-[2000] glass-dark border border-white/10 rounded-xl p-1 w-40 shadow-2xl"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button
              onClick={() => {
                togglePinStartApp(contextMenu.appId);
                setContextMenu(null);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              {pinnedStartAppIds.includes(contextMenu.appId) ? 'Unpin from Start' : 'Pin to Start'}
            </button>
            <button
              onClick={() => {
                togglePinApp(contextMenu.appId);
                setContextMenu(null);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              {pinnedAppIds.includes(contextMenu.appId) ? 'Unpin from Taskbar' : 'Pin to Taskbar'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
          <input
            autoFocus
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 outline-none focus:border-blue-500/50 transition-colors text-sm"
            placeholder="Search apps, settings, and files"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Apps Grid */}
      <div className="flex-1 overflow-auto px-4 pb-4 custom-scrollbar">
        <div className="flex items-center justify-between mb-3 px-2">
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            {view === 'pinned' ? 'Workspace Intelligence' : 'All Applications'}
          </h3>
          <button 
            onClick={() => setView(view === 'pinned' ? 'all' : 'pinned')}
            className="text-[10px] font-bold text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-1"
          >
            {view === 'pinned' ? (
              <>All Apps <ChevronRight size={10} /></>
            ) : (
              <><ChevronLeft size={10} /> Back</>
            )}
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {filteredApps.map((app) => (
            <button
              key={app.id}
              onClick={() => { openApp(app.id, app.name); onClose(); }}
              onContextMenu={(e) => handleContextMenu(e, app.id)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/5 transition-colors group"
            >
              <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform ${app.color}`}>
                {app.icon}
              </div>
              <span className="text-[10px] text-gray-300 text-center truncate w-full px-1">{app.name}</span>
            </button>
          ))}
        </div>
        {view === 'pinned' && filteredApps.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 py-10">
            <Sparkles size={32} className="opacity-10 mb-2" />
            <p className="text-xs">No pinned apps</p>
            <button 
              onClick={() => setView('all')}
              className="mt-4 text-[10px] text-blue-500 font-bold uppercase"
            >
              View All Apps
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-white/5 flex items-center justify-between border-t border-white/5 relative">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center overflow-hidden border border-blue-500/20">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-blue-500 font-bold">{user?.displayName?.[0] || 'A'}</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider">{user?.displayName || 'AXRTECH'}</span>
              <span className="text-[9px] text-blue-500 font-bold uppercase tracking-tighter">Administrator</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => { openApp('phone', 'Nebula Phone'); onClose(); }}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Smartphone size={16} />
            </button>
            <button 
              onClick={() => { restart(); onClose(); }}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RotateCcw size={16} />
            </button>
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
        </div>
      </div>
    </motion.div>
  );
};

export default StartMenu;
