"use client";

import { useState } from "react";
import { AdminPageHeader, AdminCard, AdminDataTable, type Column } from "@/components/admin";
import { Button } from "@/components/ui";
import {
  ShoppingCart,
  Eye,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateCN } from "@/utils/date";

// 模拟订单数据
const mockOrders = [
  {
    id: "ORD001",
    productName: "Pro 会员年卡",
    buyer: "张三",
    email: "zhang@test.com",
    amount: 299,
    status: "completed",
    payMethod: "支付宝",
    createdAt: "2026-01-30 14:30",
  },
  {
    id: "ORD002",
    productName: "主题皮肤包",
    buyer: "李四",
    email: "li@test.com",
    amount: 49,
    status: "pending",
    payMethod: "微信支付",
    createdAt: "2026-01-30 12:15",
  },
  {
    id: "ORD003",
    productName: "Pro 会员月卡",
    buyer: "王五",
    email: "wang@test.com",
    amount: 39,
    status: "completed",
    payMethod: "微信支付",
    createdAt: "2026-01-29 18:45",
  },
  {
    id: "ORD004",
    productName: "知识库高级版",
    buyer: "赵六",
    email: "zhao@test.com",
    amount: 199,
    status: "refunded",
    payMethod: "支付宝",
    createdAt: "2026-01-28 09:00",
  },
  {
    id: "ORD005",
    productName: "Pro 会员季卡",
    buyer: "孙七",
    email: "sun@test.com",
    amount: 99,
    status: "completed",
    payMethod: "支付宝",
    createdAt: "2026-01-27 16:30",
  },
  {
    id: "ORD006",
    productName: "主题皮肤包",
    buyer: "周八",
    email: "zhou@test.com",
    amount: 49,
    status: "failed",
    payMethod: "微信支付",
    createdAt: "2026-01-26 11:20",
  },
];

type OrderItem = (typeof mockOrders)[number];

const statusConfig: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; className: string }
> = {
  completed: { label: "已完成", icon: CheckCircle, className: "text-green bg-green/10" },
  pending: { label: "待支付", icon: Clock, className: "text-yellow bg-yellow/10" },
  refunded: { label: "已退款", icon: AlertCircle, className: "text-orange bg-orange/10" },
  failed: { label: "已取消", icon: XCircle, className: "text-red bg-red/10" },
};

export default function OrdersPage() {
  const [orders] = useState(mockOrders);
  const [filter, setFilter] = useState("all");

  const filteredOrders = filter === "all" ? orders : orders.filter(o => o.status === filter);

  // 计算统计数据
  const totalRevenue = orders.filter(o => o.status === "completed").reduce((acc, o) => acc + o.amount, 0);
  const todayRevenue = orders
    .filter(o => o.status === "completed" && o.createdAt.includes("2026-01-30"))
    .reduce((acc, o) => acc + o.amount, 0);

  const columns: Column<OrderItem>[] = [
    {
      key: "id",
      header: "订单号",
      render: order => <span className="font-mono text-sm">{order.id}</span>,
    },
    {
      key: "productName",
      header: "商品",
      render: order => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Package className="w-4 h-4 text-primary" />
          </div>
          <span className="font-medium">{order.productName}</span>
        </div>
      ),
    },
    {
      key: "buyer",
      header: "买家",
      render: order => (
        <div>
          <p className="font-medium">{order.buyer}</p>
          <p className="text-xs text-muted-foreground">{order.email}</p>
        </div>
      ),
    },
    {
      key: "amount",
      header: "金额",
      sortable: true,
      align: "right",
      render: order => <span className="font-semibold text-primary">¥{order.amount}</span>,
    },
    {
      key: "payMethod",
      header: "支付方式",
      render: order => <span className="text-muted-foreground">{order.payMethod}</span>,
    },
    {
      key: "status",
      header: "状态",
      render: order => {
        const config = statusConfig[order.status];
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
      header: "下单时间",
      sortable: true,
      render: order => <span className="text-sm text-muted-foreground">{formatDateCN(order.createdAt)}</span>,
    },
  ];

  const filterTabs = [
    { key: "all", label: "全部", count: orders.length },
    { key: "completed", label: "已完成", count: orders.filter(o => o.status === "completed").length },
    { key: "pending", label: "待支付", count: orders.filter(o => o.status === "pending").length },
    { key: "refunded", label: "已退款", count: orders.filter(o => o.status === "refunded").length },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="订单管理"
        description="查看和管理商品订单"
        icon={ShoppingCart}
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
          <p className="text-3xl font-bold">{orders.length}</p>
          <p className="text-sm text-muted-foreground mt-1">订单总数</p>
        </AdminCard>
        <AdminCard delay={0.05}>
          <p className="text-3xl font-bold text-primary">¥{totalRevenue}</p>
          <p className="text-sm text-muted-foreground mt-1">总收入</p>
        </AdminCard>
        <AdminCard delay={0.1}>
          <p className="text-3xl font-bold text-green">¥{todayRevenue}</p>
          <p className="text-sm text-muted-foreground mt-1">今日收入</p>
        </AdminCard>
        <AdminCard delay={0.15}>
          <p className="text-3xl font-bold text-yellow">{orders.filter(o => o.status === "pending").length}</p>
          <p className="text-sm text-muted-foreground mt-1">待处理</p>
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
        <div className="flex-1" />
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          导出
        </Button>
      </div>

      {/* 订单列表 */}
      <AdminCard title="订单列表" noPadding>
        <AdminDataTable
          data={filteredOrders}
          columns={columns}
          searchable
          searchPlaceholder="搜索订单号或买家..."
          searchKeys={["id", "buyer", "productName"]}
          rowActions={() => (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Eye className="w-4 h-4" />
            </Button>
          )}
        />
      </AdminCard>
    </div>
  );
}
