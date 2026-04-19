import React from 'react';
import { motion } from 'motion/react';
import { X, Minus, Square, Maximize2, Monitor, LayoutGrid } from 'lucide-react';
import { useOSStore, AppId } from '../store';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface WindowProps {
  id: AppId;
  title: string;
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({ id, title, children }) => {
  const { 
    windows, activeWindowId, closeApp, minimizeApp, maximizeApp, focusApp, 
    currentDisplayId, displays, moveWindowToDisplay, snapApp
  } = useOSStore();
  const windowState = windows.find(w => w.id === id);
  const [showSnapLayouts, setShowSnapLayouts] = React.useState(false);
  const snapTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  if (!windowState || !windowState.isOpen || windowState.isMinimized || windowState.displayId !== currentDisplayId) return null;

  const isActive = activeWindowId === id;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const isMaximized = windowState.isMaximized || isMobile;
  const isSnapped = windowState.snapState && windowState.snapState !== 'none';

  const handleSnapHover = () => {
    if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
    setShowSnapLayouts(true);
  };

  const handleSnapLeave = () => {
    snapTimeoutRef.current = setTimeout(() => {
      setShowSnapLayouts(false);
    }, 300);
  };

  const otherDisplays = displays.filter(d => d.id !== currentDisplayId);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
        width: isMaximized ? '100%' : (isSnapped ? '50%' : '800px'),
        height: isMaximized || isSnapped ? 'calc(100% - 48px)' : '500px',
        top: isMaximized || isSnapped ? 0 : '15%',
        left: isMaximized ? 0 : (windowState.snapState === 'left' ? 0 : (windowState.snapState === 'right' ? '50%' : '20%')),
      }}
      drag={!isMaximized && !isSnapped}
      dragMomentum={false}
      onMouseDown={() => focusApp(id)}
      style={{ 
        zIndex: windowState.zIndex,
        boxShadow: isActive ? '0 0 0 1px var(--os-accent)' : undefined
      }}
      className={cn(
        "fixed overflow-hidden flex flex-col window-shadow",
        "glass-dark rounded-xl border border-white/10",
        isActive ? "ring-1" : "",
        isMobile && "rounded-none border-none"
      )}
    >
      {/* Title Bar */}
      <div 
        className={cn(
          "h-10 flex items-center justify-between px-4 select-none cursor-default",
          isActive ? "bg-white/5" : "bg-transparent",
          isMobile && "h-12"
        )}
        onDoubleClick={() => !isMobile && maximizeApp(id)}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-300">{title}</span>
        </div>
        
        <div className="flex items-center gap-1">
          {otherDisplays.length > 0 && (
            <div className="flex items-center gap-1 mr-2 border-r border-white/10 pr-2">
              {otherDisplays.map((display, i) => (
                <button
                  key={display.id}
                  onClick={(e) => { e.stopPropagation(); moveWindowToDisplay(id, display.id); }}
                  className="p-1.5 hover:bg-white/10 rounded-md transition-colors group flex items-center gap-1"
                  title={`Move to Display ${i + 2}`}
                >
                  <Monitor size={12} className="text-gray-400 group-hover:text-white" />
                  <span className="text-[10px] text-gray-500 group-hover:text-white">{i + 2}</span>
                </button>
              ))}
            </div>
          )}
          {!isMobile && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); minimizeApp(id); }}
                className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
              >
                <Minus size={14} className="text-gray-400" />
              </button>
              <div 
                className="relative"
                onMouseEnter={handleSnapHover}
                onMouseLeave={handleSnapLeave}
              >
                <button 
                  onClick={(e) => { e.stopPropagation(); maximizeApp(id); }}
                  className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                >
                  {windowState.isMaximized ? <Square size={12} className="text-gray-400" /> : <Maximize2 size={12} className="text-gray-400" />}
                </button>

                {showSnapLayouts && (
                  <div className="absolute top-full right-0 mt-1 p-2 bg-[#0a0c10]/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl z-50 flex gap-2 w-32">
                    <button 
                      onClick={(e) => { e.stopPropagation(); snapApp(id, 'left'); setShowSnapLayouts(false); }}
                      className="flex-1 aspect-square rounded border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all group flex flex-col"
                      title="Snap Left"
                    >
                      <div className="flex-1 flex w-full">
                        <div className="w-1/2 h-full bg-blue-500/30 rounded-sm m-0.5 border border-blue-500/50" />
                        <div className="w-1/2 h-full bg-white/5 rounded-sm m-0.5 border border-white/5" />
                      </div>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); snapApp(id, 'right'); setShowSnapLayouts(false); }}
                      className="flex-1 aspect-square rounded border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all group flex flex-col"
                      title="Snap Right"
                    >
                      <div className="flex-1 flex w-full">
                        <div className="w-1/2 h-full bg-white/5 rounded-sm m-0.5 border border-white/5" />
                        <div className="w-1/2 h-full bg-blue-500/30 rounded-sm m-0.5 border border-blue-500/50" />
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); closeApp(id); }}
            className="p-1.5 hover:bg-red-500/80 rounded-md transition-colors group"
          >
            <X size={14} className="text-gray-400 group-hover:text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-black/20">
        {children}
      </div>
    </motion.div>
  );
};

export default Window;
