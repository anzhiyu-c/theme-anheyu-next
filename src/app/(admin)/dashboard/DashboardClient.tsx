"use client";

import Link from "next/link";
import { Card, CardBody, CardHeader, Button, Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { FileText, Eye, Tag, Folder, Plus, ExternalLink, TrendingUp } from "lucide-react";
import { formatNumber, formatDate } from "@/lib/utils";
import type { ArticleStatistics, ArticleSummary } from "@/lib/api/types";

// 模拟 API（实际项目中应该调用真实 API）
async function fetchDashboardStats(): Promise<ArticleStatistics> {
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    total_articles: 42,
    total_views: 12580,
    total_words: 156000,
    total_categories: 8,
    total_tags: 25,
  };
}

async function fetchRecentArticles(): Promise<ArticleSummary[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    {
      id: "1",
      title: "使用 Next.js 16 构建现代 Web 应用",
      view_count: 1250,
      created_at: new Date().toISOString(),
      word_count: 3500,
      reading_time: 12,
    },
    {
      id: "2",
      title: "Tailwind CSS v4 新特性解析",
      view_count: 890,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      word_count: 2800,
      reading_time: 9,
    },
    {
      id: "3",
      title: "Go 语言并发编程最佳实践",
      view_count: 650,
      created_at: new Date(Date.now() - 172800000).toISOString(),
      word_count: 4200,
      reading_time: 14,
    },
  ];
}

const statCards = [
  { key: "total_articles", label: "文章总数", icon: FileText, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  { key: "total_views", label: "总浏览量", icon: Eye, color: "text-green-500", bgColor: "bg-green-500/10" },
  { key: "total_categories", label: "分类数", icon: Folder, color: "text-purple-500", bgColor: "bg-purple-500/10" },
  { key: "total_tags", label: "标签数", icon: Tag, color: "text-orange-500", bgColor: "bg-orange-500/10" },
] as const;

export function DashboardClient() {
  // 获取统计数据
  const { data: stats, isPending: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
  });

  // 获取最近文章
  const { data: articles, isPending: articlesLoading } = useQuery({
    queryKey: ["recent-articles"],
    queryFn: fetchRecentArticles,
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">后台概览</h1>
          <p className="text-foreground/60 mt-1">欢迎回来，查看您的博客数据</p>
        </div>
        <Button as={Link} href="/dashboard/posts/new" color="primary" startContent={<Plus className="w-4 h-4" />}>
          写文章
        </Button>
      </motion.div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardBody className="flex flex-row items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  {statsLoading ? (
                    <Skeleton className="w-16 h-8 rounded-lg" />
                  ) : (
                    <div className="text-2xl font-bold">{formatNumber(stats?.[stat.key] || 0)}</div>
                  )}
                  <div className="text-sm text-foreground/60">{stat.label}</div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 最近文章 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">最近文章</h2>
              <Button
                as={Link}
                href="/dashboard/posts"
                variant="light"
                size="sm"
                endContent={<ExternalLink className="w-4 h-4" />}
              >
                查看全部
              </Button>
            </CardHeader>
            <CardBody>
              {articlesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="w-12 h-12 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="w-3/4 h-4 rounded-lg" />
                        <Skeleton className="w-1/2 h-3 rounded-lg" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {articles?.map(article => (
                    <div
                      key={article.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-default-100 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{article.title}</h3>
                        <p className="text-sm text-foreground/60">{formatDate(article.created_at, "relative")}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-foreground/60">
                        <Eye className="w-4 h-4" />
                        {formatNumber(article.view_count)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>

        {/* 快捷操作 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">快捷操作</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              <Button
                as={Link}
                href="/dashboard/posts/new"
                className="w-full justify-start"
                variant="flat"
                startContent={<Plus className="w-4 h-4" />}
              >
                撰写新文章
              </Button>
              <Button
                as={Link}
                href="/dashboard/posts"
                className="w-full justify-start"
                variant="flat"
                startContent={<FileText className="w-4 h-4" />}
              >
                管理文章
              </Button>
              <Button
                as={Link}
                href="/dashboard/settings"
                className="w-full justify-start"
                variant="flat"
                startContent={<TrendingUp className="w-4 h-4" />}
              >
                查看统计
              </Button>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
