"use client";

import { useState } from "react";
import { AdminPageHeader, AdminCard, AdminDataTable, type Column } from "@/components/admin";
import { Button } from "@/components/ui";
import {
  HeadphonesIcon,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Eye,
  Send,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateCN } from "@/utils/date";

// 模拟工单数据
const mockTickets = [
  {
    id: "TK001",
    title: "会员功能无法使用",
    user: "张三",
    email: "zhang@test.com",
    priority: "high",
    status: "open",
    category: "功能问题",
    createdAt: "2026-01-30 15:30",
    updatedAt: "2026-01-30 16:00",
  },
  {
    id: "TK002",
    title: "订单支付失败",
    user: "李四",
    email: "li@test.com",
    priority: "high",
    status: "processing",
    category: "支付问题",
    createdAt: "2026-01-30 12:15",
    updatedAt: "2026-01-30 14:30",
  },
  {
    id: "TK003",
    title: "主题安装问题",
    user: "王五",
    email: "wang@test.com",
    priority: "medium",
    status: "resolved",
    category: "安装部署",
    createdAt: "2026-01-29 18:45",
    updatedAt: "2026-01-30 09:00",
  },
  {
    id: "TK004",
    title: "如何导出数据",
    user: "赵六",
    email: "zhao@test.com",
    priority: "low",
    status: "resolved",
    category: "使用咨询",
    createdAt: "2026-01-28 09:00",
    updatedAt: "2026-01-28 11:30",
  },
  {
    id: "TK005",
    title: "申请退款",
    user: "孙七",
    email: "sun@test.com",
    priority: "medium",
    status: "closed",
    category: "退款申请",
    createdAt: "2026-01-27 14:30",
    updatedAt: "2026-01-28 10:00",
  },
];

type TicketItem = (typeof mockTickets)[number];

const statusConfig: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; className: string }
> = {
  open: { label: "待处理", icon: AlertCircle, className: "text-red bg-red/10" },
  processing: { label: "处理中", icon: Clock, className: "text-yellow bg-yellow/10" },
  resolved: { label: "已解决", icon: CheckCircle, className: "text-green bg-green/10" },
  closed: { label: "已关闭", icon: XCircle, className: "text-muted-foreground bg-muted" },
};

const priorityConfig: Record<string, { label: string; className: string }> = {
  high: { label: "紧急", className: "text-red bg-red/10" },
  medium: { label: "普通", className: "text-yellow bg-yellow/10" },
  low: { label: "低优", className: "text-green bg-green/10" },
};

export default function SupportsPage() {
  const [tickets] = useState(mockTickets);
  const [filter, setFilter] = useState("all");

  const filteredTickets = filter === "all" ? tickets : tickets.filter(t => t.status === filter);

  const columns: Column<TicketItem>[] = [
    {
      key: "id",
      header: "工单号",
      render: ticket => <span className="font-mono text-sm">{ticket.id}</span>,
    },
    {
      key: "title",
      header: "问题",
      render: ticket => (
        <div className="max-w-xs">
          <p className="font-medium truncate">{ticket.title}</p>
          <p className="text-xs text-muted-foreground">{ticket.category}</p>
        </div>
      ),
    },
    {
      key: "user",
      header: "用户",
      render: ticket => (
        <div>
          <p className="font-medium">{ticket.user}</p>
          <p className="text-xs text-muted-foreground">{ticket.email}</p>
        </div>
      ),
    },
    {
      key: "priority",
      header: "优先级",
      render: ticket => {
        const config = priorityConfig[ticket.priority];
        return (
          <span className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium", config.className)}>
            {config.label}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "状态",
      render: ticket => {
        const config = statusConfig[ticket.status];
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
      key: "updatedAt",
      header: "更新时间",
      sortable: true,
      render: ticket => <span className="text-sm text-muted-foreground">{formatDateCN(ticket.updatedAt)}</span>,
    },
  ];

  const filterTabs = [
    { key: "all", label: "全部", count: tickets.length },
    { key: "open", label: "待处理", count: tickets.filter(t => t.status === "open").length },
    { key: "processing", label: "处理中", count: tickets.filter(t => t.status === "processing").length },
    { key: "resolved", label: "已解决", count: tickets.filter(t => t.status === "resolved").length },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="售后工单"
        description="处理用户的售后问题和咨询"
        icon={HeadphonesIcon}
        actions={
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow/10 text-yellow text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            PRO 功能
          </div>
        }
      />

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AdminCard>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <HeadphonesIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{tickets.length}</p>
              <p className="text-xs text-muted-foreground">工单总数</p>
            </div>
          </div>
        </AdminCard>
        <AdminCard delay={0.05}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red/10">
              <AlertCircle className="w-6 h-6 text-red" />
            </div>
            <div>
              <p className="text-2xl font-bold">{tickets.filter(t => t.status === "open").length}</p>
              <p className="text-xs text-muted-foreground">待处理</p>
            </div>
          </div>
        </AdminCard>
        <AdminCard delay={0.1}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-yellow/10">
              <Clock className="w-6 h-6 text-yellow" />
            </div>
            <div>
              <p className="text-2xl font-bold">{tickets.filter(t => t.status === "processing").length}</p>
              <p className="text-xs text-muted-foreground">处理中</p>
            </div>
          </div>
        </AdminCard>
        <AdminCard delay={0.15}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-green/10">
              <CheckCircle className="w-6 h-6 text-green" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {tickets.filter(t => t.status === "resolved" || t.status === "closed").length}
              </p>
              <p className="text-xs text-muted-foreground">已解决</p>
            </div>
          </div>
        </AdminCard>
      </div>

      {/* 筛选标签 */}
      <div className="flex items-center gap-2">
        {filterTabs.map(tab => (
          <Button
            key={tab.key}
            variant={filter === tab.key ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(tab.key)}
            className="gap-1.5"
          >
            {tab.label}
            <span
              className={cn(
                "px-1.5 py-0.5 rounded text-[10px]",
                filter === tab.key ? "bg-primary-foreground/20" : "bg-muted"
              )}
            >
              {tab.count}
            </span>
          </Button>
        ))}
      </div>

      {/* 工单列表 */}
      <AdminCard title="工单列表" noPadding>
        <AdminDataTable
          data={filteredTickets}
          columns={columns}
          searchable
          searchPlaceholder="搜索工单号或用户..."
          searchKeys={["id", "title", "user"]}
          rowActions={ticket => (
            <div className="flex items-center gap-1 justify-end">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Eye className="w-4 h-4" />
              </Button>
              {(ticket.status === "open" || ticket.status === "processing") && (
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-primary">
                  <Send className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        />
      </AdminCard>
    </div>
  );
}
