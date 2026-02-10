"use client";

import { Button, Tooltip } from "@heroui/react";
import { motion } from "framer-motion";
import { Edit, Eye, Trash2, Music, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateCN } from "@/utils/date";
import { adminRowVariants } from "@/lib/motion";
import { ESSAY_STATUS_CONFIG } from "@/lib/constants/essay";
import type { Essay } from "@/lib/api/essay";

interface EssayRowProps {
  essay: Essay;
  index: number;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
  onEdit: (essay: Essay) => void;
  onView: (essay: Essay) => void;
  onDelete: (essay: Essay) => void;
}

export function EssayRow({
  essay,
  index,
  isSelected,
  onToggleSelect,
  onEdit,
  onView,
  onDelete,
}: EssayRowProps) {
  const badge = ESSAY_STATUS_CONFIG[essay.status] ?? { label: "未知", className: "bg-zinc-100 text-zinc-600" };
  const hasMusic = !!(essay.aplayer && essay.aplayer.id);
  const hasImages = !!(essay.image && essay.image.length > 0);
  const imageCount = essay.image?.length ?? 0;

  return (
    <motion.div
      variants={adminRowVariants}
      custom={index}
      className={cn(
        "grid grid-cols-[36px_48px_1fr_72px_64px_140px] sm:grid-cols-[36px_48px_1fr_72px_72px_64px_140px] md:grid-cols-[36px_48px_1fr_72px_72px_56px_64px_90px_160px] items-center px-4 py-2.5",
        "border-b border-border/30 transition-all duration-200 group",
        "hover:bg-muted/25",
        isSelected && "bg-primary/4 border-l-2 border-l-primary"
      )}
    >
      {/* 选择 */}
      <div className="flex justify-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(essay.id)}
          aria-label={`选择说说 ${essay.id}`}
          className="w-3.5 h-3.5 rounded border-border accent-primary cursor-pointer"
        />
      </div>

      {/* 序号 */}
      <div className="flex justify-center">
        <span className="text-sm text-muted-foreground tabular-nums">
          {essay.sort_order > 0 ? essay.sort_order : essay.id}
        </span>
      </div>

      {/* 内容 */}
      <div className="min-w-0 pr-2">
        <Tooltip
          content={essay.content.length > 50 ? essay.content.slice(0, 100) + "..." : essay.content}
          placement="bottom"
          size="sm"
          delay={300}
        >
          <p className="text-sm truncate leading-snug group-hover:text-primary/80 transition-colors cursor-default">
            {essay.content}
          </p>
        </Tooltip>
      </div>

      {/* 媒体 */}
      <div className="flex items-center justify-center">
        {hasMusic ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400">
            <Music className="w-3 h-3" />
            音乐
          </span>
        ) : hasImages ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400">
            <ImageIcon className="w-3 h-3" />
            {imageCount}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground/30">-</span>
        )}
      </div>

      {/* 地址 */}
      <div className="hidden sm:flex items-center justify-center">
        <span className="text-xs text-muted-foreground truncate max-w-[72px]">{essay.address || "-"}</span>
      </div>

      {/* 发布者 */}
      <div className="hidden md:flex items-center justify-center">
        <span className="text-xs text-muted-foreground truncate max-w-[56px]">{essay.from || "-"}</span>
      </div>

      {/* 状态 */}
      <div className="flex items-center justify-center">
        <span
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium leading-tight",
            badge.className
          )}
        >
          {badge.label}
        </span>
      </div>

      {/* 创建时间 */}
      <div className="hidden md:flex items-center justify-center">
        <Tooltip content={formatDateCN(essay.created_at)} placement="top" size="sm">
          <span className="text-xs text-muted-foreground/60 cursor-default tabular-nums">
            {new Date(essay.created_at).toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </span>
        </Tooltip>
      </div>

      {/* 操作 */}
      <div className="flex items-center justify-center gap-1.5">
        <Button size="sm" color="primary" variant="flat" onPress={() => onEdit(essay)} startContent={<Edit className="w-3 h-3" />} className="h-7 min-w-0 px-2.5 text-xs font-medium">
          编辑
        </Button>
        <Button size="sm" color="success" variant="flat" onPress={() => onView(essay)} startContent={<Eye className="w-3 h-3" />} className="h-7 min-w-0 px-2.5 text-xs font-medium">
          查看
        </Button>
        <Button size="sm" color="danger" variant="flat" onPress={() => onDelete(essay)} startContent={<Trash2 className="w-3 h-3" />} className="h-7 min-w-0 px-2.5 text-xs font-medium">
          删除
        </Button>
      </div>
    </motion.div>
  );
}
