"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AdminPageHeader, AdminCard, AdminDataTable, type Column } from "@/components/admin";
import { Button } from "@/components/ui";
import {
  MessageSquare,
  Check,
  X,
  Trash2,
  Reply,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

// 模拟评论数据
const mockComments = [
  {
    id: 1,
    author: "张三",
    email: "zhang@example.com",
    content: "非常棒的文章！学到了很多。",
    postTitle: "Next.js 16 新特性详解",
    status: "approved",
    createdAt: "2026-01-30 15:30",
  },
  {
    id: 2,
    author: "李四",
    email: "li@example.com",
    content: "期待更多这样的内容！",
    postTitle: "Tailwind CSS v4 迁移指南",
    status: "pending",
    createdAt: "2026-01-30 14:20",
  },
  {
    id: 3,
    author: "王五",
    email: "wang@example.com",
    content: "这个方法我试过了，确实有效👍",
    postTitle: "React 19 新功能一览",
    status: "approved",
    createdAt: "2026-01-29 18:45",
  },
  {
    id: 4,
    author: "spam_user",
    email: "spam@test.com",
    content: "广告内容...",
    postTitle: "TypeScript 5.0 最佳实践",
    status: "spam",
    createdAt: "2026-01-29 12:00",
  },
  {
    id: 5,
    author: "赵六",
    email: "zhao@example.com",
    content: "能不能出一个视频教程？",
    postTitle: "Docker 容器化部署",
    status: "pending",
    createdAt: "2026-01-28 20:15",
  },
  {
    id: 6,
    author: "陈七",
    email: "chen@example.com",
    content: "已经在项目中应用了，效果很好",
    postTitle: "Go 语言并发编程",
    status: "approved",
    createdAt: "2026-01-28 10:30",
  },
];

type CommentItem = (typeof mockComments)[number];

const statusConfig: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; className: string }
> = {
  approved: { label: "已通过", icon: CheckCircle, className: "text-green bg-green/10" },
  pending: { label: "待审核", icon: Clock, className: "text-yellow bg-yellow/10" },
  spam: { label: "垃圾", icon: AlertCircle, className: "text-red bg-red/10" },
};

export default function CommentsPage() {
  const [comments] = useState(mockComments);
  const [filter, setFilter] = useState("all");

  const filteredComments = filter === "all" ? comments : comments.filter(c => c.status === filter);

  const columns: Column<CommentItem>[] = [
    {
      key: "author",
      header: "评论者",
      render: comment => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-medium text-sm">
            {comment.author[0]}
          </div>
          <div>
            <p className="font-medium">{comment.author}</p>
            <p className="text-xs text-muted-foreground">{comment.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "content",
      header: "内容",
      render: comment => (
        <div className="max-w-md">
          <p className="truncate">{comment.content}</p>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
            <ExternalLink className="w-3 h-3" />
            {comment.postTitle}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "状态",
      render: comment => {
        const config = statusConfig[comment.status];
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
      key: "createdAt",
      header: "时间",
      sortable: true,
      render: comment => <span className="text-sm text-muted-foreground">{formatDate(comment.createdAt)}</span>,
    },
  ];

  const filterTabs = [
    { key: "all", label: "全部", count: comments.length },
    { key: "pending", label: "待审核", count: comments.filter(c => c.status === "pending").length },
    { key: "approved", label: "已通过", count: comments.filter(c => c.status === "approved").length },
    { key: "spam", label: "垃圾", count: comments.filter(c => c.status === "spam").length },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader title="评论管理" description="审核和管理用户评论" icon={MessageSquare} />

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
              <p
                className={cn(
                  "text-3xl font-bold",
                  tab.key === "pending" && "text-yellow",
                  tab.key === "spam" && "text-red",
                  tab.key === "approved" && "text-green"
                )}
              >
                {tab.count}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{tab.label}</p>
            </button>
          </AdminCard>
        ))}
      </div>

      {/* 评论列表 */}
      <AdminCard title="评论列表" noPadding>
        <AdminDataTable
          data={filteredComments}
          columns={columns}
          searchable
          searchPlaceholder="搜索评论内容或作者..."
          searchKeys={["author", "content", "postTitle"]}
          rowActions={comment => (
            <div className="flex items-center gap-1 justify-end">
              {comment.status === "pending" && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-green hover:text-green hover:bg-green/10"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red hover:text-red hover:bg-red/10">
                    <X className="w-4 h-4" />
                  </Button>
                </>
              )}
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Reply className="w-4 h-4" />
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
