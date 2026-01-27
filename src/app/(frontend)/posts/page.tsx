import type { Metadata } from "next";
import { getArticles } from "@/lib/api/server";
import { PostsListClient } from "./PostsListClient";

export const metadata: Metadata = {
  title: "全部文章",
  description: "浏览所有文章 - AnHeYu Blog",
};

// 动态渲染
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    page?: string;
    category?: string;
    tag?: string;
  }>;
}

export default async function PostsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const categoryId = params.category;
  const tagId = params.tag;

  const articlesData = await getArticles({
    page,
    page_size: 12,
    category_id: categoryId,
    tag_id: tagId,
  }).catch(() => ({
    list: [],
    total: 0,
    page: 1,
    pageSize: 12,
  }));

  return (
    <PostsListClient
      articles={articlesData.list}
      total={articlesData.total}
      currentPage={page}
      pageSize={articlesData.pageSize}
    />
  );
}
