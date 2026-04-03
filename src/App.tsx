/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useOSStore } from './store';
import BIOS from './components/BIOS';
import Desktop from './components/Desktop';
import SetupScreen from './components/SetupScreen';
import { motion, AnimatePresence } from 'motion/react';
import { User, Lock, LogIn, Power, ChevronRight, Plus } from 'lucide-react';
import { auth, googleProvider } from './firebase';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';

export default function App() {
  const { 
    isBooted, isLoggedIn, boot, setUser, setAuthReady, isAuthReady, syncSettings,
    isGrayscale, isInverted, toggleGrayscale, toggleInvert, isRestarting,
    isShutDown, isSetupComplete, loginLocal, accentColor, fontStyle,
    savedUsers, removeSavedUser, cursorScale, setCursorScale, cursorColor,
    taskbarTransparency, windowTransparency, isDarkMode, factoryReset,
    openApp, currentDisplayId, registerDisplay, unregisterDisplay, displays, windows
  } = useOSStore();

  useEffect(() => {
    const channel = new BroadcastChannel('nebula_os_sync');
    
    // Register this tab as a display
    const display = {
      id: currentDisplayId,
      x: displays.length * 1920, // Default position
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      isPrimary: displays.length === 0
    };
    registerDisplay(display);

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'SYNC_STATE') {
        const newState = event.data.state;
        // Merge state but keep local currentDisplayId
        useOSStore.setState({
          ...newState,
          currentDisplayId: currentDisplayId,
          // Merge displays to ensure we don't lose local display info
          displays: Array.from(new Map([...newState.displays, ...useOSStore.getState().displays].map(d => [d.id, d])).values())
        });
      } else if (event.data.type === 'IDENTIFY') {
        window.dispatchEvent(new CustomEvent('nebula_identify'));
      }
    };

    channel.onmessage = handleMessage;

    const syncInterval = setInterval(() => {
      channel.postMessage({ type: 'SYNC_STATE', state: useOSStore.getState() });
    }, 500);

    const handleUnload = () => {
      unregisterDisplay(currentDisplayId);
      channel.postMessage({ type: 'SYNC_STATE', state: useOSStore.getState() });
      channel.close();
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearInterval(syncInterval);
      window.removeEventListener('beforeunload', handleUnload);
      channel.close();
    };
  }, [currentDisplayId]);

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showLocalLogin, setShowLocalLogin] = useState(false);
  const [localUsername, setLocalUsername] = useState('');
  const [isAddingAccount, setIsAddingAccount] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        if (e.key.toLowerCase() === 'g') {
          e.preventDefault();
          toggleGrayscale();
        }
        if (e.key.toLowerCase() === 'i') {
          e.preventDefault();
          toggleInvert();
        }
        if (e.key.toLowerCase() === 's') {
          e.preventDefault();
          openApp('settings', 'System Settings');
        }
        if (e.key.toLowerCase() === 'f') {
          e.preventDefault();
          openApp('search', 'Nebula Search');
        }
        if (e.key.toLowerCase() === 'r') {
          e.preventDefault();
          // Use a more robust check for confirm if possible, but for now stick to the request
          if (window.confirm("Are you sure you want to factory reset? All local data will be lost.")) {
            factoryReset();
          }
        }
        if (e.key === '+' || e.key === '=') {
          e.preventDefault();
          setCursorScale(cursorScale + 0.2);
        }
        if (e.key === '-' || e.key === '_') {
          e.preventDefault();
          setCursorScale(cursorScale - 0.2);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleGrayscale, toggleInvert, cursorScale, setCursorScale]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        });
        syncSettings();
      } else {
        // Only clear if not a local user
        const currentUser = useOSStore.getState().user;
        if (!currentUser?.isLocal) {
          setUser(null);
        }
      }
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, [setUser, setAuthReady, syncSettings]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLocalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (localUsername.trim()) {
      loginLocal(localUsername.trim());
      setIsAddingAccount(false);
    }
  };

  const handleSavedUserLogin = async (savedUser: any) => {
    if (savedUser.isLocal) {
      loginLocal(savedUser.displayName);
    } else {
      // For Google users, we trigger the popup to refresh the session
      handleLogin();
    }
  };

  const filterStyle = {
    filter: `${isGrayscale ? 'grayscale(100%)' : ''} ${isInverted ? 'invert(100%)' : ''}`.trim()
  };

  const effectiveCursorColor = cursorColor === 'accent' ? accentColor : cursorColor;
  const cursorSize = 32 * cursorScale;
  const cursorStroke = effectiveCursorColor.toLowerCase() === 'white' || effectiveCursorColor.toLowerCase() === '#ffffff' ? 'black' : 'white';
  const cursorSvg = `%3Csvg width='${cursorSize}' height='${cursorSize}' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 4V25L13.5 19.5L17.5 28.5L20.5 27L16.5 18H23L8 4Z' fill='${encodeURIComponent(effectiveCursorColor)}' stroke='${cursorStroke}' stroke-width='2.5' stroke-linejoin='round'/%3E%3C/svg%3E`;

  const themeStyle = {
    '--os-accent': accentColor,
    '--os-accent-glow': `${accentColor}33`,
    '--os-accent-border': `${accentColor}66`,
    '--os-bg': isDarkMode ? '#0a0a0a' : '#f0f2f5',
    '--os-text': isDarkMode ? 'white' : 'white', // User requested white text for lightmode
    '--cursor-url': `url("data:image/svg+xml,${cursorSvg}")`,
    '--taskbar-opacity': taskbarTransparency / 100,
    '--window-opacity': windowTransparency / 100,
    '--font-family-custom': fontStyle === 'sans' ? '"Inter", ui-sans-serif, system-ui, sans-serif' :
                  fontStyle === 'mono' ? '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace' :
                  fontStyle === 'display' ? '"Space Grotesk", sans-serif' :
                  fontStyle === 'serif' ? '"Libre Baskerville", serif' : '"Inter", ui-sans-serif, system-ui, sans-serif',
    ...filterStyle
  } as React.CSSProperties;

  if (isShutDown) {
    return (
      <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center cursor-none">
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          whileHover={{ opacity: 1 }}
          onClick={() => boot()}
          className="p-8 rounded-full border border-white/20 text-white/40 hover:text-white hover:border-white transition-all group"
        >
          <Power size={48} className="group-hover:scale-110 transition-transform" />
          <p className="mt-4 text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">Power On</p>
        </motion.button>
      </div>
    );
  }

  if (!isBooted || isRestarting) {
    return <BIOS onComplete={boot} />;
  }

  if (!isSetupComplete) {
    return <SetupScreen />;
  }

  if (!isAuthReady) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div style={themeStyle} className="fixed inset-0 font-sans">
      {!isLoggedIn ? (
        <div className="fixed inset-0 bg-[#050505] flex items-center justify-center font-sans overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md p-8 text-center z-10"
          >
            <div className="mb-12">
              <h1 className="text-4xl font-display font-bold text-white tracking-tighter mb-2">Nebulabs OS 2</h1>
              <p className="text-gray-500 text-sm font-medium">Welcome back to the future of computing</p>
            </div>

            {!isAddingAccount && savedUsers.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {savedUsers.map((savedUser) => (
                    <div key={savedUser.uid} className="group relative">
                      <button
                        onClick={() => handleSavedUserLogin(savedUser)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left"
                      >
                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden shadow-lg">
                          {savedUser.photoURL ? (
                            <img src={savedUser.photoURL} alt={savedUser.displayName || ''} className="w-full h-full object-cover" />
                          ) : (
                            <User size={24} className="text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white">{savedUser.displayName}</h3>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest">{savedUser.isLocal ? 'Local Account' : savedUser.email}</p>
                        </div>
                        <ChevronRight size={18} className="text-gray-600 group-hover:text-white transition-colors" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeSavedUser(savedUser.uid); }}
                        className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <span className="text-xs">×</span>
                      </button>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => setIsAddingAccount(true)}
                  className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-dashed border-white/20 text-gray-400 hover:border-white/40 hover:text-white transition-all text-sm font-medium"
                >
                  <Plus size={16} />
                  <span>Add New Account</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {!showLocalLogin ? (
                  <>
                    <button 
                      onClick={handleLogin}
                      disabled={isLoggingIn}
                      className="w-full bg-white text-black font-bold rounded-2xl py-4 px-6 flex items-center justify-center gap-3 hover:bg-gray-200 transition-all disabled:opacity-50 shadow-xl shadow-white/5"
                    >
                      {isLoggingIn ? (
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          <LogIn size={20} />
                          <span>Sign in with Google</span>
                        </>
                      )}
                    </button>
                    <button 
                      onClick={() => setShowLocalLogin(true)}
                      className="w-full bg-white/5 text-white font-bold rounded-2xl py-4 px-6 flex items-center justify-center gap-3 hover:bg-white/10 transition-all border border-white/10"
                    >
                      <User size={20} />
                      <span>Local Account</span>
                    </button>
                    {savedUsers.length > 0 && (
                      <button 
                        onClick={() => setIsAddingAccount(false)}
                        className="w-full text-gray-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors mt-4"
                      >
                        Cancel
                      </button>
                    )}
                  </>
                ) : (
                  <form onSubmit={handleLocalLogin} className="space-y-4">
                    <div className="text-left space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-2">Username</label>
                      <input 
                        type="text"
                        placeholder="Enter your name"
                        autoFocus
                        value={localUsername}
                        onChange={(e) => setLocalUsername(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button 
                        type="button"
                        onClick={() => setShowLocalLogin(false)}
                        className="flex-1 bg-white/5 text-white font-bold rounded-2xl py-4 hover:bg-white/10 transition-all border border-white/10"
                      >
                        Back
                      </button>
                      <button 
                        type="submit"
                        disabled={!localUsername.trim()}
                        className="flex-[2] bg-blue-600 text-white font-bold rounded-2xl py-4 hover:bg-blue-500 transition-all disabled:opacity-50 shadow-xl shadow-blue-500/20"
                      >
                        Login
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            <div className="mt-16 flex items-center justify-center gap-12 text-gray-600">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
                  <Lock size={16} />
                </div>
                <span className="text-[9px] uppercase tracking-widest font-bold">Encrypted</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
                  <Power size={16} />
                </div>
                <span className="text-[9px] uppercase tracking-widest font-bold">System</span>
              </div>
            </div>
          </motion.div>

          <div className="fixed bottom-8 left-8 text-left">
            <h2 className="text-5xl font-display font-light text-white/90">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </h2>
            <p className="text-gray-400 mt-2 font-medium">
              {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      ) : (
        <Desktop />
      )}
    </div>
  );
}
