/**
 * 评论相关 Query Hooks
 */

import { useQuery, queryOptions } from "@tanstack/react-query";
import { commentApi, type GetLatestCommentsParams } from "@/lib/api/comment";

// ===================================
//          Query Keys
// ===================================

export const commentKeys = {
  all: ["comments"] as const,
  latest: (params: GetLatestCommentsParams) => [...commentKeys.all, "latest", params] as const,
};

// ===================================
//          Query Options
// ===================================

export const latestCommentsQueryOptions = (params: GetLatestCommentsParams = {}) =>
  queryOptions({
    queryKey: commentKeys.latest(params),
    queryFn: () => commentApi.getLatestComments(params),
    staleTime: 1000 * 60 * 2, // 2 分钟
  });

// ===================================
//          Query Hooks
// ===================================

/**
 * 获取最新评论列表
 */
export function useLatestComments(params: GetLatestCommentsParams = {}, options?: { enabled?: boolean }) {
  return useQuery({
    ...latestCommentsQueryOptions(params),
    enabled: options?.enabled ?? true,
  });
}
