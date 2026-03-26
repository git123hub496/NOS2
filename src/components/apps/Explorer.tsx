import React, { useState, useEffect, useRef } from 'react';
import { Folder, File, ChevronRight, Search, HardDrive, Download, Upload, Clock, Star, Plus, Trash2, Monitor } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, Timestamp, query, orderBy } from 'firebase/firestore';
import { useOSStore } from '../../store';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size: string;
  date: string;
  ownerId: string;
  content?: string;
}

const Explorer: React.FC = () => {
  const { user } = useOSStore();
  const [currentPath, setCurrentPath] = useState("C:\\Users\\Nebulabs\\Documents");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (!user) return;

    // Skip Firestore for local/guest users to avoid permission errors
    if (user.isLocal) {
      setFiles([
        {
          id: 'welcome',
          name: 'Welcome to Nebulabs.txt',
          type: 'file',
          size: '1 KB',
          date: new Date().toISOString().split('T')[0],
          ownerId: user.uid,
          content: 'Welcome to Nebulabs OS 2! You are currently logged in as a Guest. To sync your files across devices, please sign in with a Nebula Account.'
        }
      ]);
      setIsLoading(false);
      return;
    }

    const path = `users/${user.uid}/files`;
    const q = query(collection(db, path), orderBy('type', 'desc'), orderBy('name', 'asc'));
    
    const unsubscribe = onSnapshot(collection(db, path), (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FileItem[];
      setFiles(items);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [user]);

  const createFile = async (type: 'file' | 'folder') => {
    if (!user) return;
    const name = type === 'file' ? 'New File.txt' : 'New Folder';

    if (user.isLocal) {
      const newFile: FileItem = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        type,
        ownerId: user.uid,
        size: type === 'file' ? '0 KB' : '--',
        content: type === 'file' ? 'This is a new text file created in Nebulabs OS.' : '',
        date: new Date().toISOString().split('T')[0]
      };
      setFiles(prev => [...prev, newFile]);
      return;
    }

    const path = `users/${user.uid}/files`;
    
    try {
      await addDoc(collection(db, path), {
        name,
        type,
        ownerId: user.uid,
        size: type === 'file' ? '0 KB' : '--',
        content: type === 'file' ? 'This is a new text file created in Nebulabs OS.' : '',
        updatedAt: Timestamp.now(),
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const deleteFile = async (id: string) => {
    if (!user) return;

    if (user.isLocal) {
      setFiles(prev => prev.filter(f => f.id !== id));
      if (selectedFile?.id === id) setSelectedFile(null);
      return;
    }

    const path = `users/${user.uid}/files/${id}`;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/files`, id));
      if (selectedFile?.id === id) setSelectedFile(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    uploadFile(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const uploadFile = async (file: File) => {
    if (!user) return;

    if (file.size > 1024 * 1024) {
      alert("File is too large. Maximum size is 1MB for Nebulabs Cloud storage.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;

      if (user.isLocal) {
        const newFile: FileItem = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: 'file',
          ownerId: user.uid,
          size: `${Math.round(file.size / 1024)} KB`,
          content: content,
          date: new Date().toISOString().split('T')[0]
        };
        setFiles(prev => [...prev, newFile]);
        return;
      }

      const path = `users/${user.uid}/files`;
      
      try {
        await addDoc(collection(db, path), {
          name: file.name,
          type: 'file',
          ownerId: user.uid,
          size: `${Math.round(file.size / 1024)} KB`,
          content: content,
          updatedAt: Timestamp.now(),
          date: new Date().toISOString().split('T')[0]
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }
    };

    if (file.type.startsWith('image/')) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const renderPreview = () => {
    if (!selectedFile) return (
      <div className="h-full flex flex-col items-center justify-center text-gray-600 text-xs gap-2">
        <File size={32} className="opacity-20" />
        <p>Select a file to preview</p>
      </div>
    );

    if (selectedFile.type === 'folder') return (
      <div className="h-full flex flex-col items-center justify-center text-gray-600 text-xs gap-2">
        <Folder size={32} className="opacity-20" />
        <p>Folders cannot be previewed</p>
      </div>
    );

    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(selectedFile.name);
    
    return (
      <div className="h-full flex flex-col p-4 overflow-auto">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center">
            {isImage ? <Star size={20} className="text-purple-400" /> : <File size={20} style={{ color: 'var(--os-accent)' }} />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white truncate w-40" title={selectedFile.name}>{selectedFile.name}</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{selectedFile.size} • {selectedFile.date}</p>
          </div>
        </div>

        <div className="flex-1 bg-white/5 rounded-lg border border-white/10 overflow-hidden flex flex-col">
          <div className="px-3 py-2 border-b border-white/10 bg-white/5 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
            Content Preview
          </div>
          <div className="flex-1 p-4 overflow-auto">
            {isImage ? (
              <div className="h-full flex items-center justify-center">
                <img 
                  src={selectedFile.content || 'https://picsum.photos/seed/file/400/300'} 
                  alt={selectedFile.name}
                  className="max-w-full max-h-full object-contain rounded"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <pre className="text-[11px] text-gray-400 font-mono whitespace-pre-wrap leading-relaxed">
                {selectedFile.content || 'No content available.'}
              </pre>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] text-white font-sans">
      {/* Toolbar */}
      <div className="h-12 border-b border-white/5 flex items-center px-4 gap-4">
        <div className="flex items-center gap-2 text-gray-400">
          <button className="p-1 hover:bg-white/10 rounded"><ChevronRight className="rotate-180" size={16} /></button>
          <button className="p-1 hover:bg-white/10 rounded"><ChevronRight size={16} /></button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <button onClick={() => createFile('folder')} className="p-1 hover:bg-white/10 rounded" title="New Folder"><Plus size={16} /></button>
          <button onClick={() => createFile('file')} className="p-1 hover:bg-white/10 rounded" title="New File"><File size={14} /></button>
          <button onClick={() => fileInputRef.current?.click()} className="p-1 hover:bg-white/10 rounded" title="Upload File"><Upload size={16} /></button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
        </div>
        <div className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-1 text-xs text-gray-400 flex items-center gap-2">
          <HardDrive size={14} />
          <span>{currentPath}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowPreview(!showPreview)}
            className="p-1.5 rounded transition-colors"
            style={{ 
              backgroundColor: showPreview ? 'var(--os-accent)' : 'transparent',
              color: showPreview ? 'white' : '#9ca3af'
            }}
            title="Toggle Preview Pane"
          >
            <Monitor size={16} />
          </button>
          <div className="relative w-48">
            <Search className="absolute left-2 top-1.5 text-gray-500" size={14} />
            <input 
              className="w-full bg-white/5 border border-white/10 rounded py-1 pl-8 pr-2 text-xs outline-none focus:ring-1"
              style={{ boxShadow: '0 0 0 1px var(--os-accent)' }}
              placeholder="Search Documents"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 border-r border-white/5 p-2 space-y-1 overflow-auto">
          <button className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 text-xs text-gray-300">
            <Star size={14} className="text-yellow-500" /> Quick Access
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 text-xs text-gray-300">
            <Clock size={14} style={{ color: 'var(--os-accent)' }} /> Recent
          </button>
          <button 
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: 'var(--os-accent-glow)', color: 'var(--os-accent)' }}
          >
            <Folder size={14} /> Documents
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 text-xs text-gray-300">
            <Download size={14} className="text-green-500" /> Downloads
          </button>
          <div className="h-px bg-white/5 my-2" />
          <button className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 text-xs text-gray-300">
            <HardDrive size={14} /> This PC
          </button>
        </div>

        {/* File List */}
        <div 
          className={`flex-1 overflow-auto p-4 transition-colors ${isDragging ? 'bg-white/5' : ''}`}
          style={{ backgroundColor: isDragging ? 'var(--os-accent-glow)' : undefined }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-gray-500 text-xs">
              Loading file system...
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-xs gap-4">
              <Folder size={48} className="opacity-10" />
              <p>This folder is empty.</p>
              <button 
                onClick={() => createFile('file')}
                className="px-4 py-2 text-white rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--os-accent)' }}
              >
                Create your first file
              </button>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-500 border-b border-white/5">
                  <th className="font-medium pb-2 px-2">Name</th>
                  <th className="font-medium pb-2 px-2">Date Modified</th>
                  <th className="font-medium pb-2 px-2">Type</th>
                  <th className="font-medium pb-2 px-2">Size</th>
                  <th className="font-medium pb-2 px-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr 
                    key={file.id} 
                    onClick={() => setSelectedFile(file)}
                    className="hover:bg-white/5 group cursor-default"
                    style={{ backgroundColor: selectedFile?.id === file.id ? 'var(--os-accent-glow)' : undefined }}
                  >
                    <td className="py-2 px-2 flex items-center gap-3">
                      {file.type === 'folder' ? <Folder size={18} className="text-yellow-500" /> : <File size={18} className="text-gray-400" />}
                      <span className="text-gray-200">{file.name}</span>
                    </td>
                    <td className="py-2 px-2 text-gray-500">{file.date}</td>
                    <td className="py-2 px-2 text-gray-500">{file.type === 'folder' ? 'File Folder' : 'Text Document'}</td>
                    <td className="py-2 px-2 text-gray-500">{file.size}</td>
                    <td className="py-2 px-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteFile(file.id); }}
                        className="p-1 hover:bg-red-500/20 text-gray-600 hover:text-red-500 rounded opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Preview Pane */}
        {showPreview && (
          <div className="w-80 border-l border-white/5 bg-white/[0.02] overflow-hidden">
            {renderPreview()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explorer;
