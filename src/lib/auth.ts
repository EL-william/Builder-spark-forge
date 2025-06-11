import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, AuthState } from "./types";

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

// Mock authentication - in production, replace with real API calls
export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock user data
        const user: User = {
          id: "1",
          email,
          name: email.split("@")[0],
          createdAt: new Date(),
        };

        set({ user, isAuthenticated: true, isLoading: false });
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true });

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock user data
        const user: User = {
          id: "1",
          email,
          name,
          createdAt: new Date(),
        };

        set({ user, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, isLoading: false });
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export const requireAuth = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};
