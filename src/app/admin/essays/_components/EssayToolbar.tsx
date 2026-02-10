"use client";

import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Plus, Upload, ExternalLink, ChevronDown, RotateCcw } from "lucide-react";
import { ESSAY_STATUS_OPTIONS } from "@/lib/constants/essay";
import type { EssaysPageState } from "../_hooks/use-essays-page";

export function EssayToolbar({ cm }: { cm: EssaysPageState }) {
  return (
    <>
      {/* ===== 标题区 + 操作按钮 ===== */}
      <div className="shrink-0 px-5 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">说说管理</h1>
            <p className="text-xs text-muted-foreground mt-1">管理即刻动态，支持文本、图片、音乐等多种形式</p>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              color="primary"
              startContent={<Plus className="w-3.5 h-3.5" />}
              onPress={cm.handleNew}
              className="font-medium shadow-sm"
            >
              发布说说
            </Button>
            <Button
              size="sm"
              variant="flat"
              startContent={<ExternalLink className="w-3.5 h-3.5" />}
              onPress={() => window.open("/essay", "_blank")}
              className="text-default-600"
            >
              查看页面
            </Button>
            <Button
              size="sm"
              variant="flat"
              startContent={<Upload className="w-3.5 h-3.5" />}
              onPress={cm.importModal.onOpen}
              className="text-default-600"
            >
              导入
            </Button>
          </div>
        </div>
      </div>

      {/* ===== 筛选栏 ===== */}
      <div className="shrink-0 px-5 pb-3">
        <div className="flex items-center gap-3">
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button size="sm" variant="flat" endContent={<ChevronDown className="w-3.5 h-3.5" />} className="h-8">
                {cm.statusFilter
                  ? ESSAY_STATUS_OPTIONS.find(o => o.key === cm.statusFilter)?.label ?? "说说状态"
                  : "说说状态"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="说说状态筛选"
              selectedKeys={cm.statusFilter ? new Set([cm.statusFilter]) : new Set()}
              selectionMode="single"
              onSelectionChange={keys => {
                const v = Array.from(keys)[0];
                cm.setStatusFilter(v ? (v as string) : "");
                cm.setPage(1);
              }}
            >
              {ESSAY_STATUS_OPTIONS.map(opt => (
                <DropdownItem key={opt.key}>{opt.label}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <div className="ml-auto">
            <Button
              size="sm"
              variant="flat"
              startContent={<RotateCcw className="w-3.5 h-3.5" />}
              onPress={() => {
                cm.setStatusFilter("");
                cm.setPage(1);
              }}
              isDisabled={!cm.statusFilter}
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
