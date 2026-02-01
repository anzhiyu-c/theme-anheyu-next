"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui";
import { LogOut, Sun, Moon, ChevronDown, Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useShallow } from "zustand/shallow";
import { useTheme } from "@/hooks";
import { Logo } from "@/components/common";
import { cn } from "@/lib/utils";
import { adminMenuConfig, type AdminMenuGroup, type AdminMenuItem } from "@/config/admin-menu";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  // 展开的菜单组
  const [expandedGroups, setExpandedGroups] = useState<string[]>(() => {
    // 默认展开当前路径所在的组
    const currentGroup = adminMenuConfig.find(group =>
      group.items.some(item => {
        if (!item.href) return false;
        return pathname.startsWith(item.href);
      })
    );
    return currentGroup ? [currentGroup.id] : ["overview"];
  });

  const toggleGroup = useCallback((groupId: string) => {
    setExpandedGroups(prev => (prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]));
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const isItemActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="flex flex-col h-full bg-linear-to-b from-card to-card/95">
      {/* Logo */}
      <div className="hidden lg:flex items-center h-16 px-6 border-b border-border/50">
        <Logo href="/admin" className="text-xl" />
        <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">Admin</span>
      </div>

      {/* 用户信息 */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-linear-to-r from-primary/5 to-primary/10 border border-primary/10">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center text-white font-semibold shadow-lg shadow-primary/20">
              {user?.nickname?.[0] || user?.username?.[0] || "U"}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green rounded-full border-2 border-card" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate text-sm">{user?.nickname || user?.username || "用户"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || "管理员"}</p>
          </div>
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2 scrollbar-thin">
        {adminMenuConfig.map(group => (
          <MenuGroup
            key={group.id}
            group={group}
            isExpanded={expandedGroups.includes(group.id)}
            onToggle={() => toggleGroup(group.id)}
            isItemActive={isItemActive}
            onItemClick={onClose}
          />
        ))}
      </nav>

      {/* 底部操作 */}
      <div className="p-3 border-t border-border/50 space-y-1.5">
        {mounted && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2.5 h-10 px-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all"
            onClick={toggleTheme}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="text-sm">{isDark ? "浅色模式" : "深色模式"}</span>
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2.5 h-10 px-3 text-red hover:text-red hover:bg-red/10 rounded-lg transition-all"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">退出登录</span>
        </Button>
      </div>
    </div>
  );
}

interface MenuGroupProps {
  group: AdminMenuGroup;
  isExpanded: boolean;
  onToggle: () => void;
  isItemActive: (href?: string) => boolean;
  onItemClick?: () => void;
}

function MenuGroup({ group, isExpanded, onToggle, isItemActive, onItemClick }: MenuGroupProps) {
  const hasActiveItem = group.items.some(item => isItemActive(item.href));
  const GroupIcon = group.icon;

  return (
    <div className="space-y-0.5">
      {/* 组标题 */}
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
          hasActiveItem ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
      >
        <GroupIcon className="w-4 h-4 shrink-0" />
        <span className="flex-1 text-left">{group.label}</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isExpanded ? "rotate-180" : "")} />
      </button>

      {/* 子菜单项 */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pl-3 space-y-0.5 pt-1">
              {group.items.map(item => (
                <MenuItem key={item.id} item={item} isActive={isItemActive(item.href)} onClick={onItemClick} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface MenuItemProps {
  item: AdminMenuItem;
  isActive: boolean;
  onClick?: () => void;
}

function MenuItem({ item, isActive, onClick }: MenuItemProps) {
  const ItemIcon = item.icon;

  return (
    <Link
      href={item.href || "#"}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 relative",
        isActive
          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      )}
    >
      <ItemIcon className={cn("w-4 h-4 shrink-0", isActive ? "" : "group-hover:scale-110 transition-transform")} />
      <span className="flex-1">{item.label}</span>

      {/* PRO 标识 */}
      {item.isProFeature && (
        <span
          className={cn(
            "flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold",
            isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-yellow/10 text-yellow"
          )}
        >
          <Sparkles className="w-2.5 h-2.5" />
          PRO
        </span>
      )}

      {/* Badge */}
      {item.badge && (
        <span
          className={cn(
            "px-1.5 py-0.5 rounded text-[10px] font-semibold",
            isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary"
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}
