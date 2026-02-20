import { create } from 'zustand';

export type UserRole = 'TPO' | 'STUDENT' | 'RECRUITER';

interface UserData {
  email: string;
  role: UserRole;
}

interface AppState {
  userRole: UserRole | null;
  setUserRole: (role: UserRole | null) => void;
  isBotOpen: boolean;
  toggleBot: () => void;
  
  // Approval Workflow State
  approvedUsers: UserData[];
  pendingUsers: UserData[];
  requestAccess: (email: string, role: UserRole) => void;
  directRegister: (email: string, role: UserRole) => void; // New function
  approveUser: (email: string) => void;
  rejectUser: (email: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  userRole: null, 
  setUserRole: (role) => set({ userRole: role }),
  isBotOpen: false,
  toggleBot: () => set((state) => ({ isBotOpen: !state.isBotOpen })),

  approvedUsers: [{ email: 'admin@college.edu', role: 'TPO' }],
  pendingUsers: [],

  // For Students and Recruiters
  requestAccess: (email, role) => set((state) => ({
    pendingUsers: [...state.pendingUsers, { email, role }]
  })),

  // For TPOs - Skip the queue
  directRegister: (email, role) => set((state) => ({
    approvedUsers: [...state.approvedUsers, { email, role }]
  })),

  approveUser: (email) => set((state) => {
    const userToApprove = state.pendingUsers.find(u => u.email === email);
    if (!userToApprove) return state;
    return {
      pendingUsers: state.pendingUsers.filter(u => u.email !== email),
      approvedUsers: [...state.approvedUsers, userToApprove]
    };
  }),

  rejectUser: (email) => set((state) => ({
    pendingUsers: state.pendingUsers.filter(u => u.email !== email)
  }))
}));