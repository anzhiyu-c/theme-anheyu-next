"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { addToast, useDisclosure } from "@heroui/react";
import type { Selection } from "@heroui/react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { orderApi } from "@/lib/api/order";
import type { AdminOrder, OrderListParams, OrderStatus, OrderType, PaymentProvider } from "@/types/order";

function detectOrderKeywordType(keyword: string): "order_no" | "trade_no" {
  const value = keyword.trim();
  if (!value) return "order_no";
  return value.toUpperCase().startsWith("ORDER") ? "order_no" : "trade_no";
}

export function useOrdersPage() {
  const [keywordInput, setKeywordInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [providerFilter, setProviderFilter] = useState<PaymentProvider | "">("");
  const [orderTypeFilter, setOrderTypeFilter] = useState<OrderType | "">("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailTarget, setDetailTarget] = useState<AdminOrder | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminOrder | null>(null);
  const detailModal = useDisclosure();
  const deleteModal = useDisclosure();
  const batchDeleteModal = useDisclosure();

  const debouncedKeyword = useDebouncedValue(keywordInput, 350);
  const debouncedEmail = useDebouncedValue(emailInput, 350);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const isSomeSelected = selectedIds.size > 0;

  const queryParams = useMemo<OrderListParams>(() => {
    const params: OrderListParams = {
      page,
      page_size: pageSize,
      status: statusFilter || undefined,
      payment_provider: providerFilter || undefined,
      user_email: debouncedEmail.trim() || undefined,
      order_type: orderTypeFilter || undefined,
      sort_by: "created_at",
      sort_order: "desc",
    };

    const keyword = debouncedKeyword.trim();
    if (keyword) {
      const keywordType = detectOrderKeywordType(keyword);
      if (keywordType === "order_no") {
        params.order_no = keyword;
      } else {
        params.trade_no = keyword;
      }
    }

    return params;
  }, [page, pageSize, statusFilter, providerFilter, orderTypeFilter, debouncedEmail, debouncedKeyword]);

  const fetchOrders = useCallback(async () => {
    try {
      setIsFetching(true);
      const response = await orderApi.getAdminOrders(queryParams);
      if (response.code !== 200 || !response.data) {
        throw new Error(response.message || "获取订单列表失败");
      }

      setOrders(response.data.orders || []);
      setTotalItems(response.data.total || 0);
    } catch (error) {
      addToast({
        title: error instanceof Error ? error.message : "获取订单列表失败",
        color: "danger",
        timeout: 3000,
      });
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSelectionChange = useCallback(
    (keys: Selection) => {
      if (keys === "all") {
        setSelectedIds(new Set(orders.map(order => String(order.id))));
      } else {
        setSelectedIds(new Set(Array.from(keys).map(String)));
      }
    },
    [orders]
  );

  const handleResetFilters = useCallback(() => {
    setKeywordInput("");
    setEmailInput("");
    setStatusFilter("");
    setProviderFilter("");
    setOrderTypeFilter("");
    setPage(1);
    setSelectedIds(new Set());
  }, []);

  const handleDeleteClick = useCallback(
    (order: AdminOrder) => {
      setDeleteTarget(order);
      deleteModal.onOpen();
    },
    [deleteModal]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;

    try {
      const response = await orderApi.deleteOrder(deleteTarget.id);
      if (response.code !== 200) {
        throw new Error(response.message || "删除订单失败");
      }

      addToast({ title: "订单已删除", color: "success", timeout: 2500 });
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(String(deleteTarget.id));
        return next;
      });
      await fetchOrders();
    } catch (error) {
      addToast({
        title: error instanceof Error ? error.message : "删除订单失败",
        color: "danger",
        timeout: 3000,
      });
    } finally {
      deleteModal.onClose();
      setDeleteTarget(null);
    }
  }, [deleteTarget, fetchOrders, deleteModal]);

  const handleBatchDeleteConfirm = useCallback(async () => {
    const ids = Array.from(selectedIds).map(id => Number(id));
    if (ids.length === 0) return;

    let successCount = 0;
    let failCount = 0;

    for (const id of ids) {
      try {
        const response = await orderApi.deleteOrder(id);
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
      addToast({ title: `成功删除 ${successCount} 个订单`, color: "success", timeout: 2500 });
    }
    if (failCount > 0) {
      addToast({ title: `${failCount} 个订单删除失败`, color: "warning", timeout: 3000 });
    }

    setSelectedIds(new Set());
    batchDeleteModal.onClose();
    await fetchOrders();
  }, [selectedIds, batchDeleteModal, fetchOrders]);

  const handleViewDetail = useCallback(
    (order: AdminOrder) => {
      setDetailTarget(order);
      detailModal.onOpen();
    },
    [detailModal]
  );

  return {
    keywordInput,
    setKeywordInput,
    emailInput,
    setEmailInput,
    statusFilter,
    setStatusFilter,
    providerFilter,
    setProviderFilter,
    orderTypeFilter,
    setOrderTypeFilter,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalItems,
    totalPages,
    isLoading,
    isFetching,
    orders,
    selectedIds,
    setSelectedIds,
    isSomeSelected,
    handleSelectionChange,
    handleResetFilters,
    fetchOrders,
    detailTarget,
    detailModal,
    handleViewDetail,
    deleteTarget,
    deleteModal,
    batchDeleteModal,
    handleDeleteClick,
    handleDeleteConfirm,
    handleBatchDeleteConfirm,
  };
}

export type OrdersPageState = ReturnType<typeof useOrdersPage>;
