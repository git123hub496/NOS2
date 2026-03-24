import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
import NebulaBrowser from './apps/NebulaBrowser';
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
  Heart,
  Cloud,
  Newspaper,
  Clock,
  Send,
  User as UserIcon,
  Smartphone as PhoneIcon,
  Wifi,
  Battery,
  Signal,
  MessageSquare,
  LayoutGrid,
  Trash2,
  Mail,
  Map,
  Calendar as CalendarIcon,
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
  Car,
  ChevronRight,
  Power
} from 'lucide-react';

const Desktop: React.FC = () => {
  const { 
    wallpaper, openApp, isLiteMode, user,
    isWidgetsOpen, isChatOpen, toggleWidgets, toggleChat
  } = useOSStore();

  const desktopIcons = [
    { id: 'recycle-bin', name: 'Recycle Bin', icon: <Trash2 size={32} />, color: 'text-gray-500' },
    { id: 'explorer', name: 'File Explorer', icon: <FileText size={32} />, color: 'text-yellow-500' },
    { id: 'browser', name: 'Nebula Browser', icon: <Globe size={32} />, color: 'text-blue-500' },
    { id: 'settings', name: 'Settings', icon: <SettingsIcon size={32} />, color: 'text-gray-400' },
    { id: 'ai', name: 'Nebulabs AI', icon: <Sparkles size={32} />, color: 'text-purple-500' },
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
        <NebulaBrowser />
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
      
      <Window id="phone" title="Nebula Phone (Remote)">
        <div className="h-full bg-black flex items-center justify-center p-4">
          <div className="w-[280px] h-[580px] bg-[#1a1a1a] rounded-[3rem] border-[6px] border-[#333] relative overflow-hidden shadow-2xl flex flex-col">
            {/* Phone Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20" />
            
            {/* Phone Status Bar */}
            <div className="h-10 flex items-end justify-between px-6 pb-1 text-[10px] text-white font-bold z-10">
              <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <div className="flex items-center gap-1.5">
                <Signal size={10} />
                <Wifi size={10} />
                <Battery size={10} />
              </div>
            </div>

            {/* Phone Screen Content */}
            <div className="flex-1 bg-gradient-to-b from-purple-900/40 to-black p-6 flex flex-col">
              <div className="mt-8 mb-6">
                <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">Locating...</p>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-4xl font-bold text-white">39°</h3>
                    <p className="text-xs text-gray-400">Partly Cloudy</p>
                  </div>
                  <Cloud size={48} className="text-blue-400" />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard size={16} className="text-indigo-400" />
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Nebula Pay</span>
                </div>
                <p className="text-xs text-white font-bold">Active Link</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <Heart size={16} className="text-red-500" />
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Vitals</span>
                </div>
                <p className="text-xs text-white font-bold">72 BPM</p>
              </div>

              <div className="flex-1" />

              <div className="grid grid-cols-4 gap-4 mb-4">
                {[
                  { icon: <MessageSquare size={20} />, color: 'bg-green-500', label: 'Messages' },
                  { icon: <CreditCard size={20} />, color: 'bg-blue-600', label: 'Pay' },
                  { icon: <Globe size={20} />, color: 'bg-blue-400', label: 'Photos' },
                  { icon: <SettingsIcon size={20} />, color: 'bg-gray-600', label: 'Settings' },
                ].map((app, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className={`${app.color} w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg`}>
                      {app.icon}
                    </div>
                    <span className="text-[8px] text-gray-400 uppercase font-bold">{app.label}</span>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                {[
                  { icon: <Globe size={20} />, color: 'bg-blue-500', label: 'Browser' },
                  { icon: <SearchIcon size={20} />, color: 'bg-blue-600', label: 'Search' },
                  { icon: <Heart size={20} />, color: 'bg-red-500', label: 'Health' },
                  { icon: <ShoppingBag size={20} />, color: 'bg-orange-500', label: 'Store' },
                ].map((app, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className={`${app.color} w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg`}>
                      {app.icon}
                    </div>
                    <span className="text-[8px] text-gray-400 uppercase font-bold">{app.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Phone Home Bar */}
            <div className="h-6 flex items-center justify-center">
              <div className="w-20 h-1 bg-white/20 rounded-full" />
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

      <Window id="recycle-bin" title="Recycle Bin">
        <div className="h-full bg-[#0a0a0a] p-8 flex flex-col items-center justify-center text-gray-500">
          <Trash2 size={64} className="mb-4 opacity-20" />
          <p className="text-sm">Your recycle bin is empty</p>
        </div>
      </Window>

      <Window id="mail" title="NebulaMail">
        <div className="h-full flex flex-col bg-[#050505]">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">NebulaMail</h2>
            <button className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold">Compose</button>
          </div>
          <div className="flex-1 p-6 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Mail size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-sm">No new messages</p>
            </div>
          </div>
        </div>
      </Window>

      <Window id="maps" title="Nebula Maps">
        <div className="h-full bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
          <Map size={120} className="text-white/5" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Nebula Maps</h3>
            <p className="text-xs text-gray-500 max-w-xs">Satellite imagery and navigation for the Nebula system.</p>
            <div className="mt-8 w-full max-w-sm h-32 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
              <span className="text-[10px] uppercase tracking-widest text-gray-600">Loading Map Data...</span>
            </div>
          </div>
        </div>
      </Window>

      <Window id="calendar" title="Calendar">
        <div className="h-full bg-[#050505] p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">{new Date().toLocaleDateString([], { month: 'long', year: 'numeric' })}</h2>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors">
                <Clock size={16} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={`${d}-${i}`} className="text-center text-[10px] font-bold text-gray-500 uppercase py-2">{d}</div>
            ))}
            {Array.from({ length: 31 }).map((_, i) => (
              <div key={i} className={`aspect-square flex items-center justify-center rounded-xl text-xs ${i + 1 === new Date().getDate() ? 'bg-blue-600 text-white font-bold' : 'text-gray-400 hover:bg-white/5'}`}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </Window>

      <Window id="calculator" title="Calculator">
        <div className="h-full bg-[#0a0a0a] p-6 flex flex-col">
          <div className="flex-1 flex flex-col justify-end p-4 mb-4 bg-white/5 rounded-2xl text-right">
            <p className="text-gray-500 text-xs mb-1">0</p>
            <h3 className="text-4xl font-mono font-bold text-white">0</h3>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['C', '±', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '='].map(btn => (
              <button key={btn} className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all ${['÷', '×', '-', '+', '='].includes(btn) ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-white/5 text-gray-300 hover:bg-white/10'} ${btn === '0' ? 'col-span-2 aspect-auto' : ''}`}>
                {btn}
              </button>
            ))}
          </div>
        </div>
      </Window>

      <Window id="shop" title="Shop Nebulabs">
        <div className="h-full flex flex-col bg-[#050505]">
          <div className="p-8 border-b border-white/5">
            <h2 className="text-3xl font-black text-white mb-2">SHOP</h2>
            <p className="text-xs text-blue-500 uppercase tracking-widest font-bold">Official Nebulabs Hardware</p>
          </div>
          <div className="flex-1 p-8 overflow-auto grid grid-cols-2 gap-6">
            {[
              { name: 'Nebula Phone 15', price: '$999', color: 'from-purple-600 to-blue-600' },
              { name: 'Nebula Pad Pro', price: '$799', color: 'from-blue-600 to-cyan-600' },
              { name: 'Nebula Watch', price: '$399', color: 'from-orange-600 to-red-600' },
              { name: 'Nebula Buds', price: '$199', color: 'from-green-600 to-teal-600' }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all cursor-pointer group">
                <div className={`w-full aspect-square rounded-2xl bg-gradient-to-br ${item.color} mb-4 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform`}>
                  <ShoppingBag size={48} className="text-white/20" />
                </div>
                <h3 className="text-sm font-bold text-white">{item.name}</h3>
                <p className="text-xs text-blue-400 font-mono mt-1">{item.price}</p>
                <button className="mt-4 w-full py-2 bg-white/10 rounded-xl text-[10px] font-bold text-white hover:bg-blue-600 transition-all">PRE-ORDER</button>
              </div>
            ))}
          </div>
        </div>
      </Window>

      <Window id="themes" title="Themes">
        <div className="h-full bg-[#050505] p-8 overflow-auto">
          <h2 className="text-3xl font-black text-white mb-8">THEMES</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Nebula Default', color: 'bg-blue-600', active: true },
              { name: 'Solar Flare', color: 'bg-orange-600', active: false },
              { name: 'Deep Space', color: 'bg-purple-900', active: false },
              { name: 'Emerald City', color: 'bg-green-600', active: false },
              { name: 'Midnight', color: 'bg-gray-900', active: false },
              { name: 'Rose Gold', color: 'bg-pink-400', active: false },
            ].map(theme => (
              <div key={theme.name} className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer group">
                <div className={`w-20 h-20 rounded-full ${theme.color} shadow-2xl group-hover:scale-110 transition-transform`} />
                <span className="text-xs font-bold text-white">{theme.name}</span>
                {theme.active && <span className="text-[10px] text-blue-500 font-bold uppercase">Active</span>}
              </div>
            ))}
          </div>
        </div>
      </Window>

      <Window id="games" title="Nebula Games">
        <div className="h-full bg-[#0a0a0a] p-8 overflow-auto">
          <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-4">
            <Gamepad2 size={32} className="text-indigo-400" />
            GAMES
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {[
              { name: 'Nebula Racer', icon: <Car />, color: 'bg-red-600' },
              { name: 'Space Invaders', icon: <Sparkles />, color: 'bg-green-600' },
              { name: 'Minesweeper', icon: <Bomb />, color: 'bg-gray-600' },
              { name: 'Nebula Quest', icon: <Map />, color: 'bg-blue-600' },
            ].map(game => (
              <div key={game.name} className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer group">
                <div className={`w-16 h-16 rounded-2xl ${game.color} flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform`}>
                  {game.icon}
                </div>
                <span className="text-xs font-bold text-white">{game.name}</span>
                <button className="mt-2 px-6 py-2 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 transition-colors">Play Now</button>
              </div>
            ))}
          </div>
        </div>
      </Window>

      <Window id="minesweeper" title="Minesweeper">
        <div className="h-full bg-[#1a1a1a] flex flex-col items-center justify-center p-8">
          <div className="mb-8 flex items-center gap-8 bg-black/40 p-4 rounded-2xl border border-white/5">
            <div className="text-center">
              <p className="text-[10px] text-gray-500 uppercase font-bold">Mines</p>
              <p className="text-2xl font-mono text-red-500">010</p>
            </div>
            <button className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center text-2xl">😊</button>
            <div className="text-center">
              <p className="text-[10px] text-gray-500 uppercase font-bold">Time</p>
              <p className="text-2xl font-mono text-red-500">000</p>
            </div>
          </div>
          <div className="grid grid-cols-9 gap-1 p-2 bg-gray-800 rounded-lg shadow-2xl border-4 border-gray-700">
            {Array.from({ length: 81 }).map((_, i) => (
              <button key={i} className="w-8 h-8 bg-gray-400 border-2 border-t-gray-200 border-l-gray-200 border-b-gray-600 border-r-gray-600 active:border-none" />
            ))}
          </div>
        </div>
      </Window>

      <Window id="update" title="System Update">
        <div className="h-full bg-[#050505] p-12 flex flex-col items-center justify-center text-center">
          <div className="relative mb-12">
            <RefreshCw size={80} className="text-blue-500 animate-spin-slow" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white">OS</span>
            </div>
          </div>
          <h2 className="text-3xl font-black text-white mb-4">NEBULA OS 2.5</h2>
          <p className="text-gray-500 text-sm max-w-md mb-8">Your system is up to date. Last checked: Today at 14:20</p>
          <button className="px-8 py-3 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20">Check for Updates</button>
        </div>
      </Window>

      <Window id="chat" title="Nebula Chat">
        <div className="h-full flex flex-col bg-[#0a0a0a]">
          <div className="p-6 border-b border-white/5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
              <MessageCircle size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Nebula Chat</h2>
              <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Online</p>
            </div>
          </div>
          <div className="flex-1 p-6 overflow-auto flex flex-col gap-4">
            <div className="max-w-[80%] bg-white/5 p-4 rounded-2xl rounded-tl-none text-sm text-gray-300">
              Welcome to Nebula Chat! How can I help you today?
            </div>
          </div>
          <div className="p-6 border-t border-white/5">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-6 pr-12 text-sm text-white outline-none focus:border-blue-500/50 transition-colors"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:text-blue-400">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </Window>

      <Window id="info" title="System Info">
        <div className="h-full bg-[#050505] p-12 overflow-auto">
          <div className="flex items-center gap-8 mb-12">
            <div className="w-32 h-32 rounded-3xl bg-blue-600 flex items-center justify-center text-white text-6xl font-black shadow-2xl">N</div>
            <div>
              <h2 className="text-4xl font-black text-white mb-2">NEBULA OS</h2>
              <p className="text-blue-500 font-bold uppercase tracking-widest">Version 2.5.0 Professional</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Hardware</h3>
              <div className="space-y-4">
                {[
                  { label: 'Processor', value: 'Nebula Quantum X1 @ 4.2GHz' },
                  { label: 'Memory', value: '64GB LPDDR6X' },
                  { label: 'Storage', value: '2TB NVMe Gen 5 SSD' },
                  { label: 'Graphics', value: 'Nebula Core RT-4000' },
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-[10px] text-gray-600 uppercase font-bold">{item.label}</p>
                    <p className="text-sm text-gray-300">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Software</h3>
              <div className="space-y-4">
                {[
                  { label: 'Kernel', value: 'Nebula-X 6.4.2-stable' },
                  { label: 'Shell', value: 'Nebula-ZSH 5.9' },
                  { label: 'Environment', value: 'Nebula Desktop 2.0' },
                  { label: 'Build', value: '2026.03.24.release' },
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-[10px] text-gray-600 uppercase font-bold">{item.label}</p>
                    <p className="text-sm text-gray-300">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Window>

      <Window id="camera" title="Nebula Camera">
        <div className="h-full bg-black flex flex-col items-center justify-center relative group">
          <Camera size={80} className="text-white/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xs text-gray-600 uppercase tracking-widest font-bold">Camera is starting...</p>
          </div>
          <div className="absolute bottom-8 flex items-center gap-8 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <Tv size={20} />
            </button>
            <button className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 transition-transform shadow-2xl" />
            <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <RefreshCw size={20} />
            </button>
          </div>
        </div>
      </Window>

      <Window id="tv" title="Nebula TV">
        <div className="h-full bg-black flex flex-col">
          <div className="flex-1 flex items-center justify-center relative group">
            <Tv size={120} className="text-white/5" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-12 opacity-0 group-hover:opacity-100 transition-opacity">
              <h2 className="text-4xl font-black text-white mb-2">NEBULA ORIGINALS</h2>
              <p className="text-sm text-gray-400 max-w-xl mb-8">Experience the future of entertainment with high-fidelity streaming and exclusive content only on Nebula TV.</p>
              <button className="w-fit px-12 py-4 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform">Watch Now</button>
            </div>
          </div>
          <div className="h-32 bg-[#050505] p-6 flex items-center gap-6 overflow-x-auto custom-scrollbar">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-48 h-full rounded-xl bg-white/5 border border-white/10 animate-pulse" />
            ))}
          </div>
        </div>
      </Window>

      <Window id="sticky-notes" title="Sticky Notes">
        <div className="h-full bg-yellow-400 p-8 shadow-inner">
          <textarea 
            className="w-full h-full bg-transparent text-yellow-900 font-serif text-xl outline-none resize-none placeholder:text-yellow-800/40"
            placeholder="Write a note..."
            defaultValue="Don't forget to update the Nebula OS kernel tonight!"
          />
        </div>
      </Window>

      <Window id="fonts" title="Fonts">
        <div className="h-full bg-[#0a0a0a] p-12 overflow-auto">
          <h2 className="text-3xl font-black text-white mb-12">FONTS</h2>
          <div className="space-y-12">
            {[
              { name: 'Inter', font: 'font-sans' },
              { name: 'JetBrains Mono', font: 'font-mono' },
              { name: 'Georgia', font: 'font-serif' },
              { name: 'Playfair Display', font: 'font-serif italic' },
            ].map(font => (
              <div key={font.name} className="border-b border-white/5 pb-8">
                <p className="text-[10px] text-gray-600 uppercase font-bold mb-4">{font.name}</p>
                <p className={`text-4xl text-white ${font.font}`}>The quick brown fox jumps over the lazy dog.</p>
              </div>
            ))}
          </div>
        </div>
      </Window>

      <Window id="car" title="Nebula Drive">
        <div className="h-full bg-[#050505] flex flex-col">
          <div className="flex-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-transparent" />
            <div className="h-full flex flex-col items-center justify-center p-12 text-center">
              <Car size={120} className="text-white mb-8 drop-shadow-2xl" />
              <h2 className="text-5xl font-black text-white mb-4">NEBULA DRIVE</h2>
              <p className="text-blue-500 font-bold uppercase tracking-widest mb-12">Model S Connected</p>
              <div className="grid grid-cols-3 gap-12 w-full max-w-2xl">
                <div>
                  <p className="text-[10px] text-gray-600 uppercase font-bold mb-2">Battery</p>
                  <p className="text-3xl font-bold text-white">84%</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-600 uppercase font-bold mb-2">Range</p>
                  <p className="text-3xl font-bold text-white">342 mi</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-600 uppercase font-bold mb-2">Status</p>
                  <p className="text-3xl font-bold text-green-500">Parked</p>
                </div>
              </div>
            </div>
          </div>
          <div className="h-24 bg-white/5 border-t border-white/5 flex items-center justify-around px-12">
            <button className="p-4 rounded-2xl bg-white/5 text-white hover:bg-white/10 transition-colors">
              <Power size={24} />
            </button>
            <button className="p-4 rounded-2xl bg-blue-600 text-white hover:bg-blue-500 transition-colors">
              <RefreshCw size={24} />
            </button>
            <button className="p-4 rounded-2xl bg-white/5 text-white hover:bg-white/10 transition-colors">
              <SettingsIcon size={24} />
            </button>
          </div>
        </div>
      </Window>

      <Taskbar />

      {/* Widgets Panel */}
      <AnimatePresence>
        {isWidgetsOpen && (
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            className="fixed left-4 top-4 bottom-20 w-80 z-[1500] glass-dark rounded-[2rem] border border-white/10 p-6 flex flex-col gap-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Widgets</h2>
              <button onClick={toggleWidgets} className="text-gray-500 hover:text-white transition-colors">
                <LayoutGrid size={20} />
              </button>
            </div>

            <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4 text-blue-400">
                <Clock size={20} />
                <span className="text-[10px] uppercase tracking-widest font-bold">Time</span>
              </div>
              <h3 className="text-4xl font-mono font-bold text-white">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4 text-blue-400">
                <Cloud size={20} />
                <span className="text-[10px] uppercase tracking-widest font-bold">Weather</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-white">39°</h3>
                  <p className="text-xs text-gray-400">Partly Cloudy</p>
                </div>
                <Cloud size={40} className="text-blue-400" />
              </div>
            </div>

            <div className="flex-1 bg-white/5 rounded-3xl p-6 border border-white/10 overflow-hidden flex flex-col">
              <div className="flex items-center gap-3 mb-4 text-orange-400">
                <Newspaper size={20} />
                <span className="text-[10px] uppercase tracking-widest font-bold">Top Stories</span>
              </div>
              <div className="space-y-4 overflow-auto custom-scrollbar pr-2">
                {[
                  "Nebula OS 2.0 released with AI integration",
                  "Quantum computing reaches new milestone",
                  "Global tech summit starts in Neo-Tokyo",
                  "New space station module successfully docked"
                ].map((news, i) => (
                  <div key={i} className="border-b border-white/5 pb-3 last:border-0">
                    <p className="text-xs text-gray-300 leading-relaxed hover:text-blue-400 cursor-pointer transition-colors">
                      {news}
                    </p>
                    <span className="text-[9px] text-gray-600 mt-1 block uppercase">2 hours ago</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            className="fixed left-4 top-4 bottom-20 w-96 z-[1500] glass-dark rounded-[2rem] border border-white/10 flex flex-col shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Nebula Chat</h2>
                  <p className="text-[10px] text-green-500 uppercase font-bold">AI Assistant Online</p>
                </div>
              </div>
              <button onClick={toggleChat} className="text-gray-500 hover:text-white transition-colors">
                <MessageSquare size={20} />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-auto space-y-4 custom-scrollbar">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center">
                  <Sparkles size={14} className="text-white" />
                </div>
                <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Hello! I'm your Nebula AI assistant. How can I help you today?
                  </p>
                </div>
              </div>

              <div className="flex gap-3 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={14} className="text-white" />
                  )}
                </div>
                <div className="bg-blue-600 rounded-2xl rounded-tr-none p-4 max-w-[80%]">
                  <p className="text-xs text-white leading-relaxed">
                    What's the weather like?
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/5 border-t border-white/5">
              <div className="relative">
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-xs text-white outline-none focus:border-blue-500/50 transition-all"
                  placeholder="Ask Nebula AI..."
                />
                <button className="absolute right-2 top-1.5 p-1.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Desktop;
