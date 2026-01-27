"use client";

import { useTheme } from "next-themes";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Badge,
} from "@heroui/react";
import {
  Moon,
  Sun,
  Monitor,
  Bell,
  Home,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";

interface AdminHeaderProps {
  sidebarCollapsed: boolean;
}

export function AdminHeader({ sidebarCollapsed }: AdminHeaderProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const themeIcon = () => {
    if (!mounted) return <Monitor className="w-5 h-5" />;
    if (theme === "dark") return <Moon className="w-5 h-5" />;
    if (theme === "light") return <Sun className="w-5 h-5" />;
    return <Monitor className="w-5 h-5" />;
  };

  return (
    <Navbar
      className="bg-card/80 backdrop-blur-md border-b border-border"
      style={{
        marginLeft: sidebarCollapsed ? "4rem" : "16rem",
        width: sidebarCollapsed ? "calc(100% - 4rem)" : "calc(100% - 16rem)",
        transition: "all 0.3s",
      }}
      maxWidth="full"
      height="4rem"
    >
      <NavbarContent justify="start">
        <NavbarItem>
          <h1 className="text-lg font-semibold text-foreground">管理后台</h1>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        {/* 访问前台 */}
        <NavbarItem>
          <Button
            as={Link}
            href="/"
            target="_blank"
            variant="light"
            isIconOnly
            aria-label="访问前台"
          >
            <Home className="w-5 h-5" />
          </Button>
        </NavbarItem>

        {/* 通知 */}
        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button variant="light" isIconOnly aria-label="通知">
                <Badge content="3" color="danger" size="sm">
                  <Bell className="w-5 h-5" />
                </Badge>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="通知列表">
              <DropdownItem key="notification-1" className="h-14 gap-2">
                <p className="font-semibold">新评论</p>
                <p className="text-sm text-muted-foreground">
                  有用户在文章《Next.js 入门》下发表了评论
                </p>
              </DropdownItem>
              <DropdownItem key="notification-2" className="h-14 gap-2">
                <p className="font-semibold">系统更新</p>
                <p className="text-sm text-muted-foreground">
                  系统已更新到最新版本
                </p>
              </DropdownItem>
              <DropdownItem
                key="all-notifications"
                className="text-center text-primary"
              >
                查看全部通知
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>

        {/* 主题切换 */}
        <NavbarItem>
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="light" aria-label="切换主题">
                {themeIcon()}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="主题选择"
              onAction={(key) => setTheme(key as string)}
            >
              <DropdownItem
                key="light"
                startContent={<Sun className="w-4 h-4" />}
              >
                浅色
              </DropdownItem>
              <DropdownItem
                key="dark"
                startContent={<Moon className="w-4 h-4" />}
              >
                深色
              </DropdownItem>
              <DropdownItem
                key="system"
                startContent={<Monitor className="w-4 h-4" />}
              >
                跟随系统
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>

        {/* 用户菜单 */}
        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name={user?.nickname || user?.username || "Admin"}
                size="sm"
                src={user?.avatar}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="用户菜单">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">
                  {user?.nickname || user?.username || "Admin"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {user?.email || "admin@example.com"}
                </p>
              </DropdownItem>
              <DropdownItem
                key="account"
                startContent={<User className="w-4 h-4" />}
              >
                个人资料
              </DropdownItem>
              <DropdownItem
                key="settings"
                startContent={<Settings className="w-4 h-4" />}
              >
                账户设置
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                startContent={<LogOut className="w-4 h-4" />}
                onPress={handleLogout}
              >
                退出登录
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
