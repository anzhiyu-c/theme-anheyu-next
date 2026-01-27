"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  Menu,
  Search,
  Bell,
  User,
  ChevronDown,
  FileText,
  FolderOpen,
  Tags,
  Link2,
  Users,
  Heart,
  Music,
  Wind,
  Camera,
  Shuffle,
  Info,
  Wrench,
  ExternalLink,
} from "lucide-react";

// 导航菜单配置
const navMenus = [
  {
    label: "文库",
    children: [
      { href: "/archives", label: "全部文章", icon: FileText },
      { href: "/categories", label: "分类列表", icon: FolderOpen },
      { href: "/tags", label: "标签列表", icon: Tags },
    ],
  },
  {
    label: "友链",
    children: [
      { href: "/link", label: "友情链接", icon: Link2 },
      { href: "/fcircle", label: "朋友动态", icon: Users },
      { href: "#", label: "宝藏博主", icon: Heart },
    ],
  },
  {
    label: "我的",
    children: [
      { href: "/music", label: "音乐馆", icon: Music },
      { href: "/air-conditioner", label: "小空调", icon: Wind },
      { href: "/album", label: "相册集", icon: Camera },
    ],
  },
  {
    label: "关于",
    children: [
      { href: "/random-post", label: "随便逛逛", icon: Shuffle },
      { href: "/about", label: "关于本站", icon: Info },
      { href: "/equipment", label: "我的装备", icon: Wrench },
    ],
  },
];

// 左侧菜单配置（点击菜单图标展开）
const sideMenus = [
  {
    title: "网页",
    children: [
      { href: "https://index.anheyu.com/", label: "个人主页", external: true },
      { href: "https://blog.anheyu.com/", label: "博客", external: true },
      { href: "https://image.anheyu.com/", label: "安知鱼图床", external: true },
    ],
  },
  {
    title: "项目",
    children: [{ href: "https://dev.anheyu.com/", label: "安和鱼框架", external: true }],
  },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  usePathname(); // 保留用于路由变化时的重新渲染
  const { theme, setTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // 点击外部关闭菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white/80 dark:bg-[#18171d]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="h-full max-w-[1400px] mx-auto px-4 flex items-center justify-between">
        {/* 左侧区域 */}
        <div className="flex items-center gap-4">
          {/* 菜单图标 */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="打开菜单"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>

            {/* 左侧下拉菜单 */}
            {isMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#1e1e24] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                {sideMenus.map(group => (
                  <div key={group.title} className="px-3 py-2">
                    <div className="text-xs text-gray-400 mb-2">{group.title}</div>
                    {group.children.map(item => (
                      <Link
                        key={item.label}
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                        {item.external && <ExternalLink className="w-3 h-3 text-gray-400" />}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="text-gray-800 dark:text-white">安和鱼</span>
            <span className="text-[#49b1f5]">🐟</span>
          </Link>
        </div>

        {/* 中间导航 */}
        <nav className="hidden md:flex items-center gap-1">
          {navMenus.map(menu => (
            <div
              key={menu.label}
              className="relative"
              onMouseEnter={() => setActiveDropdown(menu.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#425aef] dark:hover:text-[#49b1f5] transition-colors">
                {menu.label}
                <ChevronDown className="w-3 h-3" />
              </button>

              {/* 下拉菜单 */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200 ${
                  activeDropdown === menu.label ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
              >
                <div className="bg-white dark:bg-[#1e1e24] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 min-w-[160px]">
                  {menu.children.map(item => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <item.icon className="w-4 h-4 text-gray-400" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>

        {/* 右侧工具栏 */}
        <div className="flex items-center gap-1">
          {/* 开往 */}
          <Link
            href="https://www.travellings.cn/go.html"
            target="_blank"
            className="hidden sm:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="开往-随机前往一个开往项目网站"
          >
            <ExternalLink className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Link>

          {/* 通知 */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="通知"
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          {/* 用户中心 */}
          <Link
            href="/login"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="用户中心"
          >
            <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Link>

          {/* 主题切换 */}
          <Button isIconOnly variant="light" aria-label="切换主题" onPress={toggleTheme} className="min-w-0 w-9 h-9">
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </Button>

          {/* 搜索 */}
          <Link
            href="/search"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="搜索"
          >
            <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Link>

          {/* 中控台 */}
          <button
            className="hidden sm:block px-3 py-1.5 text-sm font-medium text-white bg-[#425aef] hover:bg-[#3a4fd6] rounded-lg transition-colors"
            aria-label="中控台"
          >
            中控台
          </button>
        </div>
      </div>
    </header>
  );
}
