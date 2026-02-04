"use client";

import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useShallow } from "zustand/shallow";
import Link from "next/link";
import { Icon } from "@iconify/react";
import {
  DashboardStatCard,
  VisitTrendChart,
  SourceChart,
  DeviceChart,
  TopArticles,
  RecentComments,
} from "@/components/admin/dashboard";
import { QuickActions } from "@/components/admin";

// ==================== 模拟数据 ====================
// 基础访问统计
const mockSummary = {
  today_visitors: 456,
  today_views: 1234,
  yesterday_visitors: 420,
  yesterday_views: 1100,
  month_views: 8234,
  year_views: 98765,
};

// 内容统计
const mockContent = {
  total_articles: 128,
  published_articles: 120,
  draft_articles: 8,
  total_comments: 2456,
  pending_comments: 12,
  total_categories: 15,
  total_tags: 86,
};

// 访客趋势数据 (30天)
const mockTrendData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: `${date.getMonth() + 1}-${date.getDate().toString().padStart(2, "0")}`,
    views: Math.floor(Math.random() * 1000) + 800,
    visitors: Math.floor(Math.random() * 400) + 300,
  };
});

// 访问来源数据
const mockSourceData = [
  { name: "直接访问", value: 3200, percentage: 40 },
  { name: "搜索引擎", value: 2560, percentage: 32 },
  { name: "社交媒体", value: 1120, percentage: 14 },
  { name: "外部链接", value: 800, percentage: 10 },
  { name: "其他", value: 320, percentage: 4 },
];

// 设备分布数据
const mockDeviceData = [
  { name: "桌面端", value: 4800, percentage: 60, icon: "ri:computer-line" },
  { name: "移动端", value: 2800, percentage: 35, icon: "ri:smartphone-line" },
  { name: "平板", value: 400, percentage: 5, icon: "ri:tablet-line" },
];

// 热门文章
const mockTopArticles = [
  { id: "1", title: "Next.js 16 新特性详解", total_views: 1234, unique_views: 890, avg_duration: 180 },
  { id: "2", title: "HeroUI 组件库使用指南", total_views: 876, unique_views: 654, avg_duration: 240 },
  { id: "3", title: "Tailwind CSS v4 迁移指南", total_views: 654, unique_views: 432, avg_duration: 120 },
  { id: "4", title: "React 19 新功能一览", total_views: 543, unique_views: 387, avg_duration: 150 },
  { id: "5", title: "TypeScript 5.0 最佳实践", total_views: 432, unique_views: 298, avg_duration: 200 },
];

// 最近评论
const mockRecentComments = [
  {
    id: "1",
    author: "张三",
    content: "这篇文章写得太好了，讲解非常详细，收藏了！",
    article_title: "Next.js 16 新特性详解",
    article_id: "1",
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    status: "pending" as const,
  },
  {
    id: "2",
    author: "李四",
    content: "请问这个配置在生产环境下有什么需要注意的吗？",
    article_title: "Tailwind CSS v4 迁移指南",
    article_id: "3",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: "approved" as const,
  },
  {
    id: "3",
    author: "王五",
    content: "感谢分享，终于理解了这个概念",
    article_title: "React 19 新功能一览",
    article_id: "4",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: "approved" as const,
  },
  {
    id: "4",
    author: "赵六",
    content: "期待更多这样的教程！",
    article_title: "TypeScript 5.0 最佳实践",
    article_id: "5",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    status: "pending" as const,
  },
];

// ==================== 工具函数 ====================
function calculateTrend(current: number, previous: number) {
  if (previous === 0) return { value: 0, isUp: true };
  const diff = ((current - previous) / previous) * 100;
  return { value: Math.abs(Math.round(diff)), isUp: diff >= 0 };
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return "夜深了";
  if (hour < 9) return "早上好";
  if (hour < 12) return "上午好";
  if (hour < 14) return "中午好";
  if (hour < 18) return "下午好";
  if (hour < 22) return "晚上好";
  return "夜深了";
}

// ==================== 动画配置 ====================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

