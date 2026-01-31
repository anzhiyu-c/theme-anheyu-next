import { apiClient } from "@/lib/api/client";
import type { Article, ApiResponse, PaginatedResponse } from "@/types";

interface GetArticlesParams {
  page?: number;
  pageSize?: number;
  category?: string;
  tag?: string;
}

class ArticleService {
  async getArticles(
    params: GetArticlesParams = {},
    token?: string
  ): Promise<ApiResponse<PaginatedResponse<Article>>> {
    const { page = 1, pageSize = 10, category, tag } = params;
    const queryParams = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });

    if (category) queryParams.append("category", category);
    if (tag) queryParams.append("tag", tag);

    return apiClient.get<PaginatedResponse<Article>>(
      `/api/articles?${queryParams}`,
      { token }
    );
  }

  async getArticle(slug: string): Promise<ApiResponse<Article>> {
    return apiClient.get<Article>(`/api/articles/${slug}`);
  }

  async createArticle(
    data: Partial<Article>,
    token: string
  ): Promise<ApiResponse<Article>> {
    return apiClient.post<Article>("/api/articles", data, { token });
  }

  async updateArticle(
    id: string,
    data: Partial<Article>,
    token: string
  ): Promise<ApiResponse<Article>> {
    return apiClient.put<Article>(`/api/articles/${id}`, data, { token });
  }

  async deleteArticle(id: string, token: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/api/articles/${id}`, { token });
  }
}

export const articleService = new ArticleService();
