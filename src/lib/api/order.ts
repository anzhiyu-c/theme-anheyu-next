/**
 * 订单管理 API（管理端）
 */

import { apiClient } from "./client";
import type { ApiResponse } from "@/types";
import type { OrderListParams, OrderListResponse } from "@/types/order";

export const orderApi = {
  /**
   * 获取订单列表（管理端）
   */
  async getAdminOrders(params: OrderListParams = {}): Promise<ApiResponse<OrderListResponse>> {
    return apiClient.get<OrderListResponse>("/api/pro/admin/orders", { params });
  },

  /**
   * 获取订单列表（POST 方式）
   */
  async getAdminOrdersByPost(params: OrderListParams = {}): Promise<ApiResponse<OrderListResponse>> {
    return apiClient.post<OrderListResponse>("/api/pro/admin/orders/list", params);
  },

  /**
   * 删除订单（软删除）
   */
  async deleteOrder(orderId: number): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/api/pro/admin/orders/${orderId}`);
  },
};
