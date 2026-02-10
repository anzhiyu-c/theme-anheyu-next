"use client";

import { Button } from "@heroui/react";
import { MessageCircle, Search, Plus } from "lucide-react";

interface EssayEmptyStateProps {
  hasFilter: boolean;
  onNew: () => void;
}

export function EssayEmptyState({ hasFilter, onNew }: EssayEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-muted/40 flex items-center justify-center">
          <MessageCircle className="w-9 h-9 text-muted-foreground/25" />
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
        <p className="text-sm font-medium text-muted-foreground">{hasFilter ? "没有匹配的说说" : "还没有说说"}</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          {hasFilter ? "试试调整筛选条件" : "点击「发布说说」开始分享你的动态"}
        </p>
      </div>
      {!hasFilter && (
        <Button
          size="sm"
          color="primary"
          variant="flat"
          onPress={onNew}
          startContent={<Plus className="w-3.5 h-3.5" />}
          className="mt-1"
        >
          发布说说
        </Button>
      )}
    </div>
  );
}
