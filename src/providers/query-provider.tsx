"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 数据在 5 分钟内被认为是新鲜的
            staleTime: 5 * 60 * 1000,
            // 垃圾回收时间：1 小时后清除未使用的缓存
            gcTime: 60 * 60 * 1000,
            // 默认重试 1 次
            retry: 1,
            // 窗口获取焦点时不自动重新获取
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
