"use client";

import { motion } from "framer-motion";
import { FileText, MessageSquare, Eye, Users } from "lucide-react";
import { StatsCard, TrendChart, RecentArticles } from "@/components/admin";
import { formatNumber } from "@/lib/utils";

// 模拟数据
const stats = {
  today: { views: 1234, visitors: 456, comments: 12 },
  total: { articles: 128, comments: 2456, views: 123456, visitors: 45678 },
};

const trendData = [
  { date: "01-21", views: 120, visitors: 45 },
  { date: "01-22", views: 150, visitors: 52 },
  { date: "01-23", views: 180, visitors: 68 },
  { date: "01-24", views: 140, visitors: 48 },
  { date: "01-25", views: 200, visitors: 72 },
  { date: "01-26", views: 165, visitors: 58 },
  { date: "01-27", views: 190, visitors: 65 },
];

const recentArticles = [
  { id: 1, title: "Next.js 16 新特性详解", views: 1234, date: "2026-01-20" },
  { id: 2, title: "HeroUI 组件库使用指南", views: 876, date: "2026-01-18" },
  { id: 3, title: "Tailwind CSS v4 迁移指南", views: 654, date: "2026-01-15" },
  { id: 4, title: "React 19 新功能一览", views: 543, date: "2026-01-12" },
  { id: 5, title: "TypeScript 5.0 最佳实践", views: 432, date: "2026-01-10" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold">仪表盘</h1>
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
          value={stats.today.views}
          icon={<Eye className="w-6 h-6" />}
          trend={{ value: 12, isUp: true }}
          color="primary"
        />
        <StatsCard
          title="今日访客"
          value={stats.today.visitors}
          icon={<Users className="w-6 h-6" />}
          trend={{ value: 8, isUp: true }}
          color="success"
        />
        <StatsCard
          title="文章总数"
          value={stats.total.articles}
          icon={<FileText className="w-6 h-6" />}
          color="warning"
        />
        <StatsCard
          title="评论总数"
          value={stats.total.comments}
          icon={<MessageSquare className="w-6 h-6" />}
          trend={{ value: 5, isUp: false }}
          color="danger"
        />
      </motion.div>

      {/* 图表和列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TrendChart data={trendData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <RecentArticles articles={recentArticles} />
        </motion.div>
      </div>

      {/* 总览数据 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <p className="text-3xl font-bold text-primary">
            {formatNumber(stats.total.articles)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">文章总数</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <p className="text-3xl font-bold text-green-500">
            {formatNumber(stats.total.comments)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">评论总数</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <p className="text-3xl font-bold text-orange-500">
            {formatNumber(stats.total.views)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">总浏览量</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <p className="text-3xl font-bold text-purple-500">
            {formatNumber(stats.total.visitors)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">总访客数</p>
        </div>
      </motion.div>
    </div>
  );
}
