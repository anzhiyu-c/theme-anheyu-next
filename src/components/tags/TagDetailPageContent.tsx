"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Sidebar, TagBar } from "@/components/home";
import { FilteredArticleList } from "@/components/articles";
import { TagFilterContext } from "@/contexts/TagFilterContext";
import { useSiteConfigStore } from "@/store/siteConfigStore";

interface TagDetailPageContentProps {
  tagName: string;
  page?: number;
}

export function TagDetailPageContent({ tagName: initialTagName, page = 1 }: TagDetailPageContentProps) {
  const [currentTag, setCurrentTag] = useState(initialTagName);
  const [currentPage, setCurrentPage] = useState(page);
  const siteTitle = useSiteConfigStore(state => state.siteConfig.APP_NAME || "AnHeYu");

  const buildTagPath = useCallback((tagName: string, pageNumber: number) => {
    const encodedTag = encodeURIComponent(tagName);
    if (pageNumber <= 1) {
      return `/tags/${encodedTag}/`;
    }
    return `/tags/${encodedTag}/page/${pageNumber}`;
  }, []);

  const handleTagChange = useCallback(
    (tagName: string) => {
      setCurrentTag(tagName);
      setCurrentPage(1);
      // 直接更新浏览器 URL，不触发 Next.js 路由系统（避免组件重新挂载和动画重播）
      window.history.replaceState(null, "", buildTagPath(tagName, 1));
      // 滚动到顶部
      window.scrollTo({ top: 0 });
    },
    [buildTagPath]
  );

  const handlePageChange = useCallback(
    (nextPage: number) => {
      setCurrentPage(nextPage);
      window.history.replaceState(null, "", buildTagPath(currentTag, nextPage));
    },
    [buildTagPath, currentTag]
  );

  // Context 值，供侧边栏标签云使用
  const contextValue = useMemo(
    () => ({ selectedTag: currentTag, onTagChange: handleTagChange }),
    [currentTag, handleTagChange]
  );

  useEffect(() => {
    document.title = `标签 - ${currentTag} | ${siteTitle}`;
  }, [currentTag, siteTitle]);

  useEffect(() => {
    const handlePopState = () => {
      const parts = window.location.pathname.split("/").filter(Boolean);
      if (parts[0] !== "tags" || !parts[1]) return;
      const nextTag = decodeURIComponent(parts[1]);
      let nextPage = 1;
      if (parts[2] === "page" && parts[3]) {
        const parsed = Number(parts[3]);
        if (!Number.isNaN(parsed) && parsed > 0) {
          nextPage = parsed;
        }
      }
      setCurrentTag(nextTag);
      setCurrentPage(nextPage);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <TagFilterContext.Provider value={contextValue}>
      <div className="content-inner">
        <div className="main-content">
          <TagBar selectedTag={currentTag} onTagChange={handleTagChange} />
          <FilteredArticleList
            filterType="tag"
            filterValue={currentTag}
            page={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
        <Sidebar />
      </div>
    </TagFilterContext.Provider>
  );
}
