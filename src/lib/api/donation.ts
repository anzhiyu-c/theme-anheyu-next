/**
 * 打赏管理 API（管理端）
 */

import { apiClient, axiosInstance } from "./client";
import type { ApiResponse } from "@/types";
import type {
  DonationItem,
  CreateDonationRequest,
  UpdateDonationRequest,
  ListDonationsRequest,
  ListDonationsResponse,
  TotalAmountResponse,
  ImportDonationOptions,
  ImportDonationResult,
} from "@/types/donation";

export const donationApi = {
  /**
   * 获取打赏列表（管理端）
   */
  async getDonations(params: ListDonationsRequest = {}): Promise<ApiResponse<ListDonationsResponse>> {
    return apiClient.get<ListDonationsResponse>("/api/pro/admin/donations", { params });
  },

  /**
   * 获取打赏详情
   */
  async getDonation(id: number): Promise<ApiResponse<DonationItem>> {
    return apiClient.get<DonationItem>(`/api/pro/admin/donations/${id}`);
  },

  /**
   * 新增打赏
   */
  async createDonation(data: CreateDonationRequest): Promise<ApiResponse<DonationItem>> {
    return apiClient.post<DonationItem>("/api/pro/admin/donations", data);
  },

  /**
   * 编辑打赏
   */
  async updateDonation(id: number, data: UpdateDonationRequest): Promise<ApiResponse<DonationItem>> {
    return apiClient.put<DonationItem>(`/api/pro/admin/donations/${id}`, data);
  },

  /**
   * 删除打赏
   */
  async deleteDonation(id: number): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/api/pro/admin/donations/${id}`);
  },

  /**
   * 导出打赏记录（返回文件 Blob）
   */
  async exportDonations(ids?: number[]): Promise<Blob> {
    const params = ids && ids.length > 0 ? { ids: ids.join(",") } : undefined;
    const response = await axiosInstance.get("/api/pro/admin/donations/export", {
      params,
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * 导入打赏记录
   */
  async importDonations(file: File, options: ImportDonationOptions): Promise<ApiResponse<ImportDonationResult>> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("skip_existing", String(options.skip_existing));
    formData.append("default_status", String(options.default_status));
    return apiClient.post<ImportDonationResult>("/api/pro/admin/donations/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  /**
   * 获取前台打赏总额
   */
  async getTotalAmount(): Promise<ApiResponse<TotalAmountResponse>> {
    return apiClient.get<TotalAmountResponse>("/api/pro/donations/total");
  },
};
