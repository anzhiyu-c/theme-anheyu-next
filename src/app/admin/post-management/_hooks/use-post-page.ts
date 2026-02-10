import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { addToast, useDisclosure } from "@heroui/react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import {
  useAdminArticles,
  useDeleteArticle,
  useBatchDeleteArticles,
  useApproveArticle,
  useRejectArticle,
  useTakedownArticle,
  useRestoreArticle,
  useExportArticles,
  useImportArticles,
} from "@/hooks/queries/use-post-management";
import type { AdminArticle, AdminArticleListParams, ArticleStatus, ReviewStatus } from "@/types/post-management";
import { useSiteConfigStore } from "@/store/site-config-store";
import { FALLBACK_COVER } from "@/lib/constants/admin";

export function usePostManagementPage() {
  const router = useRouter();

  // ---- 站点配置 ----
  const siteConfig = useSiteConfigStore(state => state.siteConfig);
  const defaultCover = useMemo(() => siteConfig?.post?.default?.default_cover || FALLBACK_COVER, [siteConfig]);
  const gravatarBaseUrl = useMemo(
    () => (siteConfig?.GRAVATAR_URL || "https://cravatar.cn").replace(/\/$/, ""),
    [siteConfig]
  );

  // ---- 筛选 & 分页 ----
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput, 300);
  const [statusFilter, setStatusFilter] = useState("");
  const [reviewStatusFilter, setReviewStatusFilter] = useState("");
  const [categoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ---- 选择 ----
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // ---- 弹窗状态 ----
  const [deleteTarget, setDeleteTarget] = useState<AdminArticle | null>(null);
  const [reviewTarget, setReviewTarget] = useState<{ article: AdminArticle; action: "approve" | "reject" } | null>(
    null
  );
  const [reviewComment, setReviewComment] = useState("");
  const [takedownTarget, setTakedownTarget] = useState<AdminArticle | null>(null);
  const [takedownReason, setTakedownReason] = useState("");

  const deleteModal = useDisclosure();
  const batchDeleteModal = useDisclosure();
  const reviewModal = useDisclosure();
  const takedownModal = useDisclosure();
  const importModal = useDisclosure();

  // ---- 查询 ----
  const queryParams: AdminArticleListParams = useMemo(
    () => ({
      page,
      pageSize,
      query: debouncedSearch || undefined,
      status: (statusFilter as ArticleStatus) || undefined,
      review_status: (reviewStatusFilter as ReviewStatus) || undefined,
      category: categoryFilter || undefined,
    }),
    [page, pageSize, debouncedSearch, statusFilter, reviewStatusFilter, categoryFilter]
  );

  const { data, isLoading, isFetching } = useAdminArticles(queryParams);
  const articles = useMemo(() => data?.list ?? [], [data?.list]);
  const totalItems = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // ---- Mutations ----
  const deleteArticle = useDeleteArticle();
  const batchDeleteArticles = useBatchDeleteArticles();
  const approveArticle = useApproveArticle();
  const rejectArticle = useRejectArticle();
  const takedownArticle = useTakedownArticle();
  const restoreArticle = useRestoreArticle();
  const exportArticles = useExportArticles();
  const importArticlesHook = useImportArticles();

  // ---- 选择逻辑 ----
  const isSomeSelected = selectedIds.size > 0;

  const handleSelectionChange = useCallback(
    (keys: "all" | Set<React.Key>) => {
      if (keys === "all") {
        setSelectedIds(new Set(articles.map(a => a.id)));
      } else {
        setSelectedIds(keys as Set<string>);
      }
    },
    [articles]
  );

  // ---- 删除 ----
  const handleDeleteClick = useCallback(
    (article: AdminArticle) => {
      setDeleteTarget(article);
      deleteModal.onOpen();
    },
    [deleteModal]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteArticle.mutateAsync(deleteTarget.id);
      addToast({ title: "文章已删除", color: "success", timeout: 3000 });
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
  }, [deleteTarget, deleteArticle, deleteModal]);

  const handleBatchDeleteConfirm = useCallback(async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    try {
      await batchDeleteArticles.mutateAsync(ids);
      addToast({ title: `已删除 ${ids.length} 篇文章`, color: "success", timeout: 3000 });
      setSelectedIds(new Set());
    } catch (error) {
      addToast({ title: error instanceof Error ? error.message : "批量删除失败", color: "danger", timeout: 3000 });
    }
    batchDeleteModal.onClose();
  }, [selectedIds, batchDeleteArticles, batchDeleteModal]);

  // ---- 审核 ----
  const handleReviewClick = useCallback(
    (article: AdminArticle, action: "approve" | "reject") => {
      setReviewTarget({ article, action });
      setReviewComment("");
      reviewModal.onOpen();
    },
    [reviewModal]
  );

  const handleReviewConfirm = useCallback(async () => {
    if (!reviewTarget) return;
    try {
      if (reviewTarget.action === "approve") {
        await approveArticle.mutateAsync({
          id: reviewTarget.article.id,
          data: reviewComment ? { review_comment: reviewComment } : undefined,
        });
        addToast({ title: "文章审核通过", color: "success", timeout: 3000 });
      } else {
        if (!reviewComment.trim()) {
          addToast({ title: "请填写拒绝原因", color: "warning", timeout: 3000 });
          return;
        }
        await rejectArticle.mutateAsync({
          id: reviewTarget.article.id,
          data: { review_comment: reviewComment },
        });
        addToast({ title: "文章已拒绝", color: "success", timeout: 3000 });
      }
    } catch (error) {
      addToast({ title: error instanceof Error ? error.message : "审核操作失败", color: "danger", timeout: 3000 });
    }
    reviewModal.onClose();
    setReviewTarget(null);
    setReviewComment("");
  }, [reviewTarget, reviewComment, approveArticle, rejectArticle, reviewModal]);

  // ---- 下架 ----
  const handleTakedownClick = useCallback(
    (article: AdminArticle) => {
      setTakedownTarget(article);
      setTakedownReason("");
      takedownModal.onOpen();
    },
    [takedownModal]
  );

  const handleTakedownConfirm = useCallback(async () => {
    if (!takedownTarget || !takedownReason.trim()) {
      if (!takedownReason.trim()) addToast({ title: "请填写下架原因", color: "warning", timeout: 3000 });
      return;
    }
    try {
      await takedownArticle.mutateAsync({ id: takedownTarget.id, data: { takedown_reason: takedownReason } });
      addToast({ title: "文章已下架", color: "success", timeout: 3000 });
    } catch (error) {
      addToast({ title: error instanceof Error ? error.message : "下架失败", color: "danger", timeout: 3000 });
    }
    takedownModal.onClose();
    setTakedownTarget(null);
    setTakedownReason("");
  }, [takedownTarget, takedownReason, takedownArticle, takedownModal]);

  const handleRestore = useCallback(
    async (article: AdminArticle) => {
      try {
        await restoreArticle.mutateAsync(article.id);
        addToast({ title: "文章已恢复", color: "success", timeout: 3000 });
      } catch (error) {
        addToast({ title: error instanceof Error ? error.message : "恢复失败", color: "danger", timeout: 3000 });
      }
    },
    [restoreArticle]
  );

  // ---- 导出 ----
  const handleExport = useCallback(async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) {
      addToast({ title: "请先选择要导出的文章", color: "warning", timeout: 3000 });
      return;
    }
    try {
      await exportArticles.mutateAsync(ids);
      addToast({ title: `已导出 ${ids.length} 篇文章`, color: "success", timeout: 3000 });
    } catch (error) {
      addToast({ title: error instanceof Error ? error.message : "导出失败", color: "danger", timeout: 3000 });
    }
  }, [selectedIds, exportArticles]);

  // ---- 行操作分发 ----
  const handleAction = useCallback(
    (article: AdminArticle, key: string) => {
      switch (key) {
        case "preview":
          window.open(`/posts/${article.abbrlink || article.id}`, "_blank");
          break;
        case "edit":
          router.push(`/admin/post-management/${article.id}/edit`);
          break;
        case "approve":
          handleReviewClick(article, "approve");
          break;
        case "reject":
          handleReviewClick(article, "reject");
          break;
        case "takedown":
          handleTakedownClick(article);
          break;
        case "restore":
          handleRestore(article);
          break;
        case "delete":
          handleDeleteClick(article);
          break;
      }
    },
    [router, handleReviewClick, handleTakedownClick, handleRestore, handleDeleteClick]
  );

  // ---- 重置筛选 ----
  const handleReset = useCallback(() => {
    setSearchInput("");
    setStatusFilter("");
    setReviewStatusFilter("");
    setPage(1);
  }, []);

  return {
    // 站点配置
    defaultCover,
    gravatarBaseUrl,

    // 筛选
    searchInput,
    setSearchInput,
    debouncedSearch,
    statusFilter,
    setStatusFilter,
    reviewStatusFilter,
    setReviewStatusFilter,
    categoryFilter,
    page,
    setPage,
    pageSize,
    setPageSize,
    handleReset,

    // 查询数据
    articles,
    totalItems,
    totalPages,
    isLoading,
    isFetching,

    // 选择
    selectedIds,
    setSelectedIds,
    isSomeSelected,
    handleSelectionChange,

    // 删除
    deleteTarget,
    deleteModal,
    batchDeleteModal,
    deleteArticle,
    batchDeleteArticles,
    handleDeleteClick,
    handleDeleteConfirm,
    handleBatchDeleteConfirm,

    // 审核
    reviewTarget,
    reviewComment,
    setReviewComment,
    reviewModal,
    approveArticle,
    rejectArticle,
    handleReviewConfirm,

    // 下架
    takedownTarget,
    takedownReason,
    setTakedownReason,
    takedownModal,
    takedownArticle,
    handleTakedownConfirm,

    // 导出 & 导入
    exportArticles,
    handleExport,
    importModal,
    importArticlesHook,

    // 行操作
    handleAction,
  };
}

/** 页面状态类型，供子组件使用 */
export type PostPageState = ReturnType<typeof usePostManagementPage>;
