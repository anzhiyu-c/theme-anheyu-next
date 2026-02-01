"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AdminPageHeader, AdminCard, AdminDataTable, type Column, EmptyState } from "@/components/admin";
import { Button, Input } from "@/components/ui";
import {
  Brain,
  Plus,
  Edit,
  Trash2,
  Search,
  FileText,
  MessagesSquare,
  Zap,
  Settings,
  RefreshCw,
  Database,
  Sparkles,
  Upload,
} from "lucide-react";
import { cn, formatDate, formatBytes } from "@/lib/utils";

// 模拟知识库数据
const mockKnowledge = [
  {
    id: 1,
    name: "博客文档",
    description: "包含所有博客文章的知识库",
    documentCount: 128,
    size: 15.6 * 1024 * 1024,
    status: "ready",
    lastUpdated: "2026-01-30",
  },
  {
    id: 2,
    name: "技术文档",
    description: "技术相关的参考文档",
    documentCount: 45,
    size: 8.2 * 1024 * 1024,
    status: "ready",
    lastUpdated: "2026-01-28",
  },
  {
    id: 3,
    name: "FAQ 问答",
    description: "常见问题和解答",
    documentCount: 32,
    size: 2.1 * 1024 * 1024,
    status: "indexing",
    lastUpdated: "2026-01-30",
  },
  {
    id: 4,
    name: "产品手册",
    description: "产品使用说明和教程",
    documentCount: 18,
    size: 5.4 * 1024 * 1024,
    status: "ready",
    lastUpdated: "2026-01-25",
  },
];

type KnowledgeItem = (typeof mockKnowledge)[number];

const statusConfig: Record<string, { label: string; className: string }> = {
  ready: { label: "就绪", className: "text-green bg-green/10" },
  indexing: { label: "索引中", className: "text-yellow bg-yellow/10" },
  error: { label: "错误", className: "text-red bg-red/10" },
};

export default function KnowledgePage() {
  const [knowledgeBases] = useState(mockKnowledge);

  // 计算统计数据
  const totalDocs = knowledgeBases.reduce((acc, kb) => acc + kb.documentCount, 0);
  const totalSize = knowledgeBases.reduce((acc, kb) => acc + kb.size, 0);

  const columns: Column<KnowledgeItem>[] = [
    {
      key: "name",
      header: "知识库",
      render: kb => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{kb.name}</p>
            <p className="text-xs text-muted-foreground">{kb.description}</p>
          </div>
        </div>
      ),
    },
    {
      key: "documentCount",
      header: "文档数",
      sortable: true,
      align: "center",
      render: kb => (
        <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
          <FileText className="w-4 h-4" />
          {kb.documentCount}
        </div>
      ),
    },
    {
      key: "size",
      header: "大小",
      sortable: true,
      render: kb => <span className="text-muted-foreground">{formatBytes(kb.size)}</span>,
    },
    {
      key: "status",
      header: "状态",
      render: kb => {
        const config = statusConfig[kb.status];
        return (
          <span className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium", config.className)}>
            {kb.status === "indexing" && <RefreshCw className="w-3 h-3 mr-1 animate-spin" />}
            {config.label}
          </span>
        );
      },
    },
    {
      key: "lastUpdated",
      header: "更新时间",
      sortable: true,
      render: kb => <span className="text-sm text-muted-foreground">{formatDate(kb.lastUpdated)}</span>,
    },
  ];

  const KnowledgeCard = ({ kb, index }: { kb: KnowledgeItem; index: number }) => {
    const config = statusConfig[kb.status];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-card border border-border/50 rounded-xl p-5 hover:shadow-lg hover:border-primary/30 transition-all"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-linear-to-br from-primary/10 to-primary/20">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{kb.name}</h3>
              <p className="text-sm text-muted-foreground">{kb.description}</p>
            </div>
          </div>
          <span className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium", config.className)}>
            {kb.status === "indexing" && <RefreshCw className="w-3 h-3 mr-1 animate-spin" />}
            {config.label}
          </span>
        </div>

        {/* 统计 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold">{kb.documentCount}</p>
            <p className="text-xs text-muted-foreground">文档数量</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold">{formatBytes(kb.size)}</p>
            <p className="text-xs text-muted-foreground">存储大小</p>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-2 pt-4 border-t border-border/50">
          <Button variant="outline" size="sm" className="flex-1 gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            添加文档
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-1.5">
            <MessagesSquare className="w-3.5 h-3.5" />
            测试问答
          </Button>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-red hover:text-red hover:bg-red/10">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="知识库管理"
        description="管理 AI 智能问答的知识库"
        icon={Brain}
        primaryAction={{
          label: "创建知识库",
          icon: Plus,
          onClick: () => console.log("Create knowledge base"),
        }}
      />

      {/* 功能介绍 */}
      <AdminCard className="bg-linear-to-r from-primary/5 to-primary/10 border-primary/20">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">AI 智能问答</h3>
            <p className="text-sm text-muted-foreground mt-1">
              基于知识库的 AI 助手可以回答访客关于您网站内容的问题，提供智能化的用户体验。
            </p>
          </div>
          <Button className="gap-2">
            <Zap className="w-4 h-4" />
            开始使用
          </Button>
        </div>
      </AdminCard>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AdminCard>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{knowledgeBases.length}</p>
              <p className="text-xs text-muted-foreground">知识库数量</p>
            </div>
          </div>
        </AdminCard>
        <AdminCard delay={0.05}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue/10">
              <FileText className="w-6 h-6 text-blue" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalDocs}</p>
              <p className="text-xs text-muted-foreground">文档总数</p>
            </div>
          </div>
        </AdminCard>
        <AdminCard delay={0.1}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-green/10">
              <Brain className="w-6 h-6 text-green" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatBytes(totalSize)}</p>
              <p className="text-xs text-muted-foreground">总存储</p>
            </div>
          </div>
        </AdminCard>
        <AdminCard delay={0.15}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange/10">
              <MessagesSquare className="w-6 h-6 text-orange" />
            </div>
            <div>
              <p className="text-2xl font-bold">1.2k</p>
              <p className="text-xs text-muted-foreground">本月问答</p>
            </div>
          </div>
        </AdminCard>
      </div>

      {/* 知识库列表 - 卡片视图 */}
      {knowledgeBases.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {knowledgeBases.map((kb, index) => (
            <KnowledgeCard key={kb.id} kb={kb} index={index} />
          ))}
        </div>
      ) : (
        <AdminCard>
          <EmptyState
            icon={Brain}
            title="暂无知识库"
            description="创建您的第一个知识库，让 AI 助手更智能"
            action={{
              label: "创建知识库",
              icon: Plus,
              onClick: () => console.log("Create knowledge base"),
            }}
          />
        </AdminCard>
      )}
    </div>
  );
}
