/**
 * 服务端 API 封装
 * 用于 Server Components 的数据获取
 */

import type {
  ApiResponse,
  Article,
  Category,
  Tag,
  SiteConfigData,
  BasicStatistics,
  PaginatedResponse,
  ArticleListParams,
} from "@/types";

// 服务端直接访问后端 API
const API_URL = process.env.API_URL || "http://localhost:8091";

interface FetchOptions {
  revalidate?: number | false;
  tags?: string[];
}

// 通用服务端请求函数
async function serverFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T | null> {
  const { revalidate = 60, tags } = options;

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      next: {
        revalidate: revalidate === false ? false : revalidate,
        tags,
      },
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const result: ApiResponse<T> = await response.json();

    // anheyu-pro 使用 code === 200 表示成功
    if (result.code !== 200) {
      console.error(`API Error: ${result.message}`);
      return null;
    }

    return result.data;
  } catch (error) {
    console.error("Server fetch error:", error);
    return null;
  }
}

// ===================== 站点配置 =====================

/**
 * 获取站点配置
 */
export async function getSiteConfig(): Promise<SiteConfigData | null> {
  return serverFetch<SiteConfigData>("/api/public/site-config", {
    revalidate: 3600, // 1 小时缓存
    tags: ["site-config"],
  });
}

// ===================== 文章相关 =====================

/**
 * 获取文章列表
 */
export async function getArticles(params: ArticleListParams = {}): Promise<PaginatedResponse<Article> | null> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.append("page", String(params.page));
  if (params.page_size) searchParams.append("page_size", String(params.page_size));
  if (params.category_id) searchParams.append("category_id", String(params.category_id));
  if (params.tag_id) searchParams.append("tag_id", String(params.tag_id));
  if (params.status !== undefined) searchParams.append("status", String(params.status));
  if (params.keyword) searchParams.append("keyword", params.keyword);

  const query = searchParams.toString();
  const endpoint = `/api/public/articles${query ? `?${query}` : ""}`;

  return serverFetch<PaginatedResponse<Article>>(endpoint, {
    revalidate: 60, // 1 分钟缓存
    tags: ["articles"],
  });
}

/**
 * 根据 Slug 获取文章详情
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return serverFetch<Article>(`/api/public/articles/${slug}`, {
    revalidate: 60,
    tags: ["articles", `article-${slug}`],
  });
}

/**
 * 获取首页推荐文章
 */
export async function getHomeArticles(): Promise<Article[] | null> {
  return serverFetch<Article[]>("/api/public/articles/home", {
    revalidate: 60,
    tags: ["articles", "home-articles"],
  });
}

/**
 * 获取随机文章
 */
export async function getRandomArticles(count: number = 5): Promise<Article[] | null> {
  return serverFetch<Article[]>(`/api/public/articles/random?count=${count}`, {
    revalidate: false, // 不缓存随机文章
  });
}

// ===================== 分类相关 =====================

/**
 * 获取分类列表
 */
export async function getCategories(): Promise<Category[] | null> {
  return serverFetch<Category[]>("/api/public/categories", {
    revalidate: 600, // 10 分钟缓存
    tags: ["categories"],
  });
}

/**
 * 根据 Slug 获取分类详情
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return serverFetch<Category>(`/api/public/categories/${slug}`, {
    revalidate: 600,
    tags: ["categories", `category-${slug}`],
  });
}

// ===================== 标签相关 =====================

/**
 * 获取标签列表
 */
export async function getTags(): Promise<Tag[] | null> {
  return serverFetch<Tag[]>("/api/public/tags", {
    revalidate: 600, // 10 分钟缓存
    tags: ["tags"],
  });
}

/**
 * 根据 Slug 获取标签详情
 */
export async function getTagBySlug(slug: string): Promise<Tag | null> {
  return serverFetch<Tag>(`/api/public/tags/${slug}`, {
    revalidate: 600,
    tags: ["tags", `tag-${slug}`],
  });
}

// ===================== 统计相关 =====================

/**
 * 获取基础统计数据
 */
export async function getBasicStatistics(): Promise<BasicStatistics | null> {
  return serverFetch<BasicStatistics>("/api/public/statistics/basic", {
    revalidate: 300, // 5 分钟缓存
    tags: ["statistics"],
  });
}
