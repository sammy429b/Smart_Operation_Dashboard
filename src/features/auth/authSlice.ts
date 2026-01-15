import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionExpiry: number | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setSessionExpiry: (expiry: number | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  extendSession: (minutes?: number) => void;
}

const INITIAL_STATE: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  sessionExpiry: null,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setToken: (token) => set({ token }),

      setLoading: (isLoading) => set({ isLoading }),

      setSessionExpiry: (sessionExpiry) => set({ sessionExpiry }),

      login: (user, token) => {
        const sessionExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
        set({ user, token, isAuthenticated: true, isLoading: false, sessionExpiry });
      },

      logout: () => set(INITIAL_STATE),

      extendSession: (minutes = 15) => {
        set({ sessionExpiry: Date.now() + minutes * 60 * 1000 });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
