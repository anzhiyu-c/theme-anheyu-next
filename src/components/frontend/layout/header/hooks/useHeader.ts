"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { throttle } from "@/lib/utils";

export function useHeader(isPostDetailPage: boolean = false) {
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

    if (scrollHeight > clientHeight) {
      setScrollPercent(Math.round((scrollTop / (scrollHeight - clientHeight)) * 100));
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
    handleScroll();

    return () => {
      window.removeEventListener("scroll", throttledScrollHandler);
    };
  }, [handleScroll]);

  // 路由变化时重置状态
  useEffect(() => {
    handleScroll();
  }, [pathname, handleScroll]);

  return {
    isHeaderTransparent,
    isScrolled,
    scrollPercent,
    isFooterVisible,
  };
}
