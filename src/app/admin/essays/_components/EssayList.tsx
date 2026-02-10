"use client";

import { useMemo, useCallback } from "react";
import {
  Button,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Chip,
  Spinner,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
} from "@heroui/react";
import { Edit, Eye, Trash2, Music, Image as ImageIcon, MessageCircle, ChevronDown } from "lucide-react";
import { formatDateTimeParts } from "@/utils/date";
import { PAGE_SIZES } from "@/lib/constants/admin";
import type { Essay } from "@/lib/api/essay";
import type { EssaysPageState } from "../_hooks/use-essays-page";

// ===================================
//          常量 & 配置
// ===================================

/** 状态 Chip 配置（HeroUI Chip 颜色映射） */
const STATUS_CHIP: Record<number, { label: string; color: "success" | "warning" | "default" }> = {
  1: { label: "已发布", color: "success" },
  2: { label: "草稿", color: "warning" },
  3: { label: "隐藏", color: "default" },
};

/** 表格列定义 */
const TABLE_COLUMNS = [
  { key: "content", label: "内容" },
  { key: "media", label: "媒体" },
  { key: "status", label: "状态" },
  { key: "info", label: "信息" },
  { key: "time", label: "时间" },
  { key: "actions", label: "操作" },
];

// ===================================
//       空状态（内联 emptyContent）
// ===================================

function EssayEmptyState({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className="w-16 h-16 rounded-2xl bg-muted/40 flex items-center justify-center">
        <MessageCircle className="w-7 h-7 text-muted-foreground/25" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-muted-foreground">{hasFilter ? "没有匹配的说说" : "还没有说说"}</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          {hasFilter ? "试试调整筛选条件" : "点击「发布说说」开始分享你的动态"}
        </p>
      </div>
    </div>
  );
}

// ===================================
//          说说列表
// ===================================

export function EssayList({ cm }: { cm: EssaysPageState }) {
  // ---- 单元格渲染 ----
  const renderCell = useCallback(
    (essay: Essay, columnKey: React.Key) => {
      switch (columnKey) {
        case "content": {
          return (
            <div className="min-w-0 max-w-xs">
              <p className="text-sm truncate leading-snug">{essay.content}</p>
              {essay.sort_order > 0 && (
                <span className="text-[11px] text-muted-foreground/50 mt-0.5">排序: {essay.sort_order}</span>
              )}
            </div>
          );
        }
        case "media": {
          const hasMusic = !!(essay.aplayer && essay.aplayer.id);
          const hasImages = !!(essay.image && essay.image.length > 0);
          if (hasMusic) {
            return (
              <Chip size="sm" variant="flat" color="warning" startContent={<Music className="w-3 h-3" />}>
                音乐
              </Chip>
            );
          }
          if (hasImages) {
            return (
              <Chip size="sm" variant="flat" color="primary" startContent={<ImageIcon className="w-3 h-3" />}>
                {essay.image!.length}张
              </Chip>
            );
          }
          return <span className="text-xs text-muted-foreground/30">-</span>;
        }
        case "status": {
          const chip = STATUS_CHIP[essay.status] ?? { label: "未知", color: "default" as const };
          return (
            <Chip size="sm" color={chip.color} variant="flat">
              {chip.label}
            </Chip>
          );
        }
        case "info":
          return (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground truncate max-w-[80px]">{essay.address || "-"}</span>
              <span className="text-xs text-muted-foreground/50 truncate max-w-[80px]">{essay.from || "-"}</span>
            </div>
          );
        case "time": {
          const created = formatDateTimeParts(essay.created_at);
          return (
            <div className="flex flex-col gap-0.5 text-xs">
              <div className="text-muted-foreground tabular-nums">{created.date}</div>
              <div className="text-muted-foreground/60 tabular-nums">{created.time}</div>
            </div>
          );
        }
        case "actions":
          return (
            <div className="flex items-center justify-center gap-1">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                radius="full"
                className="w-7 h-7 min-w-0 text-primary bg-primary/10 hover:bg-primary/20"
                onPress={() => cm.handleEdit(essay)}
              >
                <Edit className="w-3.5 h-3.5" />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                radius="full"
                className="w-7 h-7 min-w-0 text-success-600 bg-success/10 hover:bg-success/20"
                onPress={() => cm.handleView(essay)}
              >
                <Eye className="w-3.5 h-3.5" />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                radius="full"
                className="w-7 h-7 min-w-0 text-danger bg-danger/10 hover:bg-danger/20"
                onPress={() => cm.handleDeleteClick(essay)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          );
        default:
          return null;
      }
    },
    [cm]
  );

  // ---- bottomContent（总数 + 每页 + 选择计数 + 分页 + 上一页/下一页） ----
  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-small text-default-400 whitespace-nowrap">共 {cm.totalItems} 条</span>
          <span className="text-small text-default-300">|</span>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="light" size="sm" className="text-default-400 text-small h-7 min-w-0 gap-1 px-2">
                {cm.pageSize}条/页
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="每页显示条数"
              selectedKeys={new Set([String(cm.pageSize)])}
              selectionMode="single"
              onSelectionChange={keys => {
                const v = Array.from(keys)[0];
                if (v) {
                  cm.setPageSize(Number(v));
                  cm.setPage(1);
                }
              }}
            >
              {PAGE_SIZES.map(n => (
                <DropdownItem key={String(n)}>{n}条/页</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          {cm.selectedIds.size > 0 && (
            <>
              <span className="text-small text-default-300">|</span>
              <span className="text-small text-primary font-medium whitespace-nowrap">
                已选 {cm.selectedIds.size} 项
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={cm.page}
            total={cm.totalPages}
            onChange={cm.setPage}
          />
          <div className="hidden sm:flex gap-1.5">
            <Button
              isDisabled={cm.page <= 1}
              size="sm"
              variant="flat"
              onPress={() => cm.setPage(p => Math.max(1, p - 1))}
            >
              上一页
            </Button>
            <Button
              isDisabled={cm.page >= cm.totalPages}
              size="sm"
              variant="flat"
              onPress={() => cm.setPage(p => Math.min(cm.totalPages, p + 1))}
            >
              下一页
            </Button>
          </div>
        </div>
      </div>
    );
  }, [cm]);

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      <Table
        isHeaderSticky
        aria-label="说说管理表格"
        selectionMode="multiple"
        color="default"
        checkboxesProps={{ color: "primary" }}
        selectedKeys={cm.selectedIds}
        onSelectionChange={cm.handleSelectionChange}
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          base: "flex-1 min-h-0 flex flex-col",
          wrapper: "flex-1 min-h-0 !px-3 !py-0 !shadow-none !rounded-none !border-none",
          table: "border-separate border-spacing-y-1.5 -mt-1.5",
          thead: "[&>tr]:first:!shadow-none after:!hidden",
          th: "bg-[#F6F7FA] dark:bg-default-50 first:!rounded-tl-lg last:!rounded-tr-lg",
          tr: "!rounded-xl",
          td: "first:before:!rounded-s-xl last:before:!rounded-e-xl",
        }}
      >
        <TableHeader columns={TABLE_COLUMNS}>
          {column => (
            <TableColumn key={column.key} align={column.key === "actions" ? "center" : "start"}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={cm.essays}
          emptyContent={<EssayEmptyState hasFilter={!!cm.statusFilter} />}
          isLoading={cm.isFetching && !cm.isLoading}
          loadingContent={<Spinner size="sm" label="加载中..." />}
        >
          {essay => (
            <TableRow key={essay.id}>{columnKey => <TableCell>{renderCell(essay, columnKey)}</TableCell>}</TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
