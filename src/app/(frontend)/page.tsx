import { Hero } from "@/components/features/home/Hero";
import { ArticleList } from "@/components/features/home/ArticleList";
import { Stats } from "@/components/features/home/Stats";
import { getArticles, getBasicStatistics } from "@/lib/api/server";
import type { Article, BasicStatistics } from "@/types";

// 强制动态渲染
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // 并行获取数据，添加错误处理
  let articles: Article[] = [];
  let statistics: BasicStatistics | null = null;

  try {
    const [articlesResponse, statsResponse] = await Promise.all([
      getArticles({ page: 1, page_size: 6 }),
      getBasicStatistics(),
    ]);

    articles = articlesResponse?.list || [];
    statistics = statsResponse;
  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
  }

  return (
    <>
      {/* Hero 区域 */}
      <Hero />

      {/* 统计数据 */}
      <Stats statistics={statistics} />

      {/* 最新文章 */}
      <ArticleList articles={articles} />
    </>
  );
}
