import { create } from 'zustand';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export type AppId = 'explorer' | 'settings' | 'terminal' | 'browser' | 'ai' | 'notepad' | 'docs' | 'slides' | 'process-manager' | 'search' | 'store' | 'pay' | 'health' | 'phone' | 'recycle-bin' | 'mail' | 'maps' | 'calendar' | 'calculator' | 'shop' | 'themes' | 'games' | 'minesweeper' | 'update' | 'chat' | 'info' | 'camera' | 'tv' | 'sticky-notes' | 'fonts' | 'car' | 'quadrais-ai';
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
  displayId: string;
  snapState?: 'left' | 'right' | 'none';
}

export interface Display {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isPrimary: boolean;
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

  // Multi-Display
  displays: Display[];
  currentDisplayId: string;
  setDisplayPosition: (id: string, x: number, y: number) => void;
  moveWindowToDisplay: (appId: AppId, displayId: string) => void;
  registerDisplay: (display: Display) => void;
  unregisterDisplay: (id: string) => void;

  boot: () => void;
  setAuthReady: (ready: boolean) => void;
  setUser: (user: User | null) => void;
  loginLocal: (username: string) => void;
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
  snapApp: (id: AppId, side: 'left' | 'right' | 'none') => void;
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
  saveToLocal: () => void;
}

const STORAGE_KEY = 'nebula_os_settings';

