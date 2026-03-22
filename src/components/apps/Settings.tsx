import React, { useState, useEffect } from 'react';
import { useOSStore } from '../../store';
import { Monitor, Cpu, Palette, Zap, Info } from 'lucide-react';

const Settings: React.FC = () => {
  const { isLiteMode, setLiteMode, wallpaper, setWallpaper } = useOSStore();

  return (
    <div className="p-6 text-white font-sans">
      <div className="flex items-center gap-3 mb-8">
        <Monitor className="text-blue-500" size={24} />
        <h2 className="text-xl font-semibold">System Settings</h2>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Performance</h3>
          <div className="bg-white/5 rounded-lg p-4 border border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className={isLiteMode ? "text-yellow-500" : "text-gray-400"} size={20} />
                <div>
                  <p className="font-medium">LITE Edition</p>
                  <p className="text-xs text-gray-500">Optimized for older hardware. Disables blurs and animations.</p>
                </div>
              </div>
              <button 
                onClick={() => setLiteMode(!isLiteMode)}
                className={`w-12 h-6 rounded-full transition-colors relative ${isLiteMode ? 'bg-blue-500' : 'bg-gray-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isLiteMode ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Personalization</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <Palette className="text-purple-500" size={20} />
                <p className="font-medium text-sm">Wallpaper</p>
              </div>
              <div className="aspect-video rounded bg-gray-800 overflow-hidden border border-white/10 mb-3">
                <img src={wallpaper} alt="Current wallpaper" className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
                  'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
                  'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986',
                  'https://images.unsplash.com/photo-1502134249126-9f3755a50d78'
                ].map((url, i) => (
                  <button 
                    key={i}
                    onClick={() => setWallpaper(`${url}?q=80&w=2564&auto=format&fit=crop`)}
                    className="aspect-square rounded border border-white/10 overflow-hidden hover:border-blue-500 transition-colors"
                  >
                    <img src={`${url}?q=40&w=200&auto=format&fit=crop`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <Cpu className="text-green-500" size={20} />
                <p className="font-medium text-sm">System Info</p>
              </div>
              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>OS Name</span>
                  <span className="text-white">Nebulabs OS 2</span>
                </div>
                <div className="flex justify-between">
                  <span>Version</span>
                  <span className="text-white">2.0.4-stable</span>
                </div>
                <div className="flex justify-between">
                  <span>Kernel</span>
                  <span className="text-white">v6.12.0-neb</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <Info size={14} />
            <p>Nebulabs OS 2 is a product of Nebulabs Corp. All rights reserved.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
