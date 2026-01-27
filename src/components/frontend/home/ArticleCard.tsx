"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { formatDate } from "@/lib/utils";
import type { ArticleSummary } from "@/lib/api/types";

interface ArticleCardProps {
  article: ArticleSummary;
  index?: number;
  isLatest?: boolean;
}

export function ArticleCard({ article, index = 0, isLatest = false }: ArticleCardProps) {
  const articleUrl = article.abbrlink ? `/posts/${article.abbrlink}` : `/posts/${article.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link href={articleUrl}>
        <div className="group bg-white dark:bg-[#1e1e24] rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 article-card">
          {/* 封面图区域 */}
          <div className="relative aspect-[16/10] bg-[#49b1f5] overflow-hidden">
            {article.cover_url ? (
              <Image
                src={article.cover_url}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              // 默认封面：显示 logo 图标
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 relative">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-white/80">
                    <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.3" />
                    <path
                      d="M50 20C33.4 20 20 33.4 20 50s13.4 30 30 30 30-13.4 30-30S66.6 20 50 20zm0 55c-13.8 0-25-11.2-25-25s11.2-25 25-25 25 11.2 25 25-11.2 25-25 25z"
                      fill="currentColor"
                    />
                    <circle cx="40" cy="45" r="5" fill="currentColor" />
                    <circle cx="60" cy="45" r="5" fill="currentColor" />
                    <path d="M65 60c0 8.3-6.7 15-15 15s-15-6.7-15-15h30z" fill="currentColor" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* 文章信息区域 */}
          <div className="p-4">
            {/* 标签 */}
            <div className="mb-2">
              {isLatest ? (
                <span className="inline-block px-2 py-0.5 text-xs font-medium text-white bg-gradient-to-r from-[#ff6b6b] to-[#ff8787] rounded">
                  最新
                </span>
              ) : (
                <span className="inline-block px-2 py-0.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded">
                  未读
                </span>
              )}
            </div>

            {/* 标题 */}
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:text-[#49b1f5] transition-colors">
              {article.title}
            </h3>

            {/* 日期 */}
            <div className="mt-3 text-sm text-gray-400 dark:text-gray-500">
              {formatDate(article.published_at || article.created_at)}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
