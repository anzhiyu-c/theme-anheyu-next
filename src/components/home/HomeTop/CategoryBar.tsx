"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCategories } from "@/hooks/queries";
import { cn } from "@/lib/utils";
import styles from "./CategoryBar.module.css";

export function CategoryBar() {
  const pathname = usePathname();
  const catalogBarRef = useRef<HTMLDivElement>(null);
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const { data: categories = [] } = useCategories();

  // 从路径中获取当前选中的分类名称
  const currentCategoryName = pathname?.startsWith("/categories/")
    ? decodeURIComponent(pathname.split("/")[2] || "")
    : null;

  const selectedCategory = categories.find(c => c.name === currentCategoryName);
  const selectedId = selectedCategory?.id || null;
  const isHomePage = pathname === "/" || pathname === "";

  const checkScrollPosition = useCallback(() => {
    const el = catalogBarRef.current;
    if (!el) return;
    setIsScrolledToEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }, []);

  const updateScrollVisibility = useCallback(() => {
    const el = catalogBarRef.current;
    if (!el) return;
    setShowScrollButton(el.scrollWidth > el.clientWidth);
    checkScrollPosition();
  }, [checkScrollPosition]);

  useEffect(() => {
    updateScrollVisibility();
    window.addEventListener("resize", updateScrollVisibility);
    return () => {
      window.removeEventListener("resize", updateScrollVisibility);
    };
  }, [updateScrollVisibility, categories]);

  const handleScrollNext = () => {
    const el = catalogBarRef.current;
    if (!el) return;
    if (isScrolledToEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
    }
  };

  return (
    <div className={styles.categoryBarContainer}>
      <div className={styles.categoryBar}>
        <div ref={catalogBarRef} className={styles.catalogBar} onScroll={checkScrollPosition}>
          <div className={styles.catalogList}>
            {/* 首页 */}
            <Link href="/" className={cn(styles.catalogListItem, isHomePage && !selectedId && styles.select)}>
              <span>首页</span>
            </Link>
            {/* 分类列表 */}
            {categories.map(category => (
              <Link
                key={category.id}
                href={`/categories/${encodeURIComponent(category.name)}/`}
                className={cn(styles.catalogListItem, selectedId === category.id && styles.select)}
              >
                <span>{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
        {showScrollButton && (
          <button
            className={styles.categoryBarNext}
            onClick={handleScrollNext}
            aria-label={isScrolledToEnd ? "滚动到开始" : "滚动到更多"}
          >
            <i className={cn("anzhiyufont anzhiyu-icon-angle-double-right", isScrolledToEnd && styles.isRotated)} />
          </button>
        )}
        <Link href="/categories" className={styles.catalogMore}>
          更多
        </Link>
      </div>
    </div>
  );
}
