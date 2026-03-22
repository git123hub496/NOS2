import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useOSStore } from '../store';

interface BIOSProps {
  onComplete: () => void;
}

const BIOS: React.FC<BIOSProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [showLogo, setShowLogo] = useState(false);
  const [isBIOSSetup, setIsBIOSSetup] = useState(false);

  const bootSequence = [
    "NEBULABS BIOS v2.0.4",
    "Copyright (C) 2024-2026 Nebulabs Corp.",
    "",
    "CPU: Quantum Core x86 @ 4.20GHz",
    "Memory Test: 65536MB OK",
    "Detecting Primary Master... [OK]",
    "Detecting Secondary Master... [OK]",
    "Checking File System... [CLEAN]",
    "Loading Kernel... [DONE]",
    "Initializing Nebulabs OS 2 Core...",
    "Starting Services...",
    "Network Interface: eth0 [UP]",
    "Ready."
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'b') {
        setIsBIOSSetup(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < bootSequence.length && !isBIOSSetup) {
        setLines(prev => [...prev, bootSequence[currentLine]]);
        currentLine++;
      } else if (!isBIOSSetup) {
        clearInterval(interval);
        setTimeout(() => setShowLogo(true), 500);
        setTimeout(onComplete, 3000);
      }
    }, 150);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isBIOSSetup, onComplete]);

  if (isBIOSSetup) {
    return (
      <div className="fixed inset-0 bg-blue-900 text-white font-mono p-8 z-[9999] select-none">
        <div className="border-4 border-white h-full p-6">
          <h1 className="text-2xl font-bold mb-8 text-center bg-white text-blue-900 py-2">NEBULABS BIOS SETUP UTILITY</h1>
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-4">
              <h2 className="text-xl border-b border-white pb-2">System Information</h2>
              <p>BIOS Version: 2.0.4</p>
              <p>Build Date: 03/22/2026</p>
              <p>Processor: Quantum Core x86</p>
              <p>Total Memory: 65536 MB</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl border-b border-white pb-2">Boot Options</h2>
              <p>[*] Fast Boot</p>
              <p>[ ] Secure Boot</p>
              <p>[*] Legacy Support</p>
              <p>Boot Order: SSD, USB, Network</p>
              <div className="pt-4">
                <button 
                  onClick={() => {
                    if (confirm("WARNING: This will erase all data and settings. Continue?")) {
                      useOSStore.getState().factoryReset();
                    }
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-between group text-red-500 border border-red-500/50"
                >
                  <span>FACTORY RESET SYSTEM</span>
                </button>
              </div>
            </div>
          </div>
          <div className="absolute bottom-12 left-12 right-12 border-t border-white pt-4 flex justify-between text-sm">
            <span>F10: Save & Exit</span>
            <span>ESC: Exit Without Saving</span>
            <span>ENTER: Select</span>
          </div>
          <button 
            onClick={() => onComplete()}
            className="mt-12 px-6 py-2 bg-white text-blue-900 font-bold hover:bg-gray-200 transition-colors"
          >
            EXIT TO OS
          </button>
          <div className="mt-4 text-xs text-blue-300 animate-pulse">
            Press 'B' during power-on to enter this utility.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black text-green-500 font-mono p-8 flex flex-col z-[9999]">
      <div className="absolute top-8 right-8 text-[10px] text-green-800 text-right">
        <p>PRESS [B] FOR SETUP</p>
        <p>PRESS [F12] FOR BOOT MENU</p>
      </div>
      <div className="flex-1 overflow-hidden">
        {lines.map((line, i) => (
          <div key={i} className="mb-1">{line}</div>
        ))}
      </div>
      
      <AnimatePresence>
        {showLogo && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black"
          >
            <div className="text-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
              />
              <h1 className="text-4xl font-display font-bold tracking-tighter text-white">
                NEBULABS <span className="text-blue-500">OS 2</span>
              </h1>
              <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest">Initializing Environment</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BIOS;
