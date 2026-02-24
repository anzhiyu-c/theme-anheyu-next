"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { addToast, useDisclosure } from "@heroui/react";
import type { Selection } from "@heroui/react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { productApi } from "@/lib/api/product";
import type {
  Product,
  ProductListItem,
  ProductStatus,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/types/product";

export function useProductsPage() {
  const [keywordInput, setKeywordInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stockTarget, setStockTarget] = useState<ProductListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductListItem | null>(null);

  const editModal = useDisclosure();
  const stockModal = useDisclosure();
  const deleteModal = useDisclosure();
  const batchDeleteModal = useDisclosure();

  const debouncedKeyword = useDebouncedValue(keywordInput, 350);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const isSomeSelected = selectedIds.size > 0;

  const queryParams = useMemo(
    () => ({
      page,
      page_size: pageSize,
      status: statusFilter ?? undefined,
      keyword: debouncedKeyword.trim() || undefined,
    }),
    [page, pageSize, statusFilter, debouncedKeyword]
  );

  const fetchProducts = useCallback(async () => {
    try {
      setIsFetching(true);
      const response = await productApi.getAdminProducts(queryParams);
      if (response.code !== 200 || !response.data) {
        throw new Error(response.message || "获取商品列表失败");
      }
      setProducts(response.data.list || []);
      setTotalItems(response.data.total || 0);
    } catch (error) {
      addToast({
        title: error instanceof Error ? error.message : "获取商品列表失败",
        color: "danger",
        timeout: 3000,
      });
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSelectionChange = useCallback(
    (keys: Selection) => {
      if (keys === "all") {
        setSelectedIds(new Set(products.map(item => item.id)));
      } else {
        setSelectedIds(new Set(Array.from(keys).map(String)));
      }
    },
    [products]
  );

  const handleResetFilters = useCallback(() => {
    setKeywordInput("");
    setStatusFilter(null);
    setPage(1);
    setSelectedIds(new Set());
  }, []);

  const handleCreateOpen = useCallback(() => {
    setEditingProduct(null);
    editModal.onOpen();
  }, [editModal]);

  const handleEditOpen = useCallback(
    async (product: ProductListItem) => {
      try {
        setIsMutating(true);
        const response = await productApi.getAdminProduct(product.id);
        if (response.code !== 200 || !response.data) {
          throw new Error(response.message || "获取商品详情失败");
        }
        setEditingProduct(response.data);
        editModal.onOpen();
      } catch (error) {
        addToast({
          title: error instanceof Error ? error.message : "获取商品详情失败",
          color: "danger",
          timeout: 3000,
        });
      } finally {
        setIsMutating(false);
      }
    },
    [editModal]
  );

  const handleSaveProduct = useCallback(
    async (payload: CreateProductRequest | UpdateProductRequest) => {
      try {
        setIsSubmitting(true);
        if (editingProduct) {
          const response = await productApi.updateProduct(editingProduct.id, payload as UpdateProductRequest);
          if (response.code !== 200) {
            throw new Error(response.message || "更新商品失败");
          }
          addToast({ title: "商品已更新", color: "success", timeout: 2500 });
        } else {
          const response = await productApi.createProduct(payload as CreateProductRequest);
          if (response.code !== 200) {
            throw new Error(response.message || "创建商品失败");
          }
          addToast({ title: "商品已创建", color: "success", timeout: 2500 });
        }
        editModal.onClose();
        setEditingProduct(null);
        await fetchProducts();
      } catch (error) {
        addToast({
          title: error instanceof Error ? error.message : "保存商品失败",
          color: "danger",
          timeout: 3000,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingProduct, editModal, fetchProducts]
  );

  const handleDeleteClick = useCallback(
    (product: ProductListItem) => {
      setDeleteTarget(product);
      deleteModal.onOpen();
    },
    [deleteModal]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      const response = await productApi.deleteProduct(deleteTarget.id);
      if (response.code !== 200) {
        throw new Error(response.message || "删除商品失败");
      }
      addToast({ title: "商品已删除", color: "success", timeout: 2500 });
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(deleteTarget.id);
        return next;
      });
      await fetchProducts();
    } catch (error) {
      addToast({
        title: error instanceof Error ? error.message : "删除商品失败",
        color: "danger",
        timeout: 3000,
      });
    } finally {
      deleteModal.onClose();
      setDeleteTarget(null);
    }
  }, [deleteTarget, deleteModal, fetchProducts]);

  const handleBatchDeleteConfirm = useCallback(async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    let successCount = 0;
    let failCount = 0;
    for (const id of ids) {
      try {
        const response = await productApi.deleteProduct(id);
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
      addToast({ title: `成功删除 ${successCount} 个商品`, color: "success", timeout: 2500 });
    }
    if (failCount > 0) {
      addToast({ title: `${failCount} 个商品删除失败`, color: "warning", timeout: 3000 });
    }

    setSelectedIds(new Set());
    batchDeleteModal.onClose();
    await fetchProducts();
  }, [selectedIds, batchDeleteModal, fetchProducts]);

  const handleToggleStatus = useCallback(
    async (product: ProductListItem) => {
      const targetStatus = product.status === 2 ? 3 : 2;
      const response = await productApi.updateProduct(product.id, { status: targetStatus });
      if (response.code !== 200) {
        throw new Error(response.message || "更新商品状态失败");
      }
      addToast({
        title: targetStatus === 2 ? "商品已上架" : "商品已下架",
        color: "success",
        timeout: 2500,
      });
      await fetchProducts();
    },
    [fetchProducts]
  );

  const handleToggleHomepage = useCallback(async (product: ProductListItem, checked: boolean) => {
    const response = await productApi.updateProduct(product.id, { show_on_homepage: checked });
    if (response.code !== 200) {
      throw new Error(response.message || "更新首页显示状态失败");
    }
    setProducts(prev =>
      prev.map(item => {
        if (item.id !== product.id) return item;
        return { ...item, show_on_homepage: checked };
      })
    );
    addToast({
      title: checked ? "已设为首页显示" : "已从首页隐藏",
      color: "success",
      timeout: 2500,
    });
  }, []);

  const handleOpenStock = useCallback(
    (product: ProductListItem) => {
      setStockTarget(product);
      stockModal.onOpen();
    },
    [stockModal]
  );

  return {
    keywordInput,
    setKeywordInput,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalItems,
    totalPages,
    isLoading,
    isFetching,
    isSubmitting,
    isMutating,
    products,
    selectedIds,
    setSelectedIds,
    isSomeSelected,
    editingProduct,
    stockTarget,
    deleteTarget,
    editModal,
    stockModal,
    deleteModal,
    batchDeleteModal,
    fetchProducts,
    handleSelectionChange,
    handleResetFilters,
    handleCreateOpen,
    handleEditOpen,
    handleSaveProduct,
    handleDeleteClick,
    handleDeleteConfirm,
    handleBatchDeleteConfirm,
    handleToggleStatus,
    handleToggleHomepage,
    handleOpenStock,
  };
}

export type ProductsPageState = ReturnType<typeof useProductsPage>;
