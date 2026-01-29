"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { CACHE_TTL, CACHE_MULTIPLIERS, API_RESPONSE_CODE } from "@/lib/constants";
import type { Article, ArticleListParams, PaginatedResponse } from "@/types";

// Query Keys
export const articleKeys = {
  all: ["articles"] as const,
  lists: () => [...articleKeys.all, "list"] as const,
  list: (params: ArticleListParams) => [...articleKeys.lists(), params] as const,
  details: () => [...articleKeys.all, "detail"] as const,
  detail: (slug: string) => [...articleKeys.details(), slug] as const,
};

/**
 * 获取文章列表
 */
export function useArticlesQuery(params: ArticleListParams = {}) {
  return useQuery({
    queryKey: articleKeys.list(params),
    queryFn: async () => {
      const res = await apiClient.get<PaginatedResponse<Article>>(
        "/public/articles",
        params as Record<string, string | number | boolean | undefined>
      );
      if (res.code === API_RESPONSE_CODE.SUCCESS && res.data) {
        return res.data;
      }
      throw new Error(res.message || "获取文章列表失败");
    },
    staleTime: CACHE_TTL.ARTICLES,
    gcTime: CACHE_TTL.ARTICLES * CACHE_MULTIPLIERS.GC_TIME,
  });
}

/**
 * 获取文章详情
 */
export function useArticleQuery(slug: string) {
  return useQuery({
    queryKey: articleKeys.detail(slug),
    queryFn: async () => {
      const res = await apiClient.get<Article>(`/public/articles/${slug}`);
      if (res.code === API_RESPONSE_CODE.SUCCESS && res.data) {
        return res.data;
      }
      throw new Error(res.message || "获取文章详情失败");
    },
    enabled: !!slug,
    staleTime: CACHE_TTL.ARTICLES,
    gcTime: CACHE_TTL.ARTICLES * CACHE_MULTIPLIERS.GC_TIME,
  });
}

/**
 * 无限滚动加载文章列表
 */
export function useArticlesInfiniteQuery(params: Omit<ArticleListParams, "page"> = {}) {
  return useInfiniteQuery({
    queryKey: [...articleKeys.lists(), "infinite", params],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await apiClient.get<PaginatedResponse<Article>>("/public/articles", {
        ...params,
        page: pageParam,
        page_size: params.page_size || 10,
      } as Record<string, string | number | boolean | undefined>);
      if (res.code === API_RESPONSE_CODE.SUCCESS && res.data) {
        return res.data;
      }
      throw new Error(res.message || "获取文章列表失败");
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.ceil(lastPage.total / lastPage.page_size);
      const nextPage = allPages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    staleTime: CACHE_TTL.ARTICLES,
    gcTime: CACHE_TTL.ARTICLES * CACHE_MULTIPLIERS.GC_TIME,
  });
}
