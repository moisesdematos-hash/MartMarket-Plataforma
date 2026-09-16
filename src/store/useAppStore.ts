import { create } from 'zustand';
import { UserRole } from '../types';

interface AppState {
  theme: 'dark' | 'light';
  currency: string;
  language: string;
  isSidebarOpen: boolean;
  
  setTheme: (theme: 'dark' | 'light') => void;
  setCurrency: (curr: string) => void;
  setLanguage: (lang: string) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'dark', // We hard-locked to dark in the app
  currency: 'AOA',
  language: 'pt',
  isSidebarOpen: false,
  
  setTheme: (theme) => set({ theme }),
  setCurrency: (currency) => set({ currency }),
  setLanguage: (language) => set({ language }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
