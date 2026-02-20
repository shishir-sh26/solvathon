import { create } from 'zustand';

interface AuthState {
  user: any | null;
  role: 'student' | 'tpo' | 'alumni' | null;
  isAuthenticated: boolean;
  login: (userData: any, role: 'student' | 'tpo' | 'alumni') => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  isAuthenticated: false,
  login: (userData, role) => set({ user: userData, role, isAuthenticated: true }),
  logout: () => set({ user: null, role: null, isAuthenticated: false }),
}));
