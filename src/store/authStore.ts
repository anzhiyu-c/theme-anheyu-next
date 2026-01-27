/**
 * 认证状态管理
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, LoginResponse } from "@/types";

interface AuthState {
  // 状态
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // 操作
  setAuth: (data: LoginResponse) => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,

      // 设置认证信息
      setAuth: (data: LoginResponse) => {
        set({
          user: data.userInfo,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });

        // 同步到 localStorage（兼容 anheyu-pro 格式）
        if (typeof window !== "undefined") {
          localStorage.setItem("anheyu-user-info", JSON.stringify(data));
        }
      },

      // 设置用户信息
      setUser: (user: User) => {
        set({ user });

        // 同步到 localStorage
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("anheyu-user-info");
          if (stored) {
            const data = JSON.parse(stored);
            localStorage.setItem("anheyu-user-info", JSON.stringify({ ...data, userInfo: user }));
          }
        }
      },

      // 设置加载状态
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // 登出
      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });

        // 清除 localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("anheyu-user-info");
        }
      },

      // 从 localStorage 恢复状态
      hydrate: () => {
        if (typeof window === "undefined") {
          set({ isLoading: false });
          return;
        }

        try {
          const stored = localStorage.getItem("anheyu-user-info");
          if (stored) {
            const data = JSON.parse(stored);
            if (data.accessToken) {
              set({
                user: data.userInfo || null,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                isAuthenticated: true,
                isLoading: false,
              });
              return;
            }
          }
        } catch (error) {
          console.error("Failed to hydrate auth state:", error);
        }

        set({ isLoading: false });
      },
    }),
    {
      name: "auth-storage",
      // 只持久化部分状态
      partialize: state => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
