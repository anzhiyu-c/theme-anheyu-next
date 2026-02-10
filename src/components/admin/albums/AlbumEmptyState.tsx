"use client";

import { Button } from "@heroui/react";
import { Image as ImageIcon, Search, Plus } from "lucide-react";

interface AlbumEmptyStateProps {
  hasFilter: boolean;
  onNew?: () => void;
}

export function AlbumEmptyState({ hasFilter, onNew }: AlbumEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-muted/40 flex items-center justify-center">
          <ImageIcon className="w-9 h-9 text-muted-foreground/25" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
          {hasFilter ? (
            <Search className="w-3.5 h-3.5 text-primary/50" />
          ) : (
            <Plus className="w-3.5 h-3.5 text-primary/50" />
          )}
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-muted-foreground">{hasFilter ? "没有匹配的图片" : "还没有相册图片"}</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          {hasFilter ? "试试调整筛选条件" : "点击「添加图片」开始上传"}
        </p>
      </div>
      {!hasFilter && onNew && (
        <Button
          size="sm"
          color="primary"
          variant="flat"
          onPress={onNew}
          startContent={<Plus className="w-3.5 h-3.5" />}
          className="mt-1"
        >
          添加图片
        </Button>
      )}
    </div>
  );
}
