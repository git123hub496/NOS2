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
  Activity
} from 'lucide-react';
import { useOSStore, AppId } from '../store';
import StartMenu from './StartMenu';

import QuickSettings from './QuickSettings';

const Taskbar: React.FC = () => {
  const { 
    windows, openApp, focusApp, activeWindowId, isLiteMode, 
    toggleQuickSettings, isQuickSettingsOpen,
    taskbarPosition, setTaskbarPosition, pinnedAppIds, togglePinApp
  } = useOSStore();
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const allApps: { id: AppId; name: string; icon: React.ReactNode; color: string }[] = [
    { id: 'explorer', name: 'File Explorer', icon: <FileText size={20} />, color: 'text-yellow-500' },
    { id: 'browser', name: 'Web Browser', icon: <Globe size={20} />, color: 'text-blue-400' },
    { id: 'terminal', name: 'Terminal', icon: <TerminalIcon size={20} />, color: 'text-green-500' },
    { id: 'ai', name: 'Nebulabs AI', icon: <Sparkles size={20} />, color: 'text-purple-500' },
    { id: 'docs', name: 'NebulaDocs', icon: <FileText size={20} />, color: 'text-blue-600' },
    { id: 'slides', name: 'NebulaSlides', icon: <Presentation size={20} />, color: 'text-orange-500' },
    { id: 'process-manager', name: 'Process Manager', icon: <Activity size={20} />, color: 'text-red-500' },
    { id: 'settings', name: 'Settings', icon: <SettingsIcon size={20} />, color: 'text-blue-500' },
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
        <div className={`flex items-center gap-1 ${isVertical ? 'flex-col' : 'flex-row'}`}>
          <button 
            onClick={() => setIsStartOpen(!isStartOpen)}
            className={`p-2 rounded-lg transition-all flex items-center justify-center ${isStartOpen ? 'bg-blue-600 text-white' : 'hover:bg-white/10 text-blue-500'}`}
          >
            <span className="text-xl font-display font-black leading-none select-none">N</span>
          </button>
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
        </div>
      </div>
    </>
  );
};

export default Taskbar;
