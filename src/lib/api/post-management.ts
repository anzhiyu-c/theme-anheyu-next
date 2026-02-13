/**
 * 管理端文章 API 服务
 * 对接 anheyu-pro 后端 /api/articles 和 /api/pro/* 接口
 */

import { apiClient, axiosInstance } from "./client";
import type {
  AdminArticle,
  AdminArticleListParams,
  AdminArticleListResponse,
  ReviewArticleRequest,
  RejectArticleRequest,
  TakedownArticleRequest,
  BatchDeleteRequest,
  ExportArticlesRequest,
  ImportArticlesParams,
  ImportArticlesResult,
  CreateArticleRequest,
  UpdateArticleRequest,
  ArticleDetailForEdit,
  ArticleHistoryListResponse,
  ArticleHistoryDetail,
} from "@/types/post-management";

export const postManagementApi = {
  // ============================================
  //  文章列表 & 详情
  // ============================================

  /**
   * 获取管理端文章列表（服务端分页 + 筛选 + 搜索）
   * GET /api/articles
   */
  async getArticles(params: AdminArticleListParams = {}): Promise<AdminArticleListResponse> {
    const { page = 1, pageSize = 10, query, status, author_id, category } = params;
    const queryParams = new URLSearchParams();
    queryParams.append("page", String(page));
    queryParams.append("pageSize", String(pageSize));
    if (query) queryParams.append("query", query);
    if (status) queryParams.append("status", status);
    if (author_id) queryParams.append("author_id", author_id);
    if (category) queryParams.append("category", category);

    const response = await apiClient.get<AdminArticleListResponse>(`/api/articles?${queryParams.toString()}`);

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "获取文章列表失败");
  },

  /**
   * 获取单篇文章详情（管理端）
   * GET /api/pro/articles/:id
   */
  async getArticle(id: string): Promise<AdminArticle> {
    const response = await apiClient.get<AdminArticle>(`/api/pro/articles/${id}`);

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "获取文章详情失败");
  },

  /**
   * 获取文章详情（编辑用，包含 content_md 和 content_html）
   * GET /api/pro/articles/:id
   */
  async getArticleForEdit(id: string): Promise<ArticleDetailForEdit> {
    const response = await apiClient.get<ArticleDetailForEdit>(`/api/pro/articles/${id}`);

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "获取文章详情失败");
  },

  // ============================================
  //  删除
  // ============================================

  /**
   * 删除单篇文章
   * DELETE /api/pro/articles/:id
   */
  async deleteArticle(id: string): Promise<void> {
    const response = await apiClient.delete(`/api/pro/articles/${id}`);
    if (response.code !== 200) {
      throw new Error(response.message || "删除文章失败");
    }
  },

  /**
   * 批量删除文章
   * DELETE /api/pro/articles/batch
   */
  async batchDeleteArticles(articleIds: string[]): Promise<void> {
    const response = await apiClient.delete<unknown>("/api/pro/articles/batch", {
      data: { article_ids: articleIds } as BatchDeleteRequest,
    });
    if (response.code !== 200) {
      throw new Error(response.message || "批量删除文章失败");
    }
  },

  // ============================================
  //  审核
  // ============================================

  /**
   * 审核通过
   * POST /api/pro/admin/articles/review/:id/approve
   */
  async approveArticle(id: string, data?: ReviewArticleRequest): Promise<void> {
    const response = await apiClient.post(`/api/pro/admin/articles/review/${id}/approve`, data);
    if (response.code !== 200) {
      throw new Error(response.message || "审核通过失败");
    }
  },

  /**
   * 审核拒绝
   * POST /api/pro/admin/articles/review/:id/reject
   */
  async rejectArticle(id: string, data: RejectArticleRequest): Promise<void> {
    const response = await apiClient.post(`/api/pro/admin/articles/review/${id}/reject`, data);
    if (response.code !== 200) {
      throw new Error(response.message || "审核拒绝失败");
    }
  },

  // ============================================
  //  下架 & 恢复
  // ============================================

  /**
   * 下架文章
   * POST /api/pro/admin/articles/takedown/:id
   */
  async takedownArticle(id: string, data: TakedownArticleRequest): Promise<void> {
    const response = await apiClient.post(`/api/pro/admin/articles/takedown/${id}`, data);
    if (response.code !== 200) {
      throw new Error(response.message || "下架文章失败");
    }
  },

  /**
   * 恢复下架文章
   * POST /api/pro/admin/articles/takedown/:id/restore
   */
  async restoreArticle(id: string): Promise<void> {
    const response = await apiClient.post(`/api/pro/admin/articles/takedown/${id}/restore`);
    if (response.code !== 200) {
      throw new Error(response.message || "恢复文章失败");
    }
  },

  // ============================================
  //  创建 & 更新
  // ============================================

  /**
   * 创建文章
   * POST /api/pro/articles
   */
  async createArticle(data: CreateArticleRequest): Promise<AdminArticle> {
    const response = await apiClient.post<AdminArticle>("/api/pro/articles", data);

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "创建文章失败");
  },

  /**
   * 更新文章
   * PUT /api/pro/articles/:id
   */
  async updateArticle(id: string, data: UpdateArticleRequest): Promise<AdminArticle> {
    const response = await apiClient.put<AdminArticle>(`/api/pro/articles/${id}`, data);

    // 后端 UpdateArticle 使用 SuccessWithMessage 返回 { code: 200, data: null }
    // 因此只需检查 code，不要求 data 非空
    if (response.code === 200) {
      return response.data;
    }

    throw new Error(response.message || "更新文章失败");
  },

  // ============================================
  //  图片上传
  // ============================================

  /**
   * 上传文章图片
   * POST /api/pro/articles/upload
   */
  async uploadArticleImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    // 必须显式设置 Content-Type 覆盖 Axios 实例默认的 application/json
    // Axios 1.x 会自动为 multipart/form-data 追加 boundary 参数
    const response = await apiClient.post<{ url: string; file_id: string }>("/api/pro/articles/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.code === 200 && response.data) {
      const { url } = response.data;

      if (url) {
        // 后端返回的 url 可能是绝对 URL（如 https://blog.anheyu.com/api/f/8dRW/xxx.webp）
        // 提取路径部分（如 /api/f/8dRW/xxx.webp），通过 Next.js rewrites 代理到本地后端
        // 不使用 /api/pro/images/{file_id}，因为该 endpoint 会 302 重定向到绝对 URL，
        // 开发环境下会指向生产域名导致加载错误图片
        try {
          const urlObj = new URL(url);
          return urlObj.pathname;
        } catch {
          // url 已经是相对路径
          return url;
        }
      }
    }

    throw new Error(response.message || "上传图片失败");
  },

  // ============================================
  //  导入 & 导出
  // ============================================

  /**
   * 导出文章（返回 ZIP Blob）
   * POST /api/pro/articles/export
   */
  async exportArticles(articleIds: string[]): Promise<Blob> {
    const response = await axiosInstance.post(
      "/api/pro/articles/export",
      { article_ids: articleIds } as ExportArticlesRequest,
      { responseType: "blob" }
    );
    return response.data;
  },

  /**
   * 导入文章
   * POST /api/pro/articles/import
   */
  async importArticles(params: ImportArticlesParams): Promise<ImportArticlesResult> {
    const formData = new FormData();
    formData.append("file", params.file);
    if (params.create_categories !== undefined) {
      formData.append("create_categories", String(params.create_categories));
    }
    if (params.create_tags !== undefined) {
      formData.append("create_tags", String(params.create_tags));
    }
    if (params.skip_existing !== undefined) {
      formData.append("skip_existing", String(params.skip_existing));
    }
    if (params.default_status) {
      formData.append("default_status", params.default_status);
    }
    if (params.import_paid_content !== undefined) {
      formData.append("import_paid_content", String(params.import_paid_content));
    }
    if (params.import_password_content !== undefined) {
      formData.append("import_password_content", String(params.import_password_content));
    }
    if (params.import_full_text_hidden !== undefined) {
      formData.append("import_full_text_hidden", String(params.import_full_text_hidden));
    }

    const response = await apiClient.post<ImportArticlesResult>("/api/pro/articles/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "导入文章失败");
  },

  // ============================================
  //  历史版本
  // ============================================

  /**
   * 获取文章历史版本列表
   * GET /api/articles/:id/history
   */
  async getArticleHistory(
    articleId: string,
    params: { page?: number; pageSize?: number } = {}
  ): Promise<ArticleHistoryListResponse> {
    const { page = 1, pageSize = 50 } = params;
    const response = await apiClient.get<ArticleHistoryListResponse>(
      `/api/articles/${articleId}/history?page=${page}&pageSize=${pageSize}`
    );

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "获取历史版本失败");
  },

  /**
   * 获取历史版本详情
   * GET /api/articles/:id/history/:version
   */
  async getArticleHistoryVersion(articleId: string, version: number): Promise<ArticleHistoryDetail> {
    const response = await apiClient.get<ArticleHistoryDetail>(`/api/articles/${articleId}/history/${version}`);

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "获取历史版本详情失败");
  },

  /**
   * 恢复到指定版本（返回版本数据，需再调用更新接口完成恢复）
   * POST /api/articles/:id/history/:version/restore
   */
  async restoreArticleHistory(articleId: string, version: number): Promise<ArticleHistoryDetail> {
    const response = await apiClient.post<ArticleHistoryDetail>(
      `/api/articles/${articleId}/history/${version}/restore`
    );

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "恢复历史版本失败");
  },

  /**
   * 获取历史版本数量
   * GET /api/articles/:id/history/count
   */
  async getArticleHistoryCount(articleId: string): Promise<number> {
    const response = await apiClient.get<{ count: number }>(`/api/articles/${articleId}/history/count`);

    if (response.code === 200 && response.data) {
      return response.data.count;
    }

    throw new Error(response.message || "获取历史版本数量失败");
  },
};
