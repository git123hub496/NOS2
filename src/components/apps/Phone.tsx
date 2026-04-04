import React, { useState, useEffect } from 'react';
import { 
  Signal, 
  Wifi, 
  Battery, 
  MessageSquare, 
  CreditCard, 
  Globe, 
  Settings as SettingsIcon, 
  Search as SearchIcon, 
  Heart, 
  ShoppingBag, 
  Cloud,
  ChevronLeft,
  Camera,
  Phone as PhoneIcon,
  Play,
  Music,
  MapPin,
  Bell,
  Moon,
  Bluetooth,
  Zap,
  RotateCw,
  MicOff,
  Volume2,
  Video,
  User as UserIcon,
  LayoutGrid,
  Plus,
  Tv,
  Map,
  Car,
  Star
} from 'lucide-react';
import { useOSStore } from '../../store';
import { motion, AnimatePresence } from 'motion/react';

type PhoneAppId = 'messages' | 'pay' | 'photos' | 'settings' | 'browser' | 'search' | 'health' | 'store' | 'camera' | 'phone-call' | 'tv' | 'maps';

const Phone: React.FC = () => {
  const { user, accentColor, volume } = useOSStore();
  const [activeApp, setActiveApp] = useState<PhoneAppId | null>(null);
  const [time, setTime] = useState(new Date());
  const [battery, setBattery] = useState(85);
  const [isWifiOn, setIsWifiOn] = useState(true);
  const [isBluetoothOn, setIsBluetoothOn] = useState(true);
  const [isDoNotDisturb, setIsDoNotDisturb] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Nebula Pay', body: 'Payment of $24.99 confirmed.', time: '2m ago' },
    { id: 2, title: 'Messages', body: 'Alex: Are we still on for tonight?', time: '15m ago' }
  ]);
  const [isLocked, setIsLocked] = useState(true);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const renderApp = () => {
    switch (activeApp) {
      case 'messages':
        return (
          <div className="flex flex-col h-full bg-black">
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <button onClick={() => setActiveApp(null)} className="p-1 hover:bg-white/10 rounded-full">
                <ChevronLeft size={20} className="text-white" />
              </button>
              <h3 className="text-sm font-bold text-white">Messages</h3>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-4">
              <div className="flex flex-col items-start">
                <div className="bg-white/10 rounded-2xl p-3 max-w-[80%]">
                  <p className="text-xs text-white">Hey! Did you see the new Nebula OS update?</p>
                </div>
                <span className="text-[8px] text-gray-500 mt-1 ml-1">10:42 AM</span>
              </div>
              <div className="flex flex-col items-end">
                <div className="bg-blue-600 rounded-2xl p-3 max-w-[80%]">
                  <p className="text-xs text-white">Yeah, the keyboard navigation is awesome!</p>
                </div>
                <span className="text-[8px] text-gray-500 mt-1 mr-1">10:45 AM</span>
              </div>
            </div>
            <div className="p-4 border-t border-white/10 flex gap-2">
              <input 
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs text-white outline-none focus:border-blue-500"
                placeholder="Message"
              />
              <button className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <ChevronLeft size={16} className="rotate-180" />
              </button>
            </div>
          </div>
        );
      case 'pay':
        return (
          <div className="flex flex-col h-full bg-black p-6">
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setActiveApp(null)} className="p-1 hover:bg-white/10 rounded-full">
                <ChevronLeft size={20} className="text-white" />
              </button>
              <h3 className="text-sm font-bold text-white">Nebula Pay</h3>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-4 shadow-xl mb-6">
              <div className="flex justify-between items-start mb-8">
                <CreditCard size={24} className="text-white/80" />
                <span className="text-[8px] font-mono text-white/60">NEBULA PLATINUM</span>
              </div>
              <p className="text-[8px] text-white/40 uppercase tracking-widest mb-1">Balance</p>
              <h3 className="text-xl font-mono font-bold text-white">$12,450.00</h3>
            </div>
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Recent</h4>
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                      <ShoppingBag size={14} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white">Store Purchase</p>
                      <p className="text-[8px] text-gray-500">Today</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-red-400">-$24.99</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="flex flex-col h-full bg-[#0a0a0a] p-6">
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setActiveApp(null)} className="p-1 hover:bg-white/10 rounded-full">
                <ChevronLeft size={20} className="text-white" />
              </button>
              <h3 className="text-sm font-bold text-white">Settings</h3>
            </div>
            <div className="space-y-2">
              <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                    <Wifi size={18} />
                  </div>
                  <span className="text-xs text-white">Wi-Fi</span>
                </div>
                <button 
                  onClick={() => setIsWifiOn(!isWifiOn)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${isWifiOn ? 'bg-blue-600' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isWifiOn ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
                    <Bluetooth size={18} />
                  </div>
                  <span className="text-xs text-white">Bluetooth</span>
                </div>
                <button 
                  onClick={() => setIsBluetoothOn(!isBluetoothOn)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${isBluetoothOn ? 'bg-blue-600' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isBluetoothOn ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center text-white">
                    <Moon size={18} />
                  </div>
                  <span className="text-xs text-white">Do Not Disturb</span>
                </div>
                <button 
                  onClick={() => setIsDoNotDisturb(!isDoNotDisturb)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${isDoNotDisturb ? 'bg-blue-600' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isDoNotDisturb ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            </div>
            <div className="mt-8">
              <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 ml-2">Device</h4>
              <div className="bg-white/5 rounded-2xl p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Model</span>
                  <span className="text-xs text-white">Nebula Phone 15 Pro</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Version</span>
                  <span className="text-xs text-white">NebulaOS 2.5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Storage</span>
                  <span className="text-xs text-white">128GB / 256GB</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'health':
        return (
          <div className="flex flex-col h-full bg-black p-6">
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setActiveApp(null)} className="p-1 hover:bg-white/10 rounded-full">
                <ChevronLeft size={20} className="text-white" />
              </button>
              <h3 className="text-sm font-bold text-white">Health</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart size={16} className="text-red-500" />
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Heart Rate</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white">72</span>
                  <span className="text-[10px] text-gray-500">BPM</span>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={16} className="text-yellow-500" />
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Activity</span>
                </div>
                <div className="space-y-2">
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[75%] bg-red-500" />
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[60%] bg-green-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'photos':
        return (
          <div className="flex flex-col h-full bg-black">
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <button onClick={() => setActiveApp(null)} className="p-1 hover:bg-white/10 rounded-full">
                <ChevronLeft size={20} className="text-white" />
              </button>
              <h3 className="text-sm font-bold text-white">Photos</h3>
            </div>
            <div className="flex-1 overflow-auto p-2 grid grid-cols-3 gap-1">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="aspect-square bg-white/5 overflow-hidden">
                  <img 
                    src={`https://picsum.photos/seed/phone-${i}/200/200`} 
                    alt="Photo" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case 'browser':
        return (
          <div className="flex flex-col h-full bg-white">
            <div className="p-3 bg-gray-100 border-b border-gray-200 flex items-center gap-2">
              <button onClick={() => setActiveApp(null)} className="p-1 hover:bg-gray-200 rounded-full">
                <ChevronLeft size={18} className="text-gray-600" />
              </button>
              <div className="flex-1 bg-white border border-gray-300 rounded-full px-3 py-1 text-[10px] text-gray-600 truncate">
                nebulabrowser.com
              </div>
            </div>
            <div className="flex-1 bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
              <Globe size={48} className="text-blue-500 mb-4 opacity-20" />
              <h4 className="text-sm font-bold text-gray-800">Nebula Browser</h4>
              <p className="text-[10px] text-gray-500 mt-2">The web, reimagined for your pocket.</p>
            </div>
          </div>
        );
      case 'search':
        return (
          <div className="flex flex-col h-full bg-[#0a0a0a] p-6">
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setActiveApp(null)} className="p-1 hover:bg-white/10 rounded-full">
                <ChevronLeft size={20} className="text-white" />
              </button>
              <h3 className="text-sm font-bold text-white">Nebula Search</h3>
            </div>
            <div className="relative">
              <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white outline-none focus:border-blue-500"
                placeholder="Search the void..."
                autoFocus
              />
            </div>
            <div className="mt-6 space-y-4">
              <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Trending</h4>
              {['Nebula OS 2.5', 'Quantum Computing', 'Mars Colony', 'AI Ethics'].map(t => (
                <div key={t} className="flex items-center gap-3 text-xs text-gray-300 hover:text-white cursor-pointer">
                  <SearchIcon size={12} className="text-gray-600" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'store':
        return (
          <div className="flex flex-col h-full bg-[#050505]">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveApp(null)} className="p-1 hover:bg-white/10 rounded-full">
                  <ChevronLeft size={20} className="text-white" />
                </button>
                <h3 className="text-sm font-bold text-white">App Store</h3>
              </div>
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold">
                {user?.displayName?.[0] || 'U'}
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-6">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 shadow-xl">
                <h4 className="text-white font-bold text-sm">Nebula Games</h4>
                <p className="text-[10px] text-white/70 mt-1">Play the latest hits on the go.</p>
                <button className="mt-3 px-4 py-1 bg-white text-blue-600 rounded-full text-[10px] font-bold">EXPLORE</button>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Top Apps</h4>
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-blue-400">
                      <ShoppingBag size={24} />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-xs font-bold text-white">Nebula App {i}</h5>
                      <p className="text-[10px] text-gray-500">Productivity • 4.8 ★</p>
                    </div>
                    <button className="px-4 py-1 bg-white/10 rounded-full text-[10px] font-bold text-blue-400">GET</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'camera':
        return (
          <div className="flex flex-col h-full bg-black relative">
            <div className="flex-1 flex items-center justify-center">
              <Camera size={64} className="text-white/10" />
              <div className="absolute inset-0 border-[20px] border-black/40 pointer-events-none" />
            </div>
            <div className="p-8 flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                <img src="https://picsum.photos/seed/last-photo/100/100" alt="Gallery" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <button className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white active:scale-90 transition-transform" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                <RotateCw size={20} />
              </button>
            </div>
            <button onClick={() => setActiveApp(null)} className="absolute top-12 left-6 p-2 bg-black/40 backdrop-blur-md rounded-full text-white">
              <ChevronLeft size={20} />
            </button>
          </div>
        );
      case 'phone-call':
        return (
          <div className="flex flex-col h-full bg-gradient-to-b from-gray-800 to-black p-8 items-center text-center">
            <div className="mt-12 mb-16">
              <div className="w-24 h-24 rounded-full bg-blue-600 mx-auto mb-6 flex items-center justify-center shadow-2xl">
                <UserIcon size={48} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Alex Johnson</h3>
              <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mt-2">Calling...</p>
            </div>
            <div className="grid grid-cols-3 gap-8 mb-16">
              {[
                { icon: <MicOff size={20} />, label: 'Mute' },
                { icon: <LayoutGrid size={20} />, label: 'Keypad' },
                { icon: <Volume2 size={20} />, label: 'Speaker' },
                { icon: <Plus size={20} />, label: 'Add' },
                { icon: <Video size={20} />, label: 'Video' },
                { icon: <UserIcon size={20} />, label: 'Contacts' },
              ].map((btn, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 cursor-pointer">
                    {btn.icon}
                  </div>
                  <span className="text-[8px] text-gray-500 uppercase font-bold">{btn.label}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setActiveApp(null)}
              className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white shadow-xl shadow-red-500/20 active:scale-90 transition-transform"
            >
              <PhoneIcon size={32} className="rotate-[135deg]" />
            </button>
          </div>
        );
      case 'tv':
        return (
          <div className="flex flex-col h-full bg-black">
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <button onClick={() => setActiveApp(null)} className="p-1 hover:bg-white/10 rounded-full">
                <ChevronLeft size={20} className="text-white" />
              </button>
              <h3 className="text-sm font-bold text-white">Nebula TV</h3>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-6">
              <div className="aspect-video bg-white/5 rounded-2xl overflow-hidden relative group cursor-pointer">
                <img src="https://picsum.photos/seed/movie/400/225" alt="Featured" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                    <Play size={24} />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4">
                  <h4 className="text-xs font-bold text-white">Interstellar Void</h4>
                  <p className="text-[8px] text-gray-400">Sci-Fi • 2h 45m</p>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Continue Watching</h4>
                {[1, 2].map(i => (
                  <div key={i} className="flex gap-3">
                    <div className="w-24 aspect-video bg-white/5 rounded-lg overflow-hidden">
                      <img src={`https://picsum.photos/seed/tv-${i}/200/112`} alt="Show" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-[10px] font-bold text-white">Nebula Series {i}</h5>
                      <p className="text-[8px] text-gray-500">S1 • E{i+2}</p>
                      <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-[40%] bg-blue-600" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'maps':
        return (
          <div className="flex flex-col h-full bg-[#0a0a0a]">
            <div className="absolute top-12 left-4 right-4 z-10">
              <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-center gap-3">
                <SearchIcon size={16} className="text-gray-500" />
                <input className="flex-1 bg-transparent text-xs text-white outline-none" placeholder="Search Maps" />
              </div>
            </div>
            <div className="flex-1 bg-[#1a1a1a] flex items-center justify-center relative overflow-hidden">
              <Map size={120} className="text-white/5" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_20px_rgba(59,130,246,0.5)] animate-pulse" />
                <div className="mt-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-[8px] text-white font-bold uppercase tracking-widest">Your Location</div>
              </div>
            </div>
            <div className="p-4 bg-black/80 backdrop-blur-xl border-t border-white/10 flex justify-around">
              <button className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white"><MapPin size={16} /></div>
                <span className="text-[8px] text-gray-500 font-bold uppercase">Explore</span>
              </button>
              <button className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400"><Car size={16} /></div>
                <span className="text-[8px] text-gray-500 font-bold uppercase">Go</span>
              </button>
              <button className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400"><Star size={16} /></div>
                <span className="text-[8px] text-gray-500 font-bold uppercase">Saved</span>
              </button>
            </div>
            <button onClick={() => setActiveApp(null)} className="absolute top-12 left-4 z-20 p-2 bg-black/40 backdrop-blur-md rounded-full text-white">
              <ChevronLeft size={20} />
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const apps = [
    { id: 'messages', icon: <MessageSquare size={20} />, label: 'Messages', color: '#3b82f6' },
    { id: 'pay', icon: <CreditCard size={20} />, label: 'Pay', color: '#10b981' },
    { id: 'photos', icon: <Globe size={20} />, label: 'Photos', color: '#f59e0b' },
    { id: 'settings', icon: <SettingsIcon size={20} />, label: 'Settings', color: '#6b7280' },
    { id: 'browser', icon: <Globe size={20} />, label: 'Browser', color: '#3b82f6' },
    { id: 'search', icon: <SearchIcon size={20} />, label: 'Search', color: '#ef4444' },
    { id: 'health', icon: <Heart size={20} />, label: 'Health', color: '#ec4899' },
    { id: 'store', icon: <ShoppingBag size={20} />, label: 'Store', color: '#8b5cf6' },
    { id: 'camera', icon: <Camera size={20} />, label: 'Camera', color: '#1f2937' },
    { id: 'phone-call', icon: <PhoneIcon size={20} />, label: 'Phone', color: '#10b981' },
    { id: 'tv', icon: <Tv size={20} />, label: 'TV', color: '#ef4444' },
    { id: 'maps', icon: <Map size={20} />, label: 'Maps', color: '#10b981' },
  ];

  return (
    <div className="h-full bg-black flex items-center justify-center p-4">
      <div className="w-[280px] h-[580px] bg-[#1a1a1a] rounded-[3rem] border-[6px] border-[#333] relative overflow-hidden shadow-2xl flex flex-col">
        {/* Physical Buttons */}
        <button 
          onClick={() => {
            setIsLocked(!isLocked);
            setIsControlCenterOpen(false);
            setActiveApp(null);
          }}
          className="absolute right-[-8px] top-32 w-1 h-16 bg-[#444] rounded-l-md z-50 active:bg-[#666] transition-colors"
        />
        <div className="absolute left-[-8px] top-24 w-1 h-12 bg-[#444] rounded-r-md z-50" />
        <div className="absolute left-[-8px] top-40 w-1 h-12 bg-[#444] rounded-r-md z-50" />

        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20" />
        
        {/* Phone Status Bar */}
        <div 
          className="h-10 flex items-end justify-between px-6 pb-1 text-[10px] text-white font-bold z-30 cursor-pointer"
          onClick={() => !isLocked && setIsControlCenterOpen(true)}
        >
          <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <div className="flex items-center gap-1.5">
            <Signal size={10} />
            <Wifi size={10} className={isWifiOn ? 'text-white' : 'text-gray-600'} />
            <Battery size={10} className={battery < 20 ? 'text-red-500' : 'text-white'} />
          </div>
        </div>

        {/* Phone Screen Content */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {isControlCenterOpen && (
              <motion.div 
                key="controlcenter"
                initial={{ y: '-100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-100%' }}
                className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-2xl p-8 flex flex-col"
              >
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/10 rounded-3xl p-4 flex flex-col items-center gap-2">
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <button 
                        onClick={() => setIsWifiOn(!isWifiOn)}
                        className={`aspect-square rounded-full flex items-center justify-center ${isWifiOn ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-400'}`}
                      >
                        <Wifi size={16} />
                      </button>
                      <button 
                        onClick={() => setIsBluetoothOn(!isBluetoothOn)}
                        className={`aspect-square rounded-full flex items-center justify-center ${isBluetoothOn ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-400'}`}
                      >
                        <Bluetooth size={16} />
                      </button>
                    </div>
                    <span className="text-[8px] text-gray-500 uppercase font-bold">Connectivity</span>
                  </div>
                  <div className="bg-white/10 rounded-3xl p-4 flex flex-col items-center gap-2">
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <button 
                        onClick={() => setIsDoNotDisturb(!isDoNotDisturb)}
                        className={`aspect-square rounded-full flex items-center justify-center ${isDoNotDisturb ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-400'}`}
                      >
                        <Moon size={16} />
                      </button>
                      <button className="aspect-square rounded-full bg-white/10 flex items-center justify-center text-white">
                        <RotateCw size={16} />
                      </button>
                    </div>
                    <span className="text-[8px] text-gray-500 uppercase font-bold">System</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[8px] uppercase font-bold text-gray-500">
                      <span>Brightness</span>
                      <span className="text-white">85%</span>
                    </div>
                    <div className="h-4 bg-white/10 rounded-full overflow-hidden relative">
                      <div className="h-full w-[85%] bg-white/20" />
                      <div className="absolute inset-0 flex items-center px-3">
                        <Zap size={12} className="text-white/40" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[8px] uppercase font-bold text-gray-500">
                      <span>Volume</span>
                      <span className="text-white">{volume}%</span>
                    </div>
                    <div className="h-4 bg-white/10 rounded-full overflow-hidden relative">
                      <div className="h-full w-[80%] bg-white/20" />
                      <div className="absolute inset-0 flex items-center px-3">
                        <Volume2 size={12} className="text-white/40" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1" />
                <button 
                  onClick={() => setIsControlCenterOpen(false)}
                  className="w-full py-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold hover:text-white transition-colors"
                >
                  Close
                </button>
              </motion.div>
            )}
            {isLocked ? (
              <motion.div 
                key="lockscreen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute inset-0 z-50 bg-gradient-to-b from-blue-900/40 to-black flex flex-col items-center p-8"
                onClick={() => setIsLocked(false)}
              >
                <div className="mt-12 text-center">
                  <h3 className="text-5xl font-display font-light text-white">
                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </h3>
                  <p className="text-gray-400 mt-2 text-sm font-medium">
                    {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>

                <div className="mt-12 w-full space-y-3">
                  {notifications.map(n => (
                    <div key={n.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{n.title}</span>
                        <span className="text-[8px] text-gray-500">{n.time}</span>
                      </div>
                      <p className="text-xs text-white">{n.body}</p>
                    </div>
                  ))}
                </div>

                <div className="flex-1" />
                <div className="mb-8 flex flex-col items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white animate-bounce">
                    <ChevronLeft size={20} className="rotate-90" />
                  </div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Swipe up to unlock</p>
                </div>
              </motion.div>
            ) : activeApp ? (
              <motion.div 
                key="app"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute inset-0 z-10"
              >
                {renderApp()}
              </motion.div>
            ) : (
              <motion.div 
                key="home"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="h-full bg-gradient-to-b from-purple-900/40 to-black p-6 flex flex-col"
              >
                {/* Weather Widget */}
                <div className="mt-8 mb-6">
                  <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">San Francisco</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-4xl font-bold text-white">39°</h3>
                      <p className="text-xs text-gray-400">Partly Cloudy</p>
                    </div>
                    <Cloud size={48} className="text-blue-400" />
                  </div>
                </div>

                {/* Quick Info Cards */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard size={12} className="text-green-400" />
                      <span className="text-[8px] text-gray-400 uppercase font-bold">Pay</span>
                    </div>
                    <p className="text-[10px] text-white font-bold">$12.4k</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Heart size={12} className="text-red-400" />
                      <span className="text-[8px] text-gray-400 uppercase font-bold">Vitals</span>
                    </div>
                    <p className="text-[10px] text-white font-bold">72 BPM</p>
                  </div>
                </div>

                {/* App Grid */}
                <div className="grid grid-cols-4 gap-4">
                  {apps.map((app) => (
                    <button 
                      key={app.id} 
                      onClick={() => setActiveApp(app.id as PhoneAppId)}
                      className="flex flex-col items-center gap-1 group"
                    >
                      <div 
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg group-active:scale-90 transition-transform"
                        style={{ backgroundColor: app.color }}
                      >
                        {app.icon}
                      </div>
                      <span className="text-[8px] text-gray-400 uppercase font-bold truncate w-full text-center">{app.label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex-1" />

                {/* Dock */}
                <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-3 flex justify-around items-center mb-2">
                  <button onClick={() => setActiveApp('phone-call')} className="p-2 rounded-full hover:bg-white/10 text-white"><PhoneIcon size={20} /></button>
                  <button onClick={() => setActiveApp('messages')} className="p-2 rounded-full hover:bg-white/10 text-white"><MessageSquare size={20} /></button>
                  <button onClick={() => setActiveApp('camera')} className="p-2 rounded-full hover:bg-white/10 text-white"><Camera size={20} /></button>
                  <button onClick={() => setActiveApp('browser')} className="p-2 rounded-full hover:bg-white/10 text-white"><Globe size={20} /></button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Phone Home Bar */}
        <button 
          onClick={() => setActiveApp(null)}
          className="h-6 flex items-center justify-center group"
        >
          <div className="w-20 h-1 bg-white/20 rounded-full group-hover:bg-white/40 transition-colors" />
        </button>
      </div>
    </div>
  );
};

export default Phone;
