import { getArticles } from "@/lib/api/server";
import { NotFoundContent } from "@/components/frontend/error/NotFoundContent";

export default async function NotFound() {
  // 服务端获取推荐文章，添加错误处理
  let articles: any[] = [];
  try {
    const articlesData = await getArticles({ page: 1, page_size: 6 });
    articles = articlesData?.list || [];
  } catch (error) {
    // API 调用失败时使用空数组，不影响 404 页面显示
    console.error("Failed to fetch articles for 404 page:", error);
  }

  return <NotFoundContent articles={articles} />;
}
