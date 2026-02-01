"use client";

import { useState } from "react";
import { AdminPageHeader, AdminCard, AdminDataTable, type Column } from "@/components/admin";
import { Button } from "@/components/ui";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Mail,
  Calendar,
  MoreHorizontal,
  Ban,
  CheckCircle,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

// 模拟用户数据
const mockUsers = [
  {
    id: 1,
    username: "admin",
    email: "admin@example.com",
    nickname: "管理员",
    role: "admin",
    status: "active",
    createdAt: "2025-01-01",
    lastLogin: "2026-01-30",
  },
  {
    id: 2,
    username: "zhangsan",
    email: "zhangsan@example.com",
    nickname: "张三",
    role: "user",
    status: "active",
    createdAt: "2025-06-15",
    lastLogin: "2026-01-29",
  },
  {
    id: 3,
    username: "lisi",
    email: "lisi@example.com",
    nickname: "李四",
    role: "user",
    status: "active",
    createdAt: "2025-08-20",
    lastLogin: "2026-01-28",
  },
  {
    id: 4,
    username: "wangwu",
    email: "wangwu@example.com",
    nickname: "王五",
    role: "editor",
    status: "active",
    createdAt: "2025-09-10",
    lastLogin: "2026-01-25",
  },
  {
    id: 5,
    username: "zhaoliu",
    email: "zhaoliu@example.com",
    nickname: "赵六",
    role: "user",
    status: "banned",
    createdAt: "2025-10-05",
    lastLogin: "2026-01-15",
  },
  {
    id: 6,
    username: "sunqi",
    email: "sunqi@example.com",
    nickname: "孙七",
    role: "user",
    status: "active",
    createdAt: "2025-11-20",
    lastLogin: "2026-01-20",
  },
];

type UserItem = (typeof mockUsers)[number];

const roleConfig: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; className: string }
> = {
  admin: { label: "管理员", icon: ShieldCheck, className: "text-primary bg-primary/10" },
  editor: { label: "编辑", icon: Shield, className: "text-blue bg-blue/10" },
  user: { label: "用户", icon: Shield, className: "text-muted-foreground bg-muted" },
};

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "正常", className: "text-green bg-green/10" },
  banned: { label: "已封禁", className: "text-red bg-red/10" },
};

export default function UsersPage() {
  const [users] = useState(mockUsers);

  const columns: Column<UserItem>[] = [
    {
      key: "username",
      header: "用户",
      render: user => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-medium">
            {user.nickname[0]}
          </div>
          <div>
            <p className="font-medium">{user.nickname}</p>
            <p className="text-xs text-muted-foreground">@{user.username}</p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "邮箱",
      render: user => (
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Mail className="w-3.5 h-3.5" />
          {user.email}
        </span>
      ),
    },
    {
      key: "role",
      header: "角色",
      render: user => {
        const config = roleConfig[user.role];
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
      key: "status",
      header: "状态",
      render: user => {
        const config = statusConfig[user.status];
        return (
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
              config.className
            )}
          >
            {user.status === "active" ? <CheckCircle className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
            {config.label}
          </span>
        );
      },
    },
    {
      key: "lastLogin",
      header: "最后登录",
      sortable: true,
      render: user => <span className="text-sm text-muted-foreground">{formatDate(user.lastLogin)}</span>,
    },
    {
      key: "createdAt",
      header: "注册时间",
      sortable: true,
      render: user => <span className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="用户管理"
        description="管理您网站的注册用户"
        icon={Users}
        primaryAction={{
          label: "添加用户",
          icon: Plus,
          onClick: () => console.log("Add user"),
        }}
      />

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AdminCard>
          <p className="text-3xl font-bold">{users.length}</p>
          <p className="text-sm text-muted-foreground mt-1">用户总数</p>
        </AdminCard>
        <AdminCard delay={0.05}>
          <p className="text-3xl font-bold text-primary">{users.filter(u => u.role === "admin").length}</p>
          <p className="text-sm text-muted-foreground mt-1">管理员</p>
        </AdminCard>
        <AdminCard delay={0.1}>
          <p className="text-3xl font-bold text-green">{users.filter(u => u.status === "active").length}</p>
          <p className="text-sm text-muted-foreground mt-1">活跃用户</p>
        </AdminCard>
        <AdminCard delay={0.15}>
          <p className="text-3xl font-bold text-red">{users.filter(u => u.status === "banned").length}</p>
          <p className="text-sm text-muted-foreground mt-1">已封禁</p>
        </AdminCard>
      </div>

      {/* 用户列表 */}
      <AdminCard title="用户列表" noPadding>
        <AdminDataTable
          data={users}
          columns={columns}
          searchable
          searchPlaceholder="搜索用户名或邮箱..."
          searchKeys={["username", "nickname", "email"]}
          rowActions={user => (
            <div className="flex items-center gap-1 justify-end">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Edit className="w-4 h-4" />
              </Button>
              {user.status === "active" ? (
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red hover:text-red hover:bg-red/10">
                  <Ban className="w-4 h-4" />
                </Button>
              ) : (
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-green hover:text-green hover:bg-green/10">
                  <CheckCircle className="w-4 h-4" />
                </Button>
              )}
              {user.role !== "admin" && (
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red hover:text-red hover:bg-red/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        />
      </AdminCard>
    </div>
  );
}
