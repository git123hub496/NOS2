import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useOSStore } from '../../store';
import { 
  Monitor, 
  Cpu, 
  Palette, 
  Zap, 
  Info, 
  MousePointer2, 
  RefreshCw, 
  Search, 
  LayoutGrid, 
  Bell, 
  User, 
  Shield, 
  Layers, 
  Image as ImageIcon, 
  Upload,
  Camera,
  Moon,
  Sun,
  Check,
  Plus
} from 'lucide-react';

const Settings: React.FC = () => {
  const { 
    isLiteMode, setLiteMode, wallpaper, setWallpaper, 
    accentColor, setAccentColor, fontStyle, setFontStyle,
    cursorScale, setCursorScale, cursorColor, setCursorColor, isUpdating, updateProgress, updateStatus, startUpdate,
    isDarkMode, setDarkMode, taskbarTransparency, setTaskbarTransparency,
    windowTransparency, setWindowTransparency, isTaskbarAutohide, setTaskbarAutohide,
    user, setProfilePicture
  } = useOSStore();

  const cursorColors = [
    { name: 'White', color: 'white' },
    { name: 'Black', color: 'black' },
    { name: 'Accent', color: 'accent' },
    { name: 'Blue', color: '#3b82f6' },
    { name: 'Green', color: '#22c55e' },
    { name: 'Yellow', color: '#eab308' },
    { name: 'Red', color: '#ef4444' },
    { name: 'Orange', color: '#f97316' },
    { name: 'Pink', color: '#ec4899' },
    { name: 'Purple', color: '#a855f7' },
    { name: 'Teal', color: '#06b6d4' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'wallpaper' | 'profile') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert('File is too large. Maximum size is 1MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (type === 'wallpaper') {
        setWallpaper(result);
      } else {
        setProfilePicture(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const [activeTab, setActiveTab] = useState('Personalization');
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = sidebarItems.findIndex(item => item.id === activeTab);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % sidebarItems.length;
        setActiveTab(sidebarItems[nextIndex].id);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + sidebarItems.length) % sidebarItems.length;
        setActiveTab(sidebarItems[prevIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  const sidebarItems = [
    { id: 'Personalization', icon: <Palette size={18} /> },
    { id: 'Display', icon: <Monitor size={18} /> },
    { id: 'Apps', icon: <LayoutGrid size={18} /> },
    { id: 'Accessibility', icon: <MousePointer2 size={18} /> },
    { id: 'Notifications', icon: <Bell size={18} /> },
    { id: 'Accounts', icon: <User size={18} /> },
    { id: 'Security', icon: <Shield size={18} /> },
    { id: 'Updates', icon: <RefreshCw size={18} /> },
    { id: 'About', icon: <Info size={18} /> },
  ];

  const colors = [
    { name: 'Purple', color: '#a855f7' },
    { name: 'Blue', color: '#3b82f6' },
    { name: 'Red', color: '#ef4444' },
    { name: 'Pink', color: '#ec4899' },
    { name: 'Orange', color: '#f97316' },
    { name: 'Yellow', color: '#eab308' },
    { name: 'Green', color: '#22c55e' },
    { name: 'Cyan', color: '#06b6d4' },
    { name: 'Slate', color: '#64748b' },
    { name: 'Dark', color: '#1e293b' }
  ];

  const wallpapers = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
    'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986',
    'https://images.unsplash.com/photo-1502134249126-9f3755a50d78'
  ];

  return (
    <div className="h-full flex bg-[#0d1117] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/5 flex flex-col p-6 gap-6 bg-[#0a0c10]">
        <div className="space-y-1">
          <h2 className="text-[10px] font-bold text-blue-500/80 uppercase tracking-[0.2em] mb-6">System Configuration</h2>
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input 
              type="text"
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs outline-none focus:border-blue-500/30 transition-all"
            />
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all group ${activeTab === item.id ? 'bg-white/5 text-white font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
              >
                <span 
                  className={`${activeTab === item.id ? '' : 'text-gray-500 group-hover:text-gray-400'}`}
                  style={{ color: activeTab === item.id ? 'var(--os-accent)' : undefined }}
                >
                  {item.icon}
                </span>
                {item.id}
              </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto custom-scrollbar p-10">
        {activeTab === 'Personalization' && (
          <div className="max-w-3xl space-y-12">
            {/* Theme & Style */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Zap style={{ color: 'var(--os-accent)' }} size={20} />
                <h2 className="text-lg font-bold">Theme & Style</h2>
              </div>

              <div className="bg-white/5 rounded-3xl p-8 border border-white/5 flex items-center justify-between group hover:bg-white/[0.07] transition-all">
                <div className="flex items-center gap-6">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: 'var(--os-accent-glow)', color: 'var(--os-accent)' }}
                  >
                    <Moon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Interface Theme</h3>
                    <p className="text-xs text-gray-500 mt-1">Switch between light and dark modes</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span 
                    className="text-[10px] font-bold tracking-widest"
                    style={{ color: isDarkMode ? 'var(--os-accent)' : '#4b5563' }}
                  >DARK</span>
                  <button 
                    onClick={() => setDarkMode(!isDarkMode)}
                    className="w-12 h-6 rounded-full transition-all relative"
                    style={{ backgroundColor: isDarkMode ? 'var(--os-accent)' : '#374151' }}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? 'left-7' : 'left-1'}`} />
                  </button>
                  <span 
                    className="text-[10px] font-bold tracking-widest"
                    style={{ color: !isDarkMode ? 'var(--os-accent)' : '#4b5563' }}
                  >LIGHT</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Accent Color</h3>
                <div className="flex flex-wrap gap-4">
                  {colors.map((c) => (
                    <button
                      key={c.color}
                      onClick={() => setAccentColor(c.color)}
                      className={`w-16 h-16 rounded-2xl transition-all relative flex items-center justify-center ${accentColor === c.color ? 'ring-2 ring-white ring-offset-4 ring-offset-[#0d1117] scale-105' : 'hover:scale-105'}`}
                      style={{ backgroundColor: c.color }}
                    >
                      {accentColor === c.color && <Check size={24} className="text-white" />}
                    </button>
                  ))}
                  
                  {/* Custom Color Picker */}
                  <div className="relative group">
                    <input 
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                    />
                    <div 
                      className={`w-16 h-16 rounded-2xl transition-all relative flex flex-col items-center justify-center border-2 border-dashed border-white/20 group-hover:border-white/40 group-hover:scale-105 ${!colors.some(c => c.color === accentColor) ? 'ring-2 ring-white ring-offset-4 ring-offset-[#0d1117] scale-105' : ''}`}
                      style={{ backgroundColor: !colors.some(c => c.color === accentColor) ? accentColor : 'transparent' }}
                    >
                      {!colors.some(c => c.color === accentColor) ? (
                        <Check size={24} className="text-white" />
                      ) : (
                        <>
                          <Plus size={20} className="text-gray-500 group-hover:text-white transition-colors" />
                          <span className="text-[8px] font-bold text-gray-500 group-hover:text-white uppercase tracking-tighter mt-1">Custom</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Interface Transparency */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Layers style={{ color: 'var(--os-accent)' }} size={20} />
                <h2 className="text-lg font-bold">Interface Transparency</h2>
              </div>

              <div className="bg-white/5 rounded-3xl p-8 border border-white/5 space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Taskbar Transparency</h3>
                    <span className="text-xs font-mono" style={{ color: 'var(--os-accent)' }}>{taskbarTransparency}%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      value={taskbarTransparency}
                      onChange={(e) => setTaskbarTransparency(parseInt(e.target.value))}
                      className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                      style={{ accentColor: 'var(--os-accent)' }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">App Window Transparency</h3>
                    <span className="text-xs font-mono" style={{ color: 'var(--os-accent)' }}>{windowTransparency}%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      value={windowTransparency}
                      onChange={(e) => setWindowTransparency(parseInt(e.target.value))}
                      className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                      style={{ accentColor: 'var(--os-accent)' }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium">Auto-hide Taskbar</h3>
                    <p className="text-[10px] text-gray-500">Hide taskbar when not in use</p>
                  </div>
                  <button 
                    onClick={() => setTaskbarAutohide(!isTaskbarAutohide)}
                    className="w-10 h-5 rounded-full transition-colors relative"
                    style={{ backgroundColor: isTaskbarAutohide ? 'var(--os-accent)' : 'rgba(255,255,255,0.1)' }}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isTaskbarAutohide ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </section>

            {/* Desktop Wallpaper */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ImageIcon style={{ color: 'var(--os-accent)' }} size={20} />
                  <h2 className="text-lg font-bold">Desktop Wallpaper</h2>
                </div>
                <label className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all cursor-pointer">
                  <Upload size={14} />
                  Upload Background
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => handleFileUpload(e, 'wallpaper')} 
                  />
                </label>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {wallpapers.map((url, i) => (
                  <button 
                    key={i}
                    onClick={() => setWallpaper(`${url}?q=80&w=2564&auto=format&fit=crop`)}
                    className="aspect-video rounded-2xl overflow-hidden border-2 transition-all"
                    style={{ 
                      borderColor: wallpaper.includes(url) ? 'var(--os-accent)' : 'transparent',
                      transform: wallpaper.includes(url) ? 'scale(1.05)' : undefined,
                      boxShadow: wallpaper.includes(url) ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : undefined
                    }}
                  >
                    <img src={`${url}?q=40&w=400&auto=format&fit=crop`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'Display' && (
          <div className="max-w-3xl space-y-12">
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Monitor style={{ color: 'var(--os-accent)' }} size={20} />
                <h2 className="text-lg font-bold">Display Settings</h2>
              </div>

              <div className="bg-white/5 rounded-3xl p-8 border border-white/5 space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm">Lite Mode</h3>
                    <p className="text-xs text-gray-500 mt-1">Disable transparency and blur for better performance</p>
                  </div>
                  <button 
                    onClick={() => setLiteMode(!isLiteMode)}
                    className="w-12 h-6 rounded-full transition-all relative"
                    style={{ backgroundColor: isLiteMode ? 'var(--os-accent)' : '#374151' }}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isLiteMode ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Font Style</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {(['sans', 'mono', 'display', 'serif'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => setFontStyle(style)}
                        className="p-4 rounded-xl border transition-all text-left"
                        style={{ 
                          backgroundColor: fontStyle === style ? 'var(--os-accent-glow)' : 'rgba(255,255,255,0.05)',
                          borderColor: fontStyle === style ? 'var(--os-accent)' : 'rgba(255,255,255,0.1)',
                          color: fontStyle === style ? 'var(--os-accent)' : '#9ca3af'
                        }}
                      >
                        <p className={`text-lg capitalize font-${style}`}>Nebula OS</p>
                        <p className="text-[10px] uppercase tracking-widest mt-1 opacity-60">{style}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'Accessibility' && (
          <div className="max-w-3xl space-y-12">
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <MousePointer2 style={{ color: 'var(--os-accent)' }} size={20} />
                <h2 className="text-lg font-bold">Accessibility</h2>
              </div>

              <div className="bg-white/5 rounded-3xl p-8 border border-white/5 space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-medium">Cursor Scale</h3>
                      <p className="text-xs text-gray-500 mt-1">Adjust the size of the system cursor</p>
                    </div>
                    <span className="text-xs font-mono" style={{ color: 'var(--os-accent)' }}>{cursorScale.toFixed(1)}x</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.1"
                      value={cursorScale}
                      onChange={(e) => setCursorScale(parseFloat(e.target.value))}
                      className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                      style={{ accentColor: 'var(--os-accent)' }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 italic">Shortcut: Alt + and Alt - to scale cursor anywhere.</p>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Cursor Color</h3>
                  <div className="flex flex-wrap gap-3">
                    {cursorColors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setCursorColor(c.color)}
                        className={`group relative flex flex-col items-center gap-2 transition-all ${
                          cursorColor === c.color ? 'scale-110' : 'hover:scale-105'
                        }`}
                      >
                        <div 
                          className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                            cursorColor === c.color ? 'border-white' : 'border-transparent'
                          }`}
                          style={{ 
                            backgroundColor: c.color === 'accent' ? 'var(--os-accent)' : c.color,
                            boxShadow: cursorColor === c.color ? `0 0 15px ${c.color === 'accent' ? 'var(--os-accent-glow)' : c.color + '33'}` : 'none'
                          }}
                        >
                          {cursorColor === c.color && <Check size={14} className={c.color === 'white' ? 'text-black' : 'text-white'} />}
                        </div>
                        <span className={`text-[8px] font-bold uppercase tracking-widest transition-colors ${
                          cursorColor === c.color ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'
                        }`}>
                          {c.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'Accounts' && (
          <div className="max-w-3xl space-y-12">
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <User className="text-blue-500" size={20} />
                <h2 className="text-lg font-bold">User Account</h2>
              </div>

              <div className="bg-white/5 rounded-3xl p-8 border border-white/5 space-y-8">
                <div className="flex items-center gap-8">
                  <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border-2 shadow-2xl relative group"
                    style={{ borderColor: 'var(--os-accent-border)', backgroundColor: 'var(--os-accent-glow)' }}
                  >
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User size={48} style={{ color: 'var(--os-accent)' }} />
                    )}
                    <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera size={20} className="text-white mb-1" />
                      <span className="text-[8px] text-white font-bold uppercase">Change</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'profile')}
                      />
                    </label>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{user?.displayName || 'Nebula User'}</h3>
                    <p className="text-sm text-gray-400">{user?.email || 'Local Account'}</p>
                    <div className="flex gap-2 mt-3">
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        {user?.isLocal ? 'Local Admin' : 'Cloud User'}
                      </span>
                      <span 
                        className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                        style={{ backgroundColor: 'var(--os-accent-glow)', color: 'var(--os-accent)' }}
                      >
                        Active Session
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/5">
                  <button className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left group">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Display Name</p>
                    <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">Edit Name</p>
                  </button>
                  <button className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left group">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Password</p>
                    <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">Change Password</p>
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'Updates' && (
          <div className="max-w-3xl space-y-12">
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <RefreshCw style={{ color: 'var(--os-accent)' }} size={20} />
                <h2 className="text-lg font-bold">Nebula Update</h2>
              </div>

              <div className="bg-white/5 rounded-3xl p-10 border border-white/5 flex flex-col items-center text-center space-y-6">
                <div 
                  className={`w-20 h-20 rounded-full flex items-center justify-center ${isUpdating ? 'animate-spin' : ''}`}
                  style={{ 
                    backgroundColor: isUpdating ? 'var(--os-accent-glow)' : 'rgba(34, 197, 94, 0.1)',
                    color: isUpdating ? 'var(--os-accent)' : 'rgb(34, 197, 94)'
                  }}
                >
                  <RefreshCw size={40} />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold">{isUpdating ? 'Updating Nebula OS...' : 'You\'re up to date'}</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    {isUpdating ? `Downloading version 2.4.1 - ${updateStatus}` : 'Last checked: Today, 10:42 PM'}
                  </p>
                </div>

                {isUpdating ? (
                  <div className="w-full max-w-md space-y-2">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full"
                        style={{ backgroundColor: 'var(--os-accent)' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${updateProgress}%` }}
                      />
                    </div>
                    <p className="text-[10px] font-mono text-gray-500">{updateProgress}% complete</p>
                  </div>
                ) : (
                  <button 
                    onClick={startUpdate}
                    className="px-8 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg"
                    style={{ 
                      backgroundColor: 'var(--os-accent)',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    Check for Updates
                  </button>
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'About' && (
          <div className="max-w-3xl space-y-12">
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Info style={{ color: 'var(--os-accent)' }} size={20} />
                <h2 className="text-lg font-bold">About Nebula OS</h2>
              </div>

              <div className="bg-white/5 rounded-3xl p-8 border border-white/5 space-y-8">
                <div className="flex items-center gap-8">
                  <div 
                    className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl"
                    style={{ backgroundColor: 'var(--os-accent)', color: 'white' }}
                  >
                    <Cpu size={48} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Nebula OS 2</h3>
                    <p className="text-sm text-gray-400">Version 2.4.0 (Stable Build)</p>
                    <p className="text-xs mt-1 font-medium" style={{ color: 'var(--os-accent)' }}>Nebulabs Corporation</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Processor</p>
                    <p className="text-sm font-medium">Nebula Core v4 @ 3.8GHz</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Memory</p>
                    <p className="text-sm font-medium">32GB Virtual RAM</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Graphics</p>
                    <p className="text-sm font-medium">Nebula Vision G2</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Storage</p>
                    <p className="text-sm font-medium">1TB Cloud SSD</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {!['Personalization', 'Display', 'Accessibility', 'Updates', 'About', 'Accounts'].includes(activeTab) && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
            <Monitor size={48} className="mb-4 text-gray-600" />
            <h2 className="text-xl font-bold mb-2">{activeTab} Settings</h2>
            <p className="text-sm text-gray-500">This section is being updated in the next Nebula OS release.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
