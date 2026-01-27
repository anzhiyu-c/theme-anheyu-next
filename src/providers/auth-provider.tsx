"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    // 在客户端挂载后恢复认证状态
    hydrate();
  }, [hydrate]);

  return <>{children}</>;
}
