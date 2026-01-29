"use client";

import { useQuery, queryOptions } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { CACHE_TTL, CACHE_MULTIPLIERS, API_RESPONSE_CODE } from "@/lib/constants";
import type { SiteConfigData } from "@/types/site-config";

// Query Keys
export const siteConfigKeys = {
  all: ["site-config"] as const,
};

/**
 * 站点配置 Query Options（可复用）
 */
export const siteConfigQueryOptions = queryOptions({
  queryKey: siteConfigKeys.all,
  queryFn: async () => {
    const res = await apiClient.get<SiteConfigData>("/public/site-config");
    if (res.code === API_RESPONSE_CODE.SUCCESS && res.data) {
      return res.data;
    }
    throw new Error(res.message || "获取站点配置失败");
  },
  staleTime: CACHE_TTL.SITE_CONFIG,
  gcTime: CACHE_TTL.SITE_CONFIG * CACHE_MULTIPLIERS.GC_TIME,
  refetchOnWindowFocus: false,
  retry: 2,
});

/**
 * 获取站点配置的 React Query Hook
 * 使用 24 小时缓存
 */
export function useSiteConfigQuery() {
  return useQuery(siteConfigQueryOptions);
}
