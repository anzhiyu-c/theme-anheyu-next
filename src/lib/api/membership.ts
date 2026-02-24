/**
 * 会员管理 API（管理端）
 */

import { apiClient } from "./client";
import type { ApiResponse } from "@/types";
import type {
  MembershipPlan,
  CreatePlanRequest,
  UpdatePlanRequest,
  ListMembersRequest,
  ListMembersResponse,
} from "@/types/membership";

export const membershipApi = {
  /**
   * 获取套餐列表
   */
  async getPlans(): Promise<ApiResponse<{ list: MembershipPlan[] }>> {
    return apiClient.get<{ list: MembershipPlan[] }>("/api/pro/admin/membership/plans");
  },

  /**
   * 获取套餐详情
   */
  async getPlan(id: string): Promise<ApiResponse<MembershipPlan>> {
    return apiClient.get<MembershipPlan>(`/api/pro/admin/membership/plans/${id}`);
  },

  /**
   * 创建套餐
   */
  async createPlan(data: CreatePlanRequest): Promise<ApiResponse<MembershipPlan>> {
    return apiClient.post<MembershipPlan>("/api/pro/admin/membership/plans", data);
  },

  /**
   * 更新套餐
   */
  async updatePlan(id: string, data: UpdatePlanRequest): Promise<ApiResponse<MembershipPlan>> {
    return apiClient.put<MembershipPlan>(`/api/pro/admin/membership/plans/${id}`, data);
  },

  /**
   * 删除套餐
   */
  async deletePlan(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/api/pro/admin/membership/plans/${id}`);
  },

  /**
   * 获取会员用户列表
   */
  async getMembers(params: ListMembersRequest = {}): Promise<ApiResponse<ListMembersResponse>> {
    return apiClient.get<ListMembersResponse>("/api/pro/admin/membership/members", { params });
  },
};
