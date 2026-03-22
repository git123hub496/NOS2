/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useOSStore } from './store';
import BIOS from './components/BIOS';
import Desktop from './components/Desktop';
import SetupScreen from './components/SetupScreen';
import { motion, AnimatePresence } from 'motion/react';
import { User, Lock, LogIn, Power } from 'lucide-react';
import { auth, googleProvider } from './firebase';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';

export default function App() {
  const { 
    isBooted, isLoggedIn, boot, setUser, setAuthReady, isAuthReady, syncSettings,
    isGrayscale, isInverted, toggleGrayscale, toggleInvert, isRestarting,
    isShutDown, isSetupComplete
  } = useOSStore();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleGrayscale, toggleInvert]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthReady(true);
      if (user) {
        syncSettings();
      }
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

  const filterStyle = {
    filter: `${isGrayscale ? 'grayscale(100%)' : ''} ${isInverted ? 'invert(100%)' : ''}`.trim()
  };

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
    <div style={filterStyle} className="fixed inset-0">
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
            className="w-full max-w-sm p-8 text-center z-10"
          >
            <div className="mb-8">
              <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl shadow-blue-500/20">
                <User size={48} className="text-white" />
              </div>
              <h1 className="text-2xl font-display font-bold text-white tracking-tight">Nebulabs OS 2</h1>
              <p className="text-gray-500 text-sm mt-1">Please sign in to continue</p>
            </div>

            <button 
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full bg-white text-black font-semibold rounded-xl py-3 px-6 flex items-center justify-center gap-3 hover:bg-gray-200 transition-all disabled:opacity-50"
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

            <div className="mt-12 flex items-center justify-center gap-8 text-gray-500">
              <button className="flex flex-col items-center gap-2 hover:text-white transition-colors">
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
                  <Lock size={16} />
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold">Secure</span>
              </button>
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
