"use client";

import { useState, useEffect, useMemo } from "react";

interface ScrollState {
  scrollY: number;
  isAtTop: boolean;
  isScrolled: boolean;
  scrollPercent: number;
}

/**
 * 通用滚动状态 Hook
 * 用于监听页面滚动状态
 */
export function useScroll(): ScrollState {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(Math.max(0, window.scrollY));
    };

    // 使用 passive 提升性能
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return useMemo(() => {
    const scrollHeight = typeof document !== "undefined" ? document.documentElement.scrollHeight : 0;
    const clientHeight = typeof window !== "undefined" ? window.innerHeight : 0;

    const scrollPercent = scrollHeight > clientHeight ? Math.round((scrollY / (scrollHeight - clientHeight)) * 100) : 0;

    return {
      scrollY,
      isAtTop: scrollY === 0,
      isScrolled: scrollY > 60,
      scrollPercent,
    };
  }, [scrollY]);
}
