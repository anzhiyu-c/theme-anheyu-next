"use client";

import { Input, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { Search, ChevronDown, RotateCcw, Upload, X } from "lucide-react";
import type { CommentPageState } from "../_hooks/use-comment-page";

/** 状态筛选选项 */
const COMMENT_STATUS_OPTIONS = [
  { key: "1", label: "已发布" },
  { key: "2", label: "待审核" },
];

interface CommentFiltersProps {
  cm: CommentPageState;
}

export function CommentFilters({ cm }: CommentFiltersProps) {
  return (
    <>
      {/* 标题区 + 操作按钮 */}
      <div className="shrink-0 px-5 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">评论管理</h1>
            <p className="text-xs text-muted-foreground mt-1">审核和管理用户评论，支持批量操作</p>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="flat"
              onPress={cm.importModal.onOpen}
              startContent={<Upload className="w-3.5 h-3.5" />}
              className="text-default-600"
            >
              导入
            </Button>
          </div>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="shrink-0 px-5 pb-3">
        <div className="flex items-center gap-3">
          <Input
            size="sm"
            className="w-full sm:max-w-[300px]"
            placeholder="搜索评论内容..."
            startContent={<Search className="w-3.5 h-3.5 text-default-400" />}
            endContent={
              cm.searchInput ? (
                <button
                  type="button"
                  className="shrink-0 text-default-400 hover:text-default-600 transition-colors"
                  onClick={() => cm.setSearchInput("")}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : null
            }
            value={cm.searchInput}
            onValueChange={cm.setSearchInput}
            classNames={{
              inputWrapper:
                "h-8 min-h-8 bg-white! dark:bg-default-50! shadow-none! [border:var(--style-border)] data-[hover=true]:bg-white! dark:data-[hover=true]:bg-default-50! group-data-[focus=true]:bg-white! dark:group-data-[focus=true]:bg-default-50! group-data-[focus=true]:[border:var(--style-border-hover)] transition-all duration-200",
            }}
          />
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button size="sm" variant="flat" endContent={<ChevronDown className="w-3.5 h-3.5" />} className="h-8">
                {cm.statusFilter
                  ? COMMENT_STATUS_OPTIONS.find(o => o.key === cm.statusFilter)?.label ?? "评论状态"
                  : "评论状态"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="评论状态筛选"
              selectedKeys={cm.statusFilter ? new Set([cm.statusFilter]) : new Set()}
              selectionMode="single"
              onSelectionChange={keys => {
                const v = Array.from(keys)[0];
                cm.setStatusFilter(v ? (v as string) : "");
                cm.setPage(1);
              }}
            >
              {COMMENT_STATUS_OPTIONS.map(opt => (
                <DropdownItem key={opt.key}>{opt.label}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <div className="ml-auto">
            <Button
              size="sm"
              variant="flat"
              startContent={<RotateCcw className="w-3.5 h-3.5" />}
              onPress={cm.handleReset}
              isDisabled={!cm.searchInput && !cm.statusFilter}
              className="text-default-600"
            >
              重置
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
