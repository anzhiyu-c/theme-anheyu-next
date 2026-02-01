"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { usePathname } from "next/navigation";

interface HeaderState {
  isHeaderTransparent: boolean;
  isScrolled: boolean;
  scrollPercent: number;
  isFooterVisible: boolean;
}

// 节流函数 - 支持 leading 和 trailing
function throttle<T extends (...args: unknown[]) => unknown>(func: T, limit: number): T & { cancel: () => void } {
  let inThrottle = false;
  let lastArgs: Parameters<T> | null = null;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const throttled = function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      // Leading: 立即执行
      func.apply(this, args);
      inThrottle = true;
      timeoutId = setTimeout(() => {
        inThrottle = false;
        // Trailing: 如果有待处理的调用，执行最后一次
        if (lastArgs) {
          func.apply(this, lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else {
      // 保存最后一次调用的参数
      lastArgs = args;
    }
  } as T & { cancel: () => void };

  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    inThrottle = false;
    lastArgs = null;
  };

  return throttled;
}

/**
 * Header 专用滚动状态 Hook
 * 提供 Header 组件所需的滚动状态
 */
export function useHeader(): HeaderState {
  const [isHeaderTransparent, setIsHeaderTransparent] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const lastScrollTopRef = useRef(0);
  const pathname = usePathname();

  const handleScroll = useCallback(() => {
    // 确保 scrollTop 不能是负数
    const scrollTop = Math.max(0, window.scrollY);
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    setIsHeaderTransparent(scrollTop === 0);

    // 到达顶部时强制 isScrolled 为 false
    if (scrollTop <= 0) {
      setIsScrolled(false);
    } else if (scrollTop > 60) {
      setIsScrolled(scrollTop > lastScrollTopRef.current);
    } else {
      setIsScrolled(false);
    }

    lastScrollTopRef.current = scrollTop;

    const scrollableHeight = scrollHeight - clientHeight;
    // 当可滚动区域很小（小于 10px）或 scrollTop 接近 0 时，显示 0
    if (scrollableHeight > 10 && scrollTop > 1) {
      setScrollPercent(Math.round((scrollTop / scrollableHeight) * 100));
    } else {
      setScrollPercent(0);
    }

    const footerEl = document.getElementById("footer-container");
    if (footerEl) {
      setIsFooterVisible(scrollTop + clientHeight >= footerEl.offsetTop);
    } else {
      setIsFooterVisible(false);
    }
  }, []);

  useEffect(() => {
    const throttledScrollHandler = throttle(handleScroll, 72);

    window.addEventListener("scroll", throttledScrollHandler);
    // 使用 requestAnimationFrame 延迟初始调用，避免同步 setState
    const rafId = requestAnimationFrame(handleScroll);

    return () => {
      window.removeEventListener("scroll", throttledScrollHandler);
      throttledScrollHandler.cancel();
      cancelAnimationFrame(rafId);
    };
  }, [handleScroll]);

  // 路由变化时重置状态
  useEffect(() => {
    const rafId = requestAnimationFrame(handleScroll);
    return () => cancelAnimationFrame(rafId);
  }, [pathname, handleScroll]);

  return useMemo(
    () => ({
      isHeaderTransparent,
      isScrolled,
      scrollPercent,
      isFooterVisible,
    }),
    [isHeaderTransparent, isScrolled, scrollPercent, isFooterVisible]
  );
}
