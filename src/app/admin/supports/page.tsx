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
  Select,
  SelectItem,
  Chip,
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import type { Key } from "react";
import { HeadphonesIcon, Eye, Trash2, ShieldAlert, ChevronDown, Search, XCircle } from "lucide-react";
import { adminContainerVariants, adminItemVariants } from "@/lib/motion";
import { PAGE_SIZES, ADMIN_EMPTY_TEXTS } from "@/lib/constants/admin";
import { ConfirmDialog, FloatingSelectionBar, TableEmptyState } from "@/components/admin";
import { formatDateTime } from "@/utils/date";
import { TicketDetailDrawer } from "./_components/TicketDetailDrawer";
import { useSupportsPage } from "./_hooks/use-supports-page";
import { addToast } from "@heroui/react";

function pickSingleKey(keys: "all" | Set<Key>): string {
  if (keys === "all") return "";
  const value = Array.from(keys)[0];
  return value ? String(value) : "";
}

function statusColor(status: string): "warning" | "success" | "default" {
  if (status === "OPEN") return "warning";
  if (status === "REPLIED") return "success";
  return "default";
}

function statusLabel(status: string): string {
  if (status === "OPEN") return "待处理";
  if (status === "REPLIED") return "已回复";
  return "已关闭";
}

export default function SupportsPage() {
  const sm = useSupportsPage();

  const bottomContent = (
    <div className="py-2 px-2 flex flex-wrap justify-between items-center gap-2">
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-small text-default-400 whitespace-nowrap">共 {sm.totalItems} 个工单</span>
        <span className="text-small text-default-300">|</span>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="light" size="sm" className="text-default-400 text-small h-7 min-w-0 gap-1 px-2">
              {sm.pageSize}条/页
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="每页显示条数"
            selectedKeys={new Set([String(sm.pageSize)])}
            selectionMode="single"
            onSelectionChange={keys => {
              const value = Array.from(keys)[0];
              if (!value) return;
              sm.setPageSize(Number(value));
              sm.setPage(1);
            }}
          >
            {PAGE_SIZES.map(size => (
              <DropdownItem key={String(size)}>{size}条/页</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        {sm.selectedIds.size > 0 ? (
          <>
            <span className="text-small text-default-300">|</span>
            <span className="text-small text-primary font-medium whitespace-nowrap">已选 {sm.selectedIds.size} 项</span>
          </>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={sm.page}
          total={sm.totalPages}
          onChange={sm.setPage}
        />
        <div className="hidden sm:flex gap-1.5">
          <Button
            isDisabled={sm.page <= 1}
            size="sm"
            variant="flat"
            onPress={() => sm.setPage(Math.max(1, sm.page - 1))}
          >
            上一页
          </Button>
          <Button
            isDisabled={sm.page >= sm.totalPages}
            size="sm"
            variant="flat"
            onPress={() => sm.setPage(Math.min(sm.totalPages, sm.page + 1))}
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
              <h1 className="text-lg font-semibold tracking-tight flex items-center gap-2">
                <HeadphonesIcon className="w-5 h-5 text-primary" />
                售后工单
              </h1>
              <p className="text-xs text-muted-foreground mt-1">对接 anheyu-pro 售后工单接口，支持回复与关闭工单</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
            <div className="px-3 py-2 rounded-lg bg-default-50 dark:bg-default-100/40">
              <p className="text-xs text-default-500">工单总数</p>
              <p className="text-lg font-semibold">{sm.stats.total || sm.totalItems}</p>
            </div>
            <div className="px-3 py-2 rounded-lg bg-warning-50 dark:bg-warning/10">
              <p className="text-xs text-default-500">待处理</p>
              <p className="text-lg font-semibold text-warning">{sm.stats.pending}</p>
            </div>
            <div className="px-3 py-2 rounded-lg bg-primary-50 dark:bg-primary/10">
              <p className="text-xs text-default-500">处理中</p>
              <p className="text-lg font-semibold text-primary">{sm.stats.processing}</p>
            </div>
            <div className="px-3 py-2 rounded-lg bg-success-50 dark:bg-success/10">
              <p className="text-xs text-default-500">已关闭</p>
              <p className="text-lg font-semibold text-success">{sm.stats.closed}</p>
            </div>
          </div>
        </div>

        <div className="shrink-0 px-5 py-3 border-b border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_auto] gap-2 items-center">
            <Input
              value={sm.keywordInput}
              onValueChange={value => {
                sm.setKeywordInput(value);
                sm.setPage(1);
              }}
              placeholder="搜索工单号、订单号或主题"
              startContent={<Search className="w-4 h-4 text-default-400" />}
              size="sm"
            />
            <Select
              aria-label="工单状态筛选"
              placeholder="全部状态"
              selectedKeys={sm.statusFilter ? [sm.statusFilter] : []}
              isClearable
              size="sm"
              onSelectionChange={keys => {
                const value = pickSingleKey(keys);
                sm.setStatusFilter(value);
                sm.setPage(1);
              }}
              onClear={() => {
                sm.setStatusFilter("");
                sm.setPage(1);
              }}
            >
              <SelectItem key="OPEN">待处理</SelectItem>
              <SelectItem key="REPLIED">已回复</SelectItem>
              <SelectItem key="CLOSED">已关闭</SelectItem>
            </Select>
            <Button variant="flat" onPress={sm.handleResetFilters}>
              重置
            </Button>
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <Table
            isHeaderSticky
            aria-label="售后工单表格"
            selectionMode="multiple"
            selectedKeys={sm.selectedIds}
            onSelectionChange={sm.handleSelectionChange}
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
              <TableColumn key="ticket_no">工单号</TableColumn>
              <TableColumn key="subject">主题</TableColumn>
              <TableColumn key="trade_no">关联订单</TableColumn>
              <TableColumn key="user_email">用户邮箱</TableColumn>
              <TableColumn key="status">状态</TableColumn>
              <TableColumn key="updated_at">更新时间</TableColumn>
              <TableColumn key="actions" align="center">
                操作
              </TableColumn>
            </TableHeader>
            <TableBody
              items={sm.tickets}
              isLoading={sm.isLoading || sm.isFetching}
              loadingContent={<Spinner size="sm" label="加载中..." />}
              emptyContent={
                <TableEmptyState
                  icon={HeadphonesIcon}
                  hasFilter={!!(sm.keywordInput || sm.statusFilter)}
                  filterEmptyText={ADMIN_EMPTY_TEXTS.supports.filterEmptyText}
                  emptyText={ADMIN_EMPTY_TEXTS.supports.emptyText}
                  emptyHint={ADMIN_EMPTY_TEXTS.supports.emptyHint}
                />
              }
            >
              {ticket => (
                <TableRow key={ticket.id}>
                  <TableCell>
                    <span className="font-mono text-xs">{ticket.ticket_no}</span>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[260px]">
                      <p className="text-sm line-clamp-1">{ticket.subject}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs text-default-600">{ticket.trade_no}</span>
                  </TableCell>
                  <TableCell>{ticket.user_email || "-"}</TableCell>
                  <TableCell>
                    <Chip size="sm" variant="flat" color={statusColor(ticket.status)}>
                      {statusLabel(ticket.status)}
                    </Chip>
                  </TableCell>
                  <TableCell>{formatDateTime(ticket.updated_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button size="sm" variant="light" isIconOnly onPress={() => sm.handleOpenDetail(ticket)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      {ticket.status !== "CLOSED" ? (
                        <Button
                          size="sm"
                          variant="light"
                          color="warning"
                          isIconOnly
                          onPress={async () => {
                            if (!window.confirm("确认关闭该工单吗？")) return;
                            try {
                              await sm.handleCloseTicket(ticket);
                            } catch (error) {
                              addToast({
                                title: error instanceof Error ? error.message : "关闭工单失败",
                                color: "danger",
                                timeout: 3000,
                              });
                            }
                          }}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      ) : null}
                      <Button
                        size="sm"
                        variant="light"
                        color="danger"
                        isIconOnly
                        onPress={() => sm.handleDeleteClick(ticket)}
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
        {sm.isSomeSelected ? (
          <FloatingSelectionBar
            count={sm.selectedIds.size}
            actions={[
              {
                key: "delete",
                label: "批量删除",
                icon: <Trash2 className="w-3.5 h-3.5" />,
                onClick: sm.batchDeleteModal.onOpen,
                variant: "danger",
              },
            ]}
            onClear={() => sm.setSelectedIds(new Set())}
          />
        ) : null}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={sm.deleteModal.isOpen}
        onOpenChange={sm.deleteModal.onOpenChange}
        title="删除工单"
        description={`确定要删除工单「${sm.deleteTarget?.ticket_no || ""}」吗？`}
        confirmText="删除"
        confirmColor="danger"
        icon={<ShieldAlert className="w-5 h-5 text-danger" />}
        iconBg="bg-danger-50"
        loading={false}
        onConfirm={sm.handleDeleteConfirm}
      />

      <ConfirmDialog
        isOpen={sm.batchDeleteModal.isOpen}
        onOpenChange={sm.batchDeleteModal.onOpenChange}
        title="批量删除工单"
        description={`确定要删除选中的 ${sm.selectedIds.size} 个工单吗？`}
        confirmText={`删除 ${sm.selectedIds.size} 项`}
        confirmColor="danger"
        icon={<ShieldAlert className="w-5 h-5 text-danger" />}
        iconBg="bg-danger-50"
        loading={false}
        onConfirm={sm.handleBatchDeleteConfirm}
      />

      <TicketDetailDrawer
        isOpen={sm.detailModal.isOpen}
        onOpenChange={sm.detailModal.onOpenChange}
        ticket={sm.detailTicket}
        isLoading={sm.isDetailLoading}
        replyContent={sm.replyContent}
        onReplyContentChange={sm.setReplyContent}
        onReply={sm.handleReplyTicket}
        isReplying={sm.isReplying}
        onCloseTicket={sm.handleCloseTicket}
      />
    </motion.div>
  );
}
