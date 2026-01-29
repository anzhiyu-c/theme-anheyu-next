/**
 * 应用常量
 * 集中管理缓存键、缓存时间、断点等常量
 */

// ===================== 缓存相关 =====================

/**
 * 本地存储键
 */
export const CACHE_KEYS = {
  /** 站点配置缓存 */
  SITE_CONFIG: "site_config_cache",
  /** 用户认证信息 */
  AUTH_INFO: "anheyu-user-info",
  /** 主题设置 */
  THEME: "theme-storage",
  /** 搜索历史 */
  SEARCH_HISTORY: "search-history",
} as const;

/**
 * 缓存过期时间（毫秒）
 */
export const CACHE_TTL = {
  /** 站点配置：24小时 */
  SITE_CONFIG: 24 * 60 * 60 * 1000,
  /** 文章列表：1分钟 */
  ARTICLES: 60 * 1000,
  /** 分类/标签：10分钟 */
  CATEGORIES: 10 * 60 * 1000,
  /** 统计数据：5分钟 */
  STATISTICS: 5 * 60 * 1000,
} as const;

// ===================== 响应式断点 =====================

/**
 * 响应式断点（与 Tailwind CSS 保持一致）
 */
export const BREAKPOINTS = {
  /** 移动端 */
  MOBILE: 768,
  /** 平板端 */
  TABLET: 1024,
  /** 桌面端 */
  DESKTOP: 1280,
  /** 大屏幕 */
  WIDE: 1536,
} as const;

// ===================== API 相关 =====================

/**
 * API 响应码
 */
export const API_RESPONSE_CODE = {
  /** 成功 */
  SUCCESS: 200,
  /** 未授权 */
  UNAUTHORIZED: 401,
  /** 禁止访问 */
  FORBIDDEN: 403,
  /** 未找到 */
  NOT_FOUND: 404,
  /** 服务器错误 */
  SERVER_ERROR: 500,
} as const;

/**
 * API 路径
 */
export const API_PATHS = {
  /** 基础路径 */
  BASE: "/api",
  /** 登录页 */
  LOGIN: "/login",
  /** 注册页 */
  REGISTER: "/register",
} as const;

/**
 * 不需要携带 Token 的 API 路径白名单
 */
export const API_TOKEN_WHITELIST = [
  "/auth/refresh-token",
  "/auth/login",
  "/auth/check-email",
  "/auth/register",
  "/public/",
] as const;

/**
 * API 请求超时时间（毫秒）
 */
export const API_TIMEOUT = 30000;

/**
 * 默认 API URL（开发环境）
 */
export const DEFAULT_API_URL = "http://localhost:8091";

// ===================== 分页相关 =====================

/**
 * 默认分页配置
 */
export const PAGINATION = {
  /** 默认页码 */
  DEFAULT_PAGE: 1,
  /** 默认每页数量 */
  DEFAULT_PAGE_SIZE: 10,
  /** 最大每页数量 */
  MAX_PAGE_SIZE: 100,
} as const;

// ===================== 动画相关 =====================

/**
 * 动画持续时间（毫秒）
 */
export const ANIMATION_DURATION = {
  /** 快速 */
  FAST: 150,
  /** 正常 */
  NORMAL: 300,
  /** 慢速 */
  SLOW: 500,
} as const;

// ===================== 服务端缓存 =====================

/**
 * 服务端 revalidate 时间（秒）
 */
export const SERVER_REVALIDATE = {
  /** 站点配置：1小时 */
  SITE_CONFIG: 3600,
  /** 文章列表：1分钟 */
  ARTICLES: 60,
  /** 分类/标签：10分钟 */
  CATEGORIES: 600,
  /** 统计数据：5分钟 */
  STATISTICS: 300,
} as const;

// ===================== 默认配置 =====================

/**
 * 默认站点配置
 */
export const DEFAULT_SITE_CONFIG = {
  /** 站点名称 */
  NAME: "安和鱼",
  /** Logo 路径 */
  LOGO: "/logo.svg",
} as const;

// ===================== React Query 配置 =====================

/**
 * React Query gcTime 倍数
 * gcTime 通常设置为 staleTime 的 N 倍
 */
export const CACHE_MULTIPLIERS = {
  /** gcTime = staleTime * GC_TIME */
  GC_TIME: 7,
} as const;

// ===================== 其他 =====================

/**
 * 滚动阈值
 */
export const SCROLL_THRESHOLD = {
  /** Header 收起阈值 */
  HEADER_HIDE: 60,
  /** 返回顶部按钮显示阈值 */
  BACK_TO_TOP: 300,
} as const;
