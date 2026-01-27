import type {
  ApiResponse,
  Article,
  ArticleSummary,
  ArticleStatistics,
  ArticleQueryParams,
  PaginatedResponse,
  SiteConfig,
} from './types'

// 服务端 API 基础 URL
const API_BASE_URL = process.env.API_URL || 'http://localhost:8091'

// 通用请求函数
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  const data: ApiResponse<T> = await response.json()

  if (data.code !== 200) {
    throw new Error(data.message || 'API Error')
  }

  return data.data
}

// ============== 公开 API ==============

/**
 * 获取首页推荐文章（最多 6 篇）
 */
export async function getHomeArticles(): Promise<ArticleSummary[]> {
  return fetchApi<ArticleSummary[]>('/api/public/articles/home')
}

/**
 * 获取文章列表
 */
export async function getArticles(
  params?: ArticleQueryParams
): Promise<PaginatedResponse<ArticleSummary>> {
  const searchParams = new URLSearchParams()

  if (params?.page) searchParams.set('page', params.page.toString())
  if (params?.page_size) searchParams.set('page_size', params.page_size.toString())
  if (params?.category_id) searchParams.set('category_id', params.category_id)
  if (params?.tag_id) searchParams.set('tag_id', params.tag_id)
  if (params?.year) searchParams.set('year', params.year.toString())
  if (params?.month) searchParams.set('month', params.month.toString())
  if (params?.keyword) searchParams.set('keyword', params.keyword)

  const query = searchParams.toString()
  const endpoint = `/api/public/articles${query ? `?${query}` : ''}`

  return fetchApi<PaginatedResponse<ArticleSummary>>(endpoint)
}

/**
 * 获取文章详情
 * @param idOrAbbrlink 文章 ID 或 Abbrlink
 */
export async function getArticle(idOrAbbrlink: string): Promise<Article> {
  return fetchApi<Article>(`/api/public/articles/${idOrAbbrlink}`)
}

/**
 * 获取文章统计数据
 */
export async function getArticleStatistics(): Promise<ArticleStatistics> {
  return fetchApi<ArticleStatistics>('/api/public/articles/statistics')
}

/**
 * 获取站点配置
 */
export async function getSiteConfig(): Promise<SiteConfig> {
  return fetchApi<SiteConfig>('/api/public/site-config')
}

/**
 * 获取随机文章
 */
export async function getRandomArticle(): Promise<Article> {
  return fetchApi<Article>('/api/public/articles/random')
}
