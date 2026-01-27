// ===================== 通用响应类型 =====================
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  page_size: number;
}

// ===================== 用户相关类型 =====================
export interface User {
  id: string;
  username: string;
  nickname: string;
  email: string;
  avatar: string;
  website?: string;
  userGroupID: number;
  status: number;
  role?: string; // 用户角色：admin, user 等
  roles?: string[]; // 用户角色列表
  created_at: string;
  updated_at: string;
  lastLoginAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expires: number;
  roles: string[];
  userInfo: User;
}

export interface AuthInfo {
  accessToken: string;
  refreshToken: string;
  expires: number;
  roles: string[];
  userInfo: User;
}

// ===================== 文章相关类型 =====================
export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary: string;
  cover: string;
  category_id: number;
  category?: Category;
  tags?: Tag[];
  status: number;
  is_top: boolean;
  views: number;
  likes: number;
  comments: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface ArticleListParams {
  page?: number;
  page_size?: number;
  category_id?: number;
  tag_id?: number;
  status?: number;
  keyword?: string;
}

// ===================== 分类相关类型 =====================
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  cover: string;
  parent_id: number;
  sort: number;
  article_count: number;
  created_at: string;
  updated_at: string;
}

// ===================== 标签相关类型 =====================
export interface Tag {
  id: number;
  name: string;
  slug: string;
  color: string;
  article_count: number;
  created_at: string;
  updated_at: string;
}

// ===================== 评论相关类型 =====================
export interface Comment {
  id: number;
  article_id: number;
  user_id: number;
  user?: User;
  parent_id: number;
  content: string;
  status: number;
  likes: number;
  replies?: Comment[];
  created_at: string;
  updated_at: string;
}

// ===================== 统计相关类型 =====================
export interface BasicStatistics {
  article_count: number;
  category_count: number;
  tag_count: number;
  comment_count: number;
  total_views: number;
  total_likes: number;
}

export interface StatisticsSummary {
  today: {
    views: number;
    visitors: number;
    comments: number;
  };
  total: {
    articles: number;
    comments: number;
    views: number;
    visitors: number;
  };
  trend: {
    date: string;
    views: number;
    visitors: number;
  }[];
  recentArticles: Article[];
  recentComments: Comment[];
}

// ===================== 站点配置类型 =====================
// 基础站点配置（前端自定义）
export interface SiteConfig {
  title: string;
  subtitle: string;
  description: string;
  keywords: string[];
  author: string;
  avatar: string;
  logo: string;
  favicon: string;
  url: string;
  email: string;
  icp: string;
  startYear: number;
  social: {
    github?: string;
    twitter?: string;
    weibo?: string;
    qq?: string;
    wechat?: string;
  };
  features: {
    enableSearch: boolean;
    enableComments: boolean;
    enableDarkMode: boolean;
  };
}

// 服务端站点配置（来自 anheyu-pro API）
export interface ServerSiteConfig {
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
  [key: string]: unknown;
}

// ===================== OAuth 相关类型 =====================
export interface OAuthProvider {
  name: string;
  displayName: string;
  icon: string;
  enabled: boolean;
}

export interface OAuthAuthorizeResponse {
  url: string;
}
