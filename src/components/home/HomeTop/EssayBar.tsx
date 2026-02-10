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
        即刻
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
        <Icon icon="ri:arrow-right-circle-line" width={20} height={20} />
      </Link>
    </div>
  );
}
