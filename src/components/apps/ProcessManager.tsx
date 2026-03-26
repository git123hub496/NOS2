import React from 'react';
import { Cpu, Zap, Trash2, Clock, HardDrive, Activity } from 'lucide-react';
import { useOSStore } from '../../store';

const ProcessManager: React.FC = () => {
  const { processes, totalMemory, killProcess } = useOSStore();

  const usedMemory = processes.reduce((acc, p) => acc + p.memoryUsage, 0);
  const memoryPercent = Math.round((usedMemory / totalMemory) * 100);

  return (
    <div className="h-full flex flex-col bg-[#0f172a] text-white font-sans">
      {/* Header */}
      <div className="p-6 bg-black/20 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity style={{ color: 'var(--os-accent)' }} size={24} />
          <div>
            <h2 className="text-xl font-semibold">Nebulabs Process Manager</h2>
            <p className="text-xs text-gray-500">System Performance & Resource Allocation</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">CPU Usage</span>
            <span className="text-lg font-mono text-green-500">12%</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Memory</span>
            <span className="text-lg font-mono text-blue-500">{memoryPercent}%</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 p-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Cpu style={{ color: 'var(--os-accent)' }} size={18} />
            <span className="text-xs font-medium text-gray-300">Processor</span>
          </div>
          <p className="text-lg font-mono">Quantum Core x86</p>
          <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full w-[12%]" style={{ backgroundColor: 'var(--os-accent)' }} />
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="text-yellow-400" size={18} />
            <span className="text-xs font-medium text-gray-300">Memory</span>
          </div>
          <p className="text-lg font-mono">{usedMemory}MB / {totalMemory}MB</p>
          <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-500 w-[2%]" />
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <HardDrive className="text-green-400" size={18} />
            <span className="text-xs font-medium text-gray-300">Disk</span>
          </div>
          <p className="text-lg font-mono">2.4GB / 128GB</p>
          <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 w-[2%]" />
          </div>
        </div>
      </div>

      {/* Process List */}
      <div className="flex-1 overflow-auto p-6 pt-0">
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Active Processes</h3>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-gray-500 border-b border-white/5">
              <th className="font-medium pb-2 px-2">Process Name</th>
              <th className="font-medium pb-2 px-2">Memory Usage</th>
              <th className="font-medium pb-2 px-2">Status</th>
              <th className="font-medium pb-2 px-2">Uptime</th>
              <th className="font-medium pb-2 px-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {processes.map((p) => (
              <tr key={p.id} className="hover:bg-white/5 group transition-colors">
                <td className="py-3 px-2 flex items-center gap-3">
                  <div 
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: 'var(--os-accent)' }}
                  />
                  <span className="text-gray-200 font-medium">{p.name}</span>
                </td>
                <td className="py-3 px-2 font-mono text-blue-400">{p.memoryUsage} MB</td>
                <td className="py-3 px-2">
                  <span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full text-[10px] font-bold uppercase">Running</span>
                </td>
                <td className="py-3 px-2 text-gray-500 flex items-center gap-2">
                  <Clock size={12} />
                  {Math.floor((Date.now() - p.startTime) / 1000)}s
                </td>
                <td className="py-3 px-2">
                  <button 
                    onClick={() => killProcess(p.id)}
                    className="p-1.5 hover:bg-red-500/20 text-gray-600 hover:text-red-500 rounded transition-all opacity-0 group-hover:opacity-100"
                    title="End Task"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProcessManager;
