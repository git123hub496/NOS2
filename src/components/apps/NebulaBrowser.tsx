import React, { useState, useEffect } from 'react';
import { Globe, ArrowLeft, ArrowRight, RotateCw, Home, Search } from 'lucide-react';
import { useOSStore } from '../../store';

const NebulaBrowser: React.FC = () => {
  const { searchQuery, setSearchQuery, browserUrl, setBrowserUrl } = useOSStore();
  const [urlInput, setUrlInput] = useState(browserUrl);

  useEffect(() => {
    setUrlInput(browserUrl);
  }, [browserUrl]);

  useEffect(() => {
    if (searchQuery) {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&igu=1`;
      setBrowserUrl(searchUrl);
      setSearchQuery(''); // Clear after use
    }
  }, [searchQuery, setSearchQuery, setBrowserUrl]);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let targetUrl = urlInput;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      if (targetUrl.includes('.') && !targetUrl.includes(' ')) {
        targetUrl = `https://${targetUrl}`;
      } else {
        targetUrl = `https://www.google.com/search?q=${encodeURIComponent(targetUrl)}&igu=1`;
      }
    }
    setBrowserUrl(targetUrl);
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Browser Toolbar */}
      <div className="h-12 bg-[#f1f3f4] border-b flex items-center px-4 gap-4 shrink-0">
        <div className="flex items-center gap-2 text-gray-600">
          <button className="p-1.5 rounded-full hover:bg-black/5 transition-colors">
            <ArrowLeft size={16} />
          </button>
          <button className="p-1.5 rounded-full hover:bg-black/5 transition-colors">
            <ArrowRight size={16} />
          </button>
          <button 
            onClick={() => {
              const current = browserUrl;
              setBrowserUrl('');
              setTimeout(() => setBrowserUrl(current), 10);
            }}
            className="p-1.5 rounded-full hover:bg-black/5 transition-colors"
          >
            <RotateCw size={16} />
          </button>
          <button 
            onClick={() => setBrowserUrl('https://www.google.com/search?igu=1')}
            className="p-1.5 rounded-full hover:bg-black/5 transition-colors"
          >
            <Home size={16} />
          </button>
        </div>

        <form onSubmit={handleNavigate} className="flex-1 flex items-center bg-white rounded-full border border-gray-300 px-4 py-1.5 gap-3 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all shadow-sm">
          <Globe size={14} className="text-gray-400" />
          <input 
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 text-sm text-gray-800 outline-none bg-transparent"
            placeholder="Search Google or type a URL"
          />
          <Search size={14} className="text-gray-400" />
        </form>
      </div>

      {/* Browser Content */}
      <div className="flex-1 bg-white relative">
        {browserUrl ? (
          <iframe 
            src={browserUrl}
            className="w-full h-full border-none"
            title="Nebula Browser Content"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Globe size={32} className="text-blue-600 animate-pulse" />
            </div>
            <p className="text-sm text-gray-500 font-medium">Loading Nebula Browser Engine...</p>
          </div>
        )}
      </div>

      {/* Browser Status Bar */}
      <div className="h-6 bg-[#f1f3f4] border-t flex items-center px-3 text-[10px] text-gray-500 shrink-0">
        <span className="truncate">Safe Browsing: Active • Nebula Engine 2.0</span>
      </div>
    </div>
  );
};

export default NebulaBrowser;
