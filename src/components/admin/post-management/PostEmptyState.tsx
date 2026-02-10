"use client";

import { Button, addToast } from "@heroui/react";
import { FileText, Search, Plus } from "lucide-react";

interface PostEmptyStateProps {
  hasFilter: boolean;
}

export function PostEmptyState({ hasFilter }: PostEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-muted/40 flex items-center justify-center">
          <FileText className="w-9 h-9 text-muted-foreground/25" />
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
        <p className="text-sm font-medium text-muted-foreground">{hasFilter ? "没有匹配的文章" : "还没有文章"}</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          {hasFilter ? "试试调整筛选条件或搜索关键词" : "点击「新建文章」开始你的创作之旅"}
        </p>
      </div>
      {!hasFilter && (
        <Button
          size="sm"
          color="primary"
          variant="flat"
          onPress={() => addToast({ title: "新建文章功能开发中", color: "default", timeout: 3000 })}
          startContent={<Plus className="w-3.5 h-3.5" />}
          className="mt-1"
        >
          新建文章
        </Button>
      )}
    </div>
  );
}
