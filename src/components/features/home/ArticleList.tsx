"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ArticleCard } from "./ArticleCard";
import type { Article } from "@/types";

interface ArticleListProps {
  articles: Article[];
  title?: string;
  showMore?: boolean;
}

export function ArticleList({ articles, title = "最新文章", showMore = true }: ArticleListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // 标题动画
  const titleY = useTransform(scrollYProgress, [0, 0.15], [60, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.15, 0.8, 0.95], [0, 1, 1, 0]);

  const smoothTitleY = useSpring(titleY, { stiffness: 100, damping: 30 });

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <section ref={containerRef} className="relative py-16 sm:py-24 overflow-hidden">
      {/* 环境背景 */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl opacity-30"
          style={{ background: "var(--anzhiyu-theme-op)" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
          style={{ background: "var(--anzhiyu-theme-op)" }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section 标题 */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 sm:mb-16">
          <div>
            {/* 徽章 */}
            <motion.p
              className="text-sm font-medium tracking-[0.2em] uppercase mb-4"
              style={{
                y: smoothTitleY,
                opacity: titleOpacity,
                color: "var(--anzhiyu-theme)",
              }}
            >
              Articles
            </motion.p>

            {/* 标题 */}
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-2"
              style={{
                y: smoothTitleY,
                opacity: titleOpacity,
                color: "var(--anzhiyu-fontcolor)",
              }}
            >
              {title.split("").map((char, i) => (
                <span
                  key={i}
                  className={i === title.length - 2 ? "bg-clip-text text-transparent" : ""}
                  style={
                    i === title.length - 2
                      ? { backgroundImage: "linear-gradient(135deg, var(--anzhiyu-theme), var(--anzhiyu-blue))" }
                      : undefined
                  }
                >
                  {char}
                </span>
              ))}
            </motion.h2>

            {/* 描述 */}
            <motion.p
              className="text-base max-w-lg"
              style={{
                y: smoothTitleY,
                opacity: titleOpacity,
                color: "var(--anzhiyu-secondtext)",
              }}
            >
              探索最新的技术文章和分享
            </motion.p>
          </div>

          {/* 查看全部按钮 */}
          {showMore && (
            <motion.div style={{ opacity: titleOpacity }}>
              <Link
                href="/posts"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all rounded-full group hover:scale-105"
                style={{
                  color: "var(--anzhiyu-theme)",
                  background: "var(--anzhiyu-theme-op)",
                }}
              >
                查看全部
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          )}
        </div>

        {/* 文章网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {articles.map((article, index) => (
            <ArticleCard key={article.id} article={article} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
