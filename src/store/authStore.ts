import { create } from 'zustand';
import type { User } from 'firebase/auth';

export type Role = 'buyer' | 'seller' | null;

interface AuthState {
  user: User | null;
  role: Role;
  loading: boolean;
  setUser: (user: User | null) => void;
  setRole: (role: Role) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: (localStorage.getItem('bh_role') as Role) || null,
  loading: true,
  setUser: (user) => set({ user }),
  setRole: (role) => {
    if (role) localStorage.setItem('bh_role', role);
    else localStorage.removeItem('bh_role');
    set({ role });
  },
  setLoading: (loading) => set({ loading }),
}));
