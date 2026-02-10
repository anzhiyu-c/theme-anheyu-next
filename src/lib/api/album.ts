/**
 * 相册管理 API 服务
 * 对接后端 /api/albums 接口
 */

import { apiClient } from "./client";
import type { AlbumForm, AlbumListResponse, AlbumListParams } from "@/types/album";

export const albumApi = {
  /**
   * 获取相册图片列表（管理员，分页）
   * GET /api/albums/get
   */
  async getList(params: AlbumListParams = {}): Promise<AlbumListResponse> {
    const { page = 1, pageSize = 10, categoryId, tag, sort } = params;
    const queryParams = new URLSearchParams();
    queryParams.append("page", String(page));
    queryParams.append("pageSize", String(pageSize));
    if (categoryId) {
      queryParams.append("categoryId", String(categoryId));
    }
    if (tag) {
      queryParams.append("tag", tag);
    }
    if (sort) {
      queryParams.append("sort", sort);
    }

    const response = await apiClient.get<AlbumListResponse>(`/api/albums/get?${queryParams.toString()}`);

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || "获取相册列表失败");
  },

  /**
   * 新增相册图片
   * POST /api/albums/add
   */
  async create(data: AlbumForm): Promise<void> {
    const response = await apiClient.post("/api/albums/add", data);

    if (response.code !== 200) {
      throw new Error(response.message || "添加图片失败");
    }
  },

  /**
   * 更新相册图片
   * PUT /api/albums/update/:id
   */
  async update(id: number, data: AlbumForm): Promise<void> {
    const response = await apiClient.put(`/api/albums/update/${id}`, data);

    if (response.code !== 200) {
      throw new Error(response.message || "更新图片失败");
    }
  },

  /**
   * 删除相册图片
   * DELETE /api/albums/delete/:id
   */
  async delete(id: number): Promise<void> {
    const response = await apiClient.delete(`/api/albums/delete/${id}`);
    if (response.code !== 200) {
      throw new Error(response.message || "删除图片失败");
    }
  },

  /**
   * 批量删除相册图片
   * DELETE /api/albums/batch-delete
   */
  async batchDelete(ids: number[]): Promise<number> {
    const response = await apiClient.delete<{ deleted: number }>("/api/albums/batch-delete", {
      data: { ids },
    });
    if (response.code === 200 && response.data) {
      return response.data.deleted;
    }
    throw new Error(response.message || "批量删除失败");
  },
};
