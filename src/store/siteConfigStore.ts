/**
 * 站点配置状态管理
 * 参考 anheyu-pro 实现，使用 localStorage 缓存配置
 */

import { create } from "zustand";
import { apiClient } from "@/lib/api/client";

// 缓存相关常量
const LOCAL_STORAGE_KEY = "site_config_cache";
const CACHE_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24小时

// 站点配置类型（与 anheyu-pro 保持一致）
export interface SiteConfigData {
  APP_NAME?: string;
  APP_VERSION?: string;
  SUB_TITLE?: string;
  ICP_NUMBER?: string;
  USER_AVATAR?: string;
  ABOUT_LINK?: string;
  API_URL?: string;
  SITE_URL?: string;
  ICON_URL?: string;
  LOGO_HORIZONTAL_DAY?: string;
  LOGO_HORIZONTAL_NIGHT?: string;
  LOGO_URL?: string;
  LOGO_URL_192x192?: string;
  LOGO_URL_512x512?: string;
  DEFAULT_THUMB_PARAM?: string;
  DEFAULT_BIG_PARAM?: string;
  SITE_ANNOUNCEMENT?: string;
  GRAVATAR_URL?: string;
  DEFAULT_GRAVATAR_TYPE?: string;
  ENABLE_REGISTRATION?: boolean | string;
  POLICE_RECORD_NUMBER?: string;
  POLICE_RECORD_ICON?: string;

  // 嵌套配置
  frontDesk?: {
    siteOwner?: {
      name?: string;
      email?: string;
    };
  };

  header?: {
    nav?: unknown;
    menu?: unknown;
  };

  footer?: {
    uptime_kuma?: {
      enable?: boolean;
      url?: string;
    };
    runtime?: {
      enable?: boolean;
      launch_time?: string;
    };
  };

  sidebar?: {
    author?: {
      enable?: boolean;
      description?: string;
      statusImg?: string;
      skills?: string[];
      social?: Record<string, { icon: string; link: string }>;
    };
    weather?: {
      enable?: boolean;
      qweather_key?: string;
    };
    tags?: {
      enable?: boolean;
      highlight?: string[];
    };
    siteinfo?: {
      totalPostCount?: number;
      runtimeEnable?: boolean;
      totalWordCount?: number;
    };
    series?: {
      postCount?: number;
    };
  };

  page?: {
    one_image?: {
      config?: unknown;
      hitokoto_api?: string;
      typing_speed?: number;
    };
    oneImageConfig?: unknown;
  };

  post?: {
    waves?: {
      enable?: boolean;
    };
    default?: {
      cover?: string;
    };
    copyright?: {
      enable?: boolean;
      license?: string;
      license_url?: string;
    };
    copy?: {
      enable?: boolean;
      min_length?: number;
    };
    code_block?: {
      code_max_lines?: number;
    };
    reward?: {
      enable?: boolean;
      button_text?: string;
      title?: string;
      wechat_label?: string;
      alipay_label?: string;
      wechat_qr?: string;
      alipay_qr?: string;
      list_button_text?: string;
      list_button_desc?: string;
    };
    subscribe?: {
      enable?: boolean;
      buttonText?: string;
      dialogTitle?: string;
      dialogDesc?: string;
    };
    page404?: {
      default_image?: string;
    };
  };

  comment?: {
    enable?: boolean;
  };

  music?: {
    player?: {
      enable?: boolean;
    };
  };

  copyright?: {
    license?: string;
    license_url?: string;
  };

  site?: {
    url?: string;
  };

  // 文章多人共创配置
  article?: {
    multi_author?: {
      enable?: boolean | string;
      need_review?: boolean | string;
    };
  };

  // AI 播客配置
  ai_podcast?: {
    button_text?: string;
    button_icon?: string;
  };

  // 验证码配置
  captcha?: {
    provider?: string;
  };

  turnstile?: {
    site_key?: string;
  };

  geetest?: {
    captcha_id?: string;
  };

  // OAuth 配置
  oauth?: {
    qq?: { enable?: boolean };
    wechat?: { enable?: boolean };
    logto?: { enable?: boolean; display_name?: string };
    oidc?: { enable?: boolean; display_name?: string };
    rainbow?: {
      enable?: boolean;
      api_url?: string;
      app_id?: string;
      login_methods?: string;
      callback_url?: string;
    };
  };

  // 即刻配置
  essay?: {
    title?: string;
    subtitle?: string;
    tips?: string;
    button_text?: string;
    button_link?: string;
    limit?: number;
    home_enable?: boolean;
    top_background?: string;
  };

  // 朋友圈配置
  moments?: {
    enable?: boolean;
    title?: string;
    subtitle?: string;
    tips?: string;
    button_text?: string;
    button_link?: string;
    top_background?: string;
  };

  // 最近评论配置
  recent_comments?: {
    enable?: boolean;
    limit?: number;
  };

  // 任意其他配置
  [key: string]: unknown;
}

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
        const cachedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cachedData) {
          const { config: cachedConfig, timestamp }: CachedData = JSON.parse(cachedData);
          // 检查缓存是否过期
          if (Date.now() - timestamp < CACHE_EXPIRATION_TIME) {
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
            localStorage.removeItem(LOCAL_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error("[SiteConfig] 解析缓存数据失败:", error);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
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
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToCache));
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
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    set({ isLoaded: false });
    console.log("%c[SiteConfig] 配置缓存已清除", "color: #f59e0b; font-weight: bold;");
  },

  // 强制从服务器刷新
  forceRefreshFromServer: async () => {
    // 先清除缓存
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    set({ isLoaded: false });

    // 重新获取
    await get().fetchSiteConfig();
  },
}));
