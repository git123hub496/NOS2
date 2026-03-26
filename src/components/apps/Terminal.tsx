import React, { useState, useRef, useEffect } from 'react';

const Terminal: React.FC = () => {
  const [history, setHistory] = useState<string[]>(["Nebulabs OS 2 Terminal [Version 2.0.4]", "Type 'help' for a list of commands.", ""]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    const newHistory = [...history, `nebulabs@user:~$ ${input}`];

    switch (cmd) {
      case 'help':
        newHistory.push("Available commands: help, clear, date, whoami, version, neofetch, echo [text]");
        break;
      case 'clear':
        setHistory([]);
        setInput("");
        return;
      case 'date':
        newHistory.push(new Date().toString());
        break;
      case 'whoami':
        newHistory.push("nebulabs_user");
        break;
      case 'version':
        newHistory.push("Nebulabs OS 2 (v2.0.4-stable)");
        break;
      case 'neofetch':
        newHistory.push(
          "  _   _      _             _       _ ",
          " | \\ | | ___| |__  _   _  | | __ _| |__  ___ ",
          " |  \\| |/ _ \\ '_ \\| | | | | |/ _` | '_ \\/ __|",
          " | |\\  |  __/ |_) | |_| | | | (_| | |_) \\__ \\",
          " |_| \\_|\\___|_.__/ \\__,_| |_|\\__,_|_.__/|___/",
          " --------------------------------------------",
          " OS: Nebulabs OS 2 x86_64",
          " Host: Web Browser",
          " Kernel: 6.12.0-neb",
          " Shell: neb-sh 1.0",
          " Resolution: 1920x1080",
          " DE: Nebu-Desktop",
          " WM: Nebu-WM",
          " CPU: Virtual Core (4) @ 4.2GHz",
          " Memory: 64GB / 128GB"
        );
        break;
      default:
        if (cmd.startsWith('echo ')) {
          newHistory.push(input.substring(5));
        } else {
          newHistory.push(`Command not found: ${cmd}`);
        }
    }

    setHistory(newHistory);
    setInput("");
  };

  return (
    <div 
      className="h-full bg-[#0c0c0c] font-mono p-4 overflow-auto"
      style={{ color: 'var(--os-accent)' }}
      ref={scrollRef}
      onClick={() => document.getElementById('terminal-input')?.focus()}
    >
      {history.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap mb-1">{line}</div>
      ))}
      <form onSubmit={handleCommand} className="flex">
        <span className="mr-2" style={{ color: 'var(--os-accent)' }}>nebulabs@user:~$</span>
        <input
          id="terminal-input"
          autoFocus
          className="flex-1 bg-transparent border-none outline-none"
          style={{ color: 'var(--os-accent)' }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  );
};

export default Terminal;
