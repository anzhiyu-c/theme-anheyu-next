"use client";

import { motion } from "framer-motion";
import { ArticleCard } from "./ArticleCard";
import type { Article } from "@/types";

interface ArticleListProps {
  articles: Article[];
}

// 模拟文章数据
const mockArticles: Article[] = [
  {
    id: "1",
    title: "Next.js 16 新特性详解",
    slug: "nextjs-16-features",
    content: "",
    excerpt: "探索 Next.js 16 带来的新特性，包括异步路由参数、Cache Components 等。",
    cover: "https://picsum.photos/seed/1/800/450",
    author: { id: "1", email: "", username: "anzhiyu", nickname: "安知鱼", avatar: "", role: "admin", created_at: "", updated_at: "" },
    category: { id: "1", name: "技术", slug: "tech", description: "", cover: "", count: 10 },
    tags: [],
    views: 1234,
    likes: 56,
    comments_count: 12,
    is_published: true,
    is_top: false,
    created_at: "2026-01-20",
    updated_at: "2026-01-20",
    published_at: "2026-01-20",
  },
  {
    id: "2",
    title: "HeroUI 组件库使用指南",
    slug: "heroui-guide",
    content: "",
    excerpt: "学习如何使用 HeroUI 构建现代化的 React 应用界面。",
    cover: "https://picsum.photos/seed/2/800/450",
    author: { id: "1", email: "", username: "anzhiyu", nickname: "安知鱼", avatar: "", role: "admin", created_at: "", updated_at: "" },
    category: { id: "2", name: "教程", slug: "tutorial", description: "", cover: "", count: 8 },
    tags: [],
    views: 876,
    likes: 34,
    comments_count: 8,
    is_published: true,
    is_top: false,
    created_at: "2026-01-18",
    updated_at: "2026-01-18",
    published_at: "2026-01-18",
  },
  {
    id: "3",
    title: "Tailwind CSS v4 迁移指南",
    slug: "tailwind-v4-migration",
    content: "",
    excerpt: "从 Tailwind CSS v3 迁移到 v4 的完整指南，包括配置变化和新特性。",
    cover: "https://picsum.photos/seed/3/800/450",
    author: { id: "1", email: "", username: "anzhiyu", nickname: "安知鱼", avatar: "", role: "admin", created_at: "", updated_at: "" },
    category: { id: "1", name: "技术", slug: "tech", description: "", cover: "", count: 10 },
    tags: [],
    views: 654,
    likes: 28,
    comments_count: 5,
    is_published: true,
    is_top: false,
    created_at: "2026-01-15",
    updated_at: "2026-01-15",
    published_at: "2026-01-15",
  },
];

export function ArticleList({ articles }: ArticleListProps) {
  const displayArticles = articles.length > 0 ? articles : mockArticles;

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">最新文章</h2>
          <p className="text-muted-foreground">探索最新的技术文章和教程</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ArticleCard article={article} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
