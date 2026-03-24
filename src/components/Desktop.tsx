import React from 'react';
import { motion } from 'motion/react';
import { useOSStore } from '../store';
import Taskbar from './Taskbar';
import Window from './Window';
import Settings from './apps/Settings';
import Terminal from './apps/Terminal';
import AI from './apps/AI';
import Explorer from './apps/Explorer';
import NebulaDocs from './apps/NebulaDocs';
import NebulaSlides from './apps/NebulaSlides';
import ProcessManager from './apps/ProcessManager';
import { 
  FileText, 
  Globe, 
  Terminal as TerminalIcon, 
  Sparkles, 
  Settings as SettingsIcon, 
  Presentation, 
  Activity,
  Search as SearchIcon,
  ShoppingBag,
  CreditCard,
  Heart
} from 'lucide-react';

const Desktop: React.FC = () => {
  const { wallpaper, openApp, isLiteMode, user } = useOSStore();

  const desktopIcons = [
    { id: 'search', name: 'Nebula Search', icon: <SearchIcon size={32} />, color: 'text-blue-400' },
    { id: 'browser', name: 'Nebula Browser', icon: <Globe size={32} />, color: 'text-blue-500' },
    { id: 'explorer', name: 'File Explorer', icon: <FileText size={32} />, color: 'text-yellow-500' },
    { id: 'store', name: 'App Store', icon: <ShoppingBag size={32} />, color: 'text-pink-500' },
    { id: 'ai', name: 'Nebulabs AI', icon: <Sparkles size={32} />, color: 'text-purple-500' },
    { id: 'pay', name: 'Nebula Pay', icon: <CreditCard size={32} />, color: 'text-indigo-400' },
    { id: 'health', name: 'Health', icon: <Heart size={32} />, color: 'text-red-400' },
    { id: 'terminal', name: 'Terminal', icon: <TerminalIcon size={32} />, color: 'text-green-500' },
    { id: 'settings', name: 'Settings', icon: <SettingsIcon size={32} />, color: 'text-gray-400' },
  ];

  return (
    <div 
      className={`fixed inset-0 overflow-hidden bg-cover bg-center transition-all duration-1000 ${isLiteMode ? 'lite-mode' : ''}`}
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      {/* Desktop Icons */}
      <div className="p-4 grid grid-flow-col grid-rows-[repeat(auto-fill,100px)] gap-2 w-fit">
        {desktopIcons.map((icon) => (
          <button
            key={icon.id}
            onDoubleClick={() => openApp(icon.id as any, icon.name)}
            className="w-24 h-24 flex flex-col items-center justify-center gap-2 rounded-lg hover:bg-white/10 transition-colors group"
          >
            <div className={`${icon.color} group-hover:scale-110 transition-transform drop-shadow-lg`}>
              {icon.icon}
            </div>
            <span className="text-[11px] text-white font-medium text-center drop-shadow-md px-1">
              {icon.name}
            </span>
          </button>
        ))}
      </div>

      {/* Windows */}
      <Window id="settings" title="System Settings">
        <Settings />
      </Window>
      <Window id="terminal" title="Nebulabs Terminal">
        <Terminal />
      </Window>
      <Window id="ai" title="Nebulabs AI Assistant">
        <AI />
      </Window>
      <Window id="explorer" title="File Explorer">
        <Explorer />
      </Window>
      <Window id="docs" title="NebulaDocs">
        <NebulaDocs />
      </Window>
      <Window id="slides" title="NebulaSlides">
        <NebulaSlides />
      </Window>
      <Window id="process-manager" title="Process Manager">
        <ProcessManager />
      </Window>
      <Window id="browser" title="Nebula Browser">
        <div className="h-full flex flex-col bg-white">
          <div className="h-10 bg-gray-100 border-b flex items-center px-4 gap-2">
            <div className="flex-1 bg-white rounded border px-3 py-1 text-xs text-gray-600">
              https://www.nebulabs.io
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <Globe size={64} className="opacity-10" />
          </div>
        </div>
      </Window>
      <Window id="search" title="Nebula Search">
        <div className="h-full flex flex-col bg-[#0a0a0a] p-8 items-center justify-center">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-display font-black text-white mb-2">NEBULA</h2>
            <p className="text-xs text-blue-500 uppercase tracking-widest font-bold">Search the Void</p>
          </div>
          <div className="w-full max-w-lg relative group">
            <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white outline-none focus:border-blue-500/50 transition-all shadow-2xl"
              placeholder="Search anything..."
              autoFocus
            />
          </div>
          <div className="mt-8 flex gap-4">
            <button className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:bg-white/10 transition-colors">Trending</button>
            <button className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:bg-white/10 transition-colors">History</button>
            <button className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:bg-white/10 transition-colors">Safe Search</button>
          </div>
        </div>
      </Window>
      <Window id="store" title="Nebula App Store">
        <div className="h-full flex flex-col bg-[#050505]">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">App Store</h2>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold">Featured</button>
              <button className="px-4 py-1.5 rounded-full bg-white/5 text-gray-400 text-xs font-bold">Games</button>
              <button className="px-4 py-1.5 rounded-full bg-white/5 text-gray-400 text-xs font-bold">Apps</button>
            </div>
          </div>
          <div className="flex-1 p-6 overflow-auto grid grid-cols-2 gap-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 hover:bg-white/10 transition-all cursor-pointer group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Sparkles size={32} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white">Nebula App {i}</h3>
                  <p className="text-[10px] text-gray-500 mt-1">Productivity • 4.8 ★</p>
                  <button className="mt-2 px-4 py-1 bg-white/10 rounded-full text-[10px] font-bold text-blue-400 hover:bg-blue-500 hover:text-white transition-all">GET</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Window>
      <Window id="pay" title="Nebula Pay">
        <div className="h-full flex flex-col bg-[#0a0a0a] p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1">Nebula Pay</h2>
            <p className="text-xs text-gray-500">Manage your digital assets</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 shadow-2xl mb-8 relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/10 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <CreditCard size={32} className="text-white/80" />
                <span className="text-xs font-mono text-white/60 tracking-widest">NEBULA PLATINUM</span>
              </div>
              <div className="mb-8">
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Balance</p>
                <h3 className="text-3xl font-mono font-bold text-white">$12,450.00</h3>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Card Holder</p>
                  <p className="text-sm font-bold text-white uppercase">{user?.displayName || 'Nebula User'}</p>
                </div>
                <p className="text-sm font-mono text-white/80">**** 4589</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Recent Transactions</h3>
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <ShoppingBag size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Nebula Store Purchase</p>
                    <p className="text-[10px] text-gray-500">Mar 24, 2026</p>
                  </div>
                </div>
                <span className="text-sm font-mono font-bold text-red-400">-$24.99</span>
              </div>
            ))}
          </div>
        </div>
      </Window>
      <Window id="health" title="Health & Vitals">
        <div className="h-full flex flex-col bg-[#050505] p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Health</h2>
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <Heart size={20} className="text-red-500 animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Heart Rate</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-white">72</h3>
                <span className="text-xs text-red-500 font-bold">BPM</span>
              </div>
              <div className="mt-4 h-12 flex items-end gap-1">
                {[4,6,3,8,5,7,4,6,5,8].map((h, i) => (
                  <div key={i} className="flex-1 bg-red-500/20 rounded-t-sm" style={{ height: `${h * 10}%` }} />
                ))}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Sleep</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-white">7.5</h3>
                <span className="text-xs text-blue-400 font-bold">HRS</span>
              </div>
              <div className="mt-4 h-12 flex items-end gap-1">
                {[3,5,7,8,6,4,5,7,8,6].map((h, i) => (
                  <div key={i} className="flex-1 bg-blue-500/20 rounded-t-sm" style={{ height: `${h * 10}%` }} />
                ))}
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-600/20 to-orange-600/20 border border-red-500/20 rounded-3xl p-6">
            <h3 className="text-sm font-bold text-white mb-4">Daily Activity</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-bold">
                  <span className="text-gray-400">Move</span>
                  <span className="text-red-500">450 / 600 KCAL</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 w-[75%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-bold">
                  <span className="text-gray-400">Exercise</span>
                  <span className="text-green-500">22 / 30 MIN</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[73%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Window>
      <Window id="notepad" title="Untitled - Notepad">
        <textarea 
          className="w-full h-full bg-white text-black p-4 outline-none resize-none font-sans"
          placeholder="Start typing..."
        />
      </Window>

      <Taskbar />
    </div>
  );
};

export default Desktop;
