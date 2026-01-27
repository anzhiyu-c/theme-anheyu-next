import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticle } from "@/lib/api/server";
import { PostDetailClient } from "./PostDetailClient";

// 动态渲染
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

// 生成 SEO 元数据
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const article = await getArticle(slug);

    return {
      title: article.title,
      description: article.content_md?.slice(0, 160) || `${article.title} - AnHeYu Blog`,
      openGraph: {
        title: article.title,
        description: article.content_md?.slice(0, 160),
        type: "article",
        publishedTime: article.published_at || article.created_at,
        modifiedTime: article.updated_at,
        authors: article.owner?.nickname || article.owner?.username,
        images: article.cover_url ? [article.cover_url] : [],
        tags: article.post_tags?.map(tag => tag.name),
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: article.content_md?.slice(0, 160),
        images: article.cover_url ? [article.cover_url] : [],
      },
    };
  } catch {
    return {
      title: "文章未找到",
    };
  }
}

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params;

  const article = await getArticle(slug).catch(() => null);

  if (!article) {
    notFound();
  }

  return <PostDetailClient article={article} />;
}
