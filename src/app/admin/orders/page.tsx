"use client";

import {
  Button,
  Input,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Spinner,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Chip,
  Select,
  SelectItem,
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Trash2, ShieldAlert, ChevronDown, ShoppingCart, RotateCcw, Search } from "lucide-react";
import type { Key } from "react";
import { adminContainerVariants, adminItemVariants } from "@/lib/motion";
import { PAGE_SIZES, ADMIN_EMPTY_TEXTS } from "@/lib/constants/admin";
import { ConfirmDialog, FloatingSelectionBar, TableEmptyState } from "@/components/admin";
import { formatDateTime } from "@/utils/date";
import type { OrderStatus, PaymentProvider, OrderType } from "@/types/order";
import { useOrdersPage } from "./_hooks/use-orders-page";
import { OrderDetailDialog } from "./_components/OrderDetailDialog";

const orderStatusMap: Record<string, { label: string; color: "warning" | "success" | "danger" | "default" }> = {
  PENDING: { label: "待支付", color: "warning" },
  SUCCESS: { label: "支付成功", color: "success" },
  FAILED: { label: "支付失败", color: "danger" },
  CANCELLED: { label: "已取消", color: "default" },
  EXPIRED: { label: "已过期", color: "danger" },
};

const paymentProviderMap: Record<string, string> = {
  ALIPAY: "支付宝",
  WECHAT: "微信支付",
  EPAY: "易支付",
  HUPIJIAO: "虎皮椒V3",
};

const orderTypeMap: Record<string, string> = {
  ARTICLE: "文章购买",
  SHARE: "分享购买",
  PRODUCT: "商品购买",
  MEMBERSHIP: "会员订阅",
};

function pickSingleKey(keys: "all" | Set<Key>): string {
  if (keys === "all") return "";
  const key = Array.from(keys)[0];
  return key ? String(key) : "";
}

