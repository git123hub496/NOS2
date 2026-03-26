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
  Heart,
  Trash2,
  Mail,
  Map,
  Calculator as CalculatorIcon,
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
  Car
} from 'lucide-react';
import { useOSStore, AppId, TaskbarPosition } from '../store';
import StartMenu from './StartMenu';

import QuickSettings from './QuickSettings';

const Taskbar: React.FC = () => {
  const { 
    windows, openApp, focusApp, activeWindowId, isLiteMode, 
    toggleQuickSettings, isQuickSettingsOpen,
    taskbarPosition, setTaskbarPosition, pinnedAppIds, togglePinApp,
    user, toggleWidgets, toggleChat, isWidgetsOpen, isChatOpen,
    taskbarTransparency, isTaskbarAutohide
  } = useOSStore();
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, appId?: AppId } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

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
    { id: 'mail', name: 'Nebula Mail', icon: <Mail size={20} />, color: 'text-blue-300' },
    { id: 'maps', name: 'Nebula Maps', icon: <Map size={20} />, color: 'text-green-500' },
    { id: 'calendar', name: 'Calendar', icon: <Calendar size={20} />, color: 'text-red-400' },
    { id: 'calculator', name: 'Calculator', icon: <CalculatorIcon size={20} />, color: 'text-orange-500' },
    { id: 'notepad', name: 'Notes', icon: <FileText size={20} />, color: 'text-blue-400' },
    { id: 'recycle-bin', name: 'Recycle Bin', icon: <Trash2 size={20} />, color: 'text-gray-500' },
    { id: 'process-manager', name: 'System Monitor', icon: <Activity size={20} />, color: 'text-red-500' },
    { id: 'settings', name: 'Settings', icon: <SettingsIcon size={20} />, color: 'text-gray-400' },
    { id: 'terminal', name: 'Terminal', icon: <TerminalIcon size={20} />, color: 'text-green-500' },
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
  ];

  const pinnedApps = allApps.filter(app => pinnedAppIds.includes(app.id));
  const openUnpinnedApps = allApps.filter(app => !pinnedAppIds.includes(app.id) && windows.some(w => w.id === app.id));

  const handleContextMenu = (e: React.MouseEvent, appId?: AppId) => {
    e.preventDefault();
    e.stopPropagation();
    const menuWidth = 192; // w-48
    const menuHeight = 120; // Approx height
    
    let x = e.clientX;
    let y = e.clientY;
    
    // Keep within viewport
    if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 10;
    if (y + menuHeight > window.innerHeight) y = window.innerHeight - menuHeight - 10;
    
    setContextMenu({ x, y, appId });
  };

  const rotateTaskbar = () => {
    const positions: TaskbarPosition[] = ['bottom', 'left', 'top', 'right'];
    const currentIndex = positions.indexOf(taskbarPosition);
    const nextIndex = (currentIndex + 1) % positions.length;
    setTaskbarPosition(positions[nextIndex]);
  };

  const isVertical = taskbarPosition === 'left' || taskbarPosition === 'right';
  const isHidden = isTaskbarAutohide && !isHovered && !isStartOpen && !isQuickSettingsOpen;

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
          <button
            onClick={(e) => {
              e.stopPropagation();
              rotateTaskbar();
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/10 text-gray-300 flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={14} />
            Rotate Taskbar
          </button>

          {contextMenu.appId && pinnedAppIds.includes(contextMenu.appId) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (contextMenu.appId) togglePinApp(contextMenu.appId);
                setContextMenu(null);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-red-500/20 text-red-400 flex items-center gap-2 transition-colors mt-1"
            >
              <Trash2 size={14} />
              Unpin from Taskbar
            </button>
          )}
        </div>
      )}
      
      <div 
        onContextMenu={(e) => handleContextMenu(e)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed z-[2000] flex items-center justify-between p-2 transition-all duration-300 taskbar-${taskbarPosition} ${isHidden ? 'taskbar-hidden' : ''}`}
        style={{ 
          backgroundColor: isLiteMode ? '#111' : `rgba(10, 10, 10, ${taskbarTransparency / 100})`,
          backdropFilter: isLiteMode ? 'none' : 'blur(12px)',
          border: isLiteMode ? '1px solid #333' : '1px solid rgba(255, 255, 255, 0.1)',
          transform: isHidden ? (
            taskbarPosition === 'bottom' ? 'translateY(calc(100% - 2px))' :
            taskbarPosition === 'top' ? 'translateY(calc(-100% + 2px))' :
            taskbarPosition === 'left' ? 'translateX(calc(-100% + 2px))' :
            'translateX(calc(100% - 2px))'
          ) : 'none'
        }}
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      openApp('browser', 'Nebula Browser');
                    }
                  }}
                />
              </div>
              <button 
                onClick={toggleWidgets}
                className={`p-2 rounded-lg transition-colors ${isWidgetsOpen ? 'bg-blue-600 text-white' : 'hover:bg-white/10 text-gray-400'}`}
              >
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
                onContextMenu={(e) => handleContextMenu(e, app.id)}
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
              <button 
                onClick={() => openApp('phone', 'Nebula Phone')}
                className="hover:text-white transition-colors"
              >
                <Smartphone size={16} />
              </button>
              <button 
                onClick={toggleChat}
                className={`transition-colors ${isChatOpen ? 'text-blue-500' : 'hover:text-white'}`}
              >
                <MessageSquare size={16} />
              </button>
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
