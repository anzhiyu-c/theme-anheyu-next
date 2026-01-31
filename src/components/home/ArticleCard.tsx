/*
 * @Description:
 * @Author: 安知鱼
 * @Date: 2026-01-30 16:56:02
 * @LastEditTime: 2026-01-30 18:05:09
 * @LastEditors: 安知鱼
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui";
import { Eye, MessageSquare, Calendar } from "lucide-react";
import { formatDate, formatNumber } from "@/lib/utils";
import type { Article } from "@/types";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/posts/${article.slug}`}>
      <div className="h-full bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        {/* 封面图 */}
        {article.cover && (
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={article.cover}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        )}

        {/* 内容区域 */}
        <div className="p-4">
          {/* 分类 */}
          {article.category && (
            <Badge variant="outline" size="sm" className="mb-2">
              {article.category.name}
            </Badge>
          )}

          {/* 标题 */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
            {article.title}
          </h3>

          {/* 摘要 */}
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{article.excerpt}</p>

          {/* 底部信息 */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(article.published_at)}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {formatNumber(article.views)}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {article.comments_count}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
