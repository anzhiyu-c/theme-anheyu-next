/**
 * 管理员 API 服务
 * 对接后端 /api/statistics/* 和 /api/admin/* 接口
 */

import { apiClient } from "./client";
import type {
  StatisticsSummary,
  VisitorStatistics,
  VisitorTrendData,
  VisitorAnalytics,
  URLStatistics,
  ContentStats,
  ArticleStatsResponse,
  CommentStatsResponse,
  TopArticle,
  RecentComment,
} from "@/types/dashboard";

// ============================================
// 访问统计 API
// ============================================

export const statisticsApi = {
  /**
   * 获取统计概览（包含基础统计、热门页面、访客分析、趋势数据）
   * GET /api/statistics/summary
   */
  async getSummary(): Promise<StatisticsSummary> {
    const response = await apiClient.get<StatisticsSummary>("/api/statistics/summary");
    if (response.code === 200 && response.data) {
      return response.data;
    }
    throw new Error(response.message || "获取统计概览失败");
  },

  /**
   * 获取基础统计数据
   * GET /api/public/statistics/basic
   */
  async getBasicStats(): Promise<VisitorStatistics> {
    const response = await apiClient.get<VisitorStatistics>("/api/public/statistics/basic");
    if (response.code === 200 && response.data) {
      return response.data;
    }
    throw new Error(response.message || "获取基础统计失败");
  },

  /**
   * 获取访客趋势数据
   * GET /api/statistics/trend
   * @param period 时间周期 (daily/weekly/monthly)
   * @param days 查询天数
   */
  async getTrend(period: "daily" | "weekly" | "monthly" = "daily", days: number = 30): Promise<VisitorTrendData> {
    const response = await apiClient.get<VisitorTrendData>("/api/statistics/trend", {
      params: { period, days },
    });
    if (response.code === 200 && response.data) {
      return response.data;
    }
    throw new Error(response.message || "获取趋势数据失败");
  },

  /**
   * 获取访客分析数据
   * GET /api/statistics/analytics
   * @param startDate 开始日期 (YYYY-MM-DD)
   * @param endDate 结束日期 (YYYY-MM-DD)
   */
  async getAnalytics(startDate?: string, endDate?: string): Promise<VisitorAnalytics> {
    const params: Record<string, string> = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const response = await apiClient.get<VisitorAnalytics>("/api/statistics/analytics", { params });
    if (response.code === 200 && response.data) {
      return response.data;
    }
    throw new Error(response.message || "获取访客分析失败");
  },

  /**
   * 获取热门页面
   * GET /api/statistics/top-pages
   * @param limit 返回数量
   */
  async getTopPages(limit: number = 10): Promise<URLStatistics[]> {
    const response = await apiClient.get<URLStatistics[]>("/api/statistics/top-pages", {
      params: { limit },
    });
    if (response.code === 200 && response.data) {
      return response.data;
    }
    throw new Error(response.message || "获取热门页面失败");
  },
};

// ============================================
// 内容统计 API
// ============================================

export const contentStatsApi = {
  /**
   * 获取文章统计
   * GET /api/public/articles/statistics
   */
  async getArticleStats(): Promise<ArticleStatsResponse> {
    const response = await apiClient.get<ArticleStatsResponse>("/api/public/articles/statistics");
    if (response.code === 200 && response.data) {
      return response.data;
    }
    throw new Error(response.message || "获取文章统计失败");
  },

  /**
   * 获取评论统计
   * GET /api/admin/comments/stats
   */
  async getCommentStats(): Promise<CommentStatsResponse> {
    const response = await apiClient.get<CommentStatsResponse>("/api/admin/comments/stats");
    if (response.code === 200 && response.data) {
      return response.data;
    }
    // 如果接口不存在，返回默认值
    return { total: 0, approved: 0, pending: 0, spam: 0 };
  },

  /**
   * 获取分类数量
   */
  async getCategoryCount(): Promise<number> {
    const response = await apiClient.get<{ id: string }[]>("/api/post-categories");
    if (response.code === 200 && response.data) {
      return response.data.length;
    }
    return 0;
  },

  /**
   * 获取标签数量
   */
  async getTagCount(): Promise<number> {
    const response = await apiClient.get<{ id: string }[]>("/api/post-tags");
    if (response.code === 200 && response.data) {
      return response.data.length;
    }
    return 0;
  },

  /**
   * 获取完整的内容统计
   */
  async getContentStats(): Promise<ContentStats> {
    try {
      const [articleStats, categoryCount, tagCount] = await Promise.all([
        this.getArticleStats().catch(() => ({ total: 0, published: 0, draft: 0, pending: 0 })),
        this.getCategoryCount().catch(() => 0),
        this.getTagCount().catch(() => 0),
      ]);

      // 尝试获取评论统计，失败时返回默认值
      let commentStats = { total: 0, approved: 0, pending: 0, spam: 0 };
      try {
        commentStats = await this.getCommentStats();
      } catch {
        // 评论统计接口可能不存在，忽略错误
      }

      return {
        total_articles: articleStats.total,
        published_articles: articleStats.published,
        draft_articles: articleStats.draft,
        total_comments: commentStats.total,
        pending_comments: commentStats.pending,
        total_categories: categoryCount,
        total_tags: tagCount,
      };
    } catch (error) {
      console.error("获取内容统计失败:", error);
      throw error;
    }
  },
};

