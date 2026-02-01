/*
 * @Description: 全局加载状态
 * @Author: 安知鱼
 * @Date: 2026-02-01
 */

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* 加载动画 */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
        {/* 加载文字 */}
        <p className="text-muted-foreground text-sm">加载中...</p>
      </div>
    </div>
  );
}
