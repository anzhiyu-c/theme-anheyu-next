"use client";

import { motion } from "framer-motion";
import { Home, ArrowLeft, RotateCcw } from "lucide-react";

/**
 * 404 页面内容组件
 * 设计理念：极简主义 + 优雅动画
 * 注意：使用原生按钮和导航方法，避免 App Router 状态问题
 */
export function NotFoundContent() {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // 基础按钮样式
  const baseButtonClass =
    "inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* 背景装饰 - 极简圆形 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-primary/3 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 text-center px-6 max-w-lg mx-auto"
      >
        {/* 404 数字 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className="text-[10rem] sm:text-[12rem] font-black leading-none tracking-tighter select-none">
            <span className="bg-gradient-to-b from-foreground via-foreground/80 to-foreground/40 bg-clip-text text-transparent">
              404
            </span>
          </h1>
        </motion.div>

        {/* 文案 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-10 space-y-3"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">页面不见了</h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            抱歉，您访问的页面已被移除、重命名，或暂时不可用
          </p>
        </motion.div>

        {/* 操作按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <button
            onClick={handleGoHome}
            className={`${baseButtonClass} bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary min-w-[140px]`}
          >
            <Home className="w-4 h-4" />
            返回首页
          </button>

          <button
            onClick={handleGoBack}
            className={`${baseButtonClass} border border-border bg-transparent text-foreground hover:bg-muted focus:ring-primary min-w-[140px]`}
          >
            <ArrowLeft className="w-4 h-4" />
            返回上页
          </button>

          <button
            onClick={handleRefresh}
            className={`${baseButtonClass} bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground focus:ring-primary px-3`}
            aria-label="刷新页面"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </motion.div>

        {/* 底部提示 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="mt-12 text-xs text-muted-foreground/60"
        >
          如果问题持续存在，请联系网站管理员
        </motion.p>
      </motion.div>
    </div>
  );
}