// ============================================
// 热门文章 API
// ============================================

export const topArticlesApi = {
  /**
   * 获取热门文章列表
   * 基于热门页面数据，过滤出文章页面
   */
  async getTopArticles(limit: number = 5): Promise<TopArticle[]> {
    try {
      const topPages = await statisticsApi.getTopPages(limit * 2); // 获取更多以过滤

      // 过滤出文章页面（URL 格式: /posts/xxx 或 /article/xxx）
      const articlePages = topPages.filter(
        page => page.url_path.startsWith("/posts/") || page.url_path.startsWith("/article/")
      );

      // 转换为 TopArticle 格式
      return articlePages.slice(0, limit).map((page, index) => ({
        id: String(index + 1),
        title: page.page_title || page.url_path,
        slug: page.url_path.replace(/^\/(posts|article)\//, ""),
        total_views: page.total_views,
        unique_views: page.unique_views,
        avg_duration: page.avg_duration,
      }));
    } catch (error) {
      console.error("获取热门文章失败:", error);
      return [];
    }
  },
};

// ============================================
// 最近评论 API
// ============================================

export const recentCommentsApi = {
  /**
   * 获取最近评论列表
   * GET /api/admin/comments
   */
  async getRecentComments(limit: number = 5): Promise<RecentComment[]> {
    interface AdminComment {
      id: string;
      nickname: string;
      avatar_url?: string;
      content_html: string;
      content?: string;
      target_title?: string;
      target_path: string;
      created_at: string;
      status: number;
    }

    interface CommentsResponse {
      list: AdminComment[];
      total: number;
    }

    try {
      const response = await apiClient.get<CommentsResponse>("/api/admin/comments", {
        params: { page: 1, pageSize: limit, sort: "created_at", order: "desc" },
      });

      if (response.code === 200 && response.data?.list) {
        return response.data.list.map(comment => ({
          id: comment.id,
          author: comment.nickname,
          avatar: comment.avatar_url,
          content: comment.content_html || comment.content || "",
          article_title: comment.target_title || comment.target_path,
          article_id: comment.target_path.replace(/^\/(posts|article)\//, ""),
          created_at: comment.created_at,
          status: comment.status === 1 ? "approved" : comment.status === 0 ? "pending" : "spam",
        }));
      }

      return [];
    } catch (error) {
      console.error("获取最近评论失败:", error);
      return [];
    }
  },

  /**
   * 审核评论
   * POST /api/admin/comments/:id/approve
   */
  async approveComment(id: string): Promise<void> {
    const response = await apiClient.post(`/api/admin/comments/${id}/approve`);
    if (response.code !== 200) {
      throw new Error(response.message || "审核评论失败");
    }
  },

  /**
   * 拒绝评论
   * POST /api/admin/comments/:id/reject
   */
  async rejectComment(id: string): Promise<void> {
    const response = await apiClient.post(`/api/admin/comments/${id}/reject`);
    if (response.code !== 200) {
      throw new Error(response.message || "拒绝评论失败");
    }
  },
};

// ============================================
// 导出统一的管理员 API
// ============================================

export const adminApi = {
  statistics: statisticsApi,
  contentStats: contentStatsApi,
  topArticles: topArticlesApi,
  recentComments: recentCommentsApi,
};
