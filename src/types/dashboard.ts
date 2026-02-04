/**
 * 仪表盘数据类型定义
 * 参考 anheyu-pro 的数据结构
 */

// 基础统计数据
export interface BasicStats {
  today_visitors: number;
  today_views: number;
  yesterday_visitors: number;
  yesterday_views: number;
  month_views: number;
  year_views: number;
}

// 内容统计
export interface ContentStats {
  total_articles: number;
  published_articles: number;
  draft_articles: number;
  total_comments: number;
  pending_comments: number;
  total_categories: number;
  total_tags: number;
}

// 趋势数据点
export interface TrendDataPoint {
  date: string;
  visitors: number;
  views: number;
}

// 访客趋势
export interface VisitorTrend {
  daily: TrendDataPoint[];
  weekly?: TrendDataPoint[];
  monthly?: TrendDataPoint[];
}

// 分布数据项
export interface DistributionItem {
  name: string;
  count: number;
  percentage?: number;
}

// 访客分析
export interface VisitorAnalytics {
  top_browsers: DistributionItem[];
  top_os: DistributionItem[];
  top_devices: DistributionItem[];
  top_referers: DistributionItem[];
  top_countries: DistributionItem[];
  top_cities: DistributionItem[];
}

// 热门页面
export interface TopPage {
  url_path: string;
  page_title: string;
  total_views: number;
  unique_views: number;
  bounce_rate: number;
  avg_duration: number;
}

// 最近文章
export interface RecentArticle {
  id: string;
  title: string;
  views: number;
  comments: number;
  created_at: string;
  status: "published" | "draft" | "pending";
}

// 最近评论
export interface RecentComment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  article_title: string;
  created_at: string;
  status: "approved" | "pending" | "spam";
}

// 仪表盘汇总数据
export interface DashboardSummary {
  basic_stats: BasicStats;
  content_stats: ContentStats;
  trend_data: VisitorTrend;
  analytics?: VisitorAnalytics;
  top_pages?: TopPage[];
  recent_articles: RecentArticle[];
  recent_comments?: RecentComment[];
}

// 计算趋势百分比的工具类型
export interface TrendInfo {
  value: number;
  isUp: boolean;
  percentage: number;
}
