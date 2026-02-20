import { create } from 'zustand';

interface AppState {
  userRole: 'TPO' | 'STUDENT' | 'RECRUITER' | null;
  setUserRole: (role: 'TPO' | 'STUDENT' | 'RECRUITER') => void;
  isJarvisActive: boolean;
  toggleJarvis: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  userRole: 'TPO', // Defaulting to TPO for testing the Criteria Engine
  setUserRole: (role) => set({ userRole: role }),
  isJarvisActive: false,
  toggleJarvis: () => set((state) => ({ isJarvisActive: !state.isJarvisActive })),
}));