/**
 * 主题状态管理
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  // 状态
  mode: ThemeMode;
  resolvedTheme: "light" | "dark";

  // 操作
  setMode: (mode: ThemeMode) => void;
  setResolvedTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // 初始状态
      mode: "system",
      resolvedTheme: "light",

      // 设置主题模式
      setMode: (mode: ThemeMode) => {
        set({ mode });
      },

      // 设置解析后的主题
      setResolvedTheme: (theme: "light" | "dark") => {
        set({ resolvedTheme: theme });
      },

      // 切换主题
      toggleTheme: () => {
        const { mode } = get();
        if (mode === "light") {
          set({ mode: "dark" });
        } else if (mode === "dark") {
          set({ mode: "system" });
        } else {
          set({ mode: "light" });
        }
      },
    }),
    {
      name: "theme-storage",
    }
  )
);
