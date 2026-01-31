"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui";
import { LayoutDashboard, FileText, MessageSquare, Settings, LogOut, Sun, Moon } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useShallow } from "zustand/shallow";
import { useTheme } from "@/hooks";
import { Logo } from "@/components/common";
import { cn } from "@/lib/utils";
import { navConfig } from "@/config";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Settings,
};

interface AdminSidebarProps {
  onClose?: () => void;
}

export function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { isDark, toggleTheme, mounted } = useTheme();
  const { user, logout } = useAuthStore(
    useShallow(state => ({
      user: state.user,
      logout: state.logout,
    }))
  );

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="hidden lg:flex items-center h-16 px-6 border-b border-border">
        <Logo href="/admin" className="text-xl" />
        <span className="ml-2 text-sm text-muted-foreground">Admin</span>
      </div>

      {/* 用户信息 */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
            {user?.nickname?.[0] || user?.username?.[0] || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user?.nickname || user?.username || "用户"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
          </div>
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 p-4 space-y-1">
        {navConfig.adminNav.map(item => {
          const isActive = pathname === item.href;
          const Icon = iconMap[item.icon];
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {Icon && <Icon className="w-5 h-5" />}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 底部操作 */}
      <div className="p-4 border-t border-border space-y-2">
        {mounted && (
          <Button variant="ghost" className="w-full justify-start gap-3" onClick={toggleTheme}>
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {isDark ? "浅色模式" : "深色模式"}
          </Button>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red hover:text-red hover:bg-red/10"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          退出登录
        </Button>
      </div>
    </div>
  );
}
