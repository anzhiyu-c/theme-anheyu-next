"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AdminPageHeader, AdminCard, EmptyState } from "@/components/admin";
import { Button } from "@/components/ui";
import { BookOpen, Plus, Edit, Trash2, Eye, FileText, Calendar, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

// 模拟文档系列数据
const mockDocSeries = [
  {
    id: 1,
    title: "Next.js 完全指南",
    description: "从入门到精通的 Next.js 开发教程",
    cover: "/doc1.jpg",
    articleCount: 12,
    views: 8456,
    status: "published",
    createdAt: "2026-01-20",
  },
  {
    id: 2,
    title: "React 设计模式",
    description: "React 应用开发中的最佳实践和设计模式",
    cover: "/doc2.jpg",
    articleCount: 8,
    views: 5234,
    status: "published",
    createdAt: "2026-01-15",
  },
  {
    id: 3,
    title: "TypeScript 高级技巧",
    description: "深入理解 TypeScript 类型系统",
    cover: "/doc3.jpg",
    articleCount: 6,
    views: 3456,
    status: "draft",
    createdAt: "2026-01-10",
  },
  {
    id: 4,
    title: "Go 语言实战",
    description: "Go 语言后端开发实践指南",
    cover: "/doc4.jpg",
    articleCount: 15,
    views: 7890,
    status: "published",
    createdAt: "2026-01-05",
  },
];

type DocSeriesItem = (typeof mockDocSeries)[number];

export default function DocSeriesPage() {
  const [series] = useState(mockDocSeries);

  const SeriesCard = ({ item, index }: { item: DocSeriesItem; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all"
    >
      {/* 封面 */}
      <div className="relative aspect-[21/9] bg-linear-to-br from-primary/5 to-primary/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="w-12 h-12 text-primary/30" />
        </div>
        {item.status === "draft" && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-yellow/80 text-white text-xs font-medium">
            草稿
          </div>
        )}
      </div>

      {/* 内容 */}
      <div className="p-5">
        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{item.title}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>

        {/* 统计 */}
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            {item.articleCount} 篇文章
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {item.views.toLocaleString()} 阅读
          </span>
        </div>

        {/* 操作 */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(item.createdAt)}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 gap-1 text-primary hover:text-primary">
              查看
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red hover:text-red hover:bg-red/10">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="文档系列"
        description="创建系统化的文档和教程系列"
        icon={BookOpen}
        primaryAction={{
          label: "新建系列",
          icon: Plus,
          onClick: () => console.log("Create series"),
        }}
      />

      {/* 统计 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AdminCard>
          <p className="text-3xl font-bold">{series.length}</p>
          <p className="text-sm text-muted-foreground mt-1">系列总数</p>
        </AdminCard>
        <AdminCard delay={0.05}>
          <p className="text-3xl font-bold text-primary">{series.reduce((acc, s) => acc + s.articleCount, 0)}</p>
          <p className="text-sm text-muted-foreground mt-1">文章总数</p>
        </AdminCard>
        <AdminCard delay={0.1}>
          <p className="text-3xl font-bold text-green">{series.filter(s => s.status === "published").length}</p>
          <p className="text-sm text-muted-foreground mt-1">已发布</p>
        </AdminCard>
        <AdminCard delay={0.15}>
          <p className="text-3xl font-bold text-orange">
            {series.reduce((acc, s) => acc + s.views, 0).toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mt-1">总阅读量</p>
        </AdminCard>
      </div>

      {/* 系列列表 */}
      {series.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {series.map((item, index) => (
            <SeriesCard key={item.id} item={item} index={index} />
          ))}
        </div>
      ) : (
        <AdminCard>
          <EmptyState
            icon={BookOpen}
            title="暂无文档系列"
            description="创建您的第一个文档系列，系统化组织您的内容"
            action={{
              label: "新建系列",
              icon: Plus,
              onClick: () => console.log("Create series"),
            }}
          />
        </AdminCard>
      )}
    </div>
  );
}
