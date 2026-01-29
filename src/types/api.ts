/**
 * 通用 API 响应类型
 */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

/**
 * 分页响应类型
 */
export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  page_size: number;
}
