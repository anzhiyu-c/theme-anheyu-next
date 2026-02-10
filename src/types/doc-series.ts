/**
 * 文档系列类型定义
 * 对应后端 model.DocSeriesResponse / model.CreateDocSeriesRequest 等
 */

// ===================================
//          文档系列 (DocSeries)
// ===================================

/** 文档系列数据结构 */
export interface DocSeries {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  cover_url: string;
  sort: number;
  doc_count: number;
}

/** 创建/编辑表单数据 */
export interface DocSeriesForm {
  name: string;
  description?: string;
  cover_url?: string;
  sort?: number;
}

/** 文档系列列表响应 */
export interface DocSeriesListResponse {
  list: DocSeries[];
  total: number;
  page: number;
  pageSize: number;
}

/** 文档系列列表查询参数 */
export interface DocSeriesListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}
