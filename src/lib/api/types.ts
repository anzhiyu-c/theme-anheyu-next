// API 响应基础类型
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

// 分页响应
export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 文章类型
export interface Article {
  id: string
  title: string
  content_md?: string
  content_html?: string
  cover_url?: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'SCHEDULED'
  view_count: number
  word_count: number
  reading_time: number
  ip_location?: string
  primary_color?: string
  show_on_home: boolean
  abbrlink?: string
  copyright: boolean
  is_reprint: boolean
  created_at: string
  updated_at: string
  published_at?: string
  post_tags?: PostTag[]
  post_categories?: PostCategory[]
  owner?: UserInfo
}

// 文章摘要（列表用）
export interface ArticleSummary {
  id: string
  title: string
  cover_url?: string
  view_count: number
  word_count: number
  reading_time: number
  primary_color?: string
  abbrlink?: string
  created_at: string
  published_at?: string
  post_tags?: PostTag[]
  post_categories?: PostCategory[]
  excerpt?: string
}

// 标签
export interface PostTag {
  id: string
  name: string
  slug: string
  color?: string
  article_count?: number
}

// 分类
export interface PostCategory {
  id: string
  name: string
  slug: string
  description?: string
  parent_id?: string
  article_count?: number
}

// 用户信息
export interface UserInfo {
  id: string
  username: string
  nickname?: string
  avatar?: string
  email?: string
  website?: string
}

// 站点配置
export interface SiteConfig {
  site_name: string
  site_description?: string
  site_logo?: string
  site_favicon?: string
  footer_text?: string
  icp_record?: string
  social_links?: SocialLink[]
}

export interface SocialLink {
  name: string
  url: string
  icon?: string
}

// 文章统计
export interface ArticleStatistics {
  total_articles: number
  total_views: number
  total_words: number
  total_categories: number
  total_tags: number
}

// 登录请求/响应
export interface LoginRequest {
  username: string
  password: string
  captcha?: string
  captcha_id?: string
}

export interface LoginResponse {
  token: string
  expires_at: string
  user: UserInfo
}

// 文章查询参数
export interface ArticleQueryParams {
  page?: number
  page_size?: number
  category_id?: string
  tag_id?: string
  year?: number
  month?: number
  keyword?: string
}
