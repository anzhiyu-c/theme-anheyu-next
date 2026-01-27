import { getHomeArticles, getArticleStatistics } from "@/lib/api/server";
import { HomeClient } from "./HomeClient";

// 动态渲染
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // 并行获取数据
  const [articles, stats] = await Promise.all([
    getHomeArticles().catch(() => []),
    getArticleStatistics().catch(() => ({
      total_articles: 0,
      total_views: 0,
      total_words: 0,
      total_categories: 0,
      total_tags: 0,
    })),
  ]);

  return <HomeClient articles={articles} statistics={stats} />;
}
