/*
 * @Description:
 * @Author: 安知鱼
 * @Date: 2026-01-30 16:54:59
 * @LastEditTime: 2026-01-31 11:00:00
 * @LastEditors: 安知鱼
 */
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useSiteConfigStore } from "@/store/siteConfigStore";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * 站点配置加载器
 */
function SiteConfigLoader({ children }: { children: ReactNode }) {
  const fetchSiteConfig = useSiteConfigStore(state => state.fetchSiteConfig);

  useEffect(() => {
    fetchSiteConfig();
  }, [fetchSiteConfig]);

  return <>{children}</>;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem={true} disableTransitionOnChange={false}>
      <SiteConfigLoader>{children}</SiteConfigLoader>
    </NextThemesProvider>
  );
}
