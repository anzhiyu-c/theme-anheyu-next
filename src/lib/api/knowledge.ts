import { apiClient } from "./client";
import type { ApiResponse } from "@/types";
import type {
  KnowledgeDocument,
  KnowledgeStats,
  KnowledgeConfig,
  RebuildStatus,
  ListKnowledgeDocumentsRequest,
  ListKnowledgeDocumentsResponse,
  IndexDocumentRequest,
  BatchDeleteResult,
  ClearResult,
  SyncArticlesResult,
} from "@/types/knowledge";

const BASE = "/api/pro/admin/knowledge";

export const knowledgeApi = {
  async getStats(): Promise<ApiResponse<KnowledgeStats>> {
    return apiClient.get<KnowledgeStats>(`${BASE}/stats`);
  },

  async getConfig(): Promise<ApiResponse<KnowledgeConfig>> {
    return apiClient.get<KnowledgeConfig>(`${BASE}/config`);
  },

  async getRebuildStatus(): Promise<ApiResponse<RebuildStatus>> {
    return apiClient.get<RebuildStatus>(`${BASE}/rebuild-status`);
  },

  async getDocuments(params: ListKnowledgeDocumentsRequest = {}): Promise<ApiResponse<ListKnowledgeDocumentsResponse>> {
    return apiClient.get<ListKnowledgeDocumentsResponse>(`${BASE}/documents`, { params });
  },

  async getDocument(id: number): Promise<ApiResponse<KnowledgeDocument>> {
    return apiClient.get<KnowledgeDocument>(`${BASE}/documents/${id}`);
  },

  async indexDocument(data: IndexDocumentRequest): Promise<ApiResponse<KnowledgeDocument>> {
    return apiClient.post<KnowledgeDocument>(`${BASE}/documents`, data);
  },

  async deleteDocument(id: number): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`${BASE}/documents/${id}`);
  },

  async batchDeleteDocuments(ids: number[]): Promise<ApiResponse<BatchDeleteResult>> {
    return apiClient.delete<BatchDeleteResult>(`${BASE}/documents/batch`, { data: { ids } });
  },

  async clearAll(): Promise<ApiResponse<ClearResult>> {
    return apiClient.delete<ClearResult>(`${BASE}/clear`);
  },

  async reindexDocument(id: number): Promise<ApiResponse<KnowledgeDocument>> {
    return apiClient.post<KnowledgeDocument>(`${BASE}/documents/${id}/reindex`);
  },

  async uploadDocument(file: File): Promise<ApiResponse<KnowledgeDocument>> {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post<KnowledgeDocument>(`${BASE}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  async getSupportedFileTypes(): Promise<ApiResponse<{ types: string[] }>> {
    return apiClient.get<{ types: string[] }>(`${BASE}/supported-types`);
  },

  async syncArticles(force = false): Promise<ApiResponse<SyncArticlesResult>> {
    return apiClient.post<SyncArticlesResult>(`${BASE}/sync-articles`, { force });
  },
};
