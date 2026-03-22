import React, { useState, useEffect } from 'react';
import { Folder, File, ChevronRight, Search, HardDrive, Download, Clock, Star, Plus, Trash2 } from 'lucide-react';
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
}

const Explorer: React.FC = () => {
  const { user } = useOSStore();
  const [currentPath, setCurrentPath] = useState("C:\\Users\\Nebulabs\\Documents");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!user) return;

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
    const path = `users/${user.uid}/files`;
    
    try {
      await addDoc(collection(db, path), {
        name,
        type,
        ownerId: user.uid,
        size: type === 'file' ? '0 KB' : '--',
        updatedAt: Timestamp.now(),
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const deleteFile = async (id: string) => {
    if (!user) return;
    const path = `users/${user.uid}/files/${id}`;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/files`, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
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
        </div>
        <div className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-1 text-xs text-gray-400 flex items-center gap-2">
          <HardDrive size={14} />
          <span>{currentPath}</span>
        </div>
        <div className="relative w-48">
          <Search className="absolute left-2 top-1.5 text-gray-500" size={14} />
          <input 
            className="w-full bg-white/5 border border-white/10 rounded py-1 pl-8 pr-2 text-xs outline-none focus:border-blue-500/50"
            placeholder="Search Documents"
          />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 border-r border-white/5 p-2 space-y-1 overflow-auto">
          <button className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 text-xs text-gray-300">
            <Star size={14} className="text-yellow-500" /> Quick Access
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 text-xs text-gray-300">
            <Clock size={14} className="text-blue-400" /> Recent
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400">
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
        <div className="flex-1 overflow-auto p-4">
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
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
                  <tr key={file.id} className="hover:bg-white/5 group cursor-default">
                    <td className="py-2 px-2 flex items-center gap-3">
                      {file.type === 'folder' ? <Folder size={18} className="text-yellow-500" /> : <File size={18} className="text-gray-400" />}
                      <span className="text-gray-200">{file.name}</span>
                    </td>
                    <td className="py-2 px-2 text-gray-500">{file.date}</td>
                    <td className="py-2 px-2 text-gray-500">{file.type === 'folder' ? 'File Folder' : 'Text Document'}</td>
                    <td className="py-2 px-2 text-gray-500">{file.size}</td>
                    <td className="py-2 px-2">
                      <button 
                        onClick={() => deleteFile(file.id)}
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
      </div>
    </div>
  );
};

export default Explorer;
