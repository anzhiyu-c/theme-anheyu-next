"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AdminPageHeader, AdminCard, EmptyState } from "@/components/admin";
import { Button } from "@/components/ui";
import { Image as ImageIcon, Edit, Trash2, Eye, Lock, Globe, FolderPlus, ImagePlus } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

// 模拟相册数据
const mockAlbums = [
  {
    id: 1,
    name: "风景摄影",
    cover: "/album1.jpg",
    count: 24,
    isPublic: true,
    description: "记录旅途中的美景",
    createdAt: "2026-01-15",
  },
  {
    id: 2,
    name: "生活随拍",
    cover: "/album2.jpg",
    count: 56,
    isPublic: true,
    description: "日常生活点滴",
    createdAt: "2026-01-10",
  },
  {
    id: 3,
    name: "美食分享",
    cover: "/album3.jpg",
    count: 18,
    isPublic: true,
    description: "记录美食时刻",
    createdAt: "2026-01-05",
  },
  {
    id: 4,
    name: "私人相册",
    cover: "/album4.jpg",
    count: 12,
    isPublic: false,
    description: "私密照片",
    createdAt: "2025-12-28",
  },
  {
    id: 5,
    name: "城市街拍",
    cover: "/album5.jpg",
    count: 32,
    isPublic: true,
    description: "城市街头记录",
    createdAt: "2025-12-20",
  },
  {
    id: 6,
    name: "宠物日记",
    cover: "/album6.jpg",
    count: 45,
    isPublic: true,
    description: "可爱的毛孩子",
    createdAt: "2025-12-15",
  },
];

type AlbumItem = (typeof mockAlbums)[number];

export default function AlbumsPage() {
  const [albums] = useState(mockAlbums);

  const AlbumCard = ({ album, index }: { album: AlbumItem; index: number }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all"
    >
      {/* 封面 */}
      <div className="relative aspect-[4/3] bg-linear-to-br from-muted to-muted/50">
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageIcon className="w-16 h-16 text-muted-foreground/50" />
        </div>

        {/* 悬停遮罩 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" className="h-9">
              <Eye className="w-4 h-4 mr-1" />
              查看
            </Button>
            <Button size="sm" variant="secondary" className="h-9">
              <ImagePlus className="w-4 h-4 mr-1" />
              添加
            </Button>
          </div>
        </div>

        {/* 图片数量 */}
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/50 text-white text-xs font-medium">
          {album.count} 张
        </div>

        {/* 公开/私密标识 */}
        <div
          className={cn(
            "absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1",
            album.isPublic ? "bg-green/80 text-white" : "bg-yellow/80 text-white"
          )}
        >
          {album.isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
          {album.isPublic ? "公开" : "私密"}
        </div>
      </div>

      {/* 信息 */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{album.name}</h3>
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{album.description}</p>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red hover:text-red hover:bg-red/10">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">创建于 {formatDate(album.createdAt)}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="相册管理"
        description="创建和管理您的照片相册"
        icon={ImageIcon}
        primaryAction={{
          label: "新建相册",
          icon: FolderPlus,
          onClick: () => console.log("Create album"),
        }}
      />

      {/* 统计 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AdminCard>
          <p className="text-3xl font-bold">{albums.length}</p>
          <p className="text-sm text-muted-foreground mt-1">相册总数</p>
        </AdminCard>
        <AdminCard delay={0.05}>
          <p className="text-3xl font-bold text-primary">{albums.reduce((acc, a) => acc + a.count, 0)}</p>
          <p className="text-sm text-muted-foreground mt-1">照片总数</p>
        </AdminCard>
        <AdminCard delay={0.1}>
          <p className="text-3xl font-bold text-green">{albums.filter(a => a.isPublic).length}</p>
          <p className="text-sm text-muted-foreground mt-1">公开相册</p>
        </AdminCard>
        <AdminCard delay={0.15}>
          <p className="text-3xl font-bold text-yellow">{albums.filter(a => !a.isPublic).length}</p>
          <p className="text-sm text-muted-foreground mt-1">私密相册</p>
        </AdminCard>
      </div>

      {/* 相册列表 */}
      {albums.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {albums.map((album, index) => (
            <AlbumCard key={album.id} album={album} index={index} />
          ))}
        </div>
      ) : (
        <AdminCard>
          <EmptyState
            icon={ImageIcon}
            title="暂无相册"
            description="创建您的第一个相册，开始分享美好时刻"
            action={{
              label: "新建相册",
              icon: FolderPlus,
              onClick: () => console.log("Create album"),
            }}
          />
        </AdminCard>
      )}
    </div>
  );
}
