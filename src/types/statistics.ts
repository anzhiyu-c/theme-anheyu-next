import type { Article, Comment } from "./article";

/**
 * 基础统计信息
 */
export interface BasicStatistics {
  article_count: number;
  category_count: number;
  tag_count: number;
  comment_count: number;
  total_views: number;
  total_likes: number;
}

/**
 * 统计汇总信息
 */
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
