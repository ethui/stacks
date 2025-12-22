import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  jwt: string | null;
  isAuthenticated: boolean;
  login: (jwt: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      jwt: null,
      isAuthenticated: false,
      login: (jwt: string) => {
        set({ jwt, isAuthenticated: true });
      },
      logout: () => set({ jwt: null, isAuthenticated: false }),
    }),
    {
      name: "ethui-stacks-auth",
    },
  ),
);
