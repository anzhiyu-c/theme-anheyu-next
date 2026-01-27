"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Shuffle, ExternalLink } from "lucide-react";

// 技术栈配置
const techIcons = [
  { name: "Java", emoji: "☕" },
  { name: "Docker", emoji: "🐳" },
  { name: "PS", emoji: "🎨" },
  { name: "Node", emoji: "📗" },
  { name: "Webpack", emoji: "📦" },
  { name: "Pinia", emoji: "🍍" },
  { name: "Python", emoji: "🐍" },
  { name: "Vite", emoji: "⚡" },
  { name: "Flutter", emoji: "🦋" },
  { name: "Vue", emoji: "💚" },
  { name: "React", emoji: "⚛️" },
  { name: "CSS", emoji: "🎨" },
  { name: "JS", emoji: "💛" },
  { name: "HTML", emoji: "🌐" },
  { name: "Git", emoji: "🔀" },
  { name: "Go", emoji: "🐹" },
];

// 分类配置
const categories = [
  { href: "/categories/前端开发/", label: "前端", color: "bg-gradient-to-r from-[#425aef] to-[#5a67d8]" },
  { href: "/categories/大学生涯", label: "大学", color: "bg-gradient-to-r from-[#ff6b6b] to-[#ff8787]" },
  { href: "/categories/生活日常", label: "生活", color: "bg-gradient-to-r from-[#51cf66] to-[#69db7c]" },
];

export function Hero() {
  return (
    <section className="mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* 左侧主卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1"
        >
          <div className="relative bg-gradient-to-br from-[#49b1f5] to-[#38a3a5] rounded-2xl p-6 lg:p-8 overflow-hidden min-h-[280px]">
            {/* 背景装饰 */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 flex flex-col h-full">
              {/* 标语 */}
              <div className="mb-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">生活明朗</h1>
                <h1 className="text-2xl lg:text-3xl font-bold text-white">万物可爱。</h1>
                <p className="text-white/70 text-sm mt-2">ANHEYU.COM</p>
              </div>

              {/* 技术栈图标轮播 */}
              <div className="flex-1 relative overflow-hidden my-4">
                <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#49b1f5] to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#38a3a5] to-transparent z-10" />

                <div className="flex gap-3 animate-scroll">
                  {/* 复制两份用于无缝滚动 */}
                  {[...techIcons, ...techIcons].map((icon, index) => (
                    <div
                      key={`${icon.name}-${index}`}
                      className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm"
                      title={icon.name}
                    >
                      <span className="text-lg">{icon.emoji}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 随便逛逛按钮 */}
              <Link
                href="/random-post"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-white text-sm font-medium transition-colors w-fit backdrop-blur-sm"
              >
                <Shuffle className="w-4 h-4" />
                随便逛逛
              </Link>
            </div>
          </div>

          {/* 分类标签 */}
          <div className="flex gap-2 mt-4">
            {categories.map(category => (
              <Link
                key={category.label}
                href={category.href}
                className={`${category.color} px-6 py-2 rounded-full text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1`}
              >
                {category.label}
                <span className="w-4 h-4 flex items-center justify-center">→</span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* 右侧推荐卡片 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full lg:w-[280px]"
        >
          <Link
            href="https://dev.anheyu.com/"
            target="_blank"
            className="block bg-white dark:bg-[#1e1e24] rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-shadow h-full"
          >
            {/* Hello 文字 */}
            <div className="mb-4">
              <span className="text-4xl font-bold italic text-[#49b1f5]" style={{ fontFamily: "cursive" }}>
                hello
              </span>
            </div>

            {/* 框架信息 */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-400">新品框架</span>
            </div>
            <h3 className="text-lg font-bold text-[#49b1f5] mb-4">Theme-AnHeYu</h3>

            {/* 更多推荐 */}
            <div className="flex items-center gap-1 text-sm text-[#ff6b6b]">
              <ExternalLink className="w-4 h-4" />
              更多推荐
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
