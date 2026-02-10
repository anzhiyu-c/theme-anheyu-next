/**
 * 相册管理类型定义
 * 对应后端 handler/album 中的请求和响应结构
 */

// ===================================
//          相册图片 (Album)
// ===================================

/** 相册图片数据结构 */
export interface Album {
  id: number;
  created_at: string;
  updated_at: string;
  categoryId: number | null;
  imageUrl: string;
  bigImageUrl: string;
  downloadUrl: string;
  thumbParam: string;
  bigParam: string;
  tags: string;
  viewCount: number;
  downloadCount: number;
  width: number;
  height: number;
  widthAndHeight: string;
  fileSize: number;
  format: string;
  aspectRatio: string;
  displayOrder: number;
  title: string;
  description: string;
  location: string;
}

/** 创建/编辑表单数据 */
export interface AlbumForm {
  categoryId?: number | null;
  imageUrl: string;
  bigImageUrl?: string;
  downloadUrl?: string;
  thumbParam?: string;
  bigParam?: string;
  tags?: string[];
  width?: number;
  height?: number;
  fileSize?: number;
  format?: string;
  fileHash?: string;
  displayOrder?: number;
  title?: string;
  description?: string;
  location?: string;
}

/** 相册列表响应 */
export interface AlbumListResponse {
  list: Album[];
  total: number;
  pageNum: number;
  pageSize: number;
}

/** 相册列表查询参数 */
export interface AlbumListParams {
  page?: number;
  pageSize?: number;
  categoryId?: number;
  tag?: string;
  sort?: string;
}

/** 排序选项 */
export const ALBUM_SORT_OPTIONS = [
  { key: "display_order_asc", label: "排序 (升序)" },
  { key: "display_order_desc", label: "排序 (降序)" },
  { key: "created_at_desc", label: "最新创建" },
  { key: "created_at_asc", label: "最早创建" },
  { key: "view_count_desc", label: "浏览最多" },
] as const;
