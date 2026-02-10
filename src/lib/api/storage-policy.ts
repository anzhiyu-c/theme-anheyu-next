/**
 * 存储策略 API
 * 对接 anheyu-app 后端 /api/policies 端点
 */

import { apiClient } from "./client";
import type {
  StoragePolicy,
  StoragePolicyListParams,
  StoragePolicyListResponse,
  StoragePolicyCreateRequest,
  StoragePolicyUpdateRequest,
} from "@/types/storage-policy";

export const storagePolicyApi = {
  /** 获取存储策略列表（分页） */
  list: async (params: StoragePolicyListParams = {}): Promise<StoragePolicyListResponse> => {
    const res = await apiClient.get<StoragePolicyListResponse>("/api/policies", { params });
    return res.data;
  },

  /** 获取单个存储策略 */
  getById: async (id: string): Promise<StoragePolicy> => {
    const res = await apiClient.get<StoragePolicy>(`/api/policies/${id}`);
    return res.data;
  },

  /** 创建存储策略 */
  create: async (data: Partial<StoragePolicyCreateRequest>): Promise<StoragePolicy> => {
    const res = await apiClient.post<StoragePolicy>("/api/policies", data);
    return res.data;
  },

  /** 更新存储策略 */
  update: async (id: string, data: StoragePolicyUpdateRequest): Promise<StoragePolicy> => {
    const res = await apiClient.put<StoragePolicy>(`/api/policies/${id}`, data);
    return res.data;
  },

  /** 删除存储策略 */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete<null>(`/api/policies/${id}`);
  },
};
