'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from './types';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

const THEMES: Record<string, ThemeColors> = {
  'dark-purple': { primary: '#6366f1', secondary: '#8b5cf6', accent: '#a78bfa', background: '#0f0a1e' },
  'dark-cyan': { primary: '#06b6d4', secondary: '#0891b2', accent: '#67e8f9', background: '#0a1929' },
  'dark-green': { primary: '#10b981', secondary: '#059669', accent: '#6ee7b7', background: '#0a1f1a' },
  'dark-rose': { primary: '#f43f5e', secondary: '#e11d48', accent: '#fda4af', background: '#1a0a0f' },
  'dark-amber': { primary: '#f59e0b', secondary: '#d97706', accent: '#fcd34d', background: '#1a1200' },
  'dark-blue': { primary: '#3b82f6', secondary: '#2563eb', accent: '#93c5fd', background: '#0a0f1e' },
  'midnight': { primary: '#a855f7', secondary: '#9333ea', accent: '#d8b4fe', background: '#030712' },
  'neon-city': { primary: '#ec4899', secondary: '#f97316', accent: '#facc15', background: '#0a0a0a' },
};

interface AppState {
  user: User | null;
  token: string | null;
  theme: string;
  themeColors: ThemeColors;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setTheme: (theme: string) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      theme: 'dark-purple',
      themeColors: THEMES['dark-purple'],
      setUser: (user) => set({ user }),
      setToken: (token) => {
        if (token) localStorage.setItem('goalflow_token', token);
        else localStorage.removeItem('goalflow_token');
        set({ token });
      },
      setTheme: (theme) => {
        const colors = THEMES[theme] || THEMES['dark-purple'];
        // Apply CSS vars
        if (typeof document !== 'undefined') {
          document.documentElement.style.setProperty('--color-primary', colors.primary);
          document.documentElement.style.setProperty('--color-secondary', colors.secondary);
          document.documentElement.style.setProperty('--color-accent', colors.accent);
          document.documentElement.style.setProperty('--color-bg', colors.background);
        }
        set({ theme, themeColors: colors });
      },
      logout: () => {
        localStorage.removeItem('goalflow_token');
        localStorage.removeItem('goalflow_user');
        set({ user: null, token: null });
      },
    }),
    {
      name: 'goalflow-store',
      partialize: (state) => ({ user: state.user, token: state.token, theme: state.theme }),
    }
  )
);

export { THEMES };
export type { ThemeColors };
