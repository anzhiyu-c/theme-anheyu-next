"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AdminPageHeader, AdminCard } from "@/components/admin";
import { Button } from "@/components/ui";
import { Gift, Heart, Coffee, MessageSquare, Sparkles, TrendingUp, Download } from "lucide-react";
import { formatDate } from "@/lib/utils";

// 模拟打赏数据
const mockDonations = [
  {
    id: 1,
    donor: "匿名用户",
    avatar: "",
    amount: 66.66,
    message: "感谢分享，学到了很多！",
    createdAt: "2026-01-30 16:20",
  },
  { id: 2, donor: "张三", avatar: "/avatar1.jpg", amount: 20, message: "支持一下~", createdAt: "2026-01-30 12:15" },
  {
    id: 3,
    donor: "李四",
    avatar: "/avatar2.jpg",
    amount: 100,
    message: "非常棒的博客，继续加油！",
    createdAt: "2026-01-29 18:45",
  },
  { id: 4, donor: "匿名用户", avatar: "", amount: 10, message: "", createdAt: "2026-01-28 09:00" },
  {
    id: 5,
    donor: "王五",
    avatar: "/avatar3.jpg",
    amount: 50,
    message: "教程写得很详细，打赏一杯咖啡",
    createdAt: "2026-01-27 14:30",
  },
  {
    id: 6,
    donor: "赵六",
    avatar: "/avatar4.jpg",
    amount: 88.88,
    message: "祝博主新年快乐！",
    createdAt: "2026-01-26 20:00",
  },
];

type DonationItem = (typeof mockDonations)[number];

export default function DonationsPage() {
  const [donations] = useState(mockDonations);

  // 计算统计数据
  const totalAmount = donations.reduce((acc, d) => acc + d.amount, 0);
  const todayAmount = donations.filter(d => d.createdAt.includes("2026-01-30")).reduce((acc, d) => acc + d.amount, 0);
  const avgAmount = totalAmount / donations.length;

  const DonationCard = ({ donation, index }: { donation: DonationItem; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:border-red/20 transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-red/20 to-pink/40 flex items-center justify-center">
            <Heart className="w-6 h-6 text-red" />
          </div>
          <div>
            <p className="font-semibold">{donation.donor}</p>
            <p className="text-xs text-muted-foreground">{formatDate(donation.createdAt)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-primary">¥{donation.amount.toFixed(2)}</p>
        </div>
      </div>
      {donation.message && (
        <div className="mt-3 p-3 rounded-lg bg-muted/50 flex items-start gap-2">
          <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">{donation.message}</p>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="打赏管理"
        description="查看收到的打赏记录"
        icon={Gift}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow/10 text-yellow text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              PRO 功能
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              导出
            </Button>
          </div>
        }
      />

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AdminCard>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red/10">
              <Heart className="w-5 h-5 text-red" />
            </div>
            <div>
              <p className="text-2xl font-bold">{donations.length}</p>
              <p className="text-xs text-muted-foreground">打赏总数</p>
            </div>
          </div>
        </AdminCard>
        <AdminCard delay={0.05}>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Gift className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">¥{totalAmount.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">累计金额</p>
            </div>
          </div>
        </AdminCard>
        <AdminCard delay={0.1}>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-green/10">
              <TrendingUp className="w-5 h-5 text-green" />
            </div>
            <div>
              <p className="text-2xl font-bold">¥{todayAmount.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">今日收入</p>
            </div>
          </div>
        </AdminCard>
        <AdminCard delay={0.15}>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange/10">
              <Coffee className="w-5 h-5 text-orange" />
            </div>
            <div>
              <p className="text-2xl font-bold">¥{avgAmount.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">平均金额</p>
            </div>
          </div>
        </AdminCard>
      </div>

      {/* 打赏列表 - 卡片视图 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {donations.map((donation, index) => (
          <DonationCard key={donation.id} donation={donation} index={index} />
        ))}
      </div>
    </div>
  );
}
