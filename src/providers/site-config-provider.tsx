"use client";

import { useEffect } from "react";
import { useSiteConfigStore } from "@/store/siteConfigStore";

interface SiteConfigProviderProps {
  children: React.ReactNode;
}

/**
 * 站点配置 Provider
 * 在应用初始化时自动获取站点配置
 */
export function SiteConfigProvider({ children }: SiteConfigProviderProps) {
  const fetchSiteConfig = useSiteConfigStore(state => state.fetchSiteConfig);
  const isLoaded = useSiteConfigStore(state => state.isLoaded);

  useEffect(() => {
    // 只在客户端且未加载时获取配置
    if (!isLoaded) {
      fetchSiteConfig();
    }
  }, [fetchSiteConfig, isLoaded]);

  return <>{children}</>;
}
