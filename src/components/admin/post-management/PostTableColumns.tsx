"use client";

import { useCallback } from "react";
import Image from "next/image";
import { User, Chip, Button, Tooltip } from "@heroui/react";
import { FileText, Eye, Trash2 } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { formatDateTimeParts } from "@/utils/date";
import { FALLBACK_COVER } from "@/lib/constants/admin";
import type { AdminArticle } from "@/types/post-management";

/** 状态 Chip 配置 */
const STATUS_CHIP: Record<string, { label: string; color: "success" | "warning" | "default" | "primary" }> = {
  PUBLISHED: { label: "已发布", color: "success" },
  DRAFT: { label: "草稿", color: "warning" },
  ARCHIVED: { label: "已归档", color: "default" },
  SCHEDULED: { label: "定时发布", color: "primary" },
};

/** 表格列定义 */
export const TABLE_COLUMNS = [
  { key: "author", label: "作者" },
  { key: "article", label: "文章" },
  { key: "status", label: "状态" },
  { key: "stats", label: "统计" },
  { key: "time", label: "时间" },
  { key: "actions", label: "操作" },
];

interface UsePostRenderCellOptions {
  defaultCover: string;
  gravatarBaseUrl: string;
  onAction: (article: AdminArticle, key: string) => void;
}

/**
 * 返回文章表格的 renderCell 函数
 */
export function usePostRenderCell({ defaultCover, gravatarBaseUrl, onAction }: UsePostRenderCellOptions) {
  return useCallback(
    (article: AdminArticle, columnKey: React.Key) => {
      switch (columnKey) {
        case "author": {
          const avatarSrc = article.owner_avatar
            ? article.owner_avatar.startsWith("http")
              ? article.owner_avatar
              : `${gravatarBaseUrl}/${article.owner_avatar}`
            : undefined;
          return (
            <User
              name={article.owner_nickname || "未知"}
              description={article.owner_email || ""}
              avatarProps={{
                src: avatarSrc,
                size: "sm",
                name: (article.owner_nickname || "U").charAt(0).toUpperCase(),
                showFallback: true,
              }}
              classNames={{ name: "text-sm font-medium", description: "text-[11px]" }}
            />
          );
        }
        case "article": {
          const coverSrc = article.cover_url || defaultCover;
          const previewUrl = `/posts/${article.abbrlink || article.id}`;
          return (
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-3 items-center min-w-0 group/article cursor-pointer rounded-lg -m-1 p-1 transition-colors hover:bg-muted/50"
              onClick={e => {
                // 阻止默认行为以使用自定义导航，保留中键点击和 Ctrl/Cmd+点击的默认行为
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  onAction(article, "preview");
                }
              }}
            >
              <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-muted ring-1 ring-border/20 transition-shadow group-hover/article:ring-primary/40">
                <Image
                  src={coverSrc}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="56px"
                  unoptimized
                  onError={e => {
                    (e.target as HTMLImageElement).src = FALLBACK_COVER;
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate group-hover/article:text-primary transition-colors">
                  {article.title}
                </p>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  {article.post_categories?.slice(0, 1).map(c => (
                    <Chip key={c.id} size="sm" color="primary" variant="flat" className="text-[11px] h-5">
                      {c.name}
                    </Chip>
                  ))}
                  {article.post_tags?.slice(0, 2).map(t => (
                    <span key={t.id} className="text-[11px] text-muted-foreground">
                      #{t.name}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          );
        }
        case "status": {
          const chip = STATUS_CHIP[article.status] ?? { label: article.status, color: "default" as const };
          return (
            <Chip size="sm" color={chip.color} variant="flat">
              {chip.label}
            </Chip>
          );
        }
        case "stats":
          return (
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-muted-foreground/40" />
                <span className="text-xs text-muted-foreground tabular-nums">{formatNumber(article.view_count)}</span>
              </div>
              {article.word_count > 0 && (
                <div className="flex items-center gap-1">
                  <FileText className="w-3 h-3 text-muted-foreground/40" />
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {formatNumber(article.word_count)}字
                  </span>
                </div>
              )}
            </div>
          );
        case "time": {
          const created = formatDateTimeParts(article.created_at);
          const updated = formatDateTimeParts(article.updated_at);
          return (
            <div className="flex flex-col gap-1 text-xs">
              <div className="text-muted-foreground tabular-nums">
                <div>{created.date}</div>
                <div className="text-muted-foreground/60">{created.time}</div>
              </div>
              <div className="text-muted-foreground/50 tabular-nums">
                <div>{updated.date}</div>
                <div className="text-muted-foreground/40">{updated.time}</div>
              </div>
            </div>
          );
        }
        case "actions":
          return (
            <div className="flex items-center justify-center gap-1">
              <Tooltip content="预览" placement="top" size="sm">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  radius="full"
                  className="w-7 h-7 min-w-0 text-primary bg-primary/10 hover:bg-primary/20"
                  onPress={() => onAction(article, "preview")}
                >
                  <Eye className="w-3.5 h-3.5" />
                </Button>
              </Tooltip>
              <Tooltip content="编辑" placement="top" size="sm">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  radius="full"
                  className="w-7 h-7 min-w-0 text-warning-600 bg-warning/10 hover:bg-warning/20"
                  onPress={() => onAction(article, "edit")}
                >
                  <FileText className="w-3.5 h-3.5" />
                </Button>
              </Tooltip>
              <Tooltip content="删除" placement="top" size="sm" color="danger">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  radius="full"
                  className="w-7 h-7 min-w-0 text-danger bg-danger/10 hover:bg-danger/20"
                  onPress={() => onAction(article, "delete")}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </Tooltip>
            </div>
          );
        default:
          return null;
      }
    },
    [onAction, defaultCover, gravatarBaseUrl]
  );
}
