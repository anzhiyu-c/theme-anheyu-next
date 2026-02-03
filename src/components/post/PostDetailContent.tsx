/*
 * @Description:
 * @Author: 安知鱼
 * @Date: 2026-02-01 18:48:54
 * @LastEditTime: 2026-02-02 19:31:13
 * @LastEditors: 安知鱼
 */
/**
 * 文章详情内容组件
 * 客户端组件，负责渲染文章详情的完整内容
 */
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { PostHeader } from "./PostHeader";
import { PostContent } from "./PostContent";
import { PostCopyright } from "./PostCopyright";
import { PostPagination } from "./PostPagination";
import { PostSidebar } from "./Sidebar";
import { useSiteConfigStore } from "@/store/siteConfigStore";
import { usePageStore } from "@/store/pageStore";
import { setArticleMetaThemeColor, restoreMetaThemeColor } from "@/utils/themeManager";
import type { Article, RecentArticle } from "@/types/article";
import styles from "./PostDetail.module.css";

interface PostDetailContentProps {
  article: Article;
  recentArticles?: RecentArticle[];
}

export function PostDetailContent({ article, recentArticles = [] }: PostDetailContentProps) {
  const siteConfig = useSiteConfigStore(state => state.siteConfig);
  const setPageTitle = usePageStore(state => state.setPageTitle);
  const clearPageTitle = usePageStore(state => state.clearPageTitle);

  // 设置文章标题到 Header
  useEffect(() => {
    setPageTitle(article.title);
    return () => {
      clearPageTitle();
    };
  }, [article.title, setPageTitle, clearPageTitle]);

  // 保存原始主题色
  const originalPrimaryRef = useRef<string>("");

  // 设置文章主题色（如果有）- 全局设置 --primary 并更新 meta theme-color
  useEffect(() => {
    if (article.primary_color) {
      // 保存原始主题色
      originalPrimaryRef.current = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();

      // 设置全局主题色
      document.documentElement.style.setProperty("--primary", article.primary_color);
      document.documentElement.style.setProperty("--article-primary-color", article.primary_color);

      // 简单判断是否为 HEX 颜色以添加透明度变体
      if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(article.primary_color)) {
        document.documentElement.style.setProperty("--primary-op", `${article.primary_color}23`);
        document.documentElement.style.setProperty("--primary-op-deep", `${article.primary_color}dd`);
        document.documentElement.style.setProperty("--primary-op-light", `${article.primary_color}0d`);
      }

      // 更新浏览器 meta theme-color
      setArticleMetaThemeColor(article.primary_color);
    }

    return () => {
      // 恢复原始主题色
      if (originalPrimaryRef.current) {
        document.documentElement.style.setProperty("--primary", originalPrimaryRef.current);
      } else {
        document.documentElement.style.removeProperty("--primary");
      }
      document.documentElement.style.removeProperty("--article-primary-color");
      document.documentElement.style.removeProperty("--primary-op");
      document.documentElement.style.removeProperty("--primary-op-deep");
      document.documentElement.style.removeProperty("--primary-op-light");

      // 恢复默认 meta theme-color
      restoreMetaThemeColor();
    };
  }, [article.primary_color]);

  const siteName = siteConfig?.APP_NAME || "安知鱼";
  const ownerName = siteConfig?.frontDesk?.siteOwner?.name || "安知鱼";

  return (
    <div className={styles.postDetailContainer}>
      {/* 文章头部 */}
      <PostHeader article={article} />

      {/* 主内容区域 */}
      <div className={styles.layout}>
        <main className={styles.postContentInner}>
          <div className={styles.postDetailContent}>
            {/* 文章内容 */}
            <PostContent content={article.content_html} />

            {/* 版权信息 */}
            <PostCopyright article={article} />

            {/* 上下篇导航 */}
            <PostPagination prevArticle={article.prev_article} nextArticle={article.next_article} />

            {/* 评论区占位 */}
            <div id="post-comment" className={styles.commentSection}>
              {/* TODO: 评论组件 */}
            </div>
          </div>
        </main>

        {/* 文章详情侧边栏 */}
        <PostSidebar article={article} recentArticles={recentArticles} />
      </div>

      {/* 底部栏 */}
      <div className={styles.footerBar}>
        <div className={styles.footerLogo}>{siteName}</div>
        <div className={styles.footerDescription}>来自 {ownerName} 最新设计与科技的文章</div>
        <Link href="/archives" className={styles.footerLink}>
          查看全部
        </Link>
      </div>
    </div>
  );
}

export default PostDetailContent;
