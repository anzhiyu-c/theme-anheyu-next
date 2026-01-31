"use client";

import { Eye } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface RecentArticle {
  id: number | string;
  title: string;
  views: number;
  date: string;
}

interface RecentArticlesProps {
  articles: RecentArticle[];
}

export function RecentArticles({ articles }: RecentArticlesProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border">
        <p className="text-lg font-semibold">最近文章</p>
        <p className="text-small text-muted-foreground">最近发布的 5 篇文章</p>
      </div>
      <div className="divide-y divide-border">
        {articles.map((article) => (
          <div
            key={article.id}
            className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
            <div>
              <p className="font-medium">{article.title}</p>
              <p className="text-xs text-muted-foreground">{article.date}</p>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Eye className="w-4 h-4" />
              {formatNumber(article.views)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
