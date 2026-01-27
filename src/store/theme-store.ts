import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { SiteConfig } from '@/lib/api/types'

interface ThemeState {
  siteConfig: SiteConfig | null
  primaryColor: string
  _hasHydrated: boolean
}

interface ThemeActions {
  setSiteConfig: (config: SiteConfig) => void
  setPrimaryColor: (color: string) => void
  setHasHydrated: (state: boolean) => void
}

type ThemeStore = ThemeState & ThemeActions

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      // State
      siteConfig: null,
      primaryColor: '#3b82f6', // 默认蓝色
      _hasHydrated: false,

      // Actions
      setSiteConfig: (config) => set({ siteConfig: config }),

      setPrimaryColor: (color) => set({ primaryColor: color }),

      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        primaryColor: state.primaryColor,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
