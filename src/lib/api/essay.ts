import { apiClient, axiosInstance } from "./client";

/**
 * APlayer 配置
 */
export interface APlayerConfig {
  id: string;
}

/**
 * 即刻（短文）类型定义
 */
export interface Essay {
  id: number;
  content: string;
  address?: string;
  from?: string;
  link?: string;
  image?: string[];
  aplayer?: APlayerConfig;
  status: number; // 1=发布, 2=草稿, 3=隐藏
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/**
 * 即刻列表响应
 */
export interface EssayListResponse {
  list: Essay[];
  total: number;
  page: number;
  page_size: number;
}

/**
 * 即刻列表查询参数（公开）
 */
export interface EssayListParams {
  page?: number;
  page_size?: number;
}

/**
 * 管理端即刻列表查询参数
 */
export interface AdminEssayListParams {
  page: number;
  page_size: number;
  status?: number;
}

/**
 * 创建即刻数据
 */
export interface CreateEssayData {
  content: string;
  address?: string;
  from?: string;
  link?: string;
  image?: string[];
  aplayer?: APlayerConfig;
  status?: number;
  sort_order?: number;
  custom_published_at?: string;
}

/**
 * 更新即刻数据
 */
export interface UpdateEssayData {
  content?: string;
  address?: string;
  from?: string;
  link?: string;
  image?: string[];
  aplayer?: APlayerConfig;
  status?: number;
  sort_order?: number;
  custom_published_at?: string;
}

/**
 * 导入选项
 */
export interface ImportEssayOptions {
  skip_existing: boolean;
  default_status: number;
}

/**
 * 导入结果
 */
export interface ImportEssayResult {
  total_count: number;
  success_count: number;
  skipped_count: number;
  failed_count: number;
  errors: string[];
  created_ids: number[];
}

/**
 * 即刻 API 服务
 */
export const essayApi = {
  // ===================================
  //          公开接口
  // ===================================

  /**
   * 获取公开的即刻列表
   * GET /api/pro/essays
   */
  async getPublicList(params: EssayListParams = {}): Promise<EssayListResponse> {
    const { page = 1, page_size = 10 } = params;
    const response = await apiClient.get<EssayListResponse>(`/api/pro/essays?page=${page}&page_size=${page_size}`);

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "获取即刻列表失败");
  },

  // ===================================
  //          管理端接口
  // ===================================

  /**
   * 管理端获取即刻列表
   * GET /api/pro/admin/essays
   */
  async getAdminList(params: AdminEssayListParams): Promise<EssayListResponse> {
    const searchParams = new URLSearchParams();
    searchParams.set("page", String(params.page));
    searchParams.set("page_size", String(params.page_size));
    if (params.status !== undefined) {
      searchParams.set("status", String(params.status));
    }

    const response = await apiClient.get<EssayListResponse>(`/api/pro/admin/essays?${searchParams.toString()}`);

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "获取即刻列表失败");
  },

  /**
   * 获取单条即刻详情
   * GET /api/pro/admin/essays/:id
   */
  async getDetail(id: number): Promise<Essay> {
    const response = await apiClient.get<Essay>(`/api/pro/admin/essays/${id}`);

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "获取即刻详情失败");
  },

  /**
   * 创建即刻
   * POST /api/pro/admin/essays
   */
  async create(data: CreateEssayData): Promise<Essay> {
    const response = await apiClient.post<Essay>("/api/pro/admin/essays", data);

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "创建即刻失败");
  },

  /**
   * 更新即刻
   * PUT /api/pro/admin/essays/:id
   */
  async update(id: number, data: UpdateEssayData): Promise<Essay> {
    const response = await apiClient.put<Essay>(`/api/pro/admin/essays/${id}`, data);

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "更新即刻失败");
  },

  /**
   * 删除即刻
   * DELETE /api/pro/admin/essays/:id
   */
  async remove(id: number): Promise<void> {
    const response = await apiClient.delete(`/api/pro/admin/essays/${id}`);

    if (response.code !== 200) {
      throw new Error(response.message || "删除即刻失败");
    }
  },

  /**
   * 批量删除即刻
   * POST /api/pro/admin/essays/batch-delete
   */
  async batchDelete(ids: number[]): Promise<void> {
    const response = await apiClient.post("/api/pro/admin/essays/batch-delete", { ids });

    if (response.code !== 200) {
      throw new Error(response.message || "批量删除即刻失败");
    }
  },

  /**
   * 导出即刻
   * POST /api/pro/admin/essays/export
   */
  async exportEssays(essayIds: number[]): Promise<Blob> {
    const response = await axiosInstance.post(
      "/api/pro/admin/essays/export",
      { essay_ids: essayIds },
      { responseType: "blob" }
    );
    return response.data;
  },

  /**
   * 导入即刻
   * POST /api/pro/admin/essays/import
   */
  async importEssays(file: File, options: ImportEssayOptions): Promise<ImportEssayResult> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("skip_existing", String(options.skip_existing));
    formData.append("default_status", String(options.default_status));

    const response = await apiClient.post<ImportEssayResult>("/api/pro/admin/essays/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "导入即刻失败");
  },
};
