import { apiClient } from "./client";

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
 * 即刻列表查询参数
 */
export interface EssayListParams {
  page?: number;
  page_size?: number;
}

/**
 * 即刻 API 服务
 */
export const essayApi = {
  /**
   * 获取公开的即刻列表
   * API 路径: /api/pro/essays (通过 Next.js rewrites 代理到后端)
   */
  async getPublicList(params: EssayListParams = {}): Promise<EssayListResponse> {
    const { page = 1, page_size = 10 } = params;
    const response = await apiClient.get<EssayListResponse>(`/api/pro/essays?page=${page}&page_size=${page_size}`);

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "获取即刻列表失败");
  },
};
