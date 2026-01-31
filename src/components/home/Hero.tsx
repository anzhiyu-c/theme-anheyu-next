/*
 * @Description:
 * @Author: 安知鱼
 * @Date: 2026-01-30 16:55:49
 * @LastEditTime: 2026-01-30 17:01:26
 * @LastEditors: 安知鱼
 */
"use client";

import { Button } from "@/components/ui";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          {/* 标签 */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>现代化博客主题</span>
          </div>

          {/* 标题 */}
          <h1 className="text-hero mb-6">
            <span className="gradient-text">AnHeYu</span>
            <br />
            <span className="text-foreground/80">博客主题</span>
          </h1>

          {/* 描述 */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            基于 Next.js 和 Tailwind CSS 构建的现代化博客主题， 支持深色模式、响应式设计、SEO 优化等特性。
          </p>

          {/* 按钮组 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/archives">
              <Button size="lg">
                浏览文章
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg">
                了解更多
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
