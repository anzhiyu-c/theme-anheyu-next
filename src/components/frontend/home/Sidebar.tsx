"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { FileText, Calendar, Type, CloudSun, Navigation } from "lucide-react";
import type { ArticleStatistics } from "@/lib/api/types";

// 社交链接配置
const socialLinks = [
  {
    href: "https://space.bilibili.com/372204786",
    label: "BiliBili",
    icon: () => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.124.929.373.267.249.4.551.4.907 0 .355-.133.657-.4.906L17.813 4.653zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773H5.333zm4 5.867c-.355 0-.658-.124-.907-.373a1.233 1.233 0 0 1-.373-.907v-.533a1.233 1.233 0 0 1 .373-.907c.249-.249.552-.373.907-.373h5.333c.356 0 .658.124.907.373.249.249.373.552.373.907v.533c0 .355-.124.658-.373.907-.249.249-.551.373-.907.373H9.333z" />
      </svg>
    ),
  },
  {
    href: "https://github.com/anzhiyu-c",
    label: "Github",
    icon: () => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
];

interface SidebarProps {
  statistics?: ArticleStatistics;
}

export function Sidebar({ statistics }: SidebarProps) {
  // 计算建站天数
  const startDate = new Date("2020-01-01");
  const today = new Date();
  const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  // 获取当前时间
  const now = new Date();
  const timeString = now.toLocaleTimeString("zh-CN", { hour12: false });
  const dateString = now.toLocaleDateString("zh-CN", { month: "short", day: "numeric", weekday: "short" });

  return (
    <aside className="space-y-4">
      {/* 用户信息卡片 */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-[#1e1e24] rounded-2xl overflow-hidden card-shadow"
      >
        {/* 欢迎语 */}
        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
          欢迎再次回来，anzhiyu
        </div>

        {/* 头像和信息 */}
        <div className="p-4">
          {/* 头像 */}
          <div className="relative w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#49b1f5] to-[#38a3a5] flex items-center justify-center">
            <span className="text-white text-2xl font-bold">安</span>
          </div>

          {/* 介绍文字 */}
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mb-2 line-clamp-2">
            这有关于产品、设计、开发相关的问题和看法，还有文章翻译和分享。
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mb-4">
            相信你可以在这里找到对你有用的知识和教程。
          </p>

          {/* 用户名和签名 */}
          <Link href="/about" className="block text-center group">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-[#49b1f5] transition-colors">
              安知鱼
            </h3>
            <p className="text-sm text-gray-400 dark:text-gray-500">生活明朗，万物可爱</p>
          </Link>

          {/* 社交链接 */}
          <div className="flex justify-center gap-3 mt-4">
            {socialLinks.map(link => (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-[#49b1f5] hover:text-white transition-colors"
                title={link.label}
              >
                <link.icon />
              </Link>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 公众号卡片 */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-br from-[#07c160] to-[#10b981] rounded-2xl p-4 card-shadow text-white"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 bg-white/20 rounded text-xs">公众号</span>
          <span className="text-xs opacity-80">扫码</span>
        </div>
        <p className="text-sm opacity-90">扫人一步获取最新文章 →</p>
      </motion.div>

      {/* 天气/时间卡片 */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white dark:bg-[#1e1e24] rounded-2xl p-4 card-shadow"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{dateString}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <CloudSun className="w-4 h-4" />
            <span>晴 6°C</span>
          </div>
        </div>
        <div className="text-3xl font-mono font-bold text-gray-800 dark:text-white text-center mt-3">{timeString}</div>
        <div className="flex justify-around text-xs text-gray-400 dark:text-gray-500 mt-3">
          <span className="flex items-center gap-1">
            <Navigation className="w-3 h-3" />
            北风
          </span>
          <span>未知</span>
          <span>PM</span>
        </div>
      </motion.div>

      {/* 标签区域 */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white dark:bg-[#1e1e24] rounded-2xl p-4 card-shadow"
      >
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">暂无标签</h4>

        <div className="border-t border-gray-100 dark:border-gray-800 my-3" />

        {/* 归档链接 */}
        <Link
          href="/archives/2026/1/"
          className="flex items-center justify-between text-sm hover:text-[#49b1f5] transition-colors"
        >
          <span className="text-gray-600 dark:text-gray-400">一月 2026</span>
          <span className="text-gray-400 dark:text-gray-500">{statistics?.total_articles || 9}篇</span>
        </Link>

        <div className="border-t border-gray-100 dark:border-gray-800 my-3" />

        {/* 网站统计 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <FileText className="w-4 h-4" />
              文章总数 :
            </span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{statistics?.total_articles || 9}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              建站天数 :
            </span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{daysSinceStart} 天</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Type className="w-4 h-4" />
              全站字数 :
            </span>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {statistics?.total_words ? (statistics.total_words / 1000).toFixed(1) + "k" : "13.3k"}
            </span>
          </div>
        </div>
      </motion.div>
    </aside>
  );
}
