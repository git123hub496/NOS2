import { create } from 'zustand';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export type AppId = 'explorer' | 'settings' | 'terminal' | 'browser' | 'ai' | 'notepad' | 'docs' | 'slides' | 'process-manager' | 'search' | 'store' | 'pay' | 'health' | 'phone' | 'recycle-bin' | 'mail' | 'maps' | 'calendar' | 'calculator' | 'shop' | 'themes' | 'games' | 'minesweeper' | 'update' | 'chat' | 'info' | 'camera' | 'tv' | 'sticky-notes' | 'fonts' | 'car';
export type TaskbarPosition = 'bottom' | 'left' | 'right' | 'top';

export interface Process {
  id: string;
  appId: AppId;
  name: string;
  memoryUsage: number; // in MB
  startTime: number;
}

export interface WindowState {
  id: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isLocal?: boolean;
}

export interface Network {
  id: string;
  name: string;
  signal: number;
  isSecure: boolean;
}

interface OSStore {
  isBooted: boolean;
  isLoggedIn: boolean;
  isAuthReady: boolean;
  isSetupComplete: boolean;
  user: User | null;
  isLiteMode: boolean;
  wallpaper: string;
  accentColor: string;
  fontStyle: string;
  windows: WindowState[];
  activeWindowId: AppId | null;
  
  // New System Services State
  processes: Process[];
  totalMemory: number; // 65536 MB
  isGrayscale: boolean;
  isInverted: boolean;
  isQuickSettingsOpen: boolean;
  isWidgetsOpen: boolean;
  isChatOpen: boolean;
  
  // Theme & Transparency
  isDarkMode: boolean;
  taskbarTransparency: number;
  windowTransparency: number;
  isTaskbarAutohide: boolean;
  
  // Cursor Scale & Color
  cursorScale: number;
  cursorColor: string;
  
  // System Update
  isUpdating: boolean;
  updateProgress: number;
  updateStatus: string;
  
  // Taskbar & Customization
  taskbarPosition: TaskbarPosition;
  pinnedAppIds: AppId[];
  pinnedStartAppIds: AppId[];
  isRestarting: boolean;
  isShutDown: boolean;
  searchQuery: string;
  browserUrl: string;

  // New Hardware States
  volume: number;
  selectedNetwork: string;
  networks: Network[];
  savedUsers: User[];

  boot: () => void;
  setAuthReady: (ready: boolean) => void;
  setUser: (user: User | null) => void;
  loginLocal: (username: string) => void;
  setLiteMode: (enabled: boolean) => void;
  setWallpaper: (url: string) => void;
  setProfilePicture: (url: string) => void;
  setAccentColor: (color: string) => void;
  setFontStyle: (font: string) => void;
  setSetupComplete: (complete: boolean) => void;
  
  // App Management
  openApp: (id: AppId, title: string) => void;
  closeApp: (id: AppId) => void;
  minimizeApp: (id: AppId) => void;
  maximizeApp: (id: AppId) => void;
  focusApp: (id: AppId) => void;
  
  // System Actions
  toggleGrayscale: () => void;
  toggleInvert: () => void;
  toggleQuickSettings: () => void;
  toggleWidgets: () => void;
  toggleChat: () => void;
  factoryReset: () => Promise<void>;
  killProcess: (processId: string) => void;
  setTaskbarPosition: (pos: TaskbarPosition) => void;
  togglePinApp: (id: AppId) => void;
  togglePinStartApp: (id: AppId) => void;
  restart: () => void;
  powerOff: () => void;
  setVolume: (v: number) => void;
  setDarkMode: (enabled: boolean) => void;
  setTaskbarTransparency: (v: number) => void;
  setWindowTransparency: (v: number) => void;
  setTaskbarAutohide: (enabled: boolean) => void;
  setCursorScale: (scale: number) => void;
  setCursorColor: (color: string) => void;
  startUpdate: () => void;
  setNetwork: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setBrowserUrl: (url: string) => void;
  addSavedUser: (user: User) => void;
  removeSavedUser: (uid: string) => void;
  
  syncSettings: () => Promise<void>;
}

