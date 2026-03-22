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
import { FileText, Globe, Terminal as TerminalIcon, Sparkles, Settings as SettingsIcon, Presentation, Activity } from 'lucide-react';

const Desktop: React.FC = () => {
  const { wallpaper, openApp, isLiteMode } = useOSStore();

  const desktopIcons = [
    { id: 'explorer', name: 'File Explorer', icon: <FileText size={32} />, color: 'text-yellow-500' },
    { id: 'browser', name: 'Web Browser', icon: <Globe size={32} />, color: 'text-blue-400' },
    { id: 'terminal', name: 'Terminal', icon: <TerminalIcon size={32} />, color: 'text-green-500' },
    { id: 'ai', name: 'Nebulabs AI', icon: <Sparkles size={32} />, color: 'text-purple-500' },
    { id: 'docs', name: 'NebulaDocs', icon: <FileText size={32} />, color: 'text-blue-600' },
    { id: 'slides', name: 'NebulaSlides', icon: <Presentation size={32} />, color: 'text-orange-500' },
    { id: 'process-manager', name: 'Process Manager', icon: <Activity size={32} />, color: 'text-red-500' },
    { id: 'settings', name: 'Settings', icon: <SettingsIcon size={32} />, color: 'text-blue-500' },
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
      <Window id="browser" title="Web Browser">
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
