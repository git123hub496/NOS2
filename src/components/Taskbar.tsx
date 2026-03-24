import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Monitor, 
  Settings as SettingsIcon, 
  Terminal as TerminalIcon, 
  Globe, 
  Sparkles, 
  FileText,
  Wifi,
  Volume2,
  Battery,
  Calendar,
  Presentation,
  Activity,
  Search,
  LayoutGrid,
  Smartphone,
  MessageSquare,
  User as UserIcon,
  ShoppingBag,
  CreditCard,
  Heart
} from 'lucide-react';
import { useOSStore, AppId } from '../store';
import StartMenu from './StartMenu';

import QuickSettings from './QuickSettings';

const Taskbar: React.FC = () => {
  const { 
    windows, openApp, focusApp, activeWindowId, isLiteMode, 
    toggleQuickSettings, isQuickSettingsOpen,
    taskbarPosition, setTaskbarPosition, pinnedAppIds, togglePinApp,
    user
  } = useOSStore();
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const allApps: { id: AppId; name: string; icon: React.ReactNode; color: string }[] = [
    { id: 'search', name: 'Nebula Search', icon: <Search size={20} />, color: 'text-blue-400' },
    { id: 'browser', name: 'Nebula Browser', icon: <Globe size={20} />, color: 'text-blue-500' },
    { id: 'explorer', name: 'File Explorer', icon: <FileText size={20} />, color: 'text-yellow-500' },
    { id: 'store', name: 'App Store', icon: <ShoppingBag size={20} />, color: 'text-pink-500' },
    { id: 'ai', name: 'Nebulabs AI', icon: <Sparkles size={20} />, color: 'text-purple-500' },
    { id: 'pay', name: 'Nebula Pay', icon: <CreditCard size={20} />, color: 'text-indigo-400' },
    { id: 'health', name: 'Health', icon: <Heart size={20} />, color: 'text-red-400' },
    { id: 'terminal', name: 'Terminal', icon: <TerminalIcon size={20} />, color: 'text-green-500' },
    { id: 'settings', name: 'Settings', icon: <SettingsIcon size={20} />, color: 'text-gray-400' },
  ];

  const pinnedApps = allApps.filter(app => pinnedAppIds.includes(app.id));
  const openUnpinnedApps = allApps.filter(app => !pinnedAppIds.includes(app.id) && windows.some(w => w.id === app.id));

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const isVertical = taskbarPosition === 'left' || taskbarPosition === 'right';

  return (
    <>
      <StartMenu isOpen={isStartOpen} onClose={() => setIsStartOpen(false)} />
      <AnimatePresence>
        {isQuickSettingsOpen && <QuickSettings />}
      </AnimatePresence>

      {contextMenu && (
        <div 
          className="fixed z-[3000] glass-dark rounded-xl border border-white/10 p-2 w-48 shadow-2xl"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={() => setContextMenu(null)}
          onMouseLeave={() => setContextMenu(null)}
        >
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold px-3 py-1 mb-1">Taskbar Position</p>
          {(['bottom', 'top', 'left', 'right'] as const).map(pos => (
            <button
              key={pos}
              onClick={() => setTaskbarPosition(pos)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs capitalize transition-colors ${taskbarPosition === pos ? 'bg-blue-600 text-white' : 'hover:bg-white/10 text-gray-300'}`}
            >
              {pos}
            </button>
          ))}
        </div>
      )}
      
      <div 
        onContextMenu={handleContextMenu}
        className={`fixed z-[2000] flex items-center justify-between p-2 transition-all duration-300 ${isLiteMode ? 'bg-[#111] border-[#333]' : 'bg-[#0a0a0a]/90 backdrop-blur-md border-white/10'} taskbar-${taskbarPosition}`}
      >
        <div className={`flex items-center gap-2 ${isVertical ? 'flex-col' : 'flex-row'}`}>
          <button 
            onClick={() => setIsStartOpen(!isStartOpen)}
            className={`p-2 rounded-lg transition-all flex items-center justify-center ${isStartOpen ? 'bg-blue-600 text-white' : 'hover:bg-white/10 text-blue-500'}`}
          >
            <span className="text-xl font-display font-black leading-none select-none">N</span>
          </button>
          
          {!isVertical && (
            <div className="flex items-center gap-2">
              <div className="relative group">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text"
                  placeholder="Search Google..."
                  className="bg-white/5 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-xs text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all w-48"
                />
              </div>
              <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors">
                <LayoutGrid size={18} />
              </button>
            </div>
          )}
          
          <div className={`${isVertical ? 'w-6 h-px my-1' : 'w-px h-6 mx-1'} bg-white/10`} />
        </div>

        <div className={`flex flex-1 items-center justify-center gap-1 ${isVertical ? 'flex-col' : 'flex-row'}`}>
          {[...pinnedApps, ...openUnpinnedApps].map(app => {
            const isOpen = windows.some(w => w.id === app.id);
            const isActive = activeWindowId === app.id;
            const isPinned = pinnedAppIds.includes(app.id);
            
            return (
              <button
                key={app.id}
                onClick={() => isOpen ? focusApp(app.id) : openApp(app.id, app.name)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  togglePinApp(app.id);
                }}
                className={`p-2 rounded-lg transition-all relative group ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`}
                title={`${app.name} (${isPinned ? 'Pinned' : 'Unpinned'})`}
              >
                <div className={`${app.color} ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                  {app.icon}
                </div>
                {isOpen && (
                  <div className={`absolute rounded-full bg-blue-500 transition-all ${isVertical ? 'right-0.5 top-1/2 -translate-y-1/2 w-1 h-1' : 'bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1'} ${isActive ? (isVertical ? 'h-4' : 'w-4') : ''}`} />
                )}
              </button>
            );
          })}
        </div>

        <div className={`flex items-center gap-3 px-2 ${isVertical ? 'flex-col' : 'flex-row'}`}>
          {!isVertical && (
            <div className="flex items-center gap-3 text-gray-400 mr-2">
              <button className="hover:text-white transition-colors"><Smartphone size={16} /></button>
              <button className="hover:text-white transition-colors"><MessageSquare size={16} /></button>
            </div>
          )}
          
          <div className={`flex items-center gap-3 text-gray-400 ${isVertical ? 'flex-col' : 'flex-row'}`}>
            <Wifi size={16} />
            <Volume2 size={16} />
            <Battery size={16} />
          </div>
          
          <div className={`${isVertical ? 'w-6 h-px' : 'w-px h-6'} bg-white/10`} />

          <button 
            onClick={toggleQuickSettings}
            className={`flex flex-col items-center justify-center select-none px-2 rounded-lg transition-colors ${isQuickSettingsOpen ? 'bg-white/10' : 'hover:bg-white/5'} ${isVertical ? 'py-1' : ''}`}
          >
            <span className="text-[11px] font-medium leading-none">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="text-[9px] text-gray-500 mt-1">
              {time.toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </span>
          </button>

          {!isVertical && (
            <div className="flex items-center ml-1">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden border border-white/10 shadow-lg cursor-pointer hover:scale-110 transition-transform">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={16} className="text-white" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Taskbar;
