import React, { useState } from 'react';
import { FileText, Save, Share2, Type, AlignLeft, AlignCenter, AlignRight, Bold, Italic } from 'lucide-react';

const NebulaDocs: React.FC = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Untitled Document");

  return (
    <div className="h-full flex flex-col bg-white text-black font-sans">
      {/* Ribbon */}
      <div className="bg-[#f3f3f3] border-b border-gray-300 p-2 flex flex-col gap-2">
        <div className="flex items-center gap-4 px-2">
          <FileText style={{ color: 'var(--os-accent)' }} size={20} />
          <input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent border-none outline-none font-medium text-sm hover:bg-gray-200 px-2 py-1 rounded transition-colors"
          />
        </div>
        <div className="flex items-center gap-1 px-2">
          <button className="p-1.5 hover:bg-gray-200 rounded text-xs flex items-center gap-1">File</button>
          <button className="p-1.5 hover:bg-gray-200 rounded text-xs flex items-center gap-1">Edit</button>
          <button className="p-1.5 hover:bg-gray-200 rounded text-xs flex items-center gap-1">View</button>
          <button className="p-1.5 hover:bg-gray-200 rounded text-xs flex items-center gap-1">Insert</button>
          <div className="w-px h-4 bg-gray-300 mx-1" />
          <button className="p-1.5 hover:bg-gray-200 rounded"><Bold size={14} /></button>
          <button className="p-1.5 hover:bg-gray-200 rounded"><Italic size={14} /></button>
          <div className="w-px h-4 bg-gray-300 mx-1" />
          <button className="p-1.5 hover:bg-gray-200 rounded"><AlignLeft size={14} /></button>
          <button className="p-1.5 hover:bg-gray-200 rounded"><AlignCenter size={14} /></button>
          <button className="p-1.5 hover:bg-gray-200 rounded"><AlignRight size={14} /></button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 bg-[#e8e8e8] overflow-auto p-8 flex justify-center">
        <div className="w-[816px] min-h-[1056px] bg-white shadow-lg p-16 outline-none" contentEditable>
          <p className="text-gray-400">Start typing your masterpiece...</p>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 text-white text-[10px] flex items-center px-4 justify-between" style={{ backgroundColor: 'var(--os-accent)' }}>
        <span>Page 1 of 1</span>
        <span>0 words</span>
      </div>
    </div>
  );
};

export default NebulaDocs;
