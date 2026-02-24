/**
 * 售后工单 API（管理端）
 */

import { apiClient } from "./client";
import type { ApiResponse } from "@/types";
import type {
  TicketDetail,
  TicketMessage,
  ListTicketsRequest,
  ListTicketsResponse,
  ReplyTicketRequest,
  TicketStatsResponse,
} from "@/types/support";

export const supportApi = {
  /**
   * 获取工单列表（管理端）
   */
  async getAdminTickets(params: ListTicketsRequest = {}): Promise<ApiResponse<ListTicketsResponse>> {
    return apiClient.get<ListTicketsResponse>("/api/pro/admin/support/tickets", { params });
  },

  /**
   * 获取工单详情（管理端）
   */
  async getAdminTicket(id: string): Promise<ApiResponse<TicketDetail>> {
    return apiClient.get<TicketDetail>(`/api/pro/admin/support/tickets/${id}`);
  },

  /**
   * 管理员回复工单
   */
  async replyTicket(id: string, data: ReplyTicketRequest): Promise<ApiResponse<TicketMessage>> {
    return apiClient.post<TicketMessage>(`/api/pro/admin/support/tickets/${id}/reply`, data);
  },

  /**
   * 关闭工单
   */
  async closeTicket(id: string): Promise<ApiResponse<null>> {
    return apiClient.post<null>(`/api/pro/admin/support/tickets/${id}/close`);
  },

  /**
   * 更新工单状态
   */
  async updateTicketStatus(id: string, status: string): Promise<ApiResponse<null>> {
    return apiClient.put<null>(`/api/pro/admin/support/tickets/${id}/status`, { status });
  },

  /**
   * 删除工单
   */
  async deleteTicket(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/api/pro/admin/support/tickets/${id}`);
  },

  /**
   * 获取工单统计
   */
  async getTicketStats(): Promise<ApiResponse<TicketStatsResponse>> {
    return apiClient.get<TicketStatsResponse>("/api/pro/admin/support/tickets/stats");
  },
};
