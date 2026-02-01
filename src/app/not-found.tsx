/*
 * @Description: 404 页面
 * @Author: 安知鱼
 * @Date: 2026-02-01
 */

import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-lg w-full text-center">
        {/* 404 数字 */}
        <div className="mb-8">
          <h1 className="text-[120px] sm:text-[180px] font-bold leading-none gradient-text-brand">404</h1>
        </div>

        {/* 错误信息 */}
        <h2 className="text-2xl font-bold text-foreground mb-3">页面不存在</h2>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          抱歉，您访问的页面可能已被移除、名称已更改或暂时不可用。
        </p>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium transition-all hover:opacity-90 hover:scale-[1.02]"
          >
            <Home className="w-4 h-4" />
            返回首页
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-full font-medium transition-all hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4" />
            返回上页
          </button>
        </div>

        {/* 搜索建议 */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">或者尝试搜索您想要的内容</p>
          <Link href="/search" className="inline-flex items-center gap-2 text-primary hover:underline">
            <Search className="w-4 h-4" />
            前往搜索
          </Link>
        </div>
      </div>
    </div>
  );
}
