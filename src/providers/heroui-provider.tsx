/*
 * @Description:
 * @Author: 安知鱼
 * @Date: 2026-01-27 17:18:28
 * @LastEditTime: 2026-01-27 17:22:29
 * @LastEditors: 安知鱼
 */
"use client";

import { HeroUIProvider } from "@heroui/react";
import { useRouter } from "next/navigation";

export function HeroUIProviderWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return <HeroUIProvider navigate={router.push}>{children}</HeroUIProvider>;
}
