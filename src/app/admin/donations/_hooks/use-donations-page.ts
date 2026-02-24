"use client";

import { useCallback, useEffect, useState } from "react";
import { addToast, useDisclosure } from "@heroui/react";
import type { Selection } from "@heroui/react";
import { donationApi } from "@/lib/api/donation";
import { getErrorMessage } from "@/lib/api/client";
import type {
  DonationItem,
  CreateDonationRequest,
  UpdateDonationRequest,
  ImportDonationOptions,
} from "@/types/donation";

function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function useDonationsPage() {
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingDonation, setEditingDonation] = useState<DonationItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DonationItem | null>(null);

  const editModal = useDisclosure();
  const importModal = useDisclosure();
  const deleteModal = useDisclosure();
  const batchDeleteModal = useDisclosure();

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const isSomeSelected = selectedIds.size > 0;

  const fetchDonations = useCallback(async () => {
    try {
      setIsFetching(true);
      const response = await donationApi.getDonations({
        page,
        page_size: pageSize,
        status: statusFilter ?? undefined,
      });
      if (response.code !== 200 || !response.data) {
        throw new Error(response.message || "获取打赏列表失败");
      }

      setDonations(response.data.list || []);
      setTotalItems(response.data.total || 0);
    } catch (error) {
      addToast({ title: getErrorMessage(error), color: "danger", timeout: 3000 });
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [page, pageSize, statusFilter]);

  const fetchTotalAmount = useCallback(async () => {
    try {
      const response = await donationApi.getTotalAmount();
      if (response.code === 200 && response.data) {
        setTotalAmount(Number(response.data.total_amount || 0));
      }
    } catch {
      // 统计接口失败不阻塞主流程
    }
  }, []);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  useEffect(() => {
    fetchTotalAmount();
  }, [fetchTotalAmount]);

  const handleSelectionChange = useCallback(
    (keys: Selection) => {
      if (keys === "all") {
        setSelectedIds(new Set(donations.map(item => String(item.id))));
      } else {
        setSelectedIds(new Set(Array.from(keys).map(String)));
      }
    },
    [donations]
  );

  const handleResetFilters = useCallback(() => {
    setStatusFilter(null);
    setPage(1);
    setSelectedIds(new Set());
  }, []);

  const handleCreateOpen = useCallback(() => {
    setEditingDonation(null);
    editModal.onOpen();
  }, [editModal]);

  const handleEditOpen = useCallback(
    (donation: DonationItem) => {
      setEditingDonation(donation);
      editModal.onOpen();
    },
    [editModal]
  );

  const handleDeleteClick = useCallback(
    (donation: DonationItem) => {
      setDeleteTarget(donation);
      deleteModal.onOpen();
    },
    [deleteModal]
  );

  const handleSaveDonation = useCallback(
    async (data: CreateDonationRequest | UpdateDonationRequest) => {
      try {
        setIsSubmitting(true);
        if (editingDonation) {
          const response = await donationApi.updateDonation(editingDonation.id, data);
          if (response.code !== 200) {
            throw new Error(response.message || "更新打赏失败");
          }
          addToast({ title: "打赏记录已更新", color: "success", timeout: 2500 });
        } else {
          const response = await donationApi.createDonation(data as CreateDonationRequest);
          if (response.code !== 200) {
            throw new Error(response.message || "创建打赏失败");
          }
          addToast({ title: "打赏记录已创建", color: "success", timeout: 2500 });
        }
        editModal.onClose();
        setEditingDonation(null);
        await fetchDonations();
        await fetchTotalAmount();
      } catch (error) {
        addToast({ title: getErrorMessage(error), color: "danger", timeout: 3000 });
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingDonation, editModal, fetchDonations, fetchTotalAmount]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      const response = await donationApi.deleteDonation(deleteTarget.id);
      if (response.code !== 200) {
        throw new Error(response.message || "删除打赏失败");
      }
      addToast({ title: "打赏记录已删除", color: "success", timeout: 2500 });
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(String(deleteTarget.id));
        return next;
      });
      await fetchDonations();
      await fetchTotalAmount();
    } catch (error) {
      addToast({ title: getErrorMessage(error), color: "danger", timeout: 3000 });
    } finally {
      deleteModal.onClose();
      setDeleteTarget(null);
    }
  }, [deleteTarget, deleteModal, fetchDonations, fetchTotalAmount]);

  const handleBatchDeleteConfirm = useCallback(async () => {
    const ids = Array.from(selectedIds).map(id => Number(id));
    if (ids.length === 0) return;

    let successCount = 0;
    let failCount = 0;
    for (const id of ids) {
      try {
        const response = await donationApi.deleteDonation(id);
        if (response.code === 200) {
          successCount += 1;
        } else {
          failCount += 1;
        }
      } catch {
        failCount += 1;
      }
    }

    if (successCount > 0) {
      addToast({ title: `成功删除 ${successCount} 条记录`, color: "success", timeout: 2500 });
    }
    if (failCount > 0) {
      addToast({ title: `${failCount} 条记录删除失败`, color: "warning", timeout: 3000 });
    }

    setSelectedIds(new Set());
    batchDeleteModal.onClose();
    await fetchDonations();
    await fetchTotalAmount();
  }, [selectedIds, batchDeleteModal, fetchDonations, fetchTotalAmount]);

  const handleExport = useCallback(async (ids?: number[]) => {
    try {
      setIsExporting(true);
      const blob = await donationApi.exportDonations(ids);
      const date = new Date().toISOString().slice(0, 10);
      downloadBlob(blob, `donations-${date}.json`);
      addToast({ title: "导出成功", color: "success", timeout: 2500 });
    } catch {
      addToast({ title: "导出失败", color: "danger", timeout: 3000 });
    } finally {
      setIsExporting(false);
    }
  }, []);

  const handleImport = useCallback(
    async (file: File, options: ImportDonationOptions) => {
      try {
        setIsImporting(true);
        const response = await donationApi.importDonations(file, options);
        if (response.code !== 200 || !response.data) {
          throw new Error(response.message || "导入失败");
        }
        addToast({
          title: `导入完成：成功 ${response.data.success_count}，跳过 ${response.data.skipped_count}，失败 ${response.data.failed_count}`,
          color: "success",
          timeout: 4000,
        });
        await fetchDonations();
        await fetchTotalAmount();
      } catch (error) {
        addToast({ title: getErrorMessage(error), color: "danger", timeout: 3000 });
      } finally {
        setIsImporting(false);
      }
    },
    [fetchDonations, fetchTotalAmount]
  );

  return {
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalItems,
    totalPages,
    totalAmount,
    isLoading,
    isFetching,
    isSubmitting,
    isImporting,
    isExporting,
    donations,
    selectedIds,
    setSelectedIds,
    isSomeSelected,
    editingDonation,
    deleteTarget,
    editModal,
    importModal,
    deleteModal,
    batchDeleteModal,
    fetchDonations,
    handleSelectionChange,
    handleResetFilters,
    handleCreateOpen,
    handleEditOpen,
    handleDeleteClick,
    handleSaveDonation,
    handleDeleteConfirm,
    handleBatchDeleteConfirm,
    handleExport,
    handleImport,
  };
}

export type DonationsPageState = ReturnType<typeof useDonationsPage>;
