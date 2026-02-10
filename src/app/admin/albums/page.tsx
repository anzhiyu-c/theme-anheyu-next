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
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ShieldAlert, ChevronDown } from "lucide-react";
import { adminContainerVariants, adminItemVariants } from "@/lib/motion";
import { PAGE_SIZES } from "@/lib/constants/admin";
import { useAlbumsPage } from "./_hooks/use-albums-page";
import { TABLE_COLUMNS, useAlbumRenderCell } from "@/components/admin/albums/AlbumTableColumns";
import { AlbumSkeleton } from "@/components/admin/albums/AlbumSkeleton";
import { AlbumEmptyState } from "@/components/admin/albums/AlbumEmptyState";
import { AlbumFilterBar } from "@/components/admin/albums/AlbumFilterBar";
import AlbumFormModal from "@/components/admin/albums/AlbumFormModal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { FloatingSelectionBar } from "@/components/admin/FloatingSelectionBar";

export default function AlbumsPage() {
  const al = useAlbumsPage();

  const renderCell = useAlbumRenderCell({
    onAction: al.handleAction,
  });

  // ---- bottomContent ----
  const bottomContent = (
    <div className="py-2 px-2 flex flex-wrap justify-between items-center gap-2">
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-small text-default-400 whitespace-nowrap">共 {al.totalItems} 张</span>
        <span className="text-small text-default-300">|</span>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="light" size="sm" className="text-default-400 text-small h-7 min-w-0 gap-1 px-2">
              {al.pageSize}条/页
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="每页显示条数"
            selectedKeys={new Set([String(al.pageSize)])}
            selectionMode="single"
            onSelectionChange={keys => {
              const v = Array.from(keys)[0];
              if (v) {
                al.setPageSize(Number(v));
                al.setPage(1);
              }
            }}
          >
            {PAGE_SIZES.map(n => (
              <DropdownItem key={String(n)}>{n}条/页</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        {al.selectedIds.size > 0 && (
          <>
            <span className="text-small text-default-300">|</span>
            <span className="text-small text-primary font-medium whitespace-nowrap">已选 {al.selectedIds.size} 项</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={al.page}
          total={al.totalPages}
          onChange={al.setPage}
        />
        <div className="hidden sm:flex gap-1.5">
          <Button
            isDisabled={al.page <= 1}
            size="sm"
            variant="flat"
            onPress={() => al.setPage(p => Math.max(1, p - 1))}
          >
            上一页
          </Button>
          <Button
            isDisabled={al.page >= al.totalPages}
            size="sm"
            variant="flat"
            onPress={() => al.setPage(p => Math.min(al.totalPages, p + 1))}
          >
            下一页
          </Button>
        </div>
      </div>
    </div>
  );

  if (al.isLoading) {
    return <AlbumSkeleton />;
  }

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
        {/* 标题区 + 操作按钮 */}
        <div className="shrink-0 px-5 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground">相册管理</h1>
              <p className="text-xs text-muted-foreground mt-1">管理相册图片，支持批量操作</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                color="primary"
                startContent={<Plus className="w-3.5 h-3.5" />}
                onPress={al.handleNew}
                className="font-medium shadow-sm"
              >
                添加图片
              </Button>
            </div>
          </div>
        </div>

        {/* 筛选栏 */}
        <AlbumFilterBar
          sortFilter={al.sortFilter}
          onSortFilterChange={al.setSortFilter}
          onReset={al.handleReset}
          onPageReset={() => al.setPage(1)}
        />

        {/* 表格 */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <Table
            isHeaderSticky
            aria-label="相册管理表格"
            selectionMode="multiple"
            color="default"
            checkboxesProps={{ color: "primary" }}
            selectedKeys={al.selectedIds}
            onSelectionChange={al.handleSelectionChange}
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
              base: "flex-1 min-h-0 flex flex-col",
              wrapper: "flex-1 min-h-0 !px-3 !py-0 !shadow-none !rounded-none !border-none",
              table: "border-separate border-spacing-y-1.5 -mt-1.5",
              thead: "[&>tr]:first:!shadow-none after:!hidden",
              th: "bg-[#F6F7FA] dark:bg-default-50 first:!rounded-tl-lg last:!rounded-tr-lg",
              tr: "!rounded-xl",
              td: "first:before:!rounded-s-xl last:before:!rounded-e-xl",
            }}
          >
            <TableHeader columns={TABLE_COLUMNS}>
              {column => (
                <TableColumn key={column.key} align={column.key === "actions" ? "center" : "start"}>
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={al.albumList}
              emptyContent={
                <AlbumEmptyState
                  hasFilter={!!al.categoryFilter || al.sortFilter !== "display_order_asc"}
                  onNew={al.handleNew}
                />
              }
              isLoading={al.isFetching && !al.isLoading}
              loadingContent={<Spinner size="sm" label="加载中..." />}
            >
              {item => (
                <TableRow key={String(item.id)}>
                  {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* 浮动选择操作栏 */}
      <AnimatePresence>
        {al.isSomeSelected && (
          <FloatingSelectionBar
            count={al.selectedIds.size}
            actions={[
              {
                key: "delete",
                label: "删除",
                icon: <Trash2 className="w-3.5 h-3.5" />,
                onClick: al.batchDeleteModal.onOpen,
                variant: "danger",
              },
            ]}
            onClear={() => al.setSelectedIds(new Set())}
          />
        )}
      </AnimatePresence>

      {/* 弹窗 */}
      <ConfirmDialog
        isOpen={al.deleteModal.isOpen}
        onOpenChange={al.deleteModal.onOpenChange}
        title="删除图片"
        description={`确定要删除「${al.deleteTarget?.title || "该图片"}」吗？此操作不可撤销。`}
        confirmText="删除"
        confirmColor="danger"
        icon={<ShieldAlert className="w-5 h-5 text-danger" />}
        iconBg="bg-danger-50"
        loading={al.deleteAlbum.isPending}
        onConfirm={al.handleDeleteConfirm}
      />

      <ConfirmDialog
        isOpen={al.batchDeleteModal.isOpen}
        onOpenChange={al.batchDeleteModal.onOpenChange}
        title="批量删除"
        description={`确定要删除选中的 ${al.selectedIds.size} 张图片吗？此操作不可撤销。`}
        confirmText={`删除 ${al.selectedIds.size} 张`}
        confirmColor="danger"
        icon={<ShieldAlert className="w-5 h-5 text-danger" />}
        iconBg="bg-danger-50"
        loading={al.batchDeleteAlbums.isPending}
        onConfirm={al.handleBatchDeleteConfirm}
      />

      <AlbumFormModal isOpen={al.formModal.isOpen} onClose={al.handleFormClose} editItem={al.editItem} />
    </motion.div>
  );
}
