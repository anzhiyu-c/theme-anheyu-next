"use client";

import { useState, useEffect } from "react";
import { BREAKPOINTS } from "@/lib/constants";

/**
 * 通用媒体查询 Hook
 * @param query 媒体查询字符串
 * @returns 是否匹配
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

/**
 * 判断是否为移动端
 * @returns 屏幕宽度 <= 768px
 */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.MOBILE}px)`);
}

/**
 * 判断是否为平板端
 * @returns 屏幕宽度 <= 1024px
 */
export function useIsTablet(): boolean {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.TABLET}px)`);
}

/**
 * 判断是否为桌面端
 * @returns 屏幕宽度 > 1024px
 */
export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.TABLET + 1}px)`);
}
