import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'colorblind' | 'dyslexia';

interface ThemeState {
  mode: ThemeMode;
  isDyslexia: boolean;
  isColorblind: boolean;
  language: string;
  setMode: (mode: ThemeMode) => void;
  toggleDyslexia: () => void;
  toggleColorblind: () => void;
  setLanguage: (lang: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',
      isDyslexia: false,
      isColorblind: false,
      language: 'en',
      setMode: (mode) => set({ mode }),
      toggleDyslexia: () => set((state) => ({ isDyslexia: !state.isDyslexia })),
      toggleColorblind: () => set((state) => ({ isColorblind: !state.isColorblind })),
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'eduniverse-theme',
    }
  )
);
