"use client";

import { useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Spinner,
} from "@heroui/react";
import { useTheme } from "next-themes";
import { Sun, Moon, LayoutDashboard, FileText, Settings, LogOut, ExternalLink, User, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "概览", icon: LayoutDashboard },
  { href: "/dashboard/posts", label: "文章管理", icon: FileText },
  { href: "/dashboard/settings", label: "系统设置", icon: Settings },
];

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout, _hasHydrated } = useAuthStore();

  // 计算认证检查状态（使用 useMemo 避免在 effect 中设置状态）
  const isCheckingAuth = useMemo(() => {
    return !_hasHydrated || (!isAuthenticated && _hasHydrated);
  }, [_hasHydrated, isAuthenticated]);

  // 检查认证状态并重定向
  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [_hasHydrated, isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // 等待 hydration 和认证检查
  if (!_hasHydrated || isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-default-50">
      {/* 顶部导航 */}
      <Navbar className="bg-background border-b border-divider" maxWidth="full">
        <NavbarBrand>
          <Link href="/dashboard" className="font-bold text-xl text-gradient">
            AnHeYu Admin
          </Link>
        </NavbarBrand>

        {/* 导航菜单 */}
        <NavbarContent className="hidden md:flex gap-4" justify="center">
          {navItems.map(item => (
            <NavbarItem key={item.href} isActive={pathname === item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-1 text-sm font-medium transition-colors",
                  pathname === item.href ? "text-primary" : "text-foreground/60 hover:text-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        {/* 右侧操作区 */}
        <NavbarContent justify="end">
          {/* 访问前台 */}
          <NavbarItem>
            <Button
              as={Link}
              href="/"
              target="_blank"
              variant="light"
              size="sm"
              startContent={<ExternalLink className="w-4 h-4" />}
            >
              访问前台
            </Button>
          </NavbarItem>

          {/* 主题切换 */}
          <NavbarItem>
            <Button isIconOnly variant="light" aria-label="切换主题" onPress={toggleTheme}>
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </NavbarItem>

          {/* 用户菜单 */}
          <NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button variant="light" className="gap-2">
                  <Avatar src={user?.avatar} name={user?.nickname || user?.username} size="sm" />
                  <span className="hidden sm:inline">{user?.nickname || user?.username}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="用户菜单">
                <DropdownItem key="profile" startContent={<User className="w-4 h-4" />}>
                  个人资料
                </DropdownItem>
                <DropdownItem key="settings" startContent={<Settings className="w-4 h-4" />}>
                  设置
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

      {/* 主内容区 */}
      <main className="p-6">{children}</main>
    </div>
  );
}
