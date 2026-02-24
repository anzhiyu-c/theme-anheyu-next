"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { addToast, useDisclosure } from "@heroui/react";
import { knowledgeApi } from "@/lib/api/knowledge";
import type {
  KnowledgeDocument,
  KnowledgeStats,
  KnowledgeConfig,
  RebuildStatus,
  KnowledgeDocumentStatus,
} from "@/types/knowledge";

const EMPTY_STATS: KnowledgeStats = {
  total_documents: 0,
  indexed_documents: 0,
  pending_documents: 0,
  failed_documents: 0,
  total_chunks: 0,
  total_tokens: 0,
};

const EMPTY_CONFIG: KnowledgeConfig = {
  enabled: false,
  embedding_provider: "",
  embedding_model: "",
  vector_store: "",
  vector_dimension: 0,
};

const EMPTY_REBUILD: RebuildStatus = {
  is_rebuilding: false,
  start_time: 0,
  end_time: 0,
  old_provider: "",
  old_model: "",
  new_provider: "",
  new_model: "",
  total_docs: 0,
  processed_docs: 0,
  failed_docs: 0,
  error: "",
};

export function useKnowledgePage() {
  const [stats, setStats] = useState<KnowledgeStats>(EMPTY_STATS);
  const [config, setConfig] = useState<KnowledgeConfig>(EMPTY_CONFIG);
  const [rebuildStatus, setRebuildStatus] = useState<RebuildStatus>(EMPTY_REBUILD);

  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentDocument, setCurrentDocument] = useState<KnowledgeDocument | null>(null);
  const [supportedTypes, setSupportedTypes] = useState<string[]>([".md", ".markdown", ".txt", ".pdf", ".docx"]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const addDocModal = useDisclosure();
  const viewDrawer = useDisclosure();
  const deleteModal = useDisclosure();
  const batchDeleteModal = useDisclosure();
  const clearModal = useDisclosure();

  const [deleteTarget, setDeleteTarget] = useState<KnowledgeDocument | null>(null);

  const rebuildPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const rebuildProgress = rebuildStatus.total_docs
    ? Math.round((rebuildStatus.processed_docs / rebuildStatus.total_docs) * 100)
    : 0;
  const isOperating = isSubmitting || isUploading || isSyncing || isBatchDeleting || isClearing;

  // --- Fetch functions ---

  const fetchDocuments = useCallback(async () => {
    try {
      setIsFetching(true);
      const res = await knowledgeApi.getDocuments({
        status: statusFilter || undefined,
        page,
        page_size: pageSize,
      });
      if (res.code === 200 && res.data) {
        setDocuments(res.data.documents || []);
        setTotalItems(res.data.total || 0);
      }
    } catch (error) {
      addToast({ title: error instanceof Error ? error.message : "获取文档列表失败", color: "danger", timeout: 3000 });
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [page, pageSize, statusFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await knowledgeApi.getStats();
      if (res.code === 200 && res.data) setStats(res.data);
    } catch { /* silent */ }
  }, []);

  const fetchConfig = useCallback(async () => {
    try {
      const res = await knowledgeApi.getConfig();
      if (res.code === 200 && res.data) setConfig(res.data);
    } catch { /* silent */ }
  }, []);

  const fetchSupportedTypes = useCallback(async () => {
    try {
      const res = await knowledgeApi.getSupportedFileTypes();
      if (res.code === 200 && res.data?.types) setSupportedTypes(res.data.types);
    } catch { /* silent */ }
  }, []);

  const fetchRebuildStatus = useCallback(async () => {
    try {
      const res = await knowledgeApi.getRebuildStatus();
      if (res.code === 200 && res.data) {
        setRebuildStatus(res.data);
        if (res.data.is_rebuilding && !rebuildPollRef.current) {
          rebuildPollRef.current = setInterval(fetchRebuildStatus, 3000);
        }
        if (!res.data.is_rebuilding && rebuildPollRef.current) {
          clearInterval(rebuildPollRef.current);
          rebuildPollRef.current = null;
          fetchStats();
          fetchConfig();
          fetchDocuments();
        }
      }
    } catch { /* silent */ }
  }, [fetchStats, fetchConfig, fetchDocuments]);

  const refreshAll = useCallback(() => {
    fetchDocuments();
    fetchStats();
    fetchConfig();
    fetchRebuildStatus();
  }, [fetchDocuments, fetchStats, fetchConfig, fetchRebuildStatus]);

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);
  useEffect(() => { fetchStats(); fetchConfig(); fetchSupportedTypes(); fetchRebuildStatus(); }, [fetchStats, fetchConfig, fetchSupportedTypes, fetchRebuildStatus]);
  useEffect(() => {
    return () => {
      if (rebuildPollRef.current) clearInterval(rebuildPollRef.current);
    };
  }, []);

  // --- Actions ---

  const handleAddDocument = useCallback(async (data: { title: string; content: string }) => {
    try {
      setIsSubmitting(true);
      const res = await knowledgeApi.indexDocument(data);
      if (res.code !== 200) throw new Error(res.message || "添加失败");
      addToast({ title: "文档添加成功，正在索引...", color: "success", timeout: 2500 });
      addDocModal.onClose();
      refreshAll();
    } catch (error) {
      addToast({ title: error instanceof Error ? error.message : "添加失败", color: "danger", timeout: 3000 });
    } finally {
      setIsSubmitting(false);
    }
  }, [addDocModal, refreshAll]);

  const handleUpload = useCallback(async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      addToast({ title: "文件大小不能超过 10MB", color: "danger", timeout: 3000 });
      return;
    }
    try {
      setIsUploading(true);
      const res = await knowledgeApi.uploadDocument(file);
      if (res.code !== 200) throw new Error(res.message || "上传失败");
      addToast({ title: "文档上传成功，正在索引...", color: "success", timeout: 2500 });
      refreshAll();
    } catch (error) {
      addToast({ title: error instanceof Error ? error.message : "上传失败", color: "danger", timeout: 3000 });
    } finally {
      setIsUploading(false);
    }
  }, [refreshAll]);

  const handleReindexDocument = useCallback(async (doc: KnowledgeDocument) => {
    try {
      const res = await knowledgeApi.reindexDocument(doc.id);
      if (res.code !== 200) throw new Error(res.message || "操作失败");
      addToast({ title: "正在重新索引...", color: "success", timeout: 2500 });
      fetchDocuments();
    } catch (error) {
      addToast({ title: error instanceof Error ? error.message : "操作失败", color: "danger", timeout: 3000 });
    }
  }, [fetchDocuments]);

  const handleDeleteClick = useCallback((doc: KnowledgeDocument) => {
    setDeleteTarget(doc);
    deleteModal.onOpen();
  }, [deleteModal]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      const res = await knowledgeApi.deleteDocument(deleteTarget.id);
      if (res.code !== 200) throw new Error(res.message || "删除失败");
      addToast({ title: "删除成功", color: "success", timeout: 2500 });
      refreshAll();
    } catch (error) {
      addToast({ title: error instanceof Error ? error.message : "删除失败", color: "danger", timeout: 3000 });
    } finally {
      deleteModal.onClose();
      setDeleteTarget(null);
    }
  }, [deleteTarget, deleteModal, refreshAll]);

  const handleBatchDeleteConfirm = useCallback(async () => {
    if (!selectedIds.length) return;
    try {
      setIsBatchDeleting(true);
      const res = await knowledgeApi.batchDeleteDocuments(selectedIds);
      if (res.code !== 200) throw new Error(res.message || "批量删除失败");
      const { documents_deleted, chunks_deleted, failed_ids } = res.data;
      const msg = `删除了 ${documents_deleted} 个文档，${chunks_deleted} 个分块`;
      if (failed_ids?.length) {
        addToast({ title: `${msg}（${failed_ids.length} 个向量删除失败）`, color: "warning", timeout: 5000 });
      } else {
        addToast({ title: msg, color: "success", timeout: 3000 });
      }
      setSelectedIds([]);
      refreshAll();
    } catch (error) {
      addToast({ title: error instanceof Error ? error.message : "批量删除失败", color: "danger", timeout: 3000 });
    } finally {
      setIsBatchDeleting(false);
      batchDeleteModal.onClose();
    }
  }, [selectedIds, batchDeleteModal, refreshAll]);

  const handleClearConfirm = useCallback(async () => {
    try {
      setIsClearing(true);
      const res = await knowledgeApi.clearAll();
      if (res.code !== 200) throw new Error(res.message || "清空失败");
      const { documents_deleted, chunks_deleted, vectors_cleared } = res.data;
      const msg = `删除了 ${documents_deleted} 个文档，${chunks_deleted} 个分块`;
      if (!vectors_cleared) {
        addToast({ title: `${msg}（向量存储可能未完全清空）`, color: "warning", timeout: 5000 });
      } else {
        addToast({ title: msg, color: "success", timeout: 3000 });
      }
      setSelectedIds([]);
      refreshAll();
    } catch (error) {
      addToast({ title: error instanceof Error ? error.message : "清空失败", color: "danger", timeout: 3000 });
    } finally {
      setIsClearing(false);
      clearModal.onClose();
    }
  }, [clearModal, refreshAll]);

  const handleSync = useCallback(async (force: boolean) => {
    try {
      setIsSyncing(true);
      const res = await knowledgeApi.syncArticles(force);
      if (res.code !== 200) throw new Error(res.message || "同步失败");
      const d = res.data;
      addToast({
        title: `同步完成：共 ${d.total_articles} 篇，新增 ${d.new_documents}，更新 ${d.updated_documents}，跳过 ${d.skipped_documents}`,
        color: "success",
        timeout: 5000,
      });
      refreshAll();
    } catch (error) {
      addToast({ title: error instanceof Error ? error.message : "同步失败", color: "danger", timeout: 3000 });
    } finally {
      setIsSyncing(false);
    }
  }, [refreshAll]);

  const handleViewDocument = useCallback((doc: KnowledgeDocument) => {
    setCurrentDocument(doc);
    viewDrawer.onOpen();
  }, [viewDrawer]);

  const handleSelectionChange = useCallback((keys: "all" | Set<React.Key>) => {
    if (keys === "all") {
      setSelectedIds(documents.map(d => d.id));
    } else {
      setSelectedIds(Array.from(keys).map(Number));
    }
  }, [documents]);

  const clearRebuildStatus = useCallback(() => {
    setRebuildStatus(EMPTY_REBUILD);
  }, []);

  return {
    stats,
    config,
    rebuildStatus,
    rebuildProgress,
    documents,
    isLoading,
    isFetching,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalItems,
    totalPages,
    statusFilter,
    setStatusFilter: (v: KnowledgeDocumentStatus | "") => { setStatusFilter(v); setPage(1); },
    selectedIds,
    setSelectedIds,
    handleSelectionChange,
    currentDocument,
    supportedTypes,
    isSubmitting,
    isUploading,
    isSyncing,
    isBatchDeleting,
    isClearing,
    isOperating,
    addDocModal,
    viewDrawer,
    deleteModal,
    batchDeleteModal,
    clearModal,
    deleteTarget,
    handleAddDocument,
    handleUpload,
    handleReindexDocument,
    handleDeleteClick,
    handleDeleteConfirm,
    handleBatchDeleteConfirm,
    handleClearConfirm,
    handleSync,
    handleViewDocument,
    clearRebuildStatus,
    refreshAll,
  };
}

export type KnowledgePageState = ReturnType<typeof useKnowledgePage>;
