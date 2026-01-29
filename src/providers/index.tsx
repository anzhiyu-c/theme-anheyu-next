"use client";

import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { HeroUIProviderWrapper } from "./heroui-provider";
import { AuthProvider } from "./auth-provider";
import { SiteConfigProvider } from "./site-config-provider";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { DynamicHead } from "@/components/shared/DynamicHead";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ThemeProvider>
          <HeroUIProviderWrapper>
            <SiteConfigProvider>
              {/* 动态更新 favicon 和 SEO meta 标签 */}
              <DynamicHead />
              <AuthProvider>{children}</AuthProvider>
            </SiteConfigProvider>
          </HeroUIProviderWrapper>
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}
