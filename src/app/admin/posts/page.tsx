"use client";

import { useState } from "react";
import { AdminPageHeader, AdminCard, AdminDataTable, type Column } from "@/components/admin";
import { Button } from "@/components/ui";
import { FileText, Plus, Edit, Trash2, Eye, EyeOff, Clock, CheckCircle, Tag } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

// 模拟文章数据
const mockPosts = [
  {
    id: 1,
    title: "Next.js 16 新特性详解",
    category: "技术",
    status: "published",
    views: 1234,
    createdAt: "2026-01-30",
    author: "安知鱼",
  },
  {
    id: 2,
    title: "Tailwind CSS v4 迁移指南",
    category: "教程",
    status: "published",
    views: 876,
    createdAt: "2026-01-28",
    author: "安知鱼",
  },
  {
    id: 3,
    title: "React 19 新功能一览",
    category: "技术",
    status: "draft",
    views: 0,
    createdAt: "2026-01-27",
    author: "安知鱼",
  },
  {
    id: 4,
    title: "TypeScript 5.0 最佳实践",
    category: "技术",
    status: "published",
    views: 654,
    createdAt: "2026-01-25",
    author: "安知鱼",
  },
  {
    id: 5,
    title: "博客主题设计思路",
    category: "设计",
    status: "pending",
    views: 0,
    createdAt: "2026-01-24",
    author: "安知鱼",
  },
  {
    id: 6,
    title: "Go 语言并发编程",
    category: "技术",
    status: "published",
    views: 543,
    createdAt: "2026-01-22",
    author: "安知鱼",
  },
  {
    id: 7,
    title: "Docker 容器化部署",
    category: "运维",
    status: "published",
    views: 432,
    createdAt: "2026-01-20",
    author: "安知鱼",
  },
  {
    id: 8,
    title: "Kubernetes 入门指南",
    category: "运维",
    status: "draft",
    views: 0,
    createdAt: "2026-01-18",
    author: "安知鱼",
  },
];

type PostItem = (typeof mockPosts)[number];

const statusConfig: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; className: string }
> = {
  published: { label: "已发布", icon: CheckCircle, className: "text-green bg-green/10" },
  draft: { label: "草稿", icon: Clock, className: "text-yellow bg-yellow/10" },
  pending: { label: "待审核", icon: EyeOff, className: "text-orange bg-orange/10" },
};

export default function PostsPage() {
  const [posts] = useState(mockPosts);
  const [filter, setFilter] = useState("all");

  const filteredPosts = filter === "all" ? posts : posts.filter(p => p.status === filter);

  const columns: Column<PostItem>[] = [
    {
      key: "title",
      header: "标题",
      render: post => (
        <div className="max-w-md">
          <p className="font-medium truncate">{post.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">作者: {post.author}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "分类",
      render: post => (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
          <Tag className="w-3 h-3" />
          {post.category}
        </span>
      ),
    },
    {
      key: "status",
      header: "状态",
      render: post => {
        const config = statusConfig[post.status];
        const Icon = config.icon;
        return (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
              config.className
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {config.label}
          </span>
        );
      },
    },
    {
      key: "views",
      header: "浏览量",
      sortable: true,
      align: "center",
      render: post => (
        <div className="flex items-center justify-center gap-1 text-muted-foreground">
          <Eye className="w-3.5 h-3.5" />
          {post.views.toLocaleString()}
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "创建时间",
      sortable: true,
      render: post => <span className="text-muted-foreground text-sm">{formatDate(post.createdAt)}</span>,
    },
  ];

  const filterTabs = [
    { key: "all", label: "全部", count: posts.length },
    { key: "published", label: "已发布", count: posts.filter(p => p.status === "published").length },
    { key: "draft", label: "草稿", count: posts.filter(p => p.status === "draft").length },
    { key: "pending", label: "待审核", count: posts.filter(p => p.status === "pending").length },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="文章管理"
        description="创建和管理您的博客文章"
        icon={FileText}
        primaryAction={{
          label: "新建文章",
          icon: Plus,
          onClick: () => console.log("Create post"),
        }}
      />

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {filterTabs.map((tab, index) => (
          <AdminCard key={tab.key} delay={index * 0.05}>
            <button
              onClick={() => setFilter(tab.key)}
              className={cn(
                "w-full text-left transition-colors",
                filter === tab.key && "ring-2 ring-primary ring-offset-2 ring-offset-background rounded-lg"
              )}
            >
              <p className="text-3xl font-bold">{tab.count}</p>
              <p className="text-sm text-muted-foreground mt-1">{tab.label}</p>
            </button>
          </AdminCard>
        ))}
      </div>

      {/* 文章列表 */}
      <AdminCard title="文章列表" noPadding>
        <AdminDataTable
          data={filteredPosts}
          columns={columns}
          searchable
          searchPlaceholder="搜索文章标题..."
          searchKeys={["title", "category", "author"]}
          rowActions={() => (
            <div className="flex items-center gap-1 justify-end">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red hover:text-red hover:bg-red/10">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        />
      </AdminCard>
    </div>
  );
}
