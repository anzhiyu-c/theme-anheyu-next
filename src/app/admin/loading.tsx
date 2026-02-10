/**
 * Admin 路由加载状态
 * 返回 null 以避免全局 loading.tsx 的 Suspense fallback 覆盖 admin 布局
 * 初始加载由 #initial-loader (layout.tsx) 和 admin layout 骨架屏处理
 */
export default function AdminLoading() {
  return null;
}
