"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardBody, Chip, Avatar, Divider, Progress } from "@heroui/react";
import { motion } from "motion/react";
import { Calendar, Eye, Clock, Tag, Folder, ChevronLeft, ChevronRight, Share2, ArrowUp } from "lucide-react";
import { formatDate, formatNumber } from "@/lib/utils";
import type { Article } from "@/lib/api/types";

interface PostDetailClientProps {
  article: Article;
}

export function PostDetailClient({ article }: PostDetailClientProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // 监听滚动进度
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
      setShowBackToTop(scrollTop > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* 阅读进度条 */}
      <Progress
        aria-label="阅读进度"
        value={readingProgress}
        className="fixed top-16 left-0 right-0 z-50 h-1"
        color="primary"
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 文章头部 */}
        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          {/* 分类标签 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {article.post_categories?.map(category => (
              <Chip
                key={category.id}
                as={Link}
                href={`/posts?category=${category.id}`}
                variant="flat"
                color="primary"
                startContent={<Folder className="w-3 h-3" />}
              >
                {category.name}
              </Chip>
            ))}
          </div>

          {/* 标题 */}
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{article.title}</h1>

          {/* 元信息 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/60">
            {/* 作者 */}
            {article.owner && (
              <div className="flex items-center gap-2">
                <Avatar src={article.owner.avatar} name={article.owner.nickname || article.owner.username} size="sm" />
                <span>{article.owner.nickname || article.owner.username}</span>
              </div>
            )}

            {/* 发布日期 */}
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(article.published_at || article.created_at, "full")}
            </span>

            {/* 浏览量 */}
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {formatNumber(article.view_count)} 次浏览
            </span>

            {/* 阅读时间 */}
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {article.reading_time} 分钟阅读
            </span>
          </div>
        </motion.header>

        {/* 封面图 */}
        {article.cover_url && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-video rounded-xl overflow-hidden mb-8"
          >
            <Image src={article.cover_url} alt={article.title} fill className="object-cover" priority />
          </motion.div>
        )}

        {/* 文章内容 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content_html || "" }}
        />

        <Divider className="my-8" />

        {/* 标签 */}
        {article.post_tags && article.post_tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h3 className="text-sm font-medium text-foreground/60 mb-3 flex items-center gap-1">
              <Tag className="w-4 h-4" />
              文章标签
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.post_tags.map(tag => (
                <Chip key={tag.id} as={Link} href={`/posts?tag=${tag.id}`} variant="bordered" size="sm">
                  #{tag.name}
                </Chip>
              ))}
            </div>
          </motion.div>
        )}

        {/* 版权信息 */}
        {article.copyright && !article.is_reprint && (
          <Card className="mb-8 bg-primary/5">
            <CardBody className="text-sm text-foreground/60">
              <p className="font-medium text-foreground mb-2">版权声明</p>
              <p>本文为原创文章，转载请注明出处。 如需商业用途，请联系作者获得授权。</p>
            </CardBody>
          </Card>
        )}

        {/* 分享按钮 */}
        <div className="flex items-center justify-center gap-4 py-8">
          <Chip
            variant="flat"
            startContent={<Share2 className="w-4 h-4" />}
            className="cursor-pointer"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: article.title,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
          >
            分享文章
          </Chip>
        </div>

        {/* 上一篇/下一篇导航 - 占位 */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <Card className="opacity-50">
            <CardBody className="flex flex-row items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">上一篇</span>
            </CardBody>
          </Card>
          <Card className="opacity-50">
            <CardBody className="flex flex-row items-center justify-end gap-2">
              <span className="text-sm">下一篇</span>
              <ChevronRight className="w-4 h-4" />
            </CardBody>
          </Card>
        </div>
      </article>

      {/* 返回顶部按钮 */}
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
          aria-label="返回顶部"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </>
  );
}
