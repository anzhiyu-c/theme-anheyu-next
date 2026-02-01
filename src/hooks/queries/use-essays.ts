import { useQuery, queryOptions } from "@tanstack/react-query";
import { essayApi, type EssayListParams, type EssayListResponse } from "@/lib/api/essay";

/**
 * 即刻列表查询 key
 */
export const essayKeys = {
  all: ["essays"] as const,
  lists: () => [...essayKeys.all, "list"] as const,
  list: (params: EssayListParams) => [...essayKeys.lists(), params] as const,
  publicList: (params: EssayListParams) => [...essayKeys.all, "public", params] as const,
};

/**
 * 即刻公开列表查询配置
 * 使用 queryOptions 工厂模式，便于在 SSR 和客户端复用
 */
export const publicEssaysQueryOptions = (params: EssayListParams = {}) =>
  queryOptions({
    queryKey: essayKeys.publicList(params),
    queryFn: () => essayApi.getPublicList(params),
    staleTime: 1000 * 60 * 5, // 5 分钟内数据被认为是新鲜的
  });

/**
 * 获取公开即刻列表的 Hook
 *
 * @param params - 查询参数
 * @param options - 额外配置
 * @returns 查询结果
 *
 * @example
 * ```tsx
 * const { data, isPending, error } = usePublicEssays({ page: 1, page_size: 10 });
 * ```
 */
export function usePublicEssays(params: EssayListParams = {}, options?: { enabled?: boolean }) {
  return useQuery({
    ...publicEssaysQueryOptions(params),
    enabled: options?.enabled ?? true,
  });
}

/**
 * 即刻数据类型导出
 */
export type { EssayListResponse };
