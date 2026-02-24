/**
 * 商品管理 API（管理端 + 前台部分）
 */

import { apiClient } from "./client";
import type { ApiResponse } from "@/types";
import type {
  Product,
  ListProductsRequest,
  ListProductsResponse,
  CreateProductRequest,
  UpdateProductRequest,
  ListStockRequest,
  ListStockResponse,
  ImportStockRequest,
  ImportStockResponse,
} from "@/types/product";

export const productApi = {
  /**
   * 获取商品列表（管理端）
   */
  async getAdminProducts(params: ListProductsRequest = {}): Promise<ApiResponse<ListProductsResponse>> {
    return apiClient.get<ListProductsResponse>("/api/pro/admin/products", { params });
  },

  /**
   * 获取商品详情（管理端）
   */
  async getAdminProduct(id: string): Promise<ApiResponse<Product>> {
    return apiClient.get<Product>(`/api/pro/admin/products/${id}`);
  },

  /**
   * 新增商品
   */
  async createProduct(data: CreateProductRequest): Promise<ApiResponse<Product>> {
    return apiClient.post<Product>("/api/pro/admin/products", data);
  },

  /**
   * 更新商品
   */
  async updateProduct(id: string, data: UpdateProductRequest): Promise<ApiResponse<Product>> {
    return apiClient.put<Product>(`/api/pro/admin/products/${id}`, data);
  },

  /**
   * 删除商品
   */
  async deleteProduct(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/api/pro/admin/products/${id}`);
  },

  /**
   * 删除型号
   */
  async deleteVariant(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/api/pro/admin/variants/${id}`);
  },

  /**
   * 导入卡密库存
   */
  async importStock(variantId: string, data: ImportStockRequest): Promise<ApiResponse<ImportStockResponse>> {
    return apiClient.post<ImportStockResponse>(`/api/pro/admin/variants/${variantId}/stock/import`, data);
  },

  /**
   * 获取卡密库存列表
   */
  async getStockList(variantId: string, params: ListStockRequest = {}): Promise<ApiResponse<ListStockResponse>> {
    return apiClient.get<ListStockResponse>(`/api/pro/admin/variants/${variantId}/stock`, { params });
  },

  /**
   * 作废卡密
   */
  async invalidateStock(id: string): Promise<ApiResponse<null>> {
    return apiClient.post<null>(`/api/pro/admin/stock/${id}/invalidate`);
  },
};
