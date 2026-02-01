/**
 * 文章相关 API 服务
 */

import { apiClient } from "./client";
import type {
  FeedItem,
  FeedListResponse,
  GetFeedListParams,
  PostCategory,
  CategoryListResponse,
  PostTag,
  Archive,
} from "@/types/article";

// ===================================
//          文章内容流 API
// ===================================

export const articleApi = {
  /**
   * 获取混合内容流（文章列表）
   * @param params 查询参数
   */
  async getFeedList(params: GetFeedListParams = {}): Promise<FeedListResponse> {
    const { page = 1, pageSize = 10, category, tag, year, month } = params;
    const queryParams = new URLSearchParams();
    queryParams.append("page", String(page));
    queryParams.append("pageSize", String(pageSize));
    if (category) queryParams.append("category", category);
    if (tag) queryParams.append("tag", tag);
    if (year) queryParams.append("year", String(year));
    if (month) queryParams.append("month", String(month));

    const response = await apiClient.get<FeedListResponse>(`/api/pro/public/feed?${queryParams.toString()}`);

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "获取文章列表失败");
  },

  /**
   * 获取分类列表
   */
  async getCategoryList(): Promise<PostCategory[]> {
    const response = await apiClient.get<PostCategory[]>(`/api/post-categories`);

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "获取分类列表失败");
  },

  /**
   * 获取标签列表
   */
  async getTagList(): Promise<PostTag[]> {
    const response = await apiClient.get<PostTag[]>(`/api/post-tags`);

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "获取标签列表失败");
  },

  /**
   * 获取归档列表
   */
  async getArchiveList(): Promise<Archive[]> {
    // 后端返回 { list: Archive[] } 格式
    const response = await apiClient.get<{ list: Archive[] }>(`/api/public/articles/archives`);

    if (response.code === 200 && response.data) {
      return response.data.list || [];
    }

    throw new Error(response.message || "获取归档列表失败");
  },
};

export type { FeedItem, FeedListResponse, PostCategory, PostTag, Archive, GetFeedListParams };
