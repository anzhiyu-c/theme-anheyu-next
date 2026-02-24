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
  Switch,
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import type { Key } from "react";
import Image from "next/image";
import { Plus, Trash2, ShieldAlert, ChevronDown, Package, Search, Edit, Boxes, ArrowUpDown } from "lucide-react";
import { adminContainerVariants, adminItemVariants } from "@/lib/motion";
import { PAGE_SIZES, ADMIN_EMPTY_TEXTS } from "@/lib/constants/admin";
import { ConfirmDialog, FloatingSelectionBar, TableEmptyState } from "@/components/admin";
import { formatDateTime } from "@/utils/date";
import { useProductsPage } from "./_hooks/use-products-page";
import { ProductEditDialog } from "./_components/ProductEditDialog";
import { StockManageDialog } from "./_components/StockManageDialog";
import { ProductStatus } from "@/types/product";
import { addToast } from "@heroui/react";

function pickSingleKey(keys: "all" | Set<Key>): string {
  if (keys === "all") return "";
  const value = Array.from(keys)[0];
  return value ? String(value) : "";
}

function statusColor(status: number): "default" | "success" | "warning" {
  if (status === 2) return "success";
  if (status === 3) return "warning";
  return "default";
}

function statusLabel(status: number): string {
  if (status === 2) return "已上架";
  if (status === 3) return "已下架";
  return "草稿";
}

function formatPriceRange(min: number, max?: number): string {
  if (!max || max === min) {
    return `¥${(min / 100).toFixed(2)}`;
  }
  return `¥${(min / 100).toFixed(2)} - ¥${(max / 100).toFixed(2)}`;
}

