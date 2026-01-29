/**
 * 站点配置状态管理
 * 参考 anheyu-pro 实现，使用 localStorage 缓存配置
 */

import { create } from "zustand";
import { apiClient } from "@/lib/api/client";
import { CACHE_KEYS, CACHE_TTL } from "@/lib/constants";
import type { SiteConfigData } from "@/types/site-config";

// 重新导出类型以保持向后兼容
export type { SiteConfigData } from "@/types/site-config";

// 缓存数据结构
interface CachedData {
  config: SiteConfigData;
  timestamp: number;
}

interface SiteConfigState {
  // 状态
  siteConfig: SiteConfigData;
  isLoaded: boolean;
  loading: boolean;
  error: string | null;

  // Getters
  getSiteConfig: () => SiteConfigData;
  getTitle: () => string;
  getLogo: () => string;
  getSiteUrl: () => string | null;
  getApiUrl: () => string | null;
  enableRegistration: () => boolean;
  enableMultiAuthor: () => boolean;

  // Actions
  fetchSiteConfig: () => Promise<void>;
  clearCache: () => void;
  forceRefreshFromServer: () => Promise<void>;
}

export const useSiteConfigStore = create<SiteConfigState>((set, get) => ({
  // 初始状态
  siteConfig: {},
  isLoaded: false,
  loading: false,
  error: null,

  // Getters
  getSiteConfig: () => get().siteConfig,

  getTitle: () => get().siteConfig.APP_NAME || "安和鱼",

  getLogo: () => get().siteConfig.LOGO_URL_192x192 || "/logo.svg",

  getSiteUrl: () => {
    const siteUrl = get().siteConfig.SITE_URL;
    if (siteUrl) {
      return siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
    }
    return null;
  },

  getApiUrl: () => {
    let apiUrl = get().siteConfig.API_URL;
    if (apiUrl) {
      return apiUrl.endsWith("/") ? apiUrl : apiUrl + "/";
    }
    return null;
  },

  enableRegistration: () => {
    const value = get().siteConfig.ENABLE_REGISTRATION;
    return value === true || value === "true";
  },

  enableMultiAuthor: () => {
    const config = get().siteConfig;
    return config.article?.multi_author?.enable === true;
  },

  // 获取站点配置
  fetchSiteConfig: async () => {
    const state = get();

    // 如果已加载，直接返回
    if (state.isLoaded) {
      return;
    }

    // 尝试从缓存读取
    if (typeof window !== "undefined") {
      try {
        const cachedData = localStorage.getItem(CACHE_KEYS.SITE_CONFIG);
        if (cachedData) {
          const { config: cachedConfig, timestamp }: CachedData = JSON.parse(cachedData);
          // 检查缓存是否过期
          if (Date.now() - timestamp < CACHE_TTL.SITE_CONFIG) {
            set({
              siteConfig: cachedConfig,
              isLoaded: true,
              loading: false,
            });

            // 在控制台打印站点配置
            console.log("%c[SiteConfig] 从缓存加载站点配置", "color: #10b981; font-weight: bold;", cachedConfig);

            return;
          } else {
            // 缓存过期，清除
            localStorage.removeItem(CACHE_KEYS.SITE_CONFIG);
          }
        }
      } catch (error) {
        console.error("[SiteConfig] 解析缓存数据失败:", error);
        localStorage.removeItem(CACHE_KEYS.SITE_CONFIG);
      }
    }

    // 从服务器获取配置
    set({ loading: true, error: null });

    try {
      const res = await apiClient.get<SiteConfigData>("/public/site-config");

      if (res.code === 200 && res.data) {
        const configData = res.data;

        // 确保 API_URL 以 / 结尾
        if (configData.API_URL && !configData.API_URL.endsWith("/")) {
          configData.API_URL += "/";
        }

        // 更新状态
        set({
          siteConfig: configData,
          isLoaded: true,
          loading: false,
          error: null,
        });

        // 缓存到 localStorage
        if (typeof window !== "undefined") {
          const dataToCache: CachedData = {
            config: configData,
            timestamp: Date.now(),
          };
          localStorage.setItem(CACHE_KEYS.SITE_CONFIG, JSON.stringify(dataToCache));
        }

        // 在控制台打印站点配置
        console.log("%c[SiteConfig] 从服务器加载站点配置", "color: #3b82f6; font-weight: bold;", configData);
      } else {
        throw new Error(res.message || "获取站点配置失败");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "未知错误";
      console.error("[SiteConfig] 请求站点配置出错:", error);
      set({
        loading: false,
        error: errorMessage,
      });
    }
  },

  // 清除缓存
  clearCache: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(CACHE_KEYS.SITE_CONFIG);
    }
    set({ isLoaded: false });
    console.log("%c[SiteConfig] 配置缓存已清除", "color: #f59e0b; font-weight: bold;");
  },

  // 强制从服务器刷新
  forceRefreshFromServer: async () => {
    // 先清除缓存
    if (typeof window !== "undefined") {
      localStorage.removeItem(CACHE_KEYS.SITE_CONFIG);
    }
    set({ isLoaded: false });

    // 重新获取
    await get().fetchSiteConfig();
  },
}));
