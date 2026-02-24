"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { addToast, useDisclosure } from "@heroui/react";
import type { Selection } from "@heroui/react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { supportApi } from "@/lib/api/support";
import type { Ticket, TicketDetail, TicketStatsResponse, ReplyTicketRequest } from "@/types/support";

export function useSupportsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [keywordInput, setKeywordInput] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [stats, setStats] = useState<TicketStatsResponse>({ pending: 0, processing: 0, closed: 0, total: 0 });

  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailTicket, setDetailTicket] = useState<TicketDetail | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Ticket | null>(null);

  const detailModal = useDisclosure();
  const deleteModal = useDisclosure();
  const batchDeleteModal = useDisclosure();

  const debouncedKeyword = useDebouncedValue(keywordInput, 350);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const isSomeSelected = selectedIds.size > 0;

  const queryParams = useMemo(
    () => ({
      page,
      page_size: pageSize,
      status: statusFilter || undefined,
      keyword: debouncedKeyword.trim() || undefined,
    }),
    [page, pageSize, statusFilter, debouncedKeyword]
  );

  const fetchTickets = useCallback(async () => {
    try {
      setIsFetching(true);
      const response = await supportApi.getAdminTickets(queryParams);
      if (response.code !== 200 || !response.data) {
        throw new Error(response.message || "获取工单列表失败");
      }
      setTickets(response.data.list || []);
      setTotalItems(response.data.total || 0);
    } catch (error) {
      addToast({
        title: error instanceof Error ? error.message : "获取工单列表失败",
        color: "danger",
        timeout: 3000,
      });
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [queryParams]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await supportApi.getTicketStats();
      if (response.code === 200 && response.data) {
        setStats(response.data);
      }
    } catch {
      // 统计失败不阻塞页面
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleSelectionChange = useCallback(
    (keys: Selection) => {
      if (keys === "all") {
        setSelectedIds(new Set(tickets.map(item => item.id)));
      } else {
        setSelectedIds(new Set(Array.from(keys).map(String)));
      }
    },
    [tickets]
  );

  const handleResetFilters = useCallback(() => {
    setStatusFilter("");
    setKeywordInput("");
    setPage(1);
    setSelectedIds(new Set());
  }, []);

  const handleOpenDetail = useCallback(
    async (ticket: Ticket) => {
      try {
        setIsDetailLoading(true);
        const response = await supportApi.getAdminTicket(ticket.id);
        if (response.code !== 200 || !response.data) {
          throw new Error(response.message || "获取工单详情失败");
        }
        setDetailTicket(response.data);
        setReplyContent("");
        detailModal.onOpen();
      } catch (error) {
        addToast({
          title: error instanceof Error ? error.message : "获取工单详情失败",
          color: "danger",
          timeout: 3000,
        });
      } finally {
        setIsDetailLoading(false);
      }
    },
    [detailModal]
  );

  const handleReplyTicket = useCallback(async () => {
    if (!detailTicket) return;
    if (!replyContent.trim()) {
      addToast({ title: "请输入回复内容", color: "warning", timeout: 2500 });
      return;
    }

    try {
      setIsReplying(true);
      const payload: ReplyTicketRequest = { content: replyContent.trim() };
      const response = await supportApi.replyTicket(detailTicket.id, payload);
      if (response.code !== 200) {
        throw new Error(response.message || "回复失败");
      }

      addToast({ title: "回复已发送", color: "success", timeout: 2500 });
      setReplyContent("");
      const detailResponse = await supportApi.getAdminTicket(detailTicket.id);
      if (detailResponse.code === 200 && detailResponse.data) {
        setDetailTicket(detailResponse.data);
      }
      await fetchTickets();
      await fetchStats();
    } catch (error) {
      addToast({
        title: error instanceof Error ? error.message : "回复失败",
        color: "danger",
        timeout: 3000,
      });
    } finally {
      setIsReplying(false);
    }
  }, [detailTicket, replyContent, fetchTickets, fetchStats]);

  const handleCloseTicket = useCallback(
    async (ticket: Ticket) => {
      const response = await supportApi.closeTicket(ticket.id);
      if (response.code !== 200) {
        throw new Error(response.message || "关闭工单失败");
      }
      addToast({ title: "工单已关闭", color: "success", timeout: 2500 });
      await fetchTickets();
      await fetchStats();

      if (detailTicket?.id === ticket.id) {
        const detailResponse = await supportApi.getAdminTicket(ticket.id);
        if (detailResponse.code === 200 && detailResponse.data) {
          setDetailTicket(detailResponse.data);
        }
      }
    },
    [fetchTickets, fetchStats, detailTicket]
  );

  const handleDeleteClick = useCallback(
    (ticket: Ticket) => {
      setDeleteTarget(ticket);
      deleteModal.onOpen();
    },
    [deleteModal]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      const response = await supportApi.deleteTicket(deleteTarget.id);
      if (response.code !== 200) {
        throw new Error(response.message || "删除工单失败");
      }
      addToast({ title: "工单已删除", color: "success", timeout: 2500 });
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(deleteTarget.id);
        return next;
      });
      await fetchTickets();
      await fetchStats();
      if (detailTicket?.id === deleteTarget.id) {
        detailModal.onClose();
        setDetailTicket(null);
      }
    } catch (error) {
      addToast({
        title: error instanceof Error ? error.message : "删除工单失败",
        color: "danger",
        timeout: 3000,
      });
    } finally {
      deleteModal.onClose();
      setDeleteTarget(null);
    }
  }, [deleteTarget, deleteModal, fetchTickets, fetchStats, detailTicket, detailModal]);

  const handleBatchDeleteConfirm = useCallback(async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    let successCount = 0;
    let failCount = 0;
    for (const id of ids) {
      try {
        const response = await supportApi.deleteTicket(id);
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
      addToast({ title: `成功删除 ${successCount} 个工单`, color: "success", timeout: 2500 });
    }
    if (failCount > 0) {
      addToast({ title: `${failCount} 个工单删除失败`, color: "warning", timeout: 3000 });
    }

    setSelectedIds(new Set());
    batchDeleteModal.onClose();
    await fetchTickets();
    await fetchStats();
  }, [selectedIds, batchDeleteModal, fetchTickets, fetchStats]);

  return {
    statusFilter,
    setStatusFilter,
    keywordInput,
    setKeywordInput,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalItems,
    totalPages,
    stats,
    isLoading,
    isFetching,
    isDetailLoading,
    isReplying,
    tickets,
    selectedIds,
    setSelectedIds,
    isSomeSelected,
    detailTicket,
    replyContent,
    setReplyContent,
    deleteTarget,
    detailModal,
    deleteModal,
    batchDeleteModal,
    fetchTickets,
    handleSelectionChange,
    handleResetFilters,
    handleOpenDetail,
    handleReplyTicket,
    handleCloseTicket,
    handleDeleteClick,
    handleDeleteConfirm,
    handleBatchDeleteConfirm,
  };
}

export type SupportsPageState = ReturnType<typeof useSupportsPage>;
