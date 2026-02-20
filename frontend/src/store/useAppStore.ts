import { create } from 'zustand';

interface AppState {
  userRole: 'TPO' | 'STUDENT' | 'RECRUITER' | null;
  setUserRole: (role: 'TPO' | 'STUDENT' | 'RECRUITER' | null) => void;
  isBotOpen: boolean;
  toggleBot: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  userRole: null, // Starts as null so the user is forced to the login screen
  setUserRole: (role) => set({ userRole: role }),
  isBotOpen: false,
  toggleBot: () => set((state) => ({ isBotOpen: !state.isBotOpen })),
}));