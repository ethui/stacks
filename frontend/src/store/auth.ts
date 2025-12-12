import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  accessKey: string | null;
  isAuthenticated: boolean;
  login: (accessKey: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessKey: null,
      isAuthenticated: false,
      login: (accessKey: string) => set({ accessKey, isAuthenticated: true }),
      logout: () => set({ accessKey: null, isAuthenticated: false }),
    }),
    {
      name: "ethui-stacks-auth",
    },
  ),
);