export const useOSStore = create<OSStore>((set, get) => {
  const savedSettings = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

  return {
    isBooted: false,
    isLoggedIn: false,
    isAuthReady: false,
    isSetupComplete: savedSettings.isSetupComplete ?? false,
    user: savedSettings.user ?? null,
    wallpaper: savedSettings.wallpaper ?? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
    accentColor: savedSettings.accentColor ?? '#3b82f6',
    fontStyle: savedSettings.fontStyle ?? 'sans',
    windows: [],
    activeWindowId: null,
    
    processes: [],
    totalMemory: 65536,
    isGrayscale: false,
    isInverted: false,
    isQuickSettingsOpen: false,
    isWidgetsOpen: false,
    isChatOpen: false,

    isDarkMode: savedSettings.isDarkMode ?? true,
    taskbarTransparency: savedSettings.taskbarTransparency ?? 80,
    windowTransparency: savedSettings.windowTransparency ?? 80,
    isTaskbarAutohide: savedSettings.isTaskbarAutohide ?? false,

    cursorScale: savedSettings.cursorScale ?? 1,
    cursorColor: savedSettings.cursorColor ?? 'white',
    isUpdating: false,
    updateProgress: 0,
    updateStatus: 'System is up to date',

    taskbarPosition: savedSettings.taskbarPosition ?? 'bottom',
    pinnedAppIds: savedSettings.pinnedAppIds ?? ['explorer', 'browser', 'terminal', 'ai'],
    pinnedStartAppIds: savedSettings.pinnedStartAppIds ?? ['store', 'explorer', 'settings', 'ai', 'notepad', 'calculator', 'browser', 'recycle-bin', 'mail', 'maps', 'process-manager', 'calendar'],
    isRestarting: false,
    isShutDown: false,
    searchQuery: '',
    browserUrl: 'https://nebula-search.vercel.app/',

    volume: savedSettings.volume ?? 80,
    selectedNetwork: 'Nebula_5G',
    networks: [
      { id: '1', name: 'Nebula_5G', signal: 4, isSecure: true },
      { id: '2', name: 'Starlink_Guest', signal: 3, isSecure: false },
      { id: '3', name: 'Void_Net', signal: 2, isSecure: true },
      { id: '4', name: 'Quantum_Link', signal: 1, isSecure: true },
    ],
    savedUsers: JSON.parse(localStorage.getItem('nebula_saved_users') || '[]'),

    displays: [],
    currentDisplayId: Math.random().toString(36).substr(2, 9),

    setDisplayPosition: (id, x, y) => {
      set(state => ({
        displays: state.displays.map(d => d.id === id ? { ...d, x, y } : d)
      }));
      get().saveToLocal();
    },

    moveWindowToDisplay: (appId, displayId) => {
      set(state => ({
        windows: state.windows.map(w => w.id === appId ? { ...w, displayId } : w)
      }));
      get().saveToLocal();
    },

    registerDisplay: (display) => {
      set(state => {
        const exists = state.displays.find(d => d.id === display.id);
        if (exists) return state;
        return { displays: [...state.displays, display] };
      });
    },

    unregisterDisplay: (id) => {
      set(state => ({
        displays: state.displays.filter(d => d.id !== id),
        windows: state.windows.map(w => w.displayId === id ? { ...w, displayId: state.displays.find(d => d.isPrimary)?.id || 'primary' } : w)
      }));
    },

    saveToLocal: () => {
      const state = get();
      const settings = {
        isSetupComplete: state.isSetupComplete,
        user: state.user,
        wallpaper: state.wallpaper,
        accentColor: state.accentColor,
        fontStyle: state.fontStyle,
        isDarkMode: state.isDarkMode,
        taskbarTransparency: state.taskbarTransparency,
        windowTransparency: state.windowTransparency,
        isTaskbarAutohide: state.isTaskbarAutohide,
        cursorScale: state.cursorScale,
        cursorColor: state.cursorColor,
        taskbarPosition: state.taskbarPosition,
        pinnedAppIds: state.pinnedAppIds,
        pinnedStartAppIds: state.pinnedStartAppIds,
        volume: state.volume,
        displays: state.displays,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    },

    boot: () => set({ isBooted: true, isRestarting: false, isShutDown: false }),
    setAuthReady: (ready) => set({ isAuthReady: ready }),
    setUser: (user) => {
      set({ user, isLoggedIn: !!user });
      if (user) {
        get().addSavedUser(user);
      }
      get().saveToLocal();
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
      get().saveToLocal();
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
      get().saveToLocal();
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

    setVolume: (v) => {
      set({ volume: v });
      get().saveToLocal();
    },
    setDarkMode: (enabled) => {
      set({ isDarkMode: enabled });
      get().saveToLocal();
    },
    setTaskbarAutohide: (enabled) => {
      set({ isTaskbarAutohide: enabled });
      get().saveToLocal();
    },
    setTaskbarTransparency: (v) => {
      set({ taskbarTransparency: v });
      get().saveToLocal();
    },
    setWindowTransparency: (v) => {
      set({ windowTransparency: v });
      get().saveToLocal();
    },
    setCursorScale: (scale) => {
      set({ cursorScale: Math.max(0.5, Math.min(4, scale)) });
      get().saveToLocal();
    },
    setCursorColor: (color) => {
      set({ cursorColor: color });
      get().saveToLocal();
    },

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
      get().saveToLocal();
      const { user } = get();
      if (user && !user.isLocal) {
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
      get().saveToLocal();
      if (user && !user.isLocal) {
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
      get().saveToLocal();
      if (user && !user.isLocal) {
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
      
      localStorage.removeItem(STORAGE_KEY);
      
      if (!user.isLocal) {
        const path = `users/${user.uid}`;
        try {
          await setDoc(doc(db, path), {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            isSetupComplete: false,
            wallpaper: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
            accentColor: '#3b82f6',
            fontStyle: 'sans',
            taskbarPosition: 'bottom',
            pinnedAppIds: ['explorer', 'browser', 'terminal', 'ai'],
            createdAt: Timestamp.now()
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, path);
        }
      }
      
      set({ isBooted: false, isRestarting: true, isSetupComplete: false });
      window.location.reload();
    },

    setWallpaper: async (url) => {
      set({ wallpaper: url });
      get().saveToLocal();
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
      get().saveToLocal();

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
      get().saveToLocal();
      const { user } = get();
      if (user && !user.isLocal) {
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
      get().saveToLocal();
      const { user } = get();
      if (user && !user.isLocal) {
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
      if (!user || user.isLocal) return;

      const path = `users/${user.uid}`;
      try {
        const userDoc = await getDoc(doc(db, path));
        if (userDoc.exists()) {
          const data = userDoc.data();
          set({ 
            isSetupComplete: data.isSetupComplete ?? false,
            wallpaper: data.wallpaper ?? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
            accentColor: data.accentColor ?? '#3b82f6',
            fontStyle: data.fontStyle ?? 'sans',
            taskbarPosition: data.taskbarPosition ?? 'bottom',
            pinnedAppIds: data.pinnedAppIds ?? ['explorer', 'browser', 'terminal', 'ai'],
            pinnedStartAppIds: data.pinnedStartAppIds ?? ['store', 'explorer', 'settings', 'ai', 'notepad', 'calculator', 'browser', 'recycle-bin', 'mail', 'maps', 'process-manager', 'calendar']
          });
          get().saveToLocal();
        } else {
          // Initialize user document
          await setDoc(doc(db, path), {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
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
          get().saveToLocal();
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
          windows: state.windows.map(w => w.id === id ? { ...w, isOpen: true, isMinimized: false, displayId: state.currentDisplayId } : w),
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
        zIndex: state.windows.length + 10,
        displayId: state.currentDisplayId
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
      windows: state.windows.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized, snapState: 'none' } : w)
    })),

    snapApp: (id, side) => set((state) => ({
      windows: state.windows.map(w => w.id === id ? { ...w, snapState: side, isMaximized: false } : w)
    })),

    focusApp: (id) => set((state) => {
      const maxZ = Math.max(0, ...state.windows.map(w => w.zIndex));
      return {
        windows: state.windows.map(w => w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w),
        activeWindowId: id
      };
    })
  };
});
