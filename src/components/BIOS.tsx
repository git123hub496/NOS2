import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useOSStore } from '../store';

interface BIOSProps {
  onComplete: () => void;
}

type TabType = 'MAIN' | 'ADVANCED' | 'POWER' | 'SECURITY' | 'BOOT' | 'EXIT';

interface BIOSItem {
  label: string;
  value?: string;
  help: string;
  action?: () => void;
}

const TABS: TabType[] = ['MAIN', 'ADVANCED', 'POWER', 'SECURITY', 'BOOT', 'EXIT'];

const BOOT_SEQUENCE = [
  "NEBULABS BIOS v4.5.2",
  "Copyright (C) 2024-2026 Nebulabs OS.",
  "",
  "CPU: Nebulabs Quantum-X Core @ 4.20GHz",
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

const BIOS: React.FC<BIOSProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [showLogo, setShowLogo] = useState(false);
  const [isBIOSSetup, setIsBIOSSetup] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('MAIN');
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // BIOS Settings State
  const [systemModel, setSystemModel] = useState('NEBULABOOK');
  const [customIdentifier, setCustomIdentifier] = useState('SUPERNOVA');
  const [language, setLanguage] = useState('ENGLISH (US)');
  const [fastBoot, setFastBoot] = useState(true);
  const [secureBoot, setSecureBoot] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const tabContent: Record<TabType, BIOSItem[]> = useMemo(() => ({
    MAIN: [
      { label: 'System Time:', value: `[${currentTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })}]`, help: 'Adjust the system time.' },
      { label: 'System Date:', value: `[${currentTime.toLocaleDateString()}]`, help: 'Adjust the system date.' },
      { label: 'BIOS VERSION:', value: 'NEBULABS-V4.5.2-PRO', help: 'Displays the current BIOS version.' },
      { label: 'FIRMWARE LANGUAGE:', value: `[${language}]`, help: 'Select the default system language.', action: () => setLanguage(prev => prev === 'ENGLISH (US)' ? 'SPANISH (ES)' : 'ENGLISH (US)') },
      { label: 'SYSTEM MODEL:', value: `[${systemModel}]`, help: 'Displays general system information. Select \'System Model\' to toggle hardware type.', action: () => setSystemModel(prev => prev === 'NEBULABOOK' ? 'NEBULASTATION' : 'NEBULABOOK') },
      { label: 'CUSTOM IDENTIFIER:', value: `[${customIdentifier}]`, help: 'Set a custom identifier for this machine.', action: () => setCustomIdentifier(prev => prev === 'SUPERNOVA' ? 'QUASAR' : 'SUPERNOVA') },
      { label: 'Processor Type:', value: 'Nebulabs Quantum-X Core', help: 'Displays the processor type.' },
      { label: 'CPU Speed:', value: '4.20 GHz (Turbo)', help: 'Displays the CPU speed.' },
      { label: 'Total Memory:', value: '65536 MB (DDR5-6400)', help: 'Displays the total system memory.' },
      { label: 'Serial Number:', value: 'NL-QX-9928-ABC-13', help: 'Displays the system serial number.' },
    ],
    ADVANCED: [
      { label: 'CPU Configuration', help: 'Configure CPU features.' },
      { label: 'SATA Configuration', help: 'Configure SATA controllers.' },
      { label: 'USB Configuration', help: 'Configure USB ports.' },
      { label: 'Onboard Devices', help: 'Enable/Disable onboard hardware.' },
    ],
    POWER: [
      { label: 'Power Management', help: 'Configure power saving modes.' },
      { label: 'Wake on LAN', value: '[DISABLED]', help: 'Enable or disable Wake on LAN feature.' },
      { label: 'Auto Power On', value: '[OFF]', help: 'Configure automatic power on schedule.' },
    ],
    SECURITY: [
      { label: 'Set Supervisor Password', help: 'Set or change the supervisor password.' },
      { label: 'Set User Password', help: 'Set or change the user password.' },
      { label: 'Secure Boot:', value: `[${secureBoot ? 'ENABLED' : 'DISABLED'}]`, help: 'Enable or disable Secure Boot.', action: () => setSecureBoot(!secureBoot) },
    ],
    BOOT: [
      { label: 'Fast Boot:', value: `[${fastBoot ? 'ENABLED' : 'DISABLED'}]`, help: 'Enable or disable Fast Boot for quicker startup.', action: () => setFastBoot(!fastBoot) },
      { label: 'Boot Priority Order', help: 'Set the sequence of boot devices.' },
      { label: 'Boot from Network', value: '[OFF]', help: 'Enable or disable network booting.' },
    ],
    EXIT: [
      { label: 'Exit Saving Changes', help: 'Save changes and exit the utility.', action: () => onComplete() },
      { label: 'Exit Discarding Changes', help: 'Exit the utility without saving.', action: () => onComplete() },
      { label: 'Load Setup Defaults', help: 'Restore all settings to factory defaults.' },
      { label: 'FACTORY RESET SYSTEM', help: 'WARNING: This will erase all data and settings. Continue?', action: () => {
        if (confirm("WARNING: This will erase all data and settings. Continue?")) {
          useOSStore.getState().factoryReset();
        }
      }},
    ]
  }), [currentTime, language, systemModel, customIdentifier, secureBoot, fastBoot, onComplete]);

  const currentTabItems = tabContent[activeTab];

  // Boot Sequence Effect
  useEffect(() => {
    if (isBIOSSetup) return;

    let currentLine = 0;
    const interval = setInterval(() => {
      setLines(prev => {
        if (currentLine < BOOT_SEQUENCE.length) {
          const newLines = [...prev, BOOT_SEQUENCE[currentLine]];
          currentLine++;
          return newLines;
        } else {
          clearInterval(interval);
          setTimeout(() => setShowLogo(true), 500);
          setTimeout(onComplete, 3000);
          return prev;
        }
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isBIOSSetup, onComplete]);

  // Keyboard Navigation Effect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isBIOSSetup) {
        if (e.key.toLowerCase() === 'b') {
          setIsBIOSSetup(true);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          setActiveTab(prev => {
            const currentIndex = TABS.indexOf(prev);
            const nextIndex = currentIndex > 0 ? currentIndex - 1 : TABS.length - 1;
            return TABS[nextIndex];
          });
          setSelectedItemIndex(0);
          break;
        case 'ArrowRight':
          setActiveTab(prev => {
            const currentIndex = TABS.indexOf(prev);
            const nextIndex = currentIndex < TABS.length - 1 ? currentIndex + 1 : 0;
            return TABS[nextIndex];
          });
          setSelectedItemIndex(0);
          break;
        case 'ArrowUp':
          setSelectedItemIndex(prev => (prev > 0 ? prev - 1 : currentTabItems.length - 1));
          break;
        case 'ArrowDown':
          setSelectedItemIndex(prev => (prev < currentTabItems.length - 1 ? prev + 1 : 0));
          break;
        case 'Enter':
          const item = currentTabItems[selectedItemIndex];
          if (item?.action) {
            item.action();
          }
          break;
        case 'Escape':
          setIsBIOSSetup(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBIOSSetup, currentTabItems, selectedItemIndex]);

  if (isBIOSSetup) {
    return (
      <div className="fixed inset-0 bg-[#0000AA] text-white font-mono p-4 z-[9999] select-none flex flex-col">
        {/* Header */}
        <div className="border-2 border-gray-400 p-1 mb-4 flex justify-between items-center bg-[#0000AA]">
          <span className="px-2">Nebulabs Setup Utility - Version 4.5.2 (C) 2026 Nebulabs OS.</span>
          <span className="px-2 text-gray-400">FIRMWARE SETUP</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mb-4 px-4">
          {TABS.map((tab) => (
            <div 
              key={tab}
              className={`px-4 py-0.5 ${activeTab === tab ? 'bg-white text-[#0000AA]' : 'text-gray-300'}`}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 border-2 border-gray-400 flex overflow-hidden">
          {/* Left Side: Items */}
          <div className="flex-1 p-6 relative">
            <div className="space-y-2">
              {currentTabItems.map((item, index) => (
                <div 
                  key={item.label}
                  className={`flex justify-between items-center px-2 py-0.5 ${selectedItemIndex === index ? 'bg-white text-[#0000AA]' : ''}`}
                >
                  <span className="uppercase">{item.label}</span>
                  <span className="font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Help */}
          <div className="w-80 border-l-2 border-gray-400 p-6 flex flex-col">
            <h2 className="text-sm font-bold border-b border-gray-400 pb-2 mb-4 uppercase">Item Specific Help</h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              {currentTabItems[selectedItemIndex]?.help}
            </p>

            <div className="mt-auto">
              <div className="bg-[#1a1a1a]/30 p-4 rounded border border-white/10">
                <div className="flex justify-between mb-2">
                  <div className="flex gap-2">
                    <div className="w-6 h-6 border border-white/20 flex items-center justify-center text-[10px]">↑</div>
                    <div className="w-6 h-6 border border-white/20 flex items-center justify-center text-[10px]">↓</div>
                  </div>
                  <div className="text-[10px] bg-white/10 px-2 flex items-center">SELECT</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div className="flex gap-2">
                    <div className="w-6 h-6 border border-white/20 flex items-center justify-center text-[10px]">←</div>
                    <div className="w-6 h-6 border border-white/20 flex items-center justify-center text-[10px]">→</div>
                  </div>
                </div>
                <div className="text-center py-1 border border-red-500/30 text-[10px] text-red-400">
                  ✕ EXIT SETUP
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-between items-end">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black italic tracking-tighter leading-none">NEBULABS</h1>
            <p className="text-[8px] tracking-[0.3em] text-gray-400 mt-1">PROPRIETARY VIRTUAL BIOS ARCHITECTURE</p>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-[10px] text-gray-300">
            <div className="flex justify-between gap-4"><span>↑↓</span> <span>Select Item</span></div>
            <div className="flex justify-between gap-4"><span>Select Menu</span> <span>←→</span></div>
            <div className="flex justify-between gap-4"><span>Enter</span> <span>Edit/Toggle</span></div>
            <div className="flex justify-between gap-4"><span>Exit Setup</span> <span>ESC</span></div>
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
