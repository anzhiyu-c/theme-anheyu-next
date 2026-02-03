"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AdminPageHeader, AdminCard, EmptyState } from "@/components/admin";
import { Button } from "@/components/ui";
import {
  HardDrive,
  Plus,
  Edit,
  Trash2,
  Check,
  Cloud,
  Server,
  Database,
  Settings,
  CheckCircle,
  Circle,
} from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";

// 模拟存储策略数据
const mockStorages = [
  {
    id: 1,
    name: "本地存储",
    type: "local",
    icon: Server,
    description: "存储在服务器本地磁盘",
    isDefault: true,
    status: "active",
    config: { path: "/data/uploads" },
    usage: { used: 2.5 * 1024 * 1024 * 1024, total: 50 * 1024 * 1024 * 1024 },
  },
  {
    id: 2,
    name: "阿里云 OSS",
    type: "oss",
    icon: Cloud,
    description: "阿里云对象存储服务",
    isDefault: false,
    status: "active",
    config: { bucket: "my-bucket", region: "oss-cn-hangzhou" },
    usage: { used: 15.8 * 1024 * 1024 * 1024, total: 100 * 1024 * 1024 * 1024 },
  },
  {
    id: 3,
    name: "腾讯云 COS",
    type: "cos",
    icon: Cloud,
    description: "腾讯云对象存储服务",
    isDefault: false,
    status: "inactive",
    config: { bucket: "backup-bucket", region: "ap-guangzhou" },
    usage: { used: 0, total: 50 * 1024 * 1024 * 1024 },
  },
  {
    id: 4,
    name: "Amazon S3",
    type: "s3",
    icon: Database,
    description: "AWS 对象存储服务",
    isDefault: false,
    status: "active",
    config: { bucket: "s3-bucket", region: "us-east-1" },
    usage: { used: 8.2 * 1024 * 1024 * 1024, total: 200 * 1024 * 1024 * 1024 },
  },
];

type StorageItem = (typeof mockStorages)[number];

export default function StoragePage() {
  const [storages] = useState(mockStorages);

  const totalUsed = storages.reduce((acc, s) => acc + s.usage.used, 0);
  const totalCapacity = storages.reduce((acc, s) => acc + s.usage.total, 0);

  const StorageCard = ({ storage, index }: { storage: StorageItem; index: number }) => {
    const Icon = storage.icon;
    const usagePercent = (storage.usage.used / storage.usage.total) * 100;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={cn(
          "bg-card border border-border/50 rounded-xl p-5 hover:shadow-lg transition-all",
          storage.isDefault && "border-primary/30 bg-primary/5"
        )}
      >
        {/* 头部 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn("p-2.5 rounded-xl", storage.status === "active" ? "bg-primary/10" : "bg-muted")}>
              <Icon className={cn("w-6 h-6", storage.status === "active" ? "text-primary" : "text-muted-foreground")} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{storage.name}</h3>
                {storage.isDefault && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">默认</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{storage.description}</p>
            </div>
          </div>
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
              storage.status === "active" ? "bg-green/10 text-green" : "bg-muted text-muted-foreground"
            )}
          >
            {storage.status === "active" ? <CheckCircle className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
            {storage.status === "active" ? "已启用" : "未启用"}
          </div>
        </div>

        {/* 使用量进度条 */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">存储使用</span>
            <span className="font-medium">
              {formatBytes(storage.usage.used)} / {formatBytes(storage.usage.total)}
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${usagePercent}%` }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={cn(
                "h-full rounded-full",
                usagePercent > 80 ? "bg-red" : usagePercent > 60 ? "bg-yellow" : "bg-primary"
              )}
            />
          </div>
          <p className="text-xs text-muted-foreground text-right">{usagePercent.toFixed(1)}%</p>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-2 pt-4 border-t border-border/50">
          {!storage.isDefault && storage.status === "active" && (
            <Button variant="outline" size="sm" className="flex-1 gap-1.5">
              <Check className="w-3.5 h-3.5" />
              设为默认
            </Button>
          )}
          <Button variant="outline" size="sm" className="flex-1 gap-1.5">
            <Settings className="w-3.5 h-3.5" />
            配置
          </Button>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
            <Edit className="w-4 h-4" />
          </Button>
          {!storage.isDefault && (
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-red hover:text-red hover:bg-red/10">
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="存储策略"
        description="配置文件存储服务"
        icon={HardDrive}
        primaryAction={{
          label: "添加策略",
          icon: Plus,
          onClick: () => console.log("Add storage"),
        }}
      />

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AdminCard>
          <p className="text-3xl font-bold">{storages.length}</p>
          <p className="text-sm text-muted-foreground mt-1">存储策略</p>
        </AdminCard>
        <AdminCard delay={0.05}>
          <p className="text-3xl font-bold text-green">{storages.filter(s => s.status === "active").length}</p>
          <p className="text-sm text-muted-foreground mt-1">已启用</p>
        </AdminCard>
        <AdminCard delay={0.1}>
          <p className="text-3xl font-bold text-primary">{formatBytes(totalUsed)}</p>
          <p className="text-sm text-muted-foreground mt-1">已使用</p>
        </AdminCard>
        <AdminCard delay={0.15}>
          <p className="text-3xl font-bold text-orange">{formatBytes(totalCapacity)}</p>
          <p className="text-sm text-muted-foreground mt-1">总容量</p>
        </AdminCard>
      </div>

      {/* 存储策略列表 */}
      {storages.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {storages.map((storage, index) => (
            <StorageCard key={storage.id} storage={storage} index={index} />
          ))}
        </div>
      ) : (
        <AdminCard>
          <EmptyState
            icon={HardDrive}
            title="暂无存储策略"
            description="添加您的第一个存储策略"
            action={{
              label: "添加策略",
              icon: Plus,
              onClick: () => console.log("Add storage"),
            }}
          />
        </AdminCard>
      )}
    </div>
  );
}
