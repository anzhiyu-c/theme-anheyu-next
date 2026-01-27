"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, MessageSquare, Eye, Users, TrendingUp, TrendingDown } from "lucide-react";
import { StatsCard } from "@/components/admin/StatsCard";
import { RecentArticles } from "@/components/admin/RecentArticles";
import { TrendChart } from "@/components/admin/TrendChart";
import { apiClient } from "@/lib/api/client";
import type { StatisticsSummary, Article } from "@/types";

export default function AdminDashboard() {
  const [summary, setSummary] = useState<StatisticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get<StatisticsSummary>("/statistics/summary");
        // anheyu-pro 使用 code === 200 表示成功
        if (response.code === 200) {
          setSummary(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 模拟数据（实际项目中从 API 获取）
  const mockSummary: StatisticsSummary = {
    today: {
      views: 1234,
      visitors: 456,
      comments: 12,
    },
    total: {
      articles: 128,
      comments: 2456,
      views: 123456,
      visitors: 45678,
    },
    trend: [
      { date: "2026-01-21", views: 120, visitors: 45 },
      { date: "2026-01-22", views: 150, visitors: 52 },
      { date: "2026-01-23", views: 180, visitors: 68 },
      { date: "2026-01-24", views: 140, visitors: 48 },
      { date: "2026-01-25", views: 200, visitors: 72 },
      { date: "2026-01-26", views: 165, visitors: 58 },
      { date: "2026-01-27", views: 190, visitors: 65 },
    ],
    recentArticles: [],
    recentComments: [],
  };

  const displaySummary = summary || mockSummary;

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">仪表盘</h1>
        <p className="text-muted-foreground mt-1">欢迎回来！这是您的网站概览。</p>
      </motion.div>

      {/* 统计卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatsCard
          title="今日访问"
          value={displaySummary.today.views}
          icon={Eye}
          trend={{ value: 12, isUp: true }}
          color="primary"
        />
        <StatsCard
          title="今日访客"
          value={displaySummary.today.visitors}
          icon={Users}
          trend={{ value: 8, isUp: true }}
          color="success"
        />
        <StatsCard title="文章总数" value={displaySummary.total.articles} icon={FileText} color="warning" />
        <StatsCard
          title="评论总数"
          value={displaySummary.total.comments}
          icon={MessageSquare}
          trend={{ value: 5, isUp: false }}
          color="danger"
        />
      </motion.div>

      {/* 图表和列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 访问趋势 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <TrendChart data={displaySummary.trend} />
        </motion.div>

        {/* 最近文章 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <RecentArticles articles={displaySummary.recentArticles || []} />
        </motion.div>
      </div>

      {/* 总览数据 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        <div className="card-widget text-center">
          <p className="text-3xl font-bold text-primary">{displaySummary.total.articles.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">文章总数</p>
        </div>
        <div className="card-widget text-center">
          <p className="text-3xl font-bold text-success">{displaySummary.total.comments.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">评论总数</p>
        </div>
        <div className="card-widget text-center">
          <p className="text-3xl font-bold text-warning">{displaySummary.total.views.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">总浏览量</p>
        </div>
        <div className="card-widget text-center">
          <p className="text-3xl font-bold text-info">{displaySummary.total.visitors.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">总访客数</p>
        </div>
      </motion.div>
    </div>
  );
}
