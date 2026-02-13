import type { Metadata } from "next";
import { ArticleStatisticsContent } from "./_components/ArticleStatisticsContent";

export const metadata: Metadata = {
  title: "文章统计",
  description: "博客文章数据统计 — 文章总数、总字数、浏览量、分类分布、发布趋势、热门文章、标签云",
  openGraph: {
    title: "文章统计",
    description: "博客文章数据统计概览",
    type: "website",
  },
};

export default function ArticleStatisticsPage() {
  return <ArticleStatisticsContent />;
}
