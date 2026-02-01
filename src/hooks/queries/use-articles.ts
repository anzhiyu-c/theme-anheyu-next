/**
 * 文章相关 Query Hooks
 */

import { useQuery, queryOptions } from "@tanstack/react-query";
import { articleApi } from "@/lib/api/article";
import type { GetFeedListParams } from "@/types/article";

// ===================================
//          Query Keys
// ===================================

export const articleKeys = {
  all: ["articles"] as const,
  feed: () => [...articleKeys.all, "feed"] as const,
  feedList: (params: GetFeedListParams) => [...articleKeys.feed(), params] as const,
  categories: () => [...articleKeys.all, "categories"] as const,
  tags: () => [...articleKeys.all, "tags"] as const,
  archives: () => [...articleKeys.all, "archives"] as const,
};

// ===================================
//          Query Options
// ===================================

export const feedListQueryOptions = (params: GetFeedListParams = {}) =>
  queryOptions({
    queryKey: articleKeys.feedList(params),
    queryFn: () => articleApi.getFeedList(params),
    staleTime: 1000 * 60 * 5, // 5 分钟
  });

export const categoriesQueryOptions = () =>
  queryOptions({
    queryKey: articleKeys.categories(),
    queryFn: () => articleApi.getCategoryList(),
    staleTime: 1000 * 60 * 10, // 10 分钟
  });

export const tagsQueryOptions = () =>
  queryOptions({
    queryKey: articleKeys.tags(),
    queryFn: () => articleApi.getTagList(),
    staleTime: 1000 * 60 * 10, // 10 分钟
  });

export const archivesQueryOptions = () =>
  queryOptions({
    queryKey: articleKeys.archives(),
    queryFn: () => articleApi.getArchiveList(),
    staleTime: 1000 * 60 * 10, // 10 分钟
  });

// ===================================
//          Query Hooks
// ===================================

/**
 * 获取文章列表（混合内容流）
 */
export function useFeedList(params: GetFeedListParams = {}, options?: { enabled?: boolean }) {
  return useQuery({
    ...feedListQueryOptions(params),
    enabled: options?.enabled ?? true,
  });
}

/**
 * 获取分类列表
 */
export function useCategories(options?: { enabled?: boolean }) {
  return useQuery({
    ...categoriesQueryOptions(),
    enabled: options?.enabled ?? true,
  });
}

/**
 * 获取标签列表
 */
export function useTags(options?: { enabled?: boolean }) {
  return useQuery({
    ...tagsQueryOptions(),
    enabled: options?.enabled ?? true,
  });
}

/**
 * 获取归档列表
 */
export function useArchives(options?: { enabled?: boolean }) {
  return useQuery({
    ...archivesQueryOptions(),
    enabled: options?.enabled ?? true,
  });
}
