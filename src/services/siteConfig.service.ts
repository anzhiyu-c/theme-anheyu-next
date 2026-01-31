import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types";
import type { SiteConfigData } from "@/types/site-config";

class SiteConfigService {
  /**
   * 获取站点配置
   */
  async getSiteConfig(): Promise<ApiResponse<SiteConfigData>> {
    return apiClient.get<SiteConfigData>("/api/public/site-config");
  }
}

export const siteConfigService = new SiteConfigService();
