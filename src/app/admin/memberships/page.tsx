"use client";

import { useState } from "react";
import { AdminPageHeader, AdminCard, AdminDataTable, type Column } from "@/components/admin";
import { Button } from "@/components/ui";
import { Crown, Edit, CheckCircle, Clock, Star, Gift, Calendar, TrendingUp, Sparkles } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

// 模拟会员数据
const mockMembers = [
  {
    id: 1,
    username: "张三",
    email: "zhang@test.com",
    plan: "年卡",
    status: "active",
    startDate: "2026-01-15",
    endDate: "2027-01-15",
    amount: 299,
  },
  {
    id: 2,
    username: "李四",
    email: "li@test.com",
    plan: "季卡",
    status: "active",
    startDate: "2026-01-01",
    endDate: "2026-04-01",
    amount: 99,
  },
  {
    id: 3,
    username: "王五",
    email: "wang@test.com",
    plan: "月卡",
    status: "active",
    startDate: "2026-01-20",
    endDate: "2026-02-20",
    amount: 39,
  },
  {
    id: 4,
    username: "赵六",
    email: "zhao@test.com",
    plan: "年卡",
    status: "expired",
    startDate: "2025-01-10",
    endDate: "2026-01-10",
    amount: 299,
  },
  {
    id: 5,
    username: "孙七",
    email: "sun@test.com",
    plan: "季卡",
    status: "active",
    startDate: "2025-12-01",
    endDate: "2026-03-01",
    amount: 99,
  },
  {
    id: 6,
    username: "周八",
    email: "zhou@test.com",
    plan: "月卡",
    status: "expiring",
    startDate: "2026-01-05",
    endDate: "2026-02-05",
    amount: 39,
  },
];

type MemberItem = (typeof mockMembers)[number];

const statusConfig: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; className: string }
> = {
  active: { label: "有效", icon: CheckCircle, className: "text-green bg-green/10" },
  expired: { label: "已过期", icon: Clock, className: "text-muted-foreground bg-muted" },
  expiring: { label: "即将到期", icon: Clock, className: "text-yellow bg-yellow/10" },
};

const planConfig: Record<string, { label: string; className: string }> = {
  年卡: { label: "年卡", className: "text-primary bg-primary/10" },
  季卡: { label: "季卡", className: "text-blue bg-blue/10" },
  月卡: { label: "月卡", className: "text-green bg-green/10" },
};

export default function MembershipsPage() {
  const [members] = useState(mockMembers);
  const [filter, setFilter] = useState("all");

  const filteredMembers = filter === "all" ? members : members.filter(m => m.status === filter);

  // 计算统计数据
  const activeMembers = members.filter(m => m.status === "active" || m.status === "expiring").length;
  const totalRevenue = members.reduce((acc, m) => acc + m.amount, 0);
  const expiringCount = members.filter(m => m.status === "expiring").length;

  const columns: Column<MemberItem>[] = [
    {
      key: "username",
      header: "会员",
      render: member => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-yellow/20 to-yellow/40 flex items-center justify-center">
            <Crown className="w-5 h-5 text-yellow" />
          </div>
          <div>
            <p className="font-medium">{member.username}</p>
            <p className="text-xs text-muted-foreground">{member.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "plan",
      header: "套餐",
      render: member => {
        const config = planConfig[member.plan];
        return (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
              config.className
            )}
          >
            <Star className="w-3.5 h-3.5" />
            {config.label}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "状态",
      render: member => {
        const config = statusConfig[member.status];
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
      key: "endDate",
      header: "到期时间",
      sortable: true,
      render: member => (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(member.endDate)}
        </div>
      ),
    },
    {
      key: "amount",
      header: "金额",
      sortable: true,
      align: "right",
      render: member => <span className="font-semibold">¥{member.amount}</span>,
    },
  ];

  const filterTabs = [
    { key: "all", label: "全部", count: members.length },
    { key: "active", label: "有效", count: members.filter(m => m.status === "active").length },
    { key: "expiring", label: "即将到期", count: members.filter(m => m.status === "expiring").length },
    { key: "expired", label: "已过期", count: members.filter(m => m.status === "expired").length },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="会员管理"
        description="管理 Pro 会员订阅"
        icon={Crown}
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
            <div className="p-2.5 rounded-xl bg-yellow/10">
              <Crown className="w-6 h-6 text-yellow" />
            </div>
            <div>
              <p className="text-2xl font-bold">{members.length}</p>
              <p className="text-xs text-muted-foreground">会员总数</p>
            </div>
          </div>
        </AdminCard>
        <AdminCard delay={0.05}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-green/10">
              <CheckCircle className="w-6 h-6 text-green" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeMembers}</p>
              <p className="text-xs text-muted-foreground">活跃会员</p>
            </div>
          </div>
        </AdminCard>
        <AdminCard delay={0.1}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">¥{totalRevenue}</p>
              <p className="text-xs text-muted-foreground">会员收入</p>
            </div>
          </div>
        </AdminCard>
        <AdminCard delay={0.15}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange/10">
              <Clock className="w-6 h-6 text-orange" />
            </div>
            <div>
              <p className="text-2xl font-bold">{expiringCount}</p>
              <p className="text-xs text-muted-foreground">即将到期</p>
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

      {/* 会员列表 */}
      <AdminCard title="会员列表" noPadding>
        <AdminDataTable
          data={filteredMembers}
          columns={columns}
          searchable
          searchPlaceholder="搜索会员..."
          searchKeys={["username", "email"]}
          rowActions={() => (
            <div className="flex items-center gap-1 justify-end">
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-primary">
                <Gift className="w-3.5 h-3.5" />
                续费
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          )}
        />
      </AdminCard>
    </div>
  );
}
