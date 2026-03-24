import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  Wifi, 
  Shield, 
  User, 
  Palette, 
  CheckCircle2,
  Globe,
  ArrowRight
} from 'lucide-react';
import { useOSStore } from '../store';

import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

const SetupScreen: React.FC = () => {
  const { setSetupComplete, networks, selectedNetwork, setNetwork, loginLocal, setUser } = useOSStore();
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [accountType, setAccountType] = useState<'google' | 'local' | null>(null);
  const [selectedWallpaper, setSelectedWallpaper] = useState('https://picsum.photos/seed/nebula/1920/1080');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const nextStep = () => setStep(s => s + 1);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      });
      setAccountType('google');
      nextStep();
    } catch (error) {
      console.error("Setup Google login failed:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleFinish = () => {
    if (accountType === 'local') {
      loginLocal(userName);
    }
    setSetupComplete(true);
  };

  const wallpapers = [
    'https://picsum.photos/seed/nebula/1920/1080',
    'https://picsum.photos/seed/space/1920/1080',
    'https://picsum.photos/seed/mountain/1920/1080',
    'https://picsum.photos/seed/ocean/1920/1080',
  ];

  return (
    <div className="fixed inset-0 bg-[#050505] z-[9999] flex items-center justify-center font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-3xl p-12 backdrop-blur-xl relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tight text-white">Welcome to Nebulabs OS 2</h1>
                <p className="text-gray-400">Let's get your new workspace ready.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                  <Globe className="text-blue-500" size={32} />
                  <div className="space-y-1">
                    <h3 className="text-white font-bold">Language</h3>
                    <p className="text-xs text-gray-500">English (United States)</p>
                  </div>
                </div>
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                  <Shield className="text-purple-500" size={32} />
                  <div className="space-y-1">
                    <h3 className="text-white font-bold">Privacy</h3>
                    <p className="text-xs text-gray-500">Standard Protection</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={nextStep}
                className="w-full py-4 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
              >
                Get Started <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Wifi className="text-blue-500" /> Connect to Network
                </h2>
                <p className="text-gray-400">Choose a network to stay connected.</p>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {networks.map(net => (
                  <button
                    key={net.id}
                    onClick={() => setNetwork(net.id)}
                    className={`w-full p-4 rounded-xl border transition-all flex items-center justify-between ${selectedNetwork === net.name ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Wifi size={20} />
                      <span className="font-medium">{net.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs opacity-50">{net.signal}/4</span>
                      {selectedNetwork === net.name && <CheckCircle2 size={16} />}
                    </div>
                  </button>
                ))}
              </div>
              <button 
                onClick={nextStep}
                disabled={!selectedNetwork}
                className="w-full py-4 bg-white text-black rounded-xl font-bold disabled:opacity-50 transition-all"
              >
                Continue
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <User className="text-purple-500" /> Choose Account Type
                </h2>
                <p className="text-gray-400">How would you like to sign in?</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                  className={`p-6 rounded-2xl border transition-all text-left flex items-center justify-between group ${accountType === 'google' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                >
                  <div className="flex items-center gap-4">
                    {isLoggingIn ? (
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full"
                      />
                    ) : (
                      <Globe size={32} className="text-blue-400" />
                    )}
                    <div>
                      <h3 className="font-bold text-white">Google Account</h3>
                      <p className="text-xs opacity-60">Sync your settings across devices</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button
                  onClick={() => { setAccountType('local'); nextStep(); }}
                  className={`p-6 rounded-2xl border transition-all text-left flex items-center justify-between group ${accountType === 'local' ? 'bg-purple-600 border-purple-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                >
                  <div className="flex items-center gap-4">
                    <User size={32} className="text-purple-400" />
                    <div>
                      <h3 className="font-bold text-white">Local Account</h3>
                      <p className="text-xs opacity-60">Keep your data on this device only</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <User className="text-purple-500" /> {accountType === 'local' ? "Who's using this PC?" : "Confirm Identity"}
                </h2>
                <p className="text-gray-400">
                  {accountType === 'local' 
                    ? "Enter your name for your local profile." 
                    : "You've chosen to use your Google Account."}
                </p>
              </div>
              <div className="space-y-4">
                {accountType === 'local' ? (
                  <input 
                    type="text"
                    placeholder="Your Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500 transition-colors"
                  />
                ) : (
                  <div className="p-6 bg-blue-600/20 border border-blue-500/30 rounded-2xl text-blue-200 text-sm">
                    You will be prompted to sign in with Google after setup is complete.
                  </div>
                )}
              </div>
              <button 
                onClick={nextStep}
                disabled={accountType === 'local' && !userName.trim()}
                className="w-full py-4 bg-white text-black rounded-xl font-bold disabled:opacity-50 transition-all"
              >
                Continue
              </button>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div 
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Palette className="text-yellow-500" /> Personalize
                </h2>
                <p className="text-gray-400">Choose a look that fits you.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {wallpapers.map((wp, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedWallpaper(wp)}
                    className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${selectedWallpaper === wp ? 'border-blue-500 scale-95' : 'border-transparent hover:border-white/20'}`}
                  >
                    <img src={wp} alt="Wallpaper" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    {selectedWallpaper === wp && (
                      <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                        <CheckCircle2 className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <button 
                onClick={handleFinish}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-all"
              >
                Finish Setup
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SetupScreen;
