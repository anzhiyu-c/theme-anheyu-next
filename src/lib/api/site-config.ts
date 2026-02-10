/**
 * 站点配置 API
 */
import { apiClient } from "./client";
import type { ApiResponse } from "@/types";
import type { SiteConfigData } from "@/types/site-config";

export const siteConfigApi = {
  /** 获取站点配置 */
  getSiteConfig(): Promise<ApiResponse<SiteConfigData>> {
    return apiClient.get<SiteConfigData>("/api/public/site-config");
  },
};

/** @deprecated 使用 siteConfigApi 代替 */
export const siteConfigService = siteConfigApi;
