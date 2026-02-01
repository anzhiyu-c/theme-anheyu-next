/**
 * 文章相关类型定义（与 anheyu-pro 后端 API 保持一致）
 */

// ===================================
//          文章标签 (PostTag)
// ===================================

export interface PostTag {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  count: number;
}

// ===================================
//          文章分类 (PostCategory)
// ===================================

export interface PostCategory {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  count: number;
  is_series: boolean;
  sort_order: number;
}

// ===================================
//      混合内容流项 (FeedItem)
// ===================================

/**
 * @description 混合内容项（文章或商品），用于首页文章列表
 */
export interface FeedItem {
  id: string;
  item_type: "article" | "product";
  title: string;
  cover_url: string;
  created_at: string;
  // 文章特有字段
  pin_sort?: number;
  comment_count?: number;
  post_tags?: PostTag[];
  post_categories?: PostCategory[];
  is_doc?: boolean;
  doc_series_id?: string;
  primary_color?: string; // 文章主色调，用于分类标签背景色
  // 商品特有字段
  min_price?: number;
  max_price?: number;
  total_sales?: number;
}

// ===================================
//          API 响应类型
// ===================================

export interface FeedListResponse {
  list: FeedItem[];
  total: number;
  page: number;
  page_size: number;
}

export interface CategoryListResponse {
  list: PostCategory[];
  total: number;
}

// ===================================
//          查询参数类型
// ===================================

export interface GetFeedListParams {
  page?: number;
  pageSize?: number;
  category?: string;
  tag?: string;
  year?: number;
  month?: number;
}

export interface GetCategoryListParams {
  sort?: "count" | "name";
}

// ===================================
//          归档 (Archive)
// ===================================

export interface Archive {
  year: number;
  month: number;
  count: number;
}
