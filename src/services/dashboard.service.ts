/**
 * 仪表盘数据服务
 */

import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types";
import type { DashboardSummary, BasicStats, VisitorTrend, VisitorAnalytics, TopPage } from "@/types/dashboard";

class DashboardService {
  /**
   * 获取仪表盘汇总数据
   */
  async getSummary(): Promise<ApiResponse<DashboardSummary>> {
    return apiClient.get<DashboardSummary>("/api/statistics/summary");
  }

  /**
   * 获取基础统计数据
   */
  async getBasicStats(): Promise<ApiResponse<BasicStats>> {
    return apiClient.get<BasicStats>("/api/public/statistics/basic");
  }

  /**
   * 获取访客趋势
   */
  async getTrend(period: "daily" | "weekly" | "monthly" = "daily", days = 7): Promise<ApiResponse<VisitorTrend>> {
    return apiClient.get<VisitorTrend>("/api/statistics/trend", {
      params: { period, days },
    });
  }

  /**
   * 获取访客分析
   */
  async getAnalytics(startDate?: string, endDate?: string): Promise<ApiResponse<VisitorAnalytics>> {
    return apiClient.get<VisitorAnalytics>("/api/statistics/analytics", {
      params: { start_date: startDate, end_date: endDate },
    });
  }

  /**
   * 获取热门页面
   */
  async getTopPages(limit = 10): Promise<ApiResponse<TopPage[]>> {
    return apiClient.get<TopPage[]>("/api/statistics/top-pages", {
      params: { limit },
    });
  }
}

export const dashboardService = new DashboardService();
