/**
 * 友链管理 API 服务
 * 对接 anheyu-pro 后端 /api/links 和相关接口
 */

import { apiClient } from "./client";
import type {
  LinkItem,
  LinkCategory,
  LinkTag,
  LinkListResponse,
  AdminLinksParams,
  CreateLinkRequest,
  UpdateLinkRequest,
  ReviewLinkRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateTagRequest,
  UpdateTagRequest,
  ImportLinksRequest,
  ImportLinksResponse,
  ExportLinksParams,
  ExportLinksResponse,
  LinkHealthCheckResponse,
  BatchUpdateLinkSortRequest,
} from "@/types/friends";

export const friendsApi = {
  // ============================================
  //  友链 CRUD
  // ============================================

  /**
   * 获取管理端友链列表（服务端分页 + 筛选）
   * GET /api/links
   */
  async getLinks(params: AdminLinksParams = {}): Promise<LinkListResponse> {
    const { page = 1, pageSize = 20, name, url, description, status, category_id, tag_id } = params;
    const queryParams = new URLSearchParams();
    queryParams.append("page", String(page));
    queryParams.append("pageSize", String(pageSize));
    if (name) queryParams.append("name", name);
    if (url) queryParams.append("url", url);
    if (description) queryParams.append("description", description);
    if (status) queryParams.append("status", status);
    if (category_id) queryParams.append("category_id", String(category_id));
    if (tag_id) queryParams.append("tag_id", String(tag_id));

    const response = await apiClient.get<LinkListResponse>(
      `/api/links?${queryParams.toString()}`
    );

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "获取友链列表失败");
  },

  /**
   * 创建友链
   * POST /api/links
   */
  async createLink(data: CreateLinkRequest): Promise<LinkItem> {
    const response = await apiClient.post<LinkItem>("/api/links", data);

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "创建友链失败");
  },

  /**
   * 更新友链
   * PUT /api/links/:id
   */
  async updateLink(id: number, data: UpdateLinkRequest): Promise<LinkItem> {
    const response = await apiClient.put<LinkItem>(`/api/links/${id}`, data);

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "更新友链失败");
  },

  /**
   * 删除友链
   * DELETE /api/links/:id
   */
  async deleteLink(id: number): Promise<void> {
    const response = await apiClient.delete(`/api/links/${id}`);
    if (response.code !== 200) {
      throw new Error(response.message || "删除友链失败");
    }
  },

  /**
   * 审核友链
   * PUT /api/links/:id/review
   */
  async reviewLink(id: number, data: ReviewLinkRequest): Promise<void> {
    const response = await apiClient.put(`/api/links/${id}/review`, data);
    if (response.code !== 200) {
      throw new Error(response.message || "审核友链失败");
    }
  },

  // ============================================
  //  分类管理
  // ============================================

  /**
   * 获取所有友链分类
   * GET /api/links/categories
   */
  async getCategories(): Promise<LinkCategory[]> {
    const response = await apiClient.get<LinkCategory[]>("/api/links/categories");

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "获取分类列表失败");
  },

  /**
   * 创建友链分类
   * POST /api/links/categories
   */
  async createCategory(data: CreateCategoryRequest): Promise<LinkCategory> {
    const response = await apiClient.post<LinkCategory>("/api/links/categories", data);

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "创建分类失败");
  },

  /**
   * 更新友链分类
   * PUT /api/links/categories/:id
   */
  async updateCategory(id: number, data: UpdateCategoryRequest): Promise<LinkCategory> {
    const response = await apiClient.put<LinkCategory>(`/api/links/categories/${id}`, data);

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "更新分类失败");
  },

  /**
   * 删除友链分类
   * DELETE /api/links/categories/:id
   */
  async deleteCategory(id: number): Promise<void> {
    const response = await apiClient.delete(`/api/links/categories/${id}`);
    if (response.code !== 200) {
      throw new Error(response.message || "删除分类失败");
    }
  },

  // ============================================
  //  标签管理
  // ============================================

  /**
   * 获取所有友链标签
   * GET /api/links/tags
   */
  async getTags(): Promise<LinkTag[]> {
    const response = await apiClient.get<LinkTag[]>("/api/links/tags");

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "获取标签列表失败");
  },

  /**
   * 创建友链标签
   * POST /api/links/tags
   */
  async createTag(data: CreateTagRequest): Promise<LinkTag> {
    const response = await apiClient.post<LinkTag>("/api/links/tags", data);

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "创建标签失败");
  },

  /**
   * 更新友链标签
   * PUT /api/links/tags/:id
   */
  async updateTag(id: number, data: UpdateTagRequest): Promise<LinkTag> {
    const response = await apiClient.put<LinkTag>(`/api/links/tags/${id}`, data);

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "更新标签失败");
  },

  /**
   * 删除友链标签
   * DELETE /api/links/tags/:id
   */
  async deleteTag(id: number): Promise<void> {
    const response = await apiClient.delete(`/api/links/tags/${id}`);
    if (response.code !== 200) {
      throw new Error(response.message || "删除标签失败");
    }
  },

  // ============================================
  //  批量导入 & 导出
  // ============================================

  /**
   * 批量导入友链
   * POST /api/links/import
   */
  async importLinks(data: ImportLinksRequest): Promise<ImportLinksResponse> {
    const response = await apiClient.post<ImportLinksResponse>("/api/links/import", data);

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "导入友链失败");
  },

  /**
   * 导出友链
   * GET /api/links/export
   */
  async exportLinks(params?: ExportLinksParams): Promise<ExportLinksResponse> {
    const queryParams = new URLSearchParams();
    if (params?.name) queryParams.append("name", params.name);
    if (params?.url) queryParams.append("url", params.url);
    if (params?.description) queryParams.append("description", params.description);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.category_id) queryParams.append("category_id", String(params.category_id));
    if (params?.tag_id) queryParams.append("tag_id", String(params.tag_id));

    const qs = queryParams.toString();
    const endpoint = qs ? `/api/links/export?${qs}` : "/api/links/export";
    const response = await apiClient.get<ExportLinksResponse>(endpoint);

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "导出友链失败");
  },

  // ============================================
  //  健康检查
  // ============================================

  /**
   * 手动触发友链健康检查
   * POST /api/links/health-check
   */
  async triggerHealthCheck(): Promise<LinkHealthCheckResponse> {
    const response = await apiClient.post<LinkHealthCheckResponse>("/api/links/health-check");

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "触发健康检查失败");
  },

  /**
   * 获取友链健康检查状态
   * GET /api/links/health-check/status
   */
  async getHealthCheckStatus(): Promise<LinkHealthCheckResponse> {
    const response = await apiClient.get<LinkHealthCheckResponse>("/api/links/health-check/status");

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "获取健康检查状态失败");
  },

  // ============================================
  //  排序
  // ============================================

  /**
   * 批量更新友链排序
   * PUT /api/links/sort
   */
  async batchUpdateSort(data: BatchUpdateLinkSortRequest): Promise<void> {
    const response = await apiClient.put("/api/links/sort", data);
    if (response.code !== 200) {
      throw new Error(response.message || "更新排序失败");
    }
  },
};
