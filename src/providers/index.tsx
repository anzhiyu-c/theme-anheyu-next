"use client";

import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { HeroUIProviderWrapper } from "./heroui-provider";
import { AuthProvider } from "./auth-provider";
import { SiteConfigProvider } from "./site-config-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <HeroUIProviderWrapper>
          <SiteConfigProvider>
            <AuthProvider>{children}</AuthProvider>
          </SiteConfigProvider>
        </HeroUIProviderWrapper>
      </ThemeProvider>
    </QueryProvider>
  );
}
