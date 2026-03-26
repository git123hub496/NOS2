import React, { useEffect } from 'react';
import { Globe } from 'lucide-react';

const NebulaBrowser: React.FC = () => {
  useEffect(() => {
    const scriptId = 'google-cse-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = "https://cse.google.com/cse.js?cx=30f848a6050ba461f";
      script.async = true;
      document.body.appendChild(script);
    }

    // If the script is already loaded, we might need to tell it to re-render
    if ((window as any).google && (window as any).google.search && (window as any).google.search.cse && (window as any).google.search.cse.element) {
      (window as any).google.search.cse.element.go();
    }

    return () => {
      // We don't necessarily want to remove the script as it might be used again
      // but we should clean up the injected elements if they cause issues
      const cseOverlays = document.querySelectorAll('.gsc-completion-container, .gsc-image-box-v2');
      cseOverlays.forEach(el => el.remove());
    };
  }, []);

  return (
    <div className="h-full flex flex-col bg-white overflow-auto">
      <div className="h-10 bg-gray-100 border-b flex items-center px-4 gap-2 sticky top-0 z-10">
        <div className="flex-1 bg-white rounded border px-3 py-1 text-xs text-gray-600 flex items-center gap-2">
          <Globe size={12} style={{ color: 'var(--os-accent)' }} />
          <span>https://www.google.com/search</span>
        </div>
      </div>
      <div className="flex-1 p-4">
        <div className="gcse-search"></div>
        <div className="mt-20 flex flex-col items-center justify-center text-gray-300 pointer-events-none">
           <Globe size={120} className="opacity-5" />
           <p className="text-sm font-medium mt-4">Nebula Browser Engine</p>
        </div>
      </div>
    </div>
  );
};

export default NebulaBrowser;