// ==================== 主组件 ====================
export default function AdminDashboard() {
  const { user } = useAuthStore(
    useShallow(state => ({
      user: state.user,
    }))
  );

  const viewsTrend = calculateTrend(mockSummary.today_views, mockSummary.yesterday_views);
  const visitorsTrend = calculateTrend(mockSummary.today_visitors, mockSummary.yesterday_visitors);

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      {/* ==================== 欢迎区域 ==================== */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {getGreeting()}，{user?.nickname || "管理员"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">这是您的网站数据概览</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Icon icon="ri:add-line" className="w-4 h-4" />
          写文章
        </Link>
      </motion.div>

      {/* ==================== 核心指标卡片 ==================== */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <DashboardStatCard
          title="今日访客"
          value={mockSummary.today_visitors}
          icon="ri:user-line"
          trend={{ ...visitorsTrend, label: "较昨日" }}
          subtitle="独立访客数"
        />
        <DashboardStatCard
          title="今日浏览"
          value={mockSummary.today_views}
          icon="ri:eye-line"
          trend={{ ...viewsTrend, label: "较昨日" }}
          subtitle="页面浏览量"
        />
        <DashboardStatCard
          title="文章总数"
          value={mockContent.total_articles}
          icon="ri:article-line"
          subtitle={`${mockContent.published_articles} 已发布 · ${mockContent.draft_articles} 草稿`}
        />
        <DashboardStatCard
          title="评论总数"
          value={mockContent.total_comments}
          icon="ri:chat-3-line"
          subtitle={mockContent.pending_comments > 0 ? `${mockContent.pending_comments} 条待审核` : "全部已审核"}
        />
        <DashboardStatCard
          title="本月浏览"
          value={mockSummary.month_views}
          icon="ri:calendar-line"
          subtitle="累计浏览量"
        />
        <DashboardStatCard
          title="年度浏览"
          value={mockSummary.year_views}
          icon="ri:bar-chart-line"
          subtitle="年度累计"
        />
      </motion.div>

      {/* ==================== 快速操作 ==================== */}
      <motion.div variants={itemVariants}>
        <QuickActions />
      </motion.div>

      {/* ==================== 图表区域 ==================== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
        {/* 左侧：访问趋势 + 快捷统计 */}
        <motion.div variants={itemVariants} className="xl:col-span-2 space-y-6 flex flex-col">
          <VisitTrendChart data={mockTrendData} />

          {/* 快捷统计卡片 - 移到这里利用空间 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              href="/admin/categories"
              className="group flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-all"
            >
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                <Icon icon="ri:folder-line" className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-semibold">{mockContent.total_categories}</p>
                <p className="text-xs text-muted-foreground">分类</p>
              </div>
            </Link>

            <Link
              href="/admin/tags"
              className="group flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-all"
            >
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                <Icon icon="ri:price-tag-3-line" className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-semibold">{mockContent.total_tags}</p>
                <p className="text-xs text-muted-foreground">标签</p>
              </div>
            </Link>

            <Link
              href="/admin/comments?status=pending"
              className="group flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-all"
            >
              <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-600">
                <Icon icon="ri:time-line" className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-semibold">{mockContent.pending_comments}</p>
                <p className="text-xs text-muted-foreground">待审核评论</p>
              </div>
            </Link>

            <Link
              href="/admin/posts?status=draft"
              className="group flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-all"
            >
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
                <Icon icon="ri:draft-line" className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-semibold">{mockContent.draft_articles}</p>
                <p className="text-xs text-muted-foreground">草稿</p>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* 右侧：访问来源 + 设备分布，与左侧等高 */}
        <motion.div variants={itemVariants} className="flex flex-col h-full min-h-0 space-y-6">
          <div className="flex-1 min-h-0">
            <SourceChart data={mockSourceData} className="h-full" />
          </div>
          <DeviceChart data={mockDeviceData} className="shrink-0" />
        </motion.div>
      </div>

      {/* ==================== 热门文章 & 最近评论 ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 热门文章 */}
        <motion.div variants={itemVariants}>
          <TopArticles articles={mockTopArticles} />
        </motion.div>

        {/* 最近评论 */}
        <motion.div variants={itemVariants}>
          <RecentComments
            comments={mockRecentComments}
            onApprove={id => console.log("Approve:", id)}
            onReject={id => console.log("Reject:", id)}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