export default function ProductsPage() {
  const pm = useProductsPage();

  const summary = {
    total: pm.totalItems,
    published: pm.products.filter(item => item.status === 2).length,
    totalSales: pm.products.reduce((acc, item) => acc + Number(item.total_sales || 0), 0),
    totalRevenue: pm.products.reduce((acc, item) => acc + Number(item.total_revenue || 0), 0),
  };

  const bottomContent = (
    <div className="py-2 px-2 flex flex-wrap justify-between items-center gap-2">
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-small text-default-400 whitespace-nowrap">共 {pm.totalItems} 个商品</span>
        <span className="text-small text-default-300">|</span>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="light" size="sm" className="text-default-400 text-small h-7 min-w-0 gap-1 px-2">
              {pm.pageSize}条/页
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="每页显示条数"
            selectedKeys={new Set([String(pm.pageSize)])}
            selectionMode="single"
            onSelectionChange={keys => {
              const value = Array.from(keys)[0];
              if (!value) return;
              pm.setPageSize(Number(value));
              pm.setPage(1);
            }}
          >
            {PAGE_SIZES.map(size => (
              <DropdownItem key={String(size)}>{size}条/页</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        {pm.selectedIds.size > 0 ? (
          <>
            <span className="text-small text-default-300">|</span>
            <span className="text-small text-primary font-medium whitespace-nowrap">已选 {pm.selectedIds.size} 项</span>
          </>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={pm.page}
          total={pm.totalPages}
          onChange={pm.setPage}
        />
        <div className="hidden sm:flex gap-1.5">
          <Button
            isDisabled={pm.page <= 1}
            size="sm"
            variant="flat"
            onPress={() => pm.setPage(Math.max(1, pm.page - 1))}
          >
            上一页
          </Button>
          <Button
            isDisabled={pm.page >= pm.totalPages}
            size="sm"
            variant="flat"
            onPress={() => pm.setPage(Math.min(pm.totalPages, pm.page + 1))}
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
              <h1 className="text-lg font-semibold tracking-tight text-foreground">商品管理</h1>
              <p className="text-xs text-muted-foreground mt-1">对接 anheyu-pro 商品与库存接口，支持多规格商品管理</p>
            </div>
            <Button color="primary" startContent={<Plus className="w-4 h-4" />} onPress={pm.handleCreateOpen}>
              新增商品
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
            <div className="px-3 py-2 rounded-lg bg-default-50 dark:bg-default-100/40">
              <p className="text-xs text-default-500">商品总数</p>
              <p className="text-lg font-semibold">{summary.total}</p>
            </div>
            <div className="px-3 py-2 rounded-lg bg-success-50 dark:bg-success/10">
              <p className="text-xs text-default-500">在售商品</p>
              <p className="text-lg font-semibold text-success">{summary.published}</p>
            </div>
            <div className="px-3 py-2 rounded-lg bg-primary-50 dark:bg-primary/10">
              <p className="text-xs text-default-500">当前页销量</p>
              <p className="text-lg font-semibold text-primary">{summary.totalSales}</p>
            </div>
            <div className="px-3 py-2 rounded-lg bg-warning-50 dark:bg-warning/10">
              <p className="text-xs text-default-500">当前页收入</p>
              <p className="text-lg font-semibold text-warning">¥{(summary.totalRevenue / 100).toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="shrink-0 px-5 py-3 border-b border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_auto] gap-2 items-center">
            <Input
              value={pm.keywordInput}
              onValueChange={value => {
                pm.setKeywordInput(value);
                pm.setPage(1);
              }}
              placeholder="搜索商品标题"
              startContent={<Search className="w-4 h-4 text-default-400" />}
              size="sm"
            />
            <Select
              aria-label="商品状态筛选"
              placeholder="全部状态"
              selectedKeys={pm.statusFilter ? [String(pm.statusFilter)] : []}
              isClearable
              size="sm"
              onSelectionChange={keys => {
                const value = pickSingleKey(keys);
                pm.setStatusFilter(value ? (Number(value) as ProductStatus) : null);
                pm.setPage(1);
              }}
              onClear={() => {
                pm.setStatusFilter(null);
                pm.setPage(1);
              }}
            >
              <SelectItem key="1">草稿</SelectItem>
              <SelectItem key="2">已上架</SelectItem>
              <SelectItem key="3">已下架</SelectItem>
            </Select>
            <Button variant="flat" onPress={pm.handleResetFilters}>
              重置
            </Button>
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <Table
            isHeaderSticky
            aria-label="商品管理表格"
            selectionMode="multiple"
            selectedKeys={pm.selectedIds}
            onSelectionChange={pm.handleSelectionChange}
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
              <TableColumn key="title">商品</TableColumn>
              <TableColumn key="price">价格区间</TableColumn>
              <TableColumn key="stats">规格/销量</TableColumn>
              <TableColumn key="status">状态</TableColumn>
              <TableColumn key="show_on_homepage">首页显示</TableColumn>
              <TableColumn key="created_at">创建时间</TableColumn>
              <TableColumn key="actions" align="center">
                操作
              </TableColumn>
            </TableHeader>
            <TableBody
              items={pm.products}
              isLoading={pm.isLoading || pm.isFetching}
              loadingContent={<Spinner size="sm" label="加载中..." />}
              emptyContent={
                <TableEmptyState
                  icon={Package}
                  hasFilter={!!(pm.keywordInput || pm.statusFilter)}
                  filterEmptyText={ADMIN_EMPTY_TEXTS.products.filterEmptyText}
                  emptyText={ADMIN_EMPTY_TEXTS.products.emptyText}
                  emptyHint={ADMIN_EMPTY_TEXTS.products.emptyHint}
                />
              }
            >
              {item => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3 min-w-[220px]">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-default-100 flex items-center justify-center">
                        {item.cover_url ? (
                          <Image
                            src={item.cover_url}
                            alt={item.title}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <Package className="w-5 h-5 text-default-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-default-500 line-clamp-1">{item.description || "暂无描述"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-primary">
                      {formatPriceRange(item.min_price, item.max_price)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-default-600">
                      <p>{item.variant_count} 个规格</p>
                      <p>销量 {item.total_sales}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip size="sm" variant="flat" color={statusColor(item.status)}>
                      {statusLabel(item.status)}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Switch
                      size="sm"
                      isSelected={item.show_on_homepage !== false}
                      onValueChange={async checked => {
                        try {
                          await pm.handleToggleHomepage(item, checked);
                        } catch (error) {
                          addToast({
                            title: error instanceof Error ? error.message : "更新失败",
                            color: "danger",
                            timeout: 3000,
                          });
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>{formatDateTime(item.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button size="sm" variant="light" isIconOnly onPress={() => pm.handleEditOpen(item)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="light" isIconOnly onPress={() => pm.handleOpenStock(item)}>
                        <Boxes className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="light"
                        isIconOnly
                        onPress={async () => {
                          try {
                            await pm.handleToggleStatus(item);
                          } catch (error) {
                            addToast({
                              title: error instanceof Error ? error.message : "更新状态失败",
                              color: "danger",
                              timeout: 3000,
                            });
                          }
                        }}
                      >
                        <ArrowUpDown className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="light"
                        color="danger"
                        isIconOnly
                        onPress={() => pm.handleDeleteClick(item)}
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
        {pm.isSomeSelected ? (
          <FloatingSelectionBar
            count={pm.selectedIds.size}
            actions={[
              {
                key: "delete",
                label: "批量删除",
                icon: <Trash2 className="w-3.5 h-3.5" />,
                onClick: pm.batchDeleteModal.onOpen,
                variant: "danger",
              },
            ]}
            onClear={() => pm.setSelectedIds(new Set())}
          />
        ) : null}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={pm.deleteModal.isOpen}
        onOpenChange={pm.deleteModal.onOpenChange}
        title="删除商品"
        description={`确定要删除「${pm.deleteTarget?.title || ""}」吗？删除后无法恢复。`}
        confirmText="删除"
        confirmColor="danger"
        icon={<ShieldAlert className="w-5 h-5 text-danger" />}
        iconBg="bg-danger-50"
        loading={false}
        onConfirm={pm.handleDeleteConfirm}
      />

      <ConfirmDialog
        isOpen={pm.batchDeleteModal.isOpen}
        onOpenChange={pm.batchDeleteModal.onOpenChange}
        title="批量删除商品"
        description={`确定要删除选中的 ${pm.selectedIds.size} 个商品吗？`}
        confirmText={`删除 ${pm.selectedIds.size} 项`}
        confirmColor="danger"
        icon={<ShieldAlert className="w-5 h-5 text-danger" />}
        iconBg="bg-danger-50"
        loading={false}
        onConfirm={pm.handleBatchDeleteConfirm}
      />

      <ProductEditDialog
        key={`${pm.editingProduct?.id ?? "new"}-${pm.editModal.isOpen ? "open" : "closed"}`}
        isOpen={pm.editModal.isOpen}
        onOpenChange={pm.editModal.onOpenChange}
        product={pm.editingProduct}
        onSubmit={pm.handleSaveProduct}
        isSubmitting={pm.isSubmitting}
      />

      <StockManageDialog
        isOpen={pm.stockModal.isOpen}
        onOpenChange={pm.stockModal.onOpenChange}
        product={pm.stockTarget}
      />
    </motion.div>
  );
}
