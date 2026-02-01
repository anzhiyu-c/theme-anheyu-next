"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AdminPageHeader, AdminCard, EmptyState } from "@/components/admin";
import { Button } from "@/components/ui";
import { Palette, Download, Check, Eye, Star, Heart, ExternalLink, Sparkles, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

// 模拟主题数据
const mockThemes = [
  {
    id: 1,
    name: "默认主题",
    author: "AnHeYu",
    description: "简洁优雅的默认主题，适合技术博客",
    preview: "/theme1.jpg",
    version: "1.0.0",
    downloads: 12500,
    rating: 4.8,
    isInstalled: true,
    isActive: true,
    isPro: false,
    price: 0,
  },
  {
    id: 2,
    name: "暗夜模式",
    author: "AnHeYu",
    description: "深邃的暗色主题，保护眼睛",
    preview: "/theme2.jpg",
    version: "1.2.0",
    downloads: 8900,
    rating: 4.9,
    isInstalled: true,
    isActive: false,
    isPro: false,
    price: 0,
  },
  {
    id: 3,
    name: "极简白",
    author: "社区贡献",
    description: "极简主义设计，专注内容",
    preview: "/theme3.jpg",
    version: "2.0.1",
    downloads: 5600,
    rating: 4.7,
    isInstalled: false,
    isActive: false,
    isPro: false,
    price: 0,
  },
  {
    id: 4,
    name: "科技感",
    author: "AnHeYu",
    description: "炫酷的科技风格，适合技术极客",
    preview: "/theme4.jpg",
    version: "1.5.0",
    downloads: 3200,
    rating: 4.6,
    isInstalled: false,
    isActive: false,
    isPro: true,
    price: 49,
  },
  {
    id: 5,
    name: "文艺范",
    author: "社区贡献",
    description: "优雅的文艺风格，适合生活类博客",
    preview: "/theme5.jpg",
    version: "1.1.0",
    downloads: 2100,
    rating: 4.5,
    isInstalled: false,
    isActive: false,
    isPro: true,
    price: 39,
  },
  {
    id: 6,
    name: "渐变梦幻",
    author: "AnHeYu",
    description: "绚丽的渐变效果，视觉冲击力强",
    preview: "/theme6.jpg",
    version: "1.0.0",
    downloads: 1800,
    rating: 4.8,
    isInstalled: false,
    isActive: false,
    isPro: true,
    price: 59,
  },
];

type ThemeItem = (typeof mockThemes)[number];

export default function ThemesPage() {
  const [themes] = useState(mockThemes);
  const [filter, setFilter] = useState<"all" | "installed" | "free" | "pro">("all");

  const filteredThemes = themes.filter(theme => {
    if (filter === "all") return true;
    if (filter === "installed") return theme.isInstalled;
    if (filter === "free") return !theme.isPro;
    if (filter === "pro") return theme.isPro;
    return true;
  });

  const ThemeCard = ({ theme, index }: { theme: ThemeItem; index: number }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "group bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-lg transition-all",
        theme.isActive && "ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
    >
      {/* 预览图 */}
      <div className="relative aspect-[16/10] bg-linear-to-br from-muted to-muted/50">
        <div className="absolute inset-0 flex items-center justify-center">
          <Palette className="w-16 h-16 text-muted-foreground/30" />
        </div>

        {/* 悬停遮罩 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button size="sm" variant="secondary" className="gap-1.5">
            <Eye className="w-4 h-4" />
            预览
          </Button>
        </div>

        {/* 标签 */}
        <div className="absolute top-2 left-2 flex items-center gap-2">
          {theme.isActive && (
            <span className="px-2 py-1 rounded-md bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1">
              <Check className="w-3 h-3" />
              当前使用
            </span>
          )}
          {theme.isPro && (
            <span className="px-2 py-1 rounded-md bg-yellow/80 text-white text-xs font-medium flex items-center gap-1">
              <Crown className="w-3 h-3" />
              PRO
            </span>
          )}
        </div>

        {/* 价格 */}
        {theme.isPro && !theme.isInstalled && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/60 text-white text-sm font-bold">
            ¥{theme.price}
          </div>
        )}
      </div>

      {/* 信息 */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold">{theme.name}</h3>
            <p className="text-xs text-muted-foreground">
              by {theme.author} · v{theme.version}
            </p>
          </div>
          <div className="flex items-center gap-1 text-yellow">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">{theme.rating}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{theme.description}</p>

        {/* 统计 */}
        <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Download className="w-3.5 h-3.5" />
            {theme.downloads.toLocaleString()}
          </span>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-2">
          {theme.isInstalled ? (
            theme.isActive ? (
              <Button variant="outline" size="sm" className="flex-1" disabled>
                <Check className="w-4 h-4 mr-1.5" />
                使用中
              </Button>
            ) : (
              <Button size="sm" className="flex-1">
                <Check className="w-4 h-4 mr-1.5" />
                启用
              </Button>
            )
          ) : theme.isPro ? (
            <Button size="sm" className="flex-1 bg-yellow hover:bg-yellow/90 text-white">
              <Crown className="w-4 h-4 mr-1.5" />
              购买 ¥{theme.price}
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="flex-1">
              <Download className="w-4 h-4 mr-1.5" />
              安装
            </Button>
          )}
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const filterTabs = [
    { key: "all", label: "全部", count: themes.length },
    { key: "installed", label: "已安装", count: themes.filter(t => t.isInstalled).length },
    { key: "free", label: "免费", count: themes.filter(t => !t.isPro).length },
    { key: "pro", label: "PRO", count: themes.filter(t => t.isPro).length },
  ] as const;

  return (
    <div className="space-y-6">
      <AdminPageHeader title="主题商城" description="浏览和安装博客主题" icon={Palette} />

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AdminCard>
          <p className="text-3xl font-bold">{themes.length}</p>
          <p className="text-sm text-muted-foreground mt-1">可用主题</p>
        </AdminCard>
        <AdminCard delay={0.05}>
          <p className="text-3xl font-bold text-primary">{themes.filter(t => t.isInstalled).length}</p>
          <p className="text-sm text-muted-foreground mt-1">已安装</p>
        </AdminCard>
        <AdminCard delay={0.1}>
          <p className="text-3xl font-bold text-green">{themes.filter(t => !t.isPro).length}</p>
          <p className="text-sm text-muted-foreground mt-1">免费主题</p>
        </AdminCard>
        <AdminCard delay={0.15}>
          <p className="text-3xl font-bold text-yellow">{themes.filter(t => t.isPro).length}</p>
          <p className="text-sm text-muted-foreground mt-1">PRO 主题</p>
        </AdminCard>
      </div>

      {/* 筛选标签 */}
      <div className="flex items-center gap-2">
        {filterTabs.map(tab => (
          <Button
            key={tab.key}
            variant={filter === tab.key ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(tab.key)}
            className="gap-1.5"
          >
            {tab.label}
            <span
              className={cn(
                "px-1.5 py-0.5 rounded text-[10px]",
                filter === tab.key ? "bg-primary-foreground/20" : "bg-muted"
              )}
            >
              {tab.count}
            </span>
          </Button>
        ))}
      </div>

      {/* 主题列表 */}
      {filteredThemes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredThemes.map((theme, index) => (
            <ThemeCard key={theme.id} theme={theme} index={index} />
          ))}
        </div>
      ) : (
        <AdminCard>
          <EmptyState icon={Palette} title="暂无主题" description="没有符合筛选条件的主题" />
        </AdminCard>
      )}
    </div>
  );
}
