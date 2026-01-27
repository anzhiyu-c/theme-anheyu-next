"use client";

import { useRef, useState, MouseEvent } from "react";
import { motion } from "framer-motion";
import { Chip, Image } from "@heroui/react";
import Link from "next/link";
import { Calendar, Eye, MessageCircle, Heart } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { zhCN } from "date-fns/locale";
import type { Article } from "@/types";

interface ArticleCardProps {
  article: Article;
  index?: number;
}

// 安全格式化日期
function formatDate(dateValue: string | Date | undefined | null): string {
  if (!dateValue) return "未知日期";

  try {
    // 如果是字符串，尝试解析
    const date = typeof dateValue === "string" ? parseISO(dateValue) : dateValue;

    if (!isValid(date)) {
      return "未知日期";
    }

    return format(date, "yyyy年MM月dd日", { locale: zhCN });
  } catch {
    return "未知日期";
  }
}

export function ArticleCard({ article, index = 0 }: ArticleCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: index * 0.1,
      }}
      whileHover={{ scale: 1.02 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative h-full group"
    >
      <Link
        href={`/posts/${article.slug}`}
        className="block h-full relative overflow-hidden rounded-2xl transition-all duration-300"
        style={{
          background: "var(--anzhiyu-card-bg)",
          border: "1px solid var(--anzhiyu-border-color)",
        }}
      >
        {/* 鼠标跟随高光效果 */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-2xl z-10"
          animate={{ opacity: isHovering ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(var(--anzhiyu-theme-rgb, 22, 59, 242), 0.1), transparent 40%)`,
          }}
        />

        {/* 边框高光效果 */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-2xl z-10"
          animate={{ opacity: isHovering ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, var(--anzhiyu-theme), transparent 40%)`,
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
            padding: "1px",
          }}
        />

        {/* 封面图 */}
        {article.cover && (
          <div className="relative overflow-hidden">
            <Image
              removeWrapper
              alt={article.title}
              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
              src={article.cover}
            />
            {/* 渐变遮罩 */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: "linear-gradient(to top, var(--anzhiyu-card-bg) 0%, transparent 50%)",
              }}
            />
            {/* 置顶标签 */}
            {article.is_top && (
              <div
                className="absolute top-3 left-3 px-3 py-1 text-xs font-medium rounded-full text-white"
                style={{ background: "var(--anzhiyu-theme)" }}
              >
                置顶
              </div>
            )}
          </div>
        )}

        <div className="p-5">
          {/* 分类和标签 */}
          <div className="flex flex-wrap gap-2 mb-3">
            {article.category && (
              <span
                className="px-2.5 py-1 text-xs font-medium rounded-full"
                style={{
                  background: "var(--anzhiyu-theme-op)",
                  color: "var(--anzhiyu-theme)",
                }}
              >
                {article.category.name}
              </span>
            )}
            {article.tags?.slice(0, 2).map(tag => (
              <span
                key={tag.id}
                className="px-2.5 py-1 text-xs rounded-full"
                style={{
                  border: "1px solid var(--anzhiyu-border-color)",
                  color: "var(--anzhiyu-secondtext)",
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>

          {/* 标题 */}
          <h3
            className="text-lg font-semibold line-clamp-2 transition-colors duration-300 mb-2"
            style={{ color: "var(--anzhiyu-fontcolor)" }}
          >
            {article.title}
          </h3>

          {/* 摘要 */}
          <p className="text-sm line-clamp-2 leading-relaxed" style={{ color: "var(--anzhiyu-secondtext)" }}>
            {article.summary}
          </p>

          {/* 底部信息 */}
          <div
            className="flex items-center justify-between mt-4 pt-4 text-xs"
            style={{
              borderTop: "1px solid var(--anzhiyu-border-color)",
              color: "var(--anzhiyu-gray)",
            }}
          >
            {/* 日期 */}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(article.published_at || article.created_at)}</span>
            </div>

            {/* 统计数据 */}
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {article.views}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" />
                {article.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" />
                {article.comments}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
