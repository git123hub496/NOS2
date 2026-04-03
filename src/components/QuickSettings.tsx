import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wifi, 
  Volume2, 
  Battery, 
  Moon, 
  Sun, 
  Zap, 
  RotateCcw,
  Eye,
  EyeOff,
  Monitor,
  Trash2,
  ChevronRight
} from 'lucide-react';
import { useOSStore } from '../store';

const QuickSettings: React.FC = () => {
  const { 
    isQuickSettingsOpen, toggleQuickSettings, 
    isGrayscale, toggleGrayscale, 
    isInverted, toggleInvert,
    isLiteMode, setLiteMode,
    restart,
    processes,
    totalMemory,
    volume, setVolume,
    selectedNetwork, setNetwork, networks,
    isDarkMode, setDarkMode
  } = useOSStore();

  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const toggles = [
    { id: 'grayscale', label: 'Grayscale', icon: <Eye size={20} />, active: isGrayscale, action: toggleGrayscale },
    { id: 'invert', label: 'Invert', icon: <Monitor size={20} />, active: isInverted, action: toggleInvert },
    { id: 'lite', label: 'Lite Mode', icon: <Zap size={20} />, active: isLiteMode, action: () => setLiteMode(!isLiteMode) },
    { id: 'dark', label: 'Light Mode', icon: <Sun size={20} />, active: !isDarkMode, action: () => setDarkMode(!isDarkMode) },
    { id: 'display', label: 'Add Display', icon: <Monitor size={20} />, active: false, action: () => window.open(window.location.href, '_blank') },
  ];

  React.useEffect(() => {
    if (!isQuickSettingsOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setFocusedIndex(prev => (prev === null ? 0 : (prev + 1) % toggles.length));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setFocusedIndex(prev => (prev === null ? toggles.length - 1 : (prev - 1 + toggles.length) % toggles.length));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex(prev => (prev === null ? 0 : (prev + 2) % toggles.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex(prev => (prev === null ? toggles.length - 1 : (prev - 2 + toggles.length) % toggles.length));
      } else if (e.key === 'Enter' && focusedIndex !== null) {
        e.preventDefault();
        toggles[focusedIndex].action();
      } else if (e.key === 'Escape') {
        toggleQuickSettings();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isQuickSettingsOpen, focusedIndex, toggles, toggleQuickSettings]);

  if (!isQuickSettingsOpen) return null;

  const usedMemory = processes.reduce((acc, p) => acc + p.memoryUsage, 0);
  const memoryPercent = Math.round((usedMemory / totalMemory) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-14 right-2 w-80 z-[2000] glass-dark rounded-2xl border border-white/10 p-4 window-shadow"
    >
      <div className="grid grid-cols-2 gap-2 mb-6">
        {toggles.map((toggle, index) => (
          <button 
            key={toggle.id}
            onClick={toggle.action}
            onMouseEnter={() => setFocusedIndex(index)}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-colors ${toggle.active ? 'text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'} ${focusedIndex === index ? 'ring-2 ring-white/20' : ''}`}
            style={{ backgroundColor: toggle.active ? 'var(--os-accent)' : undefined }}
          >
            {toggle.icon}
            <span className="text-[10px] font-medium">{toggle.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {/* Network Selection */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            <span>Network</span>
            <button 
              onClick={() => setIsNetworkOpen(!isNetworkOpen)}
              className="hover:underline"
              style={{ color: 'var(--os-accent)' }}
            >
              {isNetworkOpen ? 'Close' : 'Change'}
            </button>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wifi size={16} style={{ color: 'var(--os-accent)' }} />
              <span className="text-xs font-medium">{selectedNetwork}</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          </div>
          <AnimatePresence>
            {isNetworkOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-1 mt-2"
              >
                {networks.map(net => (
                  <button
                    key={net.id}
                    onClick={() => {
                      setNetwork(net.id);
                      setIsNetworkOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${selectedNetwork === net.name ? 'text-white' : 'hover:bg-white/5 text-gray-400'}`}
                    style={{ backgroundColor: selectedNetwork === net.name ? 'var(--os-accent)' : undefined }}
                  >
                    <div className="flex items-center gap-2">
                      <Wifi size={12} />
                      <span>{net.name}</span>
                    </div>
                    <span className="text-[10px] opacity-50">{net.signal}/4</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Volume Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            <span>Volume</span>
            <span>{volume}%</span>
          </div>
          <div className="flex items-center gap-3">
            <Volume2 size={16} className="text-blue-500" />
            <input 
              type="range" 
              min="0" max="100" 
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            <span>Memory Usage</span>
            <span>{usedMemory}MB / {totalMemory}MB</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${memoryPercent}%` }}
              className="h-full bg-blue-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-3 text-gray-400">
            <Battery size={16} />
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                if (confirm("Are you sure you want to restart?")) {
                  restart();
                }
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-[10px] font-bold uppercase tracking-wider"
              style={{ backgroundColor: 'var(--os-accent-glow)', color: 'var(--os-accent)' }}
            >
              <RotateCcw size={14} />
              Restart
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuickSettings;
