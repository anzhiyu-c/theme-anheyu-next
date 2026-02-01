"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AdminPageHeader, AdminCard, AdminDataTable, type Column, EmptyState } from "@/components/admin";
import { Button } from "@/components/ui";
import {
  Link2,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Check,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

// 模拟友链数据
const mockFriends = [
  {
    id: 1,
    name: "张三的博客",
    url: "https://zhangsan.com",
    avatar: "/avatar1.jpg",
    description: "一个前端开发者的个人博客",
    status: "approved",
    createdAt: "2026-01-25",
  },
  {
    id: 2,
    name: "李四的技术小站",
    url: "https://lisi.dev",
    avatar: "/avatar2.jpg",
    description: "专注于后端技术分享",
    status: "approved",
    createdAt: "2026-01-20",
  },
  {
    id: 3,
    name: "王五的代码世界",
    url: "https://wangwu.io",
    avatar: "/avatar3.jpg",
    description: "全栈开发，技术分享",
    status: "pending",
    createdAt: "2026-01-28",
  },
  {
    id: 4,
    name: "赵六笔记",
    url: "https://zhaoliu.me",
    avatar: "/avatar4.jpg",
    description: "记录学习与生活",
    status: "approved",
    createdAt: "2026-01-15",
  },
  {
    id: 5,
    name: "测试站点",
    url: "https://test.com",
    avatar: "/avatar5.jpg",
    description: "链接已失效",
    status: "offline",
    createdAt: "2026-01-10",
  },
  {
    id: 6,
    name: "新申请",
    url: "https://newsite.com",
    avatar: "/avatar6.jpg",
    description: "希望交换友链",
    status: "pending",
    createdAt: "2026-01-30",
  },
];

type FriendItem = (typeof mockFriends)[number];

const statusConfig: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; className: string }
> = {
  approved: { label: "已通过", icon: CheckCircle, className: "text-green bg-green/10" },
  pending: { label: "待审核", icon: Clock, className: "text-yellow bg-yellow/10" },
  offline: { label: "已失效", icon: AlertCircle, className: "text-red bg-red/10" },
};

export default function FriendsPage() {
  const [friends] = useState(mockFriends);
  const [filter, setFilter] = useState("all");

  const filteredFriends = filter === "all" ? friends : friends.filter(f => f.status === filter);

  const columns: Column<FriendItem>[] = [
    {
      key: "name",
      header: "站点",
      render: friend => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-medium">
            {friend.name[0]}
          </div>
          <div>
            <p className="font-medium">{friend.name}</p>
            <a
              href={friend.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
            >
              {friend.url}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      ),
    },
    {
      key: "description",
      header: "描述",
      render: friend => <p className="max-w-xs truncate text-muted-foreground">{friend.description}</p>,
    },
    {
      key: "status",
      header: "状态",
      render: friend => {
        const config = statusConfig[friend.status];
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
      header: "添加时间",
      sortable: true,
      render: friend => <span className="text-sm text-muted-foreground">{formatDate(friend.createdAt)}</span>,
    },
  ];

  const FriendCard = ({ friend, index }: { friend: FriendItem; index: number }) => {
    const config = statusConfig[friend.status];
    const StatusIcon = config.icon;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.03 }}
        className="group bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:border-primary/30 transition-all"
      >
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-semibold text-lg shrink-0">
            {friend.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate">{friend.name}</h3>
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium",
                  config.className
                )}
              >
                <StatusIcon className="w-3 h-3" />
                {config.label}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{friend.description}</p>
            <a
              href={friend.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
            >
              {friend.url}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
          <span className="text-xs text-muted-foreground">{formatDate(friend.createdAt)}</span>
          <div className="flex items-center gap-1">
            {friend.status === "pending" && (
              <>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-green hover:text-green hover:bg-green/10">
                  <Check className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red hover:text-red hover:bg-red/10">
                  <X className="w-3.5 h-3.5" />
                </Button>
              </>
            )}
            {friend.status === "offline" && (
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
            )}
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Edit className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red hover:text-red hover:bg-red/10">
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  const filterTabs = [
    { key: "all", label: "全部", count: friends.length },
    { key: "approved", label: "已通过", count: friends.filter(f => f.status === "approved").length },
    { key: "pending", label: "待审核", count: friends.filter(f => f.status === "pending").length },
    { key: "offline", label: "已失效", count: friends.filter(f => f.status === "offline").length },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="友链管理"
        description="管理您的友情链接"
        icon={Link2}
        primaryAction={{
          label: "添加友链",
          icon: Plus,
          onClick: () => console.log("Add friend"),
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
              <p
                className={cn(
                  "text-3xl font-bold",
                  tab.key === "pending" && "text-yellow",
                  tab.key === "offline" && "text-red",
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

      {/* 友链列表 - 卡片视图 */}
      {filteredFriends.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFriends.map((friend, index) => (
            <FriendCard key={friend.id} friend={friend} index={index} />
          ))}
        </div>
      ) : (
        <AdminCard>
          <EmptyState
            icon={Link2}
            title="暂无友链"
            description="添加您的第一个友情链接"
            action={{
              label: "添加友链",
              icon: Plus,
              onClick: () => console.log("Add friend"),
            }}
          />
        </AdminCard>
      )}
    </div>
  );
}
