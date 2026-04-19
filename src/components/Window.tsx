import React from 'react';
import { motion } from 'motion/react';
import { X, Minus, Square, Maximize2, Monitor } from 'lucide-react';
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
    currentDisplayId, displays, moveWindowToDisplay 
  } = useOSStore();
  const windowState = windows.find(w => w.id === id);

  if (!windowState || !windowState.isOpen || windowState.isMinimized || windowState.displayId !== currentDisplayId) return null;

  const isActive = activeWindowId === id;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const isMaximized = windowState.isMaximized || isMobile;

  const otherDisplays = displays.filter(d => d.id !== currentDisplayId);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
        width: isMaximized ? '100%' : '800px',
        height: isMaximized ? 'calc(100% - 48px)' : '500px',
        top: isMaximized ? 0 : '15%',
        left: isMaximized ? 0 : '20%',
      }}
      drag={!isMaximized}
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
              <button 
                onClick={(e) => { e.stopPropagation(); maximizeApp(id); }}
                className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
              >
                {windowState.isMaximized ? <Square size={12} className="text-gray-400" /> : <Maximize2 size={12} className="text-gray-400" />}
              </button>
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
