/**
 * 文章上下篇导航组件
 * 参考 anheyu-pro 实现
 */
"use client";

import Link from "next/link";
import type { ArticleLink } from "@/types/article";
import styles from "./PostPagination.module.css";

interface PostPaginationProps {
  prevArticle?: ArticleLink | null;
  nextArticle?: ArticleLink | null;
}

export function PostPagination({ prevArticle, nextArticle }: PostPaginationProps) {
  if (!prevArticle && !nextArticle) {
    return null;
  }

  return (
    <nav className={styles.paginationPost}>
      {/* 上一篇 */}
      {prevArticle && (
        <Link
          href={`/posts/${prevArticle.abbrlink || prevArticle.id}`}
          className={`${styles.paginationItem} ${styles.left}`}
        >
          <div className={styles.paginationInfo}>
            <div className={styles.label}>上一篇</div>
            <div className={styles.infoTitle}>{prevArticle.title}</div>
          </div>
        </Link>
      )}

      {/* 下一篇 */}
      {nextArticle && (
        <Link
          href={`/posts/${nextArticle.abbrlink || nextArticle.id}`}
          className={`${styles.paginationItem} ${styles.right}`}
        >
          <div className={styles.paginationInfo}>
            <div className={styles.label}>下一篇</div>
            <div className={styles.infoTitle}>{nextArticle.title}</div>
          </div>
        </Link>
      )}
    </nav>
  );
}

export default PostPagination;
