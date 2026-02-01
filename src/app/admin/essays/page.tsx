"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AdminPageHeader, AdminCard, EmptyState } from "@/components/admin";
import { Button } from "@/components/ui";
import { MessageCircle, Plus, Heart, MessageSquare, Edit, Trash2, Image, MapPin, Globe, Lock } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

// 模拟说说数据
const mockEssays = [
  {
    id: 1,
    content: "今天天气真好，适合写代码！☀️ 刚完成了新功能的开发，感觉很有成就感。#开发日常",
    images: [],
    location: "上海",
    isPublic: true,
    likes: 24,
    comments: 5,
    createdAt: "2026-01-30 14:30",
  },
  {
    id: 2,
    content: "分享一组最近拍的风景照，希望大家喜欢 📷",
    images: ["/img1.jpg", "/img2.jpg", "/img3.jpg"],
    location: "杭州西湖",
    isPublic: true,
    likes: 56,
    comments: 12,
    createdAt: "2026-01-28 09:15",
  },
  {
    id: 3,
    content: "新版本即将发布，敬请期待！🚀",
    images: [],
    location: "",
    isPublic: true,
    likes: 89,
    comments: 23,
    createdAt: "2026-01-25 18:00",
  },
  {
    id: 4,
    content: "私密笔记：项目进度记录...",
    images: [],
    location: "",
    isPublic: false,
    likes: 0,
    comments: 0,
    createdAt: "2026-01-24 22:00",
  },
];

type EssayItem = (typeof mockEssays)[number];

export default function EssaysPage() {
  const [essays] = useState(mockEssays);

  const EssayCard = ({ essay, index }: { essay: EssayItem; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card border border-border/50 rounded-xl p-5 hover:shadow-lg hover:border-primary/20 transition-all"
    >
      {/* 头部信息 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{formatDate(essay.createdAt)}</span>
          {essay.location && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {essay.location}
              </span>
            </>
          )}
          <span
            className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs",
              essay.isPublic ? "bg-green/10 text-green" : "bg-yellow/10 text-yellow"
            )}
          >
            {essay.isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            {essay.isPublic ? "公开" : "私密"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red hover:text-red hover:bg-red/10">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 内容 */}
      <p className="text-foreground leading-relaxed whitespace-pre-wrap">{essay.content}</p>

      {/* 图片 */}
      {essay.images.length > 0 && (
        <div
          className={cn(
            "grid gap-2 mt-3",
            essay.images.length === 1 && "grid-cols-1",
            essay.images.length === 2 && "grid-cols-2",
            essay.images.length >= 3 && "grid-cols-3"
          )}
        >
          {essay.images.map((img, i) => (
            <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
              <Image className="w-8 h-8 text-muted-foreground" />
            </div>
          ))}
        </div>
      )}

      {/* 互动数据 */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/50">
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Heart className="w-4 h-4" />
          {essay.likes} 赞
        </span>
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MessageSquare className="w-4 h-4" />
          {essay.comments} 评论
        </span>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="说说管理"
        description="发布和管理您的动态说说"
        icon={MessageCircle}
        primaryAction={{
          label: "发布说说",
          icon: Plus,
          onClick: () => console.log("Create essay"),
        }}
      />

      {/* 统计 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AdminCard>
          <p className="text-3xl font-bold">{essays.length}</p>
          <p className="text-sm text-muted-foreground mt-1">总说说</p>
        </AdminCard>
        <AdminCard delay={0.05}>
          <p className="text-3xl font-bold text-green">{essays.filter(e => e.isPublic).length}</p>
          <p className="text-sm text-muted-foreground mt-1">公开</p>
        </AdminCard>
        <AdminCard delay={0.1}>
          <p className="text-3xl font-bold text-yellow">{essays.filter(e => !e.isPublic).length}</p>
          <p className="text-sm text-muted-foreground mt-1">私密</p>
        </AdminCard>
        <AdminCard delay={0.15}>
          <p className="text-3xl font-bold text-primary">{essays.reduce((acc, e) => acc + e.likes, 0)}</p>
          <p className="text-sm text-muted-foreground mt-1">总点赞</p>
        </AdminCard>
      </div>

      {/* 说说列表 */}
      {essays.length > 0 ? (
        <div className="space-y-4">
          {essays.map((essay, index) => (
            <EssayCard key={essay.id} essay={essay} index={index} />
          ))}
        </div>
      ) : (
        <AdminCard>
          <EmptyState
            icon={MessageCircle}
            title="暂无说说"
            description="发布您的第一条说说，与访客分享您的动态"
            action={{
              label: "发布说说",
              icon: Plus,
              onClick: () => console.log("Create essay"),
            }}
          />
        </AdminCard>
      )}
    </div>
  );
}
