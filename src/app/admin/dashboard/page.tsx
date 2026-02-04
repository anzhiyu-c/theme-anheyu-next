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
import { useDashboardData, useApproveComment, useRejectComment } from "@/hooks/queries/use-dashboard";
import { useMemo } from "react";

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

// ==================== 加载骨架屏 ====================
function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 欢迎区域骨架 */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-48 bg-muted rounded" />
          <div className="h-4 w-32 bg-muted rounded mt-2" />
        </div>
        <div className="h-10 w-24 bg-muted rounded-lg" />
      </div>

      {/* 统计卡片骨架 */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 bg-muted rounded-xl" />
        ))}
      </div>

      {/* 快捷操作骨架 */}
      <div className="h-24 bg-muted rounded-xl" />

      {/* 图表区域骨架 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="h-80 bg-muted rounded-xl" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-64 bg-muted rounded-xl" />
          <div className="h-32 bg-muted rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ==================== 主组件 ====================
export default function AdminDashboard() {
  const { user } = useAuthStore(
    useShallow(state => ({
      user: state.user,
    }))
  );

  // 获取仪表盘数据
  const { summary, content, topArticles, recentComments, isLoading, queries } = useDashboardData({
    topArticlesLimit: 5,
    recentCommentsLimit: 5,
  });

  // 评论审核 mutations
  const approveComment = useApproveComment();
  const rejectComment = useRejectComment();

  // 计算趋势数据
  const viewsTrend = useMemo(() => {
    const todayViews = summary?.basic_stats?.today_views ?? 0;
    const yesterdayViews = summary?.basic_stats?.yesterday_views ?? 0;
    return calculateTrend(todayViews, yesterdayViews);
  }, [summary?.basic_stats?.today_views, summary?.basic_stats?.yesterday_views]);

  const visitorsTrend = useMemo(() => {
    const todayVisitors = summary?.basic_stats?.today_visitors ?? 0;
    const yesterdayVisitors = summary?.basic_stats?.yesterday_visitors ?? 0;
    return calculateTrend(todayVisitors, yesterdayVisitors);
  }, [summary?.basic_stats?.today_visitors, summary?.basic_stats?.yesterday_visitors]);

  // 转换趋势数据格式用于图表
  const trendChartData = useMemo(() => {
    const daily = summary?.trend_data?.daily;
    if (!daily || daily.length === 0) return [];
    return daily.map(item => {
      // 处理多种日期格式
      let dateStr = item.date;
      if (dateStr.includes("T")) {
        // ISO 格式: 2025-01-22T00:00:00Z -> 01-22
        dateStr = dateStr.split("T")[0];
      }
      if (dateStr.includes("-") && dateStr.length >= 10) {
        // YYYY-MM-DD -> MM-DD
        dateStr = dateStr.slice(5);
      }
      return {
        date: dateStr,
        views: item.views || 0,
        visitors: item.visitors || 0,
      };
    });
  }, [summary?.trend_data?.daily]);

  // 转换来源数据格式
  const sourceChartData = useMemo(() => {
    const topReferers = summary?.analytics?.top_referers;
    if (!topReferers) return [];
    const total = topReferers.reduce((sum, item) => sum + item.count, 0);
    return topReferers.slice(0, 5).map(item => ({
      name: item.referer || "直接访问",
      value: item.count,
      percentage: total > 0 ? Math.round((item.count / total) * 100) : 0,
    }));
  }, [summary?.analytics?.top_referers]);

  // 转换设备数据格式
  const deviceChartData = useMemo(() => {
    const topDevices = summary?.analytics?.top_devices;
    if (!topDevices) return [];
    const total = topDevices.reduce((sum, item) => sum + item.count, 0);
    const iconMap: Record<string, string> = {
      desktop: "ri:computer-line",
      mobile: "ri:smartphone-line",
      tablet: "ri:tablet-line",
      other: "ri:device-line",
    };
    return topDevices.slice(0, 3).map(item => ({
      name:
        item.device === "desktop"
          ? "桌面端"
          : item.device === "mobile"
          ? "移动端"
          : item.device === "tablet"
          ? "平板"
          : "其他",
      value: item.count,
      percentage: total > 0 ? Math.round((item.count / total) * 100) : 0,
      icon: iconMap[item.device.toLowerCase()] || "ri:device-line",
    }));
  }, [summary?.analytics?.top_devices]);

  // 转换热门文章数据格式
  const topArticlesData = useMemo(() => {
    if (!topArticles) return [];
    return topArticles.map(article => ({
      id: article.id,
      title: article.title,
      total_views: article.total_views,
      unique_views: article.unique_views,
      avg_duration: article.avg_duration,
    }));
  }, [topArticles]);

  // 转换评论数据格式
  const recentCommentsData = useMemo(() => {
    if (!recentComments) return [];
    return recentComments.map(comment => ({
      id: comment.id,
      author: comment.author,
      content: comment.content,
      article_title: comment.article_title,
      article_id: comment.article_id,
      created_at: comment.created_at,
      status: comment.status,
    }));
  }, [recentComments]);

  // 处理评论审核
  const handleApprove = (id: string | number) => {
    approveComment.mutate(String(id));
  };

  const handleReject = (id: string | number) => {
    rejectComment.mutate(String(id));
  };

  // 加载状态
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // 使用真实数据或回退到默认值
  const basicStats = summary?.basic_stats || {
    today_visitors: 0,
    today_views: 0,
    yesterday_visitors: 0,
    yesterday_views: 0,
    month_views: 0,
    year_views: 0,
  };

  const contentStats = content || {
    total_articles: 0,
    published_articles: 0,
    draft_articles: 0,
    total_comments: 0,
    pending_comments: 0,
    total_categories: 0,
    total_tags: 0,
  };

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
          value={basicStats.today_visitors}
          icon="ri:user-line"
          trend={{ ...visitorsTrend, label: "较昨日" }}
          subtitle="独立访客数"
          isLoading={queries.summary.isLoading}
        />
        <DashboardStatCard
          title="今日浏览"
          value={basicStats.today_views}
          icon="ri:eye-line"
          trend={{ ...viewsTrend, label: "较昨日" }}
          subtitle="页面浏览量"
          isLoading={queries.summary.isLoading}
        />
        <DashboardStatCard
          title="文章总数"
          value={contentStats.total_articles}
          icon="ri:article-line"
          subtitle={`${contentStats.published_articles} 已发布 · ${contentStats.draft_articles} 草稿`}
          isLoading={queries.content.isLoading}
        />
        <DashboardStatCard
          title="评论总数"
          value={contentStats.total_comments}
          icon="ri:chat-3-line"
          subtitle={contentStats.pending_comments > 0 ? `${contentStats.pending_comments} 条待审核` : "全部已审核"}
          isLoading={queries.content.isLoading}
        />
        <DashboardStatCard
          title="本月浏览"
          value={basicStats.month_views}
          icon="ri:calendar-line"
          subtitle="累计浏览量"
          isLoading={queries.summary.isLoading}
        />
        <DashboardStatCard
          title="年度浏览"
          value={basicStats.year_views}
          icon="ri:bar-chart-line"
          subtitle="年度累计"
          isLoading={queries.summary.isLoading}
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
          <VisitTrendChart data={trendChartData} isLoading={queries.summary.isLoading} />

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
                <p className="text-lg font-semibold">{contentStats.total_categories}</p>
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
                <p className="text-lg font-semibold">{contentStats.total_tags}</p>
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
                <p className="text-lg font-semibold">{contentStats.pending_comments}</p>
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
                <p className="text-lg font-semibold">{contentStats.draft_articles}</p>
                <p className="text-xs text-muted-foreground">草稿</p>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* 右侧：访问来源 + 设备分布，与左侧等高 */}
        <motion.div variants={itemVariants} className="flex flex-col h-full min-h-0 space-y-6">
          <div className="flex-1 min-h-0">
            <SourceChart data={sourceChartData} className="h-full" isLoading={queries.summary.isLoading} />
          </div>
          <DeviceChart data={deviceChartData} className="shrink-0" isLoading={queries.summary.isLoading} />
        </motion.div>
      </div>

      {/* ==================== 热门文章 & 最近评论 ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 热门文章 */}
        <motion.div variants={itemVariants}>
          <TopArticles articles={topArticlesData} isLoading={queries.topArticles.isLoading} />
        </motion.div>

        {/* 最近评论 */}
        <motion.div variants={itemVariants}>
          <RecentComments
            comments={recentCommentsData}
            onApprove={handleApprove}
            onReject={handleReject}
            isLoading={queries.recentComments.isLoading}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
