/**
 * 评论相关 API
 */

import { apiClient } from "./client";

// 评论类型
export interface Comment {
  id: string;
  nickname: string;
  email_md5: string;
  content: string;
  content_html: string;
  target_title: string;
  target_path: string;
  created_at: string;
}

// 评论列表响应
export interface CommentListResponse {
  list: Comment[];
  total: number;
}

// 获取最新评论参数
export interface GetLatestCommentsParams {
  page?: number;
  pageSize?: number;
}

/**
 * 评论 API
 */
export const commentApi = {
  /**
   * 获取全站最新评论列表
   */
  async getLatestComments(params: GetLatestCommentsParams = {}): Promise<CommentListResponse> {
    const { page = 1, pageSize = 6 } = params;
    const response = await apiClient.get<CommentListResponse>(`/api/public/comments/latest`, {
      params: { page, pageSize },
    });
    if (response.code === 200 && response.data) {
      return response.data;
    }
    throw new Error(response.message || "获取最新评论失败");
  },
};
