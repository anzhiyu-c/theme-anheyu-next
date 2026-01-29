/**
 * 分类类型
 */
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  cover: string;
  parent_id: number;
  sort: number;
  article_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * 标签类型
 */
export interface Tag {
  id: number;
  name: string;
  slug: string;
  color: string;
  article_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * 文章类型
 */
export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary: string;
  cover: string;
  category_id: number;
  category?: Category;
  tags?: Tag[];
  status: number;
  is_top: boolean;
  views: number;
  likes: number;
  comments: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

/**
 * 文章列表查询参数
 */
export interface ArticleListParams {
  page?: number;
  page_size?: number;
  category_id?: number;
  tag_id?: number;
  status?: number;
  keyword?: string;
}

/**
 * 评论类型
 */
export interface Comment {
  id: number;
  article_id: number;
  user_id: number;
  user?: import("./user").User;
  parent_id: number;
  content: string;
  status: number;
  likes: number;
  replies?: Comment[];
  created_at: string;
  updated_at: string;
}
