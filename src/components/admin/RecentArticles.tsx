"use client";

import { Card, CardBody, CardHeader, Chip, Avatar } from "@heroui/react";
import { FileText, Eye, MessageCircle } from "lucide-react";
import Link from "next/link";
import { format, isValid, parseISO } from "date-fns";
import { zhCN } from "date-fns/locale";
import type { Article } from "@/types";

interface RecentArticlesProps {
  articles: Article[];
}

// 安全格式化日期
function formatDate(dateValue: string | Date | undefined | null, pattern: string = "MM月dd日"): string {
  if (!dateValue) return "未知";
  
  try {
    const date = typeof dateValue === "string" ? parseISO(dateValue) : dateValue;
    if (!isValid(date)) return "未知";
    return format(date, pattern, { locale: zhCN });
  } catch {
    return "未知";
  }
}

export function RecentArticles({ articles }: RecentArticlesProps) {
  if (!articles || articles.length === 0) {
    return (
      <Card className="bg-card border border-border">
        <CardHeader className="pb-0">
          <h3 className="text-lg font-semibold">最近文章</h3>
        </CardHeader>
        <CardBody className="flex items-center justify-center py-10">
          <div className="text-center text-muted-foreground">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>暂无文章</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="bg-card border border-border">
      <CardHeader className="flex justify-between items-center pb-0">
        <h3 className="text-lg font-semibold">最近文章</h3>
        <Link
          href="/admin/articles"
          className="text-sm text-primary hover:underline"
        >
          查看全部
        </Link>
      </CardHeader>
      <CardBody className="pt-4">
        <div className="space-y-4">
          {articles.map((article) => (
            <div
              key={article.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              {/* 封面或图标 */}
              {article.cover ? (
                <Avatar
                  src={article.cover}
                  className="w-12 h-12 flex-shrink-0"
                  radius="sm"
                />
              ) : (
                <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
              )}

              {/* 内容 */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/admin/articles/${article.id}`}
                  className="text-sm font-medium text-foreground hover:text-primary line-clamp-1"
                >
                  {article.title}
                </Link>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span>{formatDate(article.published_at || article.created_at)}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {article.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {article.comments}
                  </span>
                </div>
              </div>

              {/* 状态 */}
              <Chip
                size="sm"
                variant="flat"
                color={article.status === 1 ? "success" : "warning"}
              >
                {article.status === 1 ? "已发布" : "草稿"}
              </Chip>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
