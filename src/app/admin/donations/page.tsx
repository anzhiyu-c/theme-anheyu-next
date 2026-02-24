"use client";

import {
  Button,
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
import { Plus, Trash2, ShieldAlert, ChevronDown, Gift, Download, Upload, RotateCcw, Edit } from "lucide-react";
import { adminContainerVariants, adminItemVariants } from "@/lib/motion";
import { PAGE_SIZES, ADMIN_EMPTY_TEXTS } from "@/lib/constants/admin";
import { ConfirmDialog, FloatingSelectionBar, TableEmptyState } from "@/components/admin";
import { formatDateTime } from "@/utils/date";
import { useDonationsPage } from "./_hooks/use-donations-page";
import { DonationEditDialog } from "./_components/DonationEditDialog";
import { DonationImportDialog } from "./_components/DonationImportDialog";

function pickSingleKey(keys: "all" | Set<Key>): string {
  if (keys === "all") return "";
  const value = Array.from(keys)[0];
  return value ? String(value) : "";
}

export default function DonationsPage() {
  const dm = useDonationsPage();

  const pageAmount = dm.donations.reduce((acc, item) => acc + Number(item.amount || 0), 0);
  const visibleCount = dm.donations.filter(item => item.status === 1).length;
  const avgAmount = dm.totalItems > 0 ? dm.totalAmount / dm.totalItems : 0;

  const bottomContent = (
    <div className="py-2 px-2 flex flex-wrap justify-between items-center gap-2">
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-small text-default-400 whitespace-nowrap">共 {dm.totalItems} 条记录</span>
        <span className="text-small text-default-300">|</span>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="light" size="sm" className="text-default-400 text-small h-7 min-w-0 gap-1 px-2">
              {dm.pageSize}条/页
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="每页显示条数"
            selectedKeys={new Set([String(dm.pageSize)])}
            selectionMode="single"
            onSelectionChange={keys => {
              const value = Array.from(keys)[0];
              if (!value) return;
              dm.setPageSize(Number(value));
              dm.setPage(1);
            }}
          >
            {PAGE_SIZES.map(size => (
              <DropdownItem key={String(size)}>{size}条/页</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        {dm.selectedIds.size > 0 ? (
          <>
            <span className="text-small text-default-300">|</span>
            <span className="text-small text-primary font-medium whitespace-nowrap">已选 {dm.selectedIds.size} 项</span>
          </>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={dm.page}
          total={dm.totalPages}
          onChange={dm.setPage}
        />
        <div className="hidden sm:flex gap-1.5">
          <Button
            isDisabled={dm.page <= 1}
            size="sm"
            variant="flat"
            onPress={() => dm.setPage(Math.max(1, dm.page - 1))}
          >
            上一页
          </Button>
          <Button
            isDisabled={dm.page >= dm.totalPages}
            size="sm"
            variant="flat"
            onPress={() => dm.setPage(Math.min(dm.totalPages, dm.page + 1))}
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
              <h1 className="text-lg font-semibold tracking-tight text-foreground">打赏管理</h1>
              <p className="text-xs text-muted-foreground mt-1">对接 anheyu-pro 打赏接口，支持增删改、导入与导出</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="flat" startContent={<Upload className="w-4 h-4" />} onPress={dm.importModal.onOpen}>
                导入导出
              </Button>
              <Button color="primary" startContent={<Plus className="w-4 h-4" />} onPress={dm.handleCreateOpen}>
                新增打赏
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
            <div className="px-3 py-2 rounded-lg bg-default-50 dark:bg-default-100/40">
              <p className="text-xs text-default-500">总记录数</p>
              <p className="text-lg font-semibold">{dm.totalItems}</p>
            </div>
            <div className="px-3 py-2 rounded-lg bg-primary-50 dark:bg-primary/10">
              <p className="text-xs text-default-500">累计打赏</p>
              <p className="text-lg font-semibold text-primary">¥{dm.totalAmount.toFixed(2)}</p>
            </div>
            <div className="px-3 py-2 rounded-lg bg-success-50 dark:bg-success/10">
              <p className="text-xs text-default-500">当前页金额</p>
              <p className="text-lg font-semibold text-success">¥{pageAmount.toFixed(2)}</p>
            </div>
            <div className="px-3 py-2 rounded-lg bg-warning-50 dark:bg-warning/10">
              <p className="text-xs text-default-500">当前页显示数</p>
              <p className="text-lg font-semibold text-warning">{visibleCount}</p>
            </div>
          </div>
        </div>

        <div className="shrink-0 px-5 py-3 border-b border-border/50 flex items-center gap-2">
          <Select
            aria-label="打赏状态筛选"
            placeholder="全部状态"
            className="max-w-[220px]"
            selectedKeys={dm.statusFilter !== null ? [String(dm.statusFilter)] : []}
            isClearable
            onSelectionChange={keys => {
              const value = pickSingleKey(keys);
              dm.setStatusFilter(value ? Number(value) : null);
              dm.setPage(1);
            }}
            onClear={() => {
              dm.setStatusFilter(null);
              dm.setPage(1);
            }}
          >
            <SelectItem key="1">显示</SelectItem>
            <SelectItem key="2">隐藏</SelectItem>
          </Select>
          <Button variant="flat" startContent={<RotateCcw className="w-4 h-4" />} onPress={dm.handleResetFilters}>
            重置筛选
          </Button>
          <div className="flex-1" />
          <Chip variant="flat" color="secondary">
            平均金额 ¥{avgAmount.toFixed(2)}
          </Chip>
        </div>

        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <Table
            isHeaderSticky
            aria-label="打赏管理表格"
            selectionMode="multiple"
            selectedKeys={dm.selectedIds}
            onSelectionChange={dm.handleSelectionChange}
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
              <TableColumn key="name">昵称</TableColumn>
              <TableColumn key="amount">金额</TableColumn>
              <TableColumn key="sort_order">排序</TableColumn>
              <TableColumn key="created_at">打赏时间</TableColumn>
              <TableColumn key="status">状态</TableColumn>
              <TableColumn key="actions" align="center">
                操作
              </TableColumn>
            </TableHeader>
            <TableBody
              items={dm.donations}
              isLoading={dm.isLoading || dm.isFetching}
              loadingContent={<Spinner size="sm" label="加载中..." />}
              emptyContent={
                <TableEmptyState
                  icon={Gift}
                  hasFilter={dm.statusFilter !== null}
                  filterEmptyText={ADMIN_EMPTY_TEXTS.donations.filterEmptyText}
                  emptyText={ADMIN_EMPTY_TEXTS.donations.emptyText}
                  emptyHint={ADMIN_EMPTY_TEXTS.donations.emptyHint}
                />
              }
            >
              {item => (
                <TableRow key={String(item.id)}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <span className="font-semibold text-primary">¥{Number(item.amount || 0).toFixed(2)}</span>
                    <span className="text-xs text-default-500 ml-1">{item.suffix || "元"}</span>
                  </TableCell>
                  <TableCell>{item.sort_order || 0}</TableCell>
                  <TableCell>{formatDateTime(item.custom_published_at || item.created_at)}</TableCell>
                  <TableCell>
                    <Chip size="sm" variant="flat" color={item.status === 1 ? "success" : "default"}>
                      {item.status === 1 ? "显示" : "隐藏"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button size="sm" variant="light" isIconOnly onPress={() => dm.handleEditOpen(item)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="light"
                        color="danger"
                        isIconOnly
                        onPress={() => dm.handleDeleteClick(item)}
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
        {dm.isSomeSelected ? (
          <FloatingSelectionBar
            count={dm.selectedIds.size}
            actions={[
              {
                key: "export",
                label: "导出",
                icon: <Download className="w-3.5 h-3.5" />,
                onClick: async () => {
                  await dm.handleExport(Array.from(dm.selectedIds).map(id => Number(id)));
                },
              },
              {
                key: "delete",
                label: "批量删除",
                icon: <Trash2 className="w-3.5 h-3.5" />,
                onClick: dm.batchDeleteModal.onOpen,
                variant: "danger",
              },
            ]}
            onClear={() => dm.setSelectedIds(new Set())}
          />
        ) : null}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={dm.deleteModal.isOpen}
        onOpenChange={dm.deleteModal.onOpenChange}
        title="删除打赏记录"
        description={`确定要删除「${dm.deleteTarget?.name || ""}」的打赏记录吗？`}
        confirmText="删除"
        confirmColor="danger"
        icon={<ShieldAlert className="w-5 h-5 text-danger" />}
        iconBg="bg-danger-50"
        loading={false}
        onConfirm={dm.handleDeleteConfirm}
      />

      <ConfirmDialog
        isOpen={dm.batchDeleteModal.isOpen}
        onOpenChange={dm.batchDeleteModal.onOpenChange}
        title="批量删除打赏记录"
        description={`确定要删除选中的 ${dm.selectedIds.size} 条记录吗？`}
        confirmText={`删除 ${dm.selectedIds.size} 条`}
        confirmColor="danger"
        icon={<ShieldAlert className="w-5 h-5 text-danger" />}
        iconBg="bg-danger-50"
        loading={false}
        onConfirm={dm.handleBatchDeleteConfirm}
      />

      <DonationEditDialog
        key={`${dm.editingDonation?.id ?? "new"}-${dm.editModal.isOpen ? "open" : "closed"}`}
        isOpen={dm.editModal.isOpen}
        onOpenChange={dm.editModal.onOpenChange}
        donation={dm.editingDonation}
        onSubmit={dm.handleSaveDonation}
        isSubmitting={dm.isSubmitting}
      />

      <DonationImportDialog
        isOpen={dm.importModal.isOpen}
        onOpenChange={dm.importModal.onOpenChange}
        selectedCount={dm.selectedIds.size}
        isImporting={dm.isImporting}
        isExporting={dm.isExporting}
        onImport={dm.handleImport}
        onExportAll={async () => {
          await dm.handleExport();
        }}
        onExportSelected={async () => {
          await dm.handleExport(Array.from(dm.selectedIds).map(id => Number(id)));
        }}
      />
    </motion.div>
  );
}
