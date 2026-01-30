"use client";

import { useRef, useState, MouseEvent } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { FileText, FolderOpen, Tag, MessageCircle, Eye, Heart } from "lucide-react";
import type { BasicStatistics } from "@/types";

interface StatsProps {
  statistics: BasicStatistics | null;
}

const statsConfig = [
  { key: "article_count", label: "文章", icon: FileText, glowColor: "59, 130, 246" },
  { key: "category_count", label: "分类", icon: FolderOpen, glowColor: "16, 185, 129" },
  { key: "tag_count", label: "标签", icon: Tag, glowColor: "139, 92, 246" },
  { key: "comment_count", label: "评论", icon: MessageCircle, glowColor: "249, 115, 22" },
  { key: "total_views", label: "浏览", icon: Eye, glowColor: "236, 72, 153" },
  { key: "total_likes", label: "点赞", icon: Heart, glowColor: "239, 68, 68" },
];

// 带鼠标跟随高光的统计卡片
function StatCard({ stat, value, index }: { stat: (typeof statsConfig)[0]; value: number; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const Icon = stat.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: index * 0.08,
      }}
      whileHover={{ scale: 1.02 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative p-6 overflow-hidden text-center transition-all duration-300 group rounded-lg cursor-default"
      style={{
        background: "var(--anzhiyu-card-bg)",
        border: "1px solid var(--anzhiyu-border-color)",
      }}
    >
      {/* 鼠标跟随高光效果 */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-lg"
        animate={{ opacity: isHovering ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(${stat.glowColor}, 0.15), transparent 40%)`,
        }}
      />

      {/* 边框高光效果 */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-lg"
        animate={{ opacity: isHovering ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `radial-gradient(250px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(${stat.glowColor}, 0.4), transparent 40%)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />

      {/* 内容 */}
      <div className="relative z-10">
        <Icon
          className="w-6 h-6 mx-auto mb-3 transition-colors duration-300"
          style={{
            color: isHovering ? `rgb(${stat.glowColor})` : "var(--anzhiyu-gray)",
          }}
        />
        <div className="text-2xl font-bold mb-1" style={{ color: "var(--anzhiyu-fontcolor)" }}>
          {value.toLocaleString()}
        </div>
        <div className="text-sm" style={{ color: "var(--anzhiyu-secondtext)" }}>
          {stat.label}
        </div>
      </div>
    </motion.div>
  );
}

export function Stats({ statistics }: StatsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // 背景视差
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  // 标题动画
  const titleY = useTransform(scrollYProgress, [0.05, 0.2], [60, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0.05, 0.2, 0.75, 0.9], [0, 1, 1, 0]);

  const smoothTitleY = useSpring(titleY, { stiffness: 100, damping: 30 });

  if (!statistics) return null;

  return (
    <section ref={containerRef} className="relative py-16 sm:py-24 overflow-hidden">
      {/* 环境背景 */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity: backgroundOpacity }}>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px]"
          style={{
            background: "radial-gradient(ellipse, var(--anzhiyu-theme-op) 0%, transparent 60%)",
          }}
        />
      </motion.div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section 标题 */}
        <div className="text-center mb-12 sm:mb-16">
          {/* 徽章 */}
          <motion.p
            className="text-sm font-medium tracking-[0.2em] uppercase mb-4"
            style={{
              y: smoothTitleY,
              opacity: titleOpacity,
              color: "var(--anzhiyu-theme)",
            }}
          >
            Statistics
          </motion.p>

          {/* 标题 */}
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4"
            style={{
              y: smoothTitleY,
              opacity: titleOpacity,
              color: "var(--anzhiyu-fontcolor)",
            }}
          >
            博客
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, var(--anzhiyu-theme), var(--anzhiyu-blue))",
              }}
            >
              统计
            </span>
          </motion.h2>

          {/* 描述 */}
          <motion.p
            className="max-w-xl mx-auto text-base"
            style={{
              y: smoothTitleY,
              opacity: titleOpacity,
              color: "var(--anzhiyu-secondtext)",
            }}
          >
            记录每一次的成长与分享
          </motion.p>
        </div>

        {/* 统计卡片网格 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {statsConfig.map((stat, index) => {
            const value = statistics[stat.key as keyof BasicStatistics] || 0;
            return <StatCard key={stat.key} stat={stat} value={value} index={index} />;
          })}
        </div>
      </div>
    </section>
  );
}
