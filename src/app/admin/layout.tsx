"use client";

import { IconButton } from "@/components/ui";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useShallow } from "zustand/shallow";
import { AdminSidebar } from "@/components/admin";
import { Logo } from "@/components/common";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { _hasHydrated } = useAuthStore(useShallow(state => ({ _hasHydrated: state._hasHydrated })));

  // SSR 水合处理
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* 移动端顶部导航 */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-card border-b border-border">
        <Logo href="/admin" />
        <IconButton size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </IconButton>
      </div>

      <div className="flex">
        {/* 侧边栏 */}
        <aside
          className={cn(
            "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:transform-none",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <AdminSidebar onClose={() => setSidebarOpen(false)} />
        </aside>

        {/* 遮罩层 */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* 主内容区 */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
