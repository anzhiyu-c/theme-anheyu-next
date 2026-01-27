"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, Tooltip } from "@heroui/react";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  FolderOpen,
  Tag,
  Users,
  Settings,
  Image,
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import clsx from "clsx";

const menuItems = [
  {
    title: "仪表盘",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "文章管理",
    href: "/admin/articles",
    icon: FileText,
  },
  {
    title: "评论管理",
    href: "/admin/comments",
    icon: MessageSquare,
  },
  {
    title: "分类管理",
    href: "/admin/categories",
    icon: FolderOpen,
  },
  {
    title: "标签管理",
    href: "/admin/tags",
    icon: Tag,
  },
  {
    title: "用户管理",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "文件管理",
    href: "/admin/files",
    icon: Image,
  },
  {
    title: "友链管理",
    href: "/admin/links",
    icon: LinkIcon,
  },
  {
    title: "系统设置",
    href: "/admin/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo 区域 */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        {!isCollapsed && (
          <Link href="/admin" className="text-xl font-bold text-primary">
            AnHeYu
          </Link>
        )}
        <Button
          isIconOnly
          variant="light"
          size="sm"
          onPress={onToggle}
          className={clsx(isCollapsed && "mx-auto")}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* 菜单列表 */}
      <nav className="p-2 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          const menuItem = (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:bg-secondary hover:text-foreground",
                isCollapsed && "justify-center"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.title}</span>
              )}
            </Link>
          );

          if (isCollapsed) {
            return (
              <Tooltip
                key={item.href}
                content={item.title}
                placement="right"
                delay={0}
              >
                {menuItem}
              </Tooltip>
            );
          }

          return menuItem;
        })}
      </nav>
    </aside>
  );
}