export const useOSStore = create<OSStore>((set, get) => ({
  isBooted: false,
  isLoggedIn: false,
  isAuthReady: false,
  isSetupComplete: false,
  user: null,
  isLiteMode: false,
  wallpaper: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
  accentColor: '#3b82f6',
  fontStyle: 'sans',
  windows: [],
  activeWindowId: null,
  
  processes: [],
  totalMemory: 65536,
  isGrayscale: false,
  isInverted: false,
  isQuickSettingsOpen: false,
  isWidgetsOpen: false,
  isChatOpen: false,

  isDarkMode: true,
  taskbarTransparency: 80,
  windowTransparency: 80,
  isTaskbarAutohide: false,

  cursorScale: 1,
  cursorColor: 'white',
  isUpdating: false,
  updateProgress: 0,
  updateStatus: 'System is up to date',

  taskbarPosition: 'bottom',
  pinnedAppIds: ['explorer', 'browser', 'terminal', 'ai'],
  pinnedStartAppIds: ['store', 'explorer', 'settings', 'ai', 'notepad', 'calculator', 'browser', 'recycle-bin', 'mail', 'maps', 'process-manager', 'calendar'],
  isRestarting: false,
  isShutDown: false,
  searchQuery: '',
  browserUrl: 'https://www.google.com/search?igu=1',

  volume: 80,
  selectedNetwork: 'Nebula_5G',
  networks: [
    { id: '1', name: 'Nebula_5G', signal: 4, isSecure: true },
    { id: '2', name: 'Starlink_Guest', signal: 3, isSecure: false },
    { id: '3', name: 'Void_Net', signal: 2, isSecure: true },
    { id: '4', name: 'Quantum_Link', signal: 1, isSecure: true },
  ],
  savedUsers: JSON.parse(localStorage.getItem('nebula_saved_users') || '[]'),

  boot: () => set({ isBooted: true, isRestarting: false, isShutDown: false }),
  setAuthReady: (ready) => set({ isAuthReady: ready }),
  setUser: (user) => {
    set({ user, isLoggedIn: !!user });
    if (user) {
      get().addSavedUser(user);
    }
  },
  loginLocal: (username) => {
    const localUser: User = {
      uid: `local-${username.toLowerCase().replace(/\s+/g, '-')}`,
      email: null,
      displayName: username,
      photoURL: null,
      isLocal: true
    };
    set({ user: localUser, isLoggedIn: true, isAuthReady: true });
    get().addSavedUser(localUser);
  },
  addSavedUser: (user) => {
    const { savedUsers } = get();
    const exists = savedUsers.find(u => u.uid === user.uid);
    if (!exists) {
      const newSaved = [...savedUsers, user];
      set({ savedUsers: newSaved });
      localStorage.setItem('nebula_saved_users', JSON.stringify(newSaved));
    } else {
      // Update existing user info (e.g. photoURL might have changed)
      const newSaved = savedUsers.map(u => u.uid === user.uid ? user : u);
      set({ savedUsers: newSaved });
      localStorage.setItem('nebula_saved_users', JSON.stringify(newSaved));
    }
  },
  removeSavedUser: (uid) => {
    const newSaved = get().savedUsers.filter(u => u.uid !== uid);
    set({ savedUsers: newSaved });
    localStorage.setItem('nebula_saved_users', JSON.stringify(newSaved));
  },
  setSetupComplete: async (complete) => {
    set({ isSetupComplete: complete });
    const { user } = get();
    if (user && !user.isLocal) {
      const path = `users/${user.uid}`;
      try {
        await updateDoc(doc(db, path), { isSetupComplete: complete });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    }
  },
  
  toggleGrayscale: () => set(state => ({ isGrayscale: !state.isGrayscale })),
  toggleInvert: () => set(state => ({ isInverted: !state.isInverted })),
  toggleQuickSettings: () => set(state => ({ 
    isQuickSettingsOpen: !state.isQuickSettingsOpen,
    isWidgetsOpen: false,
    isChatOpen: false
  })),
  toggleWidgets: () => set(state => ({ 
    isWidgetsOpen: !state.isWidgetsOpen,
    isChatOpen: false,
    isQuickSettingsOpen: false
  })),
  toggleChat: () => set(state => ({ 
    isChatOpen: !state.isChatOpen,
    isWidgetsOpen: false,
    isQuickSettingsOpen: false
  })),

  setVolume: (v) => set({ volume: v }),
  setDarkMode: (enabled) => set({ isDarkMode: enabled }),
  setTaskbarAutohide: (enabled) => set({ isTaskbarAutohide: enabled }),
  setTaskbarTransparency: (v) => set({ taskbarTransparency: v }),
  setWindowTransparency: (v) => set({ windowTransparency: v }),
  setCursorScale: (scale) => set({ cursorScale: Math.max(0.5, Math.min(4, scale)) }),
  setCursorColor: (color) => set({ cursorColor: color }),

  startUpdate: () => {
    const { isUpdating } = get();
    if (isUpdating) return;

    set({ isUpdating: true, updateProgress: 0, updateStatus: 'Downloading Nebula OS 2.1...' });
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        set({ updateProgress: 100, updateStatus: 'Update complete. Restarting...' });
        setTimeout(() => {
          get().restart();
          set({ isUpdating: false, updateProgress: 0, updateStatus: 'System is up to date' });
        }, 2000);
      } else {
        set({ 
          updateProgress: progress, 
          updateStatus: progress > 70 ? 'Installing components...' : (progress > 40 ? 'Verifying files...' : 'Downloading Nebula OS 2.1...') 
        });
      }
    }, 200);
  },

  setNetwork: (id) => set({ selectedNetwork: get().networks.find(n => n.id === id)?.name || 'Disconnected' }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setBrowserUrl: (url) => set({ browserUrl: url }),

  setTaskbarPosition: async (pos) => {
    set({ taskbarPosition: pos });
    const { user } = get();
    if (user) {
      const path = `users/${user.uid}`;
      try {
        await updateDoc(doc(db, path), { taskbarPosition: pos });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    }
  },

  togglePinApp: async (id) => {
    const { pinnedAppIds, user } = get();
    const newPinned = pinnedAppIds.includes(id) 
      ? pinnedAppIds.filter(p => p !== id)
      : [...pinnedAppIds, id];
    
    set({ pinnedAppIds: newPinned });
    if (user) {
      const path = `users/${user.uid}`;
      try {
        await updateDoc(doc(db, path), { pinnedAppIds: newPinned });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    }
  },

  togglePinStartApp: async (id) => {
    const { pinnedStartAppIds, user } = get();
    const newPinned = pinnedStartAppIds.includes(id) 
      ? pinnedStartAppIds.filter(p => p !== id)
      : [...pinnedStartAppIds, id];
    
    set({ pinnedStartAppIds: newPinned });
    if (user) {
      const path = `users/${user.uid}`;
      try {
        await updateDoc(doc(db, path), { pinnedStartAppIds: newPinned });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    }
  },

  restart: () => {
    set({ isBooted: false, isRestarting: true, windows: [], processes: [], activeWindowId: null, isQuickSettingsOpen: false });
  },

  powerOff: () => {
    set({ isBooted: false, isShutDown: true, windows: [], processes: [], activeWindowId: null, isQuickSettingsOpen: false });
  },

  killProcess: (processId) => set(state => {
    const process = state.processes.find(p => p.id === processId);
    if (!process) return state;
    return {
      processes: state.processes.filter(p => p.id !== processId),
      windows: state.windows.filter(w => w.id !== process.appId)
    };
  }),

  factoryReset: async () => {
    const { user } = get();
    if (!user) return;
    const path = `users/${user.uid}`;
    try {
      await setDoc(doc(db, path), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        isLiteMode: false,
        isSetupComplete: false,
        wallpaper: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
        accentColor: '#3b82f6',
        fontStyle: 'sans',
        taskbarPosition: 'bottom',
        pinnedAppIds: ['explorer', 'browser', 'terminal', 'ai'],
        createdAt: Timestamp.now()
      });
      set({ isBooted: false, isRestarting: true, isSetupComplete: false });
      window.location.reload();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  setLiteMode: async (enabled) => {
    set({ isLiteMode: enabled });
    const { user } = get();
    if (user) {
      const path = `users/${user.uid}`;
      try {
        await updateDoc(doc(db, path), { isLiteMode: enabled });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    }
  },

  setWallpaper: async (url) => {
    set({ wallpaper: url });
    const { user } = get();
    if (user && !user.isLocal) {
      const path = `users/${user.uid}`;
      try {
        await updateDoc(doc(db, path), { wallpaper: url });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    }
  },

  setProfilePicture: async (url: string) => {
    const { user, savedUsers } = get();
    if (!user) return;

    const updatedUser = { ...user, photoURL: url };
    set({ user: updatedUser });

    // Update saved users list
    const newSaved = savedUsers.map(u => u.uid === user.uid ? updatedUser : u);
    set({ savedUsers: newSaved });
    localStorage.setItem('nebula_saved_users', JSON.stringify(newSaved));

    if (!user.isLocal) {
      const path = `users/${user.uid}`;
      try {
        await updateDoc(doc(db, path), { photoURL: url });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    }
  },

  setAccentColor: async (color) => {
    set({ accentColor: color });
    const { user } = get();
    if (user) {
      const path = `users/${user.uid}`;
      try {
        await updateDoc(doc(db, path), { accentColor: color });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    }
  },

  setFontStyle: async (font) => {
    set({ fontStyle: font });
    const { user } = get();
    if (user) {
      const path = `users/${user.uid}`;
      try {
        await updateDoc(doc(db, path), { fontStyle: font });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    }
  },

  syncSettings: async () => {
    const { user } = get();
    if (!user) return;

    const path = `users/${user.uid}`;
    try {
      const userDoc = await getDoc(doc(db, path));
      if (userDoc.exists()) {
        const data = userDoc.data();
        set({ 
          isLiteMode: data.isLiteMode ?? false,
          isSetupComplete: data.isSetupComplete ?? false,
          wallpaper: data.wallpaper ?? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
          accentColor: data.accentColor ?? '#3b82f6',
          fontStyle: data.fontStyle ?? 'sans',
          taskbarPosition: data.taskbarPosition ?? 'bottom',
          pinnedAppIds: data.pinnedAppIds ?? ['explorer', 'browser', 'terminal', 'ai'],
          pinnedStartAppIds: data.pinnedStartAppIds ?? ['store', 'explorer', 'settings', 'ai', 'notepad', 'calculator', 'browser', 'recycle-bin', 'mail', 'maps', 'process-manager', 'calendar']
        });
      } else {
        // Initialize user document
        await setDoc(doc(db, path), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          isLiteMode: false,
          isSetupComplete: false,
          wallpaper: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
          accentColor: '#3b82f6',
          fontStyle: 'sans',
          taskbarPosition: 'bottom',
          pinnedAppIds: ['explorer', 'browser', 'terminal', 'ai'],
          pinnedStartAppIds: ['store', 'explorer', 'settings', 'ai', 'notepad', 'calculator', 'browser', 'recycle-bin', 'mail', 'maps', 'process-manager', 'calendar'],
          createdAt: Timestamp.now()
        });
        set({ isSetupComplete: false });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },
  
  openApp: (id, title) => set((state) => {
    const existing = state.windows.find(w => w.id === id);
    
    // Process Management: Add process if not exists
    const existingProcess = state.processes.find(p => p.appId === id);
    let newProcesses = state.processes;
    if (!existingProcess) {
      newProcesses = [...state.processes, {
        id: Math.random().toString(36).substr(2, 9),
        appId: id,
        name: title,
        memoryUsage: Math.floor(Math.random() * 400) + 100, // Simulated memory
        startTime: Date.now()
      }];
    }

    if (existing) {
      return { 
        windows: state.windows.map(w => w.id === id ? { ...w, isOpen: true, isMinimized: false } : w),
        activeWindowId: id,
        processes: newProcesses
      };
    }
    const newWindow: WindowState = {
      id,
      title,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: state.windows.length + 10
    };
    return { 
      windows: [...state.windows, newWindow],
      activeWindowId: id,
      processes: newProcesses
    };
  }),

  closeApp: (id) => set((state) => ({
    windows: state.windows.filter(w => w.id !== id),
    processes: state.processes.filter(p => p.appId !== id),
    activeWindowId: state.activeWindowId === id ? null : state.activeWindowId
  })),

  minimizeApp: (id) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, isMinimized: true } : w),
    activeWindowId: state.activeWindowId === id ? null : state.activeWindowId
  })),

  maximizeApp: (id) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)
  })),

  focusApp: (id) => set((state) => {
    const maxZ = Math.max(0, ...state.windows.map(w => w.zIndex));
    return {
      windows: state.windows.map(w => w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w),
      activeWindowId: id
    };
  })
}));
