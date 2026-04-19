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
    currentDisplayId, displays, moveWindowToDisplay, updateAppPosition, resizeApp
  } = useOSStore();
  const windowState = windows.find(w => w.id === id);

  if (!windowState || !windowState.isOpen || windowState.isMinimized || windowState.displayId !== currentDisplayId) return null;

  const isActive = activeWindowId === id;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const isMaximized = windowState.isMaximized || isMobile;

  const otherDisplays = displays.filter(d => d.id !== currentDisplayId);

  const handleResize = (direction: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = windowState.width;
    const startHeight = windowState.height;
    const startLeft = windowState.x;
    const startTop = windowState.y;

    const onMouseMove = (moveEvent: MouseEvent) => {
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startLeft;
      let newY = startTop;

      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      if (direction.includes('right')) {
        newWidth = Math.max(300, startWidth + deltaX);
      }
      if (direction.includes('left')) {
        newWidth = Math.max(300, startWidth - deltaX);
        if (newWidth > 300) newX = startLeft + deltaX;
      }
      if (direction.includes('bottom')) {
        newHeight = Math.max(200, startHeight + deltaY);
      }
      if (direction.includes('top')) {
        newHeight = Math.max(200, startHeight - deltaY);
        if (newHeight > 200) newY = startTop + deltaY;
      }

      resizeApp(id, newWidth, newHeight, newX, newY);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
        width: isMaximized ? '100vw' : windowState.width,
        height: isMaximized ? 'calc(100vh - 48px)' : windowState.height,
        top: isMaximized ? 0 : windowState.y,
        left: isMaximized ? 0 : windowState.x,
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 200, opacity: { duration: 0.1 } }}
      drag={!isMaximized}
      dragMomentum={false}
      dragListener={false} // Only drag via title bar
      dragControls={undefined} // We'll handle this via a ref or custom logic if needed, but for now simple drag on div is fine if we use dragListener: true and ignore certain areas
      onDragEnd={(_, info) => {
        if (!isMaximized) {
          updateAppPosition(id, windowState.x + info.delta.x, windowState.y + info.delta.y);
        }
      }}
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
      {/* Resize Handles */}
      {!isMaximized && (
        <>
          {/* Edges */}
          <div className="absolute top-0 left-0 right-0 h-1 cursor-ns-resize z-50" onMouseDown={(e) => handleResize('top', e)} />
          <div className="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize z-50" onMouseDown={(e) => handleResize('bottom', e)} />
          <div className="absolute top-0 left-0 bottom-0 w-1 cursor-ew-resize z-50" onMouseDown={(e) => handleResize('left', e)} />
          <div className="absolute top-0 right-0 bottom-0 w-1 cursor-ew-resize z-50" onMouseDown={(e) => handleResize('right', e)} />
          
          {/* Corners */}
          <div className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize z-[51]" onMouseDown={(e) => handleResize('topleft', e)} />
          <div className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize z-[51]" onMouseDown={(e) => handleResize('topright', e)} />
          <div className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize z-[51]" onMouseDown={(e) => handleResize('bottomleft', e)} />
          <div className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize z-[51]" onMouseDown={(e) => handleResize('bottomright', e)} />
        </>
      )}

      {/* Title Bar */}
      <motion.div 
        drag={!isMaximized}
        dragMomentum={false}
        onDrag={(_, info) => {
          updateAppPosition(id, windowState.x + info.delta.x, windowState.y + info.delta.y);
        }}
        className={cn(
          "h-10 flex items-center justify-between px-4 select-none cursor-default active:cursor-grabbing",
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
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-black/20">
        {children}
      </div>
    </motion.div>
  );
};

export default Window;
