"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@heroui/react";
import { motion } from "motion/react";
import { ArticleCard } from "@/components/frontend/home/ArticleCard";
import type { ArticleSummary } from "@/lib/api/types";

interface PostsListClientProps {
  articles: ArticleSummary[];
  total: number;
  currentPage: number;
  pageSize: number;
}

export function PostsListClient({ articles, total, currentPage, pageSize }: PostsListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/posts?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 页面标题 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold">全部文章</h1>
        <p className="mt-2 text-foreground/60">共 {total} 篇文章</p>
      </motion.div>

      {/* 文章列表 */}
      {articles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {articles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                total={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                showControls
                color="primary"
              />
            </div>
          )}
        </>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <p className="text-foreground/60 text-lg">暂无文章</p>
        </motion.div>
      )}
    </div>
  );
}
