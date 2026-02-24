"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useSiteConfigStore } from "@/store/site-config-store";
import { usePublicEssays } from "@/hooks/queries";
import type { Essay } from "@/lib/api/essay";

import styles from "./EssayBar.module.css";

/**
 * 去除 HTML 标签
 */
function stripHtmlTags(html: string): string {
  if (typeof window === "undefined") {
    return html.replace(/<[^>]*>/g, "");
  }
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

/**
 * 即刻栏组件
 *
 * 使用 TanStack Query 进行数据获取和缓存管理
 * 支持自动轮播、hover 暂停等交互功能
 */
export function EssayBar() {
  const siteConfig = useSiteConfigStore(state => state.siteConfig);
  const essayConfig = useMemo(() => siteConfig?.essay, [siteConfig]);
  const isEssayEnabled = essayConfig?.home_enable === true;

  // 使用 TanStack Query 获取数据
  // 只有在配置启用时才发起请求
  const { data: essayData } = usePublicEssays({ page: 1, page_size: 10 }, { enabled: isEssayEnabled });

  const essays = useMemo(() => essayData?.list || [], [essayData]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 是否显示即刻条
  // 只有配置启用 且 有数据时才显示
  const showEssayBar = useMemo(() => {
    if (!isEssayEnabled) return false;
    if (essays.length === 0) return false;
    return true;
  }, [isEssayEnabled, essays.length]);

  // 用于无限循环的展示数组
  const displayEssays = useMemo(() => {
    if (essays.length === 0) return [];
    if (essays.length === 1) return essays;
    return [...essays, essays[0]];
  }, [essays]);

  // 开始轮播
  const startCarousel = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        const nextIndex = prev + 1;
        // 当滚动到复制的第一条时，等动画结束后瞬间跳回
        if (nextIndex >= essays.length) {
          setTimeout(() => {
            if (carouselRef.current) {
              carouselRef.current.style.transition = "none";
            }
            setCurrentIndex(0);
            setTimeout(() => {
              if (carouselRef.current) {
                carouselRef.current.style.transition = "transform 1s ease";
              }
            }, 50);
          }, 1000);
        }
        return nextIndex;
      });
    }, 5000);
  }, [essays.length]);

  // 停止轮播
  const stopCarousel = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // 恢复轮播
  const resumeCarousel = useCallback(() => {
    if (essays.length > 1) {
      startCarousel();
    }
  }, [essays.length, startCarousel]);

  // 数据加载后启动轮播
  useEffect(() => {
    if (essays.length > 1) {
      startCarousel();
    }
    return () => stopCarousel();
  }, [essays.length, startCarousel, stopCarousel]);

  if (!showEssayBar) return null;

  return (
    <div className={`essay-bar-wrapper ${styles.essayBarContainer}`}>
      <Link href="/essay" className={styles.essayLogo} title="即刻短文">
        <svg className={styles.essayLogoIcon} viewBox="0 0 1024 1024" fill="currentColor" width="1em" height="1em">
          <path d="M240.64 675.84c-5.12 7.68-15.36 12.8-23.04 15.36-5.12-20.48-12.8-43.52-20.48-61.44-56.32 20.48-115.2 40.96-174.08 71.68-5.12-110.08 0-289.28 7.68-384-7.68 0-12.8 5.12-17.92 7.68 0-10.24 0-20.48 2.56-28.16 2.56-5.12 5.12-10.24 12.8-12.8 28.16-15.36 102.4-25.6 133.12-20.48 17.92 2.56 30.72 10.24 38.4 23.04 7.68 12.8 10.24 30.72 12.8 48.64 5.12 51.2 5.12 99.84 2.56 153.6-53.76 2.56-107.52 7.68-156.16 20.48v135.68c38.4-17.92 81.92-33.28 122.88-48.64l-30.72-61.44c10.24-5.12 23.04-10.24 30.72-12.8 25.6 40.96 48.64 81.92 64 125.44 0 12.8 0 20.48-5.12 28.16zM176.64 396.8c-38.4 0-87.04 7.68-117.76 15.36l-2.56 66.56c38.4-7.68 79.36-12.8 122.88-17.92 0-17.92 0-46.08-2.56-64z m-5.12-79.36c-2.56-10.24-12.8-20.48-25.6-20.48-28.16 0-56.32 2.56-81.92 10.24-2.56 23.04-2.56 46.08-5.12 69.12 38.4-7.68 76.8-12.8 115.2-15.36 2.56-12.8 0-28.16-2.56-43.52z m273.92 320c-5.12 10.24-12.8 17.92-25.6 23.04-12.8 5.12-33.28 5.12-48.64 2.56-10.24 0-15.36-7.68-17.92-15.36-2.56-7.68-5.12-17.92-5.12-23.04 17.92 2.56 30.72 2.56 51.2 2.56 10.24 0 15.36-7.68 15.36-17.92 5.12-84.48 5.12-199.68-7.68-281.6-2.56-17.92-15.36-25.6-30.72-25.6-20.48 0-53.76 5.12-69.12 10.24-10.24 117.76-15.36 291.84-5.12 409.6h-35.84c-7.68-122.88-5.12-276.48 2.56-394.24-7.68 2.56-17.92 7.68-25.6 10.24-2.56-10.24-2.56-20.48 0-28.16 2.56-7.68 5.12-12.8 12.8-15.36 28.16-12.8 92.16-30.72 133.12-28.16 17.92 2.56 28.16 10.24 38.4 20.48 12.8 12.8 15.36 30.72 15.36 48.64 10.24 94.72 10.24 174.08 7.68 273.92 0 10.24 0 17.92-5.12 28.16zM842.24 335.36c-40.96 0-81.92 0-120.32 5.12-38.4 28.16-74.24 56.32-110.08 89.6 33.28-5.12 66.56-7.68 97.28-10.24 17.92-12.8 51.2-40.96 69.12-53.76 10.24 5.12 20.48 12.8 30.72 20.48-84.48 66.56-166.4 135.68-248.32 209.92-2.56-5.12-7.68-12.8-10.24-23.04-2.56-5.12 0-15.36 5.12-20.48 38.4-35.84 74.24-66.56 112.64-97.28-33.28 2.56-66.56 10.24-99.84 17.92-2.56-7.68-7.68-15.36-7.68-23.04 0-7.68 0-12.8 5.12-17.92 30.72-30.72 64-58.88 97.28-84.48-40.96 2.56-79.36 10.24-117.76 17.92 0-7.68 2.56-17.92 2.56-25.6 0-5.12 5.12-12.8 15.36-15.36 38.4-7.68 76.8-12.8 115.2-15.36-2.56-10.24-10.24-20.48-15.36-33.28 10.24-5.12 23.04-10.24 33.28-15.36 5.12 12.8 15.36 33.28 20.48 46.08 43.52-2.56 81.92-2.56 125.44-2.56v30.72z m-28.16 389.12c-35.84-46.08-71.68-84.48-110.08-125.44-33.28 28.16-94.72 84.48-135.68 122.88-5.12-2.56-10.24-10.24-12.8-20.48-2.56-7.68-2.56-15.36 5.12-23.04 43.52-40.96 156.16-140.8 238.08-207.36 5.12 5.12 17.92 15.36 25.6 23.04-25.6 20.48-71.68 61.44-94.72 81.92 35.84 35.84 76.8 76.8 99.84 104.96 5.12 5.12 7.68 17.92 2.56 25.6-7.68 5.12-12.8 12.8-17.92 17.92z m92.16-87.04c-10.24 2.56-25.6 2.56-35.84 2.56-5.12-120.32-5.12-232.96 0-355.84h35.84c-5.12 120.32-10.24 235.52 0 353.28z m89.6-376.32c7.68 140.8 12.8 307.2-2.56 414.72-2.56 17.92-12.8 28.16-25.6 35.84-17.92 10.24-46.08 7.68-58.88 2.56-10.24-2.56-12.8-10.24-15.36-17.92-2.56-7.68-2.56-12.8-2.56-20.48 15.36 2.56 33.28 5.12 53.76 5.12 7.68-2.56 12.8-7.68 15.36-17.92 7.68-94.72 10.24-268.8 0-404.48h35.84z" />
        </svg>
      </Link>

      <div className={styles.essayCarouselWrapper} onMouseEnter={stopCarousel} onMouseLeave={resumeCarousel}>
        <Link href="/essay" className={styles.essayCarouselLink}>
          <div
            ref={carouselRef}
            className={styles.essayCarousel}
            style={{ transform: `translateY(-${currentIndex * 30}px)` }}
          >
            {displayEssays.map((essay: Essay, index: number) => (
              <div key={`${essay.id}-${index}`} className={styles.essayItem}>
                {stripHtmlTags(essay.content)}
              </div>
            ))}
          </div>
        </Link>
      </div>

      <Link href="/essay" className={styles.essayMoreBtn} title="查看全文">
        <Icon icon="fa6-solid:circle-arrow-right" width={20} height={20} />
      </Link>
    </div>
  );
}
