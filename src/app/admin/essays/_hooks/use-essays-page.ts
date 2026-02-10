"use client";

import { useState, useMemo, useCallback } from "react";
import { addToast, useDisclosure } from "@heroui/react";
import { useAdminEssays, useDeleteEssay, useBatchDeleteEssays, useExportEssays } from "@/hooks/queries/use-essays";
import type { Essay, AdminEssayListParams } from "@/lib/api/essay";

export function useEssaysPage() {
  // ---- 筛选 & 分页 ----
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // ---- 选择 ----
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // ---- 弹窗 ----
  const [editItem, setEditItem] = useState<Essay | null>(null);
  const [viewItem, setViewItem] = useState<Essay | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Essay | null>(null);
  const editModal = useDisclosure();
  const viewModal = useDisclosure();
  const deleteModal = useDisclosure();
  const batchDeleteModal = useDisclosure();
  const importModal = useDisclosure();

  // ---- 查询 ----
  const queryParams: AdminEssayListParams = useMemo(
    () => ({ page, page_size: pageSize, status: statusFilter ? Number(statusFilter) : undefined }),
    [page, pageSize, statusFilter]
  );

  const { data, isLoading, isFetching } = useAdminEssays(queryParams);
  const essays = useMemo(() => data?.list ?? [], [data?.list]);
  const totalItems = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // ---- Mutations ----
  const deleteEssay = useDeleteEssay();
  const batchDeleteEssays = useBatchDeleteEssays();
  const exportEssays = useExportEssays();

  // ---- 选择逻辑 ----
  const isSomeSelected = selectedIds.size > 0;

  const handleSelectionChange = useCallback(
    (keys: "all" | Set<React.Key>) => {
      if (keys === "all") {
        setSelectedIds(new Set(essays.map(e => e.id)));
      } else {
        setSelectedIds(keys as Set<number>);
      }
    },
    [essays]
  );

  // ---- 编辑 ----
  const handleNew = useCallback(() => {
    setEditItem(null);
    editModal.onOpen();
  }, [editModal]);

  const handleEdit = useCallback(
    (essay: Essay) => {
      setEditItem(essay);
      editModal.onOpen();
    },
    [editModal]
  );

  const handleEditClose = useCallback(() => {
    editModal.onClose();
    setEditItem(null);
  }, [editModal]);

  // ---- 查看 ----
  const handleView = useCallback(
    (essay: Essay) => {
      setViewItem(essay);
      viewModal.onOpen();
    },
    [viewModal]
  );

  const handleViewClose = useCallback(() => {
    viewModal.onClose();
    setViewItem(null);
  }, [viewModal]);

  // ---- 删除 ----
  const handleDeleteClick = useCallback(
    (essay: Essay) => {
      setDeleteTarget(essay);
      deleteModal.onOpen();
    },
    [deleteModal]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteEssay.mutateAsync(deleteTarget.id);
      addToast({ title: "说说已删除", color: "success", timeout: 3000 });
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(deleteTarget.id);
        return next;
      });
    } catch (error) {
      addToast({ title: error instanceof Error ? error.message : "删除失败", color: "danger", timeout: 3000 });
    }
    deleteModal.onClose();
    setDeleteTarget(null);
  }, [deleteTarget, deleteEssay, deleteModal]);

  const handleBatchDeleteConfirm = useCallback(async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    try {
      await batchDeleteEssays.mutateAsync(ids);
      addToast({ title: `已删除 ${ids.length} 条说说`, color: "success", timeout: 3000 });
      setSelectedIds(new Set());
    } catch (error) {
      addToast({ title: error instanceof Error ? error.message : "批量删除失败", color: "danger", timeout: 3000 });
    }
    batchDeleteModal.onClose();
  }, [selectedIds, batchDeleteEssays, batchDeleteModal]);

  // ---- 导出 ----
  const handleExport = useCallback(async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) {
      addToast({ title: "请先选择要导出的说说", color: "warning", timeout: 3000 });
      return;
    }
    try {
      await exportEssays.mutateAsync(ids);
      addToast({ title: `已导出 ${ids.length} 条说说`, color: "success", timeout: 3000 });
    } catch (error) {
      addToast({ title: error instanceof Error ? error.message : "导出失败", color: "danger", timeout: 3000 });
    }
  }, [selectedIds, exportEssays]);

  return {
    // 筛选 & 分页
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    pageSize,
    setPageSize,

    // 选择
    selectedIds,
    setSelectedIds,
    isSomeSelected,
    handleSelectionChange,

    // 数据
    essays,
    totalItems,
    totalPages,
    isLoading,
    isFetching,

    // 弹窗
    editItem,
    viewItem,
    deleteTarget,
    editModal,
    viewModal,
    deleteModal,
    batchDeleteModal,
    importModal,

    // Mutation 状态
    deleteEssayPending: deleteEssay.isPending,
    batchDeletePending: batchDeleteEssays.isPending,
    exportPending: exportEssays.isPending,

    // 操作
    handleNew,
    handleEdit,
    handleEditClose,
    handleView,
    handleViewClose,
    handleDeleteClick,
    handleDeleteConfirm,
    handleBatchDeleteConfirm,
    handleExport,
  };
}

export type EssaysPageState = ReturnType<typeof useEssaysPage>;