export default function OrdersPage() {
  const om = useOrdersPage();

  const summary = {
    total: om.totalItems,
    revenue: om.orders
      .filter(order => order.payment_status === "SUCCESS")
      .reduce((acc, order) => acc + Number(order.amount || 0), 0),
    pending: om.orders.filter(order => order.payment_status === "PENDING").length,
    success: om.orders.filter(order => order.payment_status === "SUCCESS").length,
  };

  const bottomContent = (
    <div className="py-2 px-2 flex flex-wrap justify-between items-center gap-2">
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-small text-default-400 whitespace-nowrap">共 {om.totalItems} 条订单</span>
        <span className="text-small text-default-300">|</span>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="light" size="sm" className="text-default-400 text-small h-7 min-w-0 gap-1 px-2">
              {om.pageSize}条/页
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="每页显示条数"
            selectedKeys={new Set([String(om.pageSize)])}
            selectionMode="single"
            onSelectionChange={keys => {
              const value = Array.from(keys)[0];
              if (!value) return;
              om.setPageSize(Number(value));
              om.setPage(1);
            }}
          >
            {PAGE_SIZES.map(size => (
              <DropdownItem key={String(size)}>{size}条/页</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        {om.selectedIds.size > 0 ? (
          <>
            <span className="text-small text-default-300">|</span>
            <span className="text-small text-primary font-medium whitespace-nowrap">已选 {om.selectedIds.size} 项</span>
          </>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={om.page}
          total={om.totalPages}
          onChange={om.setPage}
        />
        <div className="hidden sm:flex gap-1.5">
          <Button
            isDisabled={om.page <= 1}
            size="sm"
            variant="flat"
            onPress={() => om.setPage(Math.max(1, om.page - 1))}
          >
            上一页
          </Button>
          <Button
            isDisabled={om.page >= om.totalPages}
            size="sm"
            variant="flat"
            onPress={() => om.setPage(Math.min(om.totalPages, om.page + 1))}
          >
            下一页
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      className="relative h-full flex flex-col overflow-hidden -m-4 lg:-m-8"
      variants={adminContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={adminItemVariants}
        className="flex-1 min-h-0 flex flex-col mx-6 mt-5 mb-2 bg-card border border-border/60 rounded-xl overflow-hidden"
      >
        <div className="shrink-0 px-5 pt-4 pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground">订单管理</h1>
              <p className="text-xs text-muted-foreground mt-1">对接 anheyu-pro 后端订单接口，支持筛选、查看和删除</p>
            </div>
            <div className="hidden md:grid grid-cols-4 gap-2">
              <div className="px-3 py-2 rounded-lg bg-default-50 dark:bg-default-100/40">
                <p className="text-xs text-default-500">订单总数</p>
                <p className="text-lg font-semibold">{summary.total}</p>
              </div>
              <div className="px-3 py-2 rounded-lg bg-success-50 dark:bg-success/10">
                <p className="text-xs text-default-500">成功订单</p>
                <p className="text-lg font-semibold text-success">{summary.success}</p>
              </div>
              <div className="px-3 py-2 rounded-lg bg-warning-50 dark:bg-warning/10">
                <p className="text-xs text-default-500">待支付</p>
                <p className="text-lg font-semibold text-warning">{summary.pending}</p>
              </div>
              <div className="px-3 py-2 rounded-lg bg-primary-50 dark:bg-primary/10">
                <p className="text-xs text-default-500">当前页收入</p>
                <p className="text-lg font-semibold text-primary">¥{summary.revenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 px-5 py-3 border-b border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-2">
            <Input
              value={om.keywordInput}
              onValueChange={value => {
                om.setKeywordInput(value);
                om.setPage(1);
              }}
              placeholder="订单号或交易号"
              startContent={<Search className="w-4 h-4 text-default-400" />}
              size="sm"
            />
            <Input
              value={om.emailInput}
              onValueChange={value => {
                om.setEmailInput(value);
                om.setPage(1);
              }}
              placeholder="用户邮箱"
              size="sm"
            />
            <Select
              aria-label="支付状态筛选"
              placeholder="全部状态"
              selectedKeys={om.statusFilter ? [om.statusFilter] : []}
              size="sm"
              onSelectionChange={keys => {
                const value = pickSingleKey(keys) as OrderStatus | "";
                om.setStatusFilter(value);
                om.setPage(1);
              }}
              onClear={() => {
                om.setStatusFilter("");
                om.setPage(1);
              }}
              isClearable
            >
              <SelectItem key="PENDING">待支付</SelectItem>
              <SelectItem key="SUCCESS">支付成功</SelectItem>
              <SelectItem key="FAILED">支付失败</SelectItem>
              <SelectItem key="CANCELLED">已取消</SelectItem>
              <SelectItem key="EXPIRED">已过期</SelectItem>
            </Select>
            <Select
              aria-label="支付方式筛选"
              placeholder="全部支付方式"
              selectedKeys={om.providerFilter ? [om.providerFilter] : []}
              size="sm"
              onSelectionChange={keys => {
                const value = pickSingleKey(keys) as PaymentProvider | "";
                om.setProviderFilter(value);
                om.setPage(1);
              }}
              onClear={() => {
                om.setProviderFilter("");
                om.setPage(1);
              }}
              isClearable
            >
              <SelectItem key="ALIPAY">支付宝</SelectItem>
              <SelectItem key="WECHAT">微信支付</SelectItem>
              <SelectItem key="EPAY">易支付</SelectItem>
              <SelectItem key="HUPIJIAO">虎皮椒V3</SelectItem>
            </Select>
            <Select
              aria-label="订单类型筛选"
              placeholder="全部订单类型"
              selectedKeys={om.orderTypeFilter ? [om.orderTypeFilter] : []}
              size="sm"
              onSelectionChange={keys => {
                const value = pickSingleKey(keys) as OrderType | "";
                om.setOrderTypeFilter(value);
                om.setPage(1);
              }}
              onClear={() => {
                om.setOrderTypeFilter("");
                om.setPage(1);
              }}
              isClearable
            >
              <SelectItem key="ARTICLE">文章购买</SelectItem>
              <SelectItem key="SHARE">分享购买</SelectItem>
              <SelectItem key="PRODUCT">商品购买</SelectItem>
              <SelectItem key="MEMBERSHIP">会员订阅</SelectItem>
            </Select>
            <Button variant="flat" startContent={<RotateCcw className="w-4 h-4" />} onPress={om.handleResetFilters}>
              重置筛选
            </Button>
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <Table
            isHeaderSticky
            aria-label="订单管理表格"
            selectionMode="multiple"
            selectedKeys={om.selectedIds}
            onSelectionChange={om.handleSelectionChange}
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
              base: "flex-1 min-h-0 flex flex-col",
              wrapper: "flex-1 min-h-0 px-3! py-0! shadow-none! rounded-none! border-none!",
              table: "border-separate border-spacing-y-1.5 -mt-1.5",
              thead: "[&>tr]:first:shadow-none! after:hidden!",
              th: "bg-[#F6F7FA] dark:bg-default-100 first:rounded-tl-lg! last:rounded-tr-lg!",
              tr: "rounded-xl!",
              td: "first:before:rounded-s-xl! last:before:rounded-e-xl!",
            }}
          >
            <TableHeader>
              <TableColumn key="order_no">订单信息</TableColumn>
              <TableColumn key="user_email">用户</TableColumn>
              <TableColumn key="order_type">订单类型</TableColumn>
              <TableColumn key="payment_status">支付状态</TableColumn>
              <TableColumn key="payment_provider">支付方式</TableColumn>
              <TableColumn key="amount">金额</TableColumn>
              <TableColumn key="created_at">时间</TableColumn>
              <TableColumn key="actions" align="center">
                操作
              </TableColumn>
            </TableHeader>
            <TableBody
              items={om.orders}
              isLoading={om.isFetching || om.isLoading}
              loadingContent={<Spinner size="sm" label="加载中..." />}
              emptyContent={
                <TableEmptyState
                  icon={ShoppingCart}
                  hasFilter={
                    !!(om.keywordInput || om.emailInput || om.statusFilter || om.providerFilter || om.orderTypeFilter)
                  }
                  filterEmptyText={ADMIN_EMPTY_TEXTS.orders.filterEmptyText}
                  emptyText={ADMIN_EMPTY_TEXTS.orders.emptyText}
                  filterHint={ADMIN_EMPTY_TEXTS.orders.filterHint}
                />
              }
            >
              {order => (
                <TableRow key={String(order.id)}>
                  <TableCell>
                    <div className="min-w-[180px]">
                      <p className="font-mono text-xs text-foreground">{order.order_no}</p>
                      <p className="text-[11px] text-default-500 truncate max-w-[200px]">{order.trade_no || "-"}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="min-w-[140px]">
                      <p className="text-sm">{order.user_email || "匿名用户"}</p>
                      <p className="text-[11px] text-default-500">{order.user_id || "-"}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip size="sm" variant="flat" color="primary">
                      {orderTypeMap[order.order_type] || order.order_type}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip size="sm" variant="flat" color={orderStatusMap[order.payment_status]?.color || "default"}>
                      {orderStatusMap[order.payment_status]?.label || order.payment_status}
                    </Chip>
                  </TableCell>
                  <TableCell>{paymentProviderMap[order.payment_provider] || order.payment_provider}</TableCell>
                  <TableCell>¥{Number(order.amount || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="min-w-[140px]">
                      <p className="text-xs text-default-600">{formatDateTime(order.created_at)}</p>
                      <p className="text-[11px] text-default-500">
                        {order.pay_time ? `支付: ${formatDateTime(order.pay_time)}` : "未支付"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button size="sm" variant="light" isIconOnly onPress={() => om.handleViewDetail(order)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="light"
                        color="danger"
                        isIconOnly
                        onPress={() => om.handleDeleteClick(order)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      <AnimatePresence>
        {om.isSomeSelected ? (
          <FloatingSelectionBar
            count={om.selectedIds.size}
            actions={[
              {
                key: "delete",
                label: "批量删除",
                icon: <Trash2 className="w-3.5 h-3.5" />,
                onClick: om.batchDeleteModal.onOpen,
                variant: "danger",
              },
            ]}
            onClear={() => om.setSelectedIds(new Set())}
          />
        ) : null}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={om.deleteModal.isOpen}
        onOpenChange={om.deleteModal.onOpenChange}
        title="删除订单"
        description={`确定要删除订单「${om.deleteTarget?.order_no || ""}」吗？此操作不可撤销。`}
        confirmText="删除"
        confirmColor="danger"
        icon={<ShieldAlert className="w-5 h-5 text-danger" />}
        iconBg="bg-danger-50"
        loading={false}
        onConfirm={om.handleDeleteConfirm}
      />

      <ConfirmDialog
        isOpen={om.batchDeleteModal.isOpen}
        onOpenChange={om.batchDeleteModal.onOpenChange}
        title="批量删除订单"
        description={`确定要删除选中的 ${om.selectedIds.size} 个订单吗？此操作不可撤销。`}
        confirmText={`删除 ${om.selectedIds.size} 项`}
        confirmColor="danger"
        icon={<ShieldAlert className="w-5 h-5 text-danger" />}
        iconBg="bg-danger-50"
        loading={false}
        onConfirm={om.handleBatchDeleteConfirm}
      />

      <OrderDetailDialog
        isOpen={om.detailModal.isOpen}
        onOpenChange={om.detailModal.onOpenChange}
        order={om.detailTarget}
        onDelete={order => om.handleDeleteClick(order)}
      />
    </motion.div>
  );
}
