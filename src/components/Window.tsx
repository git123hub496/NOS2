import React from 'react';
import { motion } from 'motion/react';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
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
  const { windows, activeWindowId, closeApp, minimizeApp, maximizeApp, focusApp, isLiteMode } = useOSStore();
  const windowState = windows.find(w => w.id === id);

  if (!windowState || !windowState.isOpen || windowState.isMinimized) return null;

  const isActive = activeWindowId === id;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
        width: windowState.isMaximized ? '100%' : '800px',
        height: windowState.isMaximized ? 'calc(100% - 48px)' : '500px',
        top: windowState.isMaximized ? 0 : '15%',
        left: windowState.isMaximized ? 0 : '20%',
      }}
      drag={!windowState.isMaximized}
      dragMomentum={false}
      onMouseDown={() => focusApp(id)}
      style={{ 
        zIndex: windowState.zIndex,
        boxShadow: isActive ? '0 0 0 1px var(--os-accent)' : undefined
      }}
      className={cn(
        "fixed overflow-hidden flex flex-col window-shadow",
        isLiteMode ? "bg-[#1a1a1a] border border-[#333]" : "glass-dark rounded-xl border border-white/10",
        isActive ? "ring-1" : ""
      )}
    >
      {/* Title Bar */}
      <div 
        className={cn(
          "h-10 flex items-center justify-between px-4 select-none cursor-default",
          isActive ? "bg-white/5" : "bg-transparent"
        )}
        onDoubleClick={() => maximizeApp(id)}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-300">{title}</span>
        </div>
        
        <div className="flex items-center gap-1">
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
