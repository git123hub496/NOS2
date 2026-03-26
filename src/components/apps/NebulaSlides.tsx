import React, { useState } from 'react';
import { Presentation, Play, Plus, Layout, Image, Type, ChevronLeft, ChevronRight } from 'lucide-react';

const NebulaSlides: React.FC = () => {
  const [slides, setSlides] = useState([{ id: 1, title: "Click to add title", subtitle: "Click to add subtitle" }]);
  const [activeSlide, setActiveSlide] = useState(0);

  const addSlide = () => {
    setSlides([...slides, { id: slides.length + 1, title: "New Slide", subtitle: "Add content here" }]);
    setActiveSlide(slides.length);
  };

  return (
    <div className="h-full flex flex-col bg-[#202124] text-white font-sans">
      {/* Ribbon */}
      <div className="bg-[#3c4043] border-b border-gray-600 p-2 flex flex-col gap-2">
        <div className="flex items-center gap-4 px-2">
          <Presentation style={{ color: 'var(--os-accent)' }} size={20} />
          <input 
            defaultValue="Untitled Presentation"
            className="bg-transparent border-none outline-none font-medium text-sm hover:bg-gray-600 px-2 py-1 rounded transition-colors"
          />
          <div className="flex-1" />
          <button 
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-colors text-white"
            style={{ backgroundColor: 'var(--os-accent)' }}
          >
            <Play size={14} /> Slideshow
          </button>
        </div>
        <div className="flex items-center gap-1 px-2">
          <button className="p-1.5 hover:bg-gray-600 rounded text-xs">File</button>
          <button className="p-1.5 hover:bg-gray-600 rounded text-xs">Edit</button>
          <button className="p-1.5 hover:bg-gray-600 rounded text-xs">View</button>
          <button className="p-1.5 hover:bg-gray-600 rounded text-xs">Insert</button>
          <div className="w-px h-4 bg-gray-600 mx-1" />
          <button onClick={addSlide} className="p-1.5 hover:bg-gray-600 rounded"><Plus size={16} /></button>
          <button className="p-1.5 hover:bg-gray-600 rounded"><Layout size={16} /></button>
          <button className="p-1.5 hover:bg-gray-600 rounded"><Image size={16} /></button>
          <button className="p-1.5 hover:bg-gray-600 rounded"><Type size={16} /></button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 border-r border-gray-600 p-2 space-y-2 overflow-auto bg-[#202124]">
          {slides.map((slide, i) => (
            <button 
              key={slide.id}
              onClick={() => setActiveSlide(i)}
              className={`w-full aspect-video rounded border-2 transition-all p-2 text-left overflow-hidden ${activeSlide === i ? 'bg-white/5' : 'border-gray-600 hover:border-gray-400'}`}
              style={{ borderColor: activeSlide === i ? 'var(--os-accent)' : undefined }}
            >
              <div className="text-[6px] font-bold text-gray-400 mb-1">Slide {i + 1}</div>
              <div className="text-[8px] font-bold truncate">{slide.title}</div>
              <div className="text-[6px] text-gray-500 truncate">{slide.subtitle}</div>
            </button>
          ))}
          <button 
            onClick={addSlide}
            className="w-full aspect-video rounded border-2 border-dashed border-gray-600 hover:border-gray-400 flex flex-col items-center justify-center gap-1 text-gray-500"
          >
            <Plus size={16} />
            <span className="text-[8px]">New Slide</span>
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 bg-[#202124] overflow-auto p-12 flex justify-center items-center">
          <div className="w-[800px] aspect-video bg-white shadow-2xl flex flex-col items-center justify-center p-16 text-black text-center">
            <h1 className="text-5xl font-bold mb-4 outline-none" contentEditable>{slides[activeSlide]?.title}</h1>
            <p className="text-xl text-gray-500 outline-none" contentEditable>{slides[activeSlide]?.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="h-6 bg-[#3c4043] text-gray-400 text-[10px] flex items-center px-4 justify-between">
        <span>Slide {activeSlide + 1} of {slides.length}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}><ChevronLeft size={14} /></button>
          <button onClick={() => setActiveSlide(Math.min(slides.length - 1, activeSlide + 1))}><ChevronRight size={14} /></button>
        </div>
      </div>
    </div>
  );
};

export default NebulaSlides;
