/**
 * 特效组件共用 Hooks
 */
"use client";

import { useRef, useEffect, useState, useCallback, useSyncExternalStore } from "react";
import { useScroll } from "framer-motion";

/**
 * 检测元素是否在视口内
 */
export function useInViewport(ref: React.RefObject<HTMLElement | null>, rootMargin = "100px") {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { rootMargin });

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return isInView;
}

/**
 * 检测用户是否偏好减少动画
 * 使用 useSyncExternalStore 避免 hydration 问题
 */
export function usePrefersReducedMotion() {
  const subscribe = useCallback((callback: () => void) => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    mediaQuery.addEventListener("change", callback);
    return () => mediaQuery.removeEventListener("change", callback);
  }, []);

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * 检测是否为触摸设备
 */
export function useIsTouchDevice() {
  const subscribe = useCallback(() => {
    return () => {};
  }, []);

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return false;
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }, []);

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * 滚动视差 Hook
 */
export function useScrollParallax(
  offset: ["start start" | "end start", "start start" | "end start"] = ["start start", "end start"]
) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as ["start start", "end start"],
  });

  return { ref, scrollYProgress };
}
