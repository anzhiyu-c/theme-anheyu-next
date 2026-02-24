"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Button,
  Chip,
  Spinner,
  Tooltip,
  Pagination,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  ModalBody,
  ModalFooter,
  Progress,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from "@heroui/react";
import {
  Brain,
  Plus,
  Trash2,
  FileText,
  ChevronDown,
  ShieldAlert,
  RotateCw,
  Upload,
  RefreshCw,
  Eye,
  CircleCheckBig,
  Clock,
  Layers,
  AlertTriangle,
  Zap,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { adminContainerVariants, adminItemVariants } from "@/lib/motion";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminDialog } from "@/components/admin/AdminDialog";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { FloatingSelectionBar } from "@/components/admin/FloatingSelectionBar";
import { AnimatePresence } from "framer-motion";
import { PAGE_SIZES } from "@/lib/constants/admin";
import { useKnowledgePage } from "./_hooks/use-knowledge-page";
import type { KnowledgeDocument, KnowledgeDocumentStatus } from "@/types/knowledge";

// ===================================
//     常量 & 工具函数
// ===================================

type TagColor = "success" | "warning" | "primary" | "danger" | "default";

const STATUS_MAP: Record<string, { label: string; color: TagColor }> = {
  indexed: { label: "已索引", color: "success" },
  pending: { label: "待处理", color: "warning" },
  processing: { label: "处理中", color: "primary" },
  failed: { label: "失败", color: "danger" },
  disabled: { label: "已禁用", color: "default" },
};

const SOURCE_TYPE_MAP: Record<string, { label: string; color: TagColor }> = {
  article: { label: "文章", color: "primary" },
  upload: { label: "上传", color: "success" },
  custom: { label: "自定义", color: "default" },
  webpage: { label: "网页", color: "warning" },
};

function formatLength(length: number) {
  if (length >= 1000) return `${(length / 1000).toFixed(1)}K`;
  return String(length);
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleString("zh-CN");
}

const TABLE_COLUMNS = [
  { key: "index", label: "序号", width: 70 },
  { key: "title", label: "标题" },
  { key: "status", label: "状态", width: 100 },
  { key: "chunk_count", label: "分块数", width: 90 },
  { key: "content_length", label: "内容长度", width: 100 },
  { key: "indexed_at", label: "索引时间", width: 170 },
  { key: "actions", label: "操作", width: 140 },
];

const STATUS_FILTER_OPTIONS: { key: KnowledgeDocumentStatus | ""; label: string }[] = [
  { key: "", label: "全部状态" },
  { key: "indexed", label: "已索引" },
  { key: "pending", label: "待处理" },
  { key: "processing", label: "处理中" },
  { key: "failed", label: "失败" },
];

// ===================================
//     骨架屏
// ===================================

function KnowledgeSkeleton() {
  return (
    <div className="relative h-full flex flex-col overflow-hidden -m-4 lg:-m-8">
      <div className="flex-1 min-h-0 flex flex-col mx-6 mt-5 mb-2 bg-card border border-border/60 rounded-xl overflow-hidden">
        <div className="shrink-0 px-5 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-6 w-24 rounded-md bg-muted/40 animate-pulse" />
              <div className="h-3 w-48 rounded-md bg-muted/30 animate-pulse" />
            </div>
            <div className="flex gap-1.5">
              <div className="h-8 w-20 rounded-lg bg-muted/30 animate-pulse" />
              <div className="h-8 w-20 rounded-lg bg-muted/30 animate-pulse" />
              <div className="h-8 w-16 rounded-lg bg-muted/30 animate-pulse" />
            </div>
          </div>
        </div>
        <div className="px-5 pb-3 border-b border-border/50 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted/30 animate-pulse" />
              <div className="space-y-1.5">
                <div className="h-5 w-8 rounded bg-muted/40 animate-pulse" />
                <div className="h-3 w-12 rounded bg-muted/30 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
        <div className="p-5 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 rounded-lg bg-muted/10 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ===================================
//     添加文档弹窗
// ===================================

function AddDocumentModalBody({ km }: { km: ReturnType<typeof useKnowledgePage> }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <>
      <ModalBody className="gap-4">
        <FormInput label="文档标题" placeholder="请输入文档标题" isRequired value={title} onValueChange={setTitle} />
        <FormTextarea
          label="文档内容（支持 Markdown）"
          placeholder="请输入文档内容"
          minRows={8}
          maxRows={16}
          isRequired
          value={content}
          onValueChange={setContent}
        />
      </ModalBody>
      <ModalFooter>
        <Button variant="flat" onPress={km.addDocModal.onClose} isDisabled={km.isSubmitting}>
          取消
        </Button>
        <Button
          color="primary"
          isDisabled={!title.trim() || !content.trim()}
          isLoading={km.isSubmitting}
          onPress={() => km.handleAddDocument({ title: title.trim(), content: content.trim() })}
        >
          确定
        </Button>
      </ModalFooter>
    </>
  );
}

function AddDocumentModal({ km }: { km: ReturnType<typeof useKnowledgePage> }) {
  return (
    <AdminDialog
      isOpen={km.addDocModal.isOpen}
      onClose={km.addDocModal.onClose}
      size="2xl"
      scrollBehavior="inside"
      header={{
        title: "添加文档",
        description: "手动添加自定义文档到知识库",
        icon: Plus,
      }}
    >
      {/* key 强制重新挂载，清空表单状态 */}
      <AddDocumentModalBody key={String(km.addDocModal.isOpen)} km={km} />
    </AdminDialog>
  );
}

// ===================================
//     文档详情 Drawer
// ===================================

function DocumentDetailDrawer({ km }: { km: ReturnType<typeof useKnowledgePage> }) {
  const doc = km.currentDocument;

  return (
    <Drawer isOpen={km.viewDrawer.isOpen} onOpenChange={km.viewDrawer.onOpenChange} size="lg">
      <DrawerContent>
        <DrawerHeader className="border-b border-divider">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-50">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span>文档详情</span>
              <p className="text-xs text-default-400 font-normal mt-0.5">{doc?.title}</p>
            </div>
          </div>
        </DrawerHeader>
        <DrawerBody>
          {doc && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="ID" value={String(doc.id)} />
                <DetailItem label="标题" value={doc.title} />
                <DetailItem
                  label="来源类型"
                  value={
                    <Chip size="sm" color={SOURCE_TYPE_MAP[doc.source_type]?.color || "default"} variant="flat">
                      {SOURCE_TYPE_MAP[doc.source_type]?.label || doc.source_type}
                    </Chip>
                  }
                />
                <DetailItem
                  label="状态"
                  value={
                    <Chip size="sm" color={STATUS_MAP[doc.status]?.color || "default"} variant="flat">
                      {STATUS_MAP[doc.status]?.label || doc.status}
                    </Chip>
                  }
                />
                <DetailItem label="分块数" value={String(doc.chunk_count)} />
                <DetailItem label="内容长度" value={formatLength(doc.content_length)} />
                <DetailItem label="索引时间" value={doc.indexed_at ? formatTime(doc.indexed_at) : "-"} />
                <DetailItem label="创建时间" value={formatTime(doc.created_at)} />
              </div>
              {doc.error_message && (
                <div className="p-3 rounded-lg bg-danger-50 border border-danger-200">
                  <p className="text-sm font-medium text-danger mb-1">错误信息</p>
                  <p className="text-sm text-danger-600">{doc.error_message}</p>
                </div>
              )}
            </div>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

// ===================================
//     主页面
// ===================================

export default function KnowledgePage() {
  const km = useKnowledgePage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) km.handleUpload(file);
      e.target.value = "";
    },
    [km]
  );

  const renderCell = useCallback(
    (doc: KnowledgeDocument, columnKey: React.Key, index: number) => {
      switch (columnKey) {
        case "index":
          return (
            <span className="text-xs text-muted-foreground tabular-nums">
              {(km.page - 1) * km.pageSize + index + 1}
            </span>
          );
        case "title":
          return (
            <div className="flex items-center gap-2 min-w-0">
              <Chip
                size="sm"
                color={SOURCE_TYPE_MAP[doc.source_type]?.color || "default"}
                variant="flat"
                className="shrink-0 text-[10px] h-5"
              >
                {SOURCE_TYPE_MAP[doc.source_type]?.label || doc.source_type}
              </Chip>
              <span className="text-sm truncate">{doc.title}</span>
            </div>
          );
        case "status": {
          const cfg = STATUS_MAP[doc.status];
          return (
            <Chip size="sm" color={cfg?.color || "default"} variant="flat">
              {cfg?.label || doc.status}
            </Chip>
          );
        }
        case "chunk_count":
          return <span className="text-sm tabular-nums">{doc.chunk_count}</span>;
        case "content_length":
          return <span className="text-sm tabular-nums">{formatLength(doc.content_length)}</span>;
        case "indexed_at":
          return (
            <span className="text-xs text-muted-foreground tabular-nums">
              {doc.indexed_at ? formatTime(doc.indexed_at) : "-"}
            </span>
          );
        case "actions":
          return (
            <div className="flex items-center justify-center gap-1">
              <Tooltip content="查看" size="sm">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  radius="full"
                  className="w-7 h-7 min-w-0 text-default-400 hover:text-foreground"
                  onPress={() => km.handleViewDocument(doc)}
                >
                  <Eye className="w-3.5 h-3.5" />
                </Button>
              </Tooltip>
              <Tooltip content="重建索引" size="sm">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  radius="full"
                  className="w-7 h-7 min-w-0 text-default-400 hover:text-foreground"
                  onPress={() => km.handleReindexDocument(doc)}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </Button>
              </Tooltip>
              <Tooltip content="删除" size="sm" color="danger">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  radius="full"
                  className="w-7 h-7 min-w-0 text-danger bg-danger/10 hover:bg-danger/20"
                  onPress={() => km.handleDeleteClick(doc)}
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
    [km]
  );

  // --- Bottom content ---
  const bottomContent = (
    <div className="py-2 px-2 flex flex-wrap justify-between items-center gap-2">
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-small text-default-400 whitespace-nowrap">共 {km.totalItems} 条</span>
        <span className="text-small text-default-300">|</span>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="light" size="sm" className="text-default-400 text-small h-7 min-w-0 gap-1 px-2">
              {km.pageSize}条/页
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="每页显示条数"
            selectedKeys={new Set([String(km.pageSize)])}
            selectionMode="single"
            onSelectionChange={keys => {
              const v = Array.from(keys)[0];
              if (v) {
                km.setPageSize(Number(v));
                km.setPage(1);
              }
            }}
          >
            {PAGE_SIZES.map(n => (
              <DropdownItem key={String(n)}>{n}条/页</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        {km.selectedIds.length > 0 && (
          <>
            <span className="text-small text-default-300">|</span>
            <span className="text-small text-primary font-medium whitespace-nowrap">
              已选 {km.selectedIds.length} 项
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
          page={km.page}
          total={km.totalPages}
          onChange={km.setPage}
        />
      </div>
    </div>
  );

  if (km.isLoading) {
    return <KnowledgeSkeleton />;
  }

  return (
    <motion.div
      className="relative h-full flex flex-col overflow-hidden -m-4 lg:-m-8"
      variants={adminContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={adminItemVariants}
        className="flex-1 min-h-0 flex flex-col mx-6 mt-5 mb-2 bg-card border border-border/60 rounded-xl overflow-hidden"
      >
        {/* 标题区 */}
        <div className="shrink-0 px-5 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold tracking-tight text-foreground">知识库管理</h1>
                {km.config.enabled ? (
                  <Chip size="sm" color="success" variant="flat">
                    已启用
                  </Chip>
                ) : (
                  <Chip size="sm" color="default" variant="flat">
                    未启用
                  </Chip>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">管理 AI 智能问答的知识库文档</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    size="sm"
                    color="warning"
                    variant="flat"
                    startContent={<Zap className="w-3.5 h-3.5" />}
                    isLoading={km.isSyncing}
                    isDisabled={km.isOperating}
                    className="font-medium"
                  >
                    同步文章
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="同步操作" onAction={key => km.handleSync(key === "force")}>
                  <DropdownItem key="sync">同步所有文章</DropdownItem>
                  <DropdownItem key="force">强制重新索引</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <input
                ref={fileInputRef}
                type="file"
                accept={km.supportedTypes.join(",")}
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                size="sm"
                color="success"
                variant="flat"
                startContent={<Upload className="w-3.5 h-3.5" />}
                onPress={() => fileInputRef.current?.click()}
                isLoading={km.isUploading}
                isDisabled={km.isOperating}
                className="font-medium"
              >
                上传
              </Button>
              <Button
                size="sm"
                color="primary"
                startContent={<Plus className="w-3.5 h-3.5" />}
                onPress={km.addDocModal.onOpen}
                isDisabled={km.isOperating}
                className="font-medium shadow-sm"
              >
                添加文档
              </Button>
              <Button
                size="sm"
                variant="flat"
                startContent={<RotateCw className="w-3.5 h-3.5" />}
                onPress={km.refreshAll}
                isDisabled={km.isOperating}
                className="text-default-600"
              >
                刷新
              </Button>
            </div>
          </div>
        </div>

        {/* 统计条 */}
        <div className="px-5 pb-3 border-b border-border/50 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold leading-tight">{km.stats.total_documents}</p>
              <p className="text-xs text-muted-foreground">总文档数</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CircleCheckBig className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-lg font-semibold leading-tight text-emerald-500">{km.stats.indexed_documents}</p>
              <p className="text-xs text-muted-foreground">已索引</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p className="text-lg font-semibold leading-tight text-amber-500">{km.stats.pending_documents}</p>
              <p className="text-xs text-muted-foreground">待处理</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <Layers className="w-4 h-4 text-violet-500" />
            </div>
            <div>
              <p className="text-lg font-semibold leading-tight text-violet-500">{km.stats.total_chunks}</p>
              <p className="text-xs text-muted-foreground">总分块数</p>
            </div>
          </div>
        </div>

        {/* 重建状态提示 */}
        {km.rebuildStatus.is_rebuilding && (
          <div className="mx-5 mt-3 p-3 rounded-lg bg-primary-50 border border-primary-200 flex items-center gap-3">
            <RefreshCw className="w-4 h-4 text-primary animate-spin shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary">
                模型切换中：{km.rebuildStatus.old_provider}/{km.rebuildStatus.old_model} →{" "}
                {km.rebuildStatus.new_provider}/{km.rebuildStatus.new_model}
              </p>
              <Progress size="sm" color="primary" value={km.rebuildProgress} className="mt-1.5" />
            </div>
          </div>
        )}
        {!km.rebuildStatus.is_rebuilding && km.rebuildStatus.end_time > 0 && (
          <div
            className={cn(
              "mx-5 mt-3 p-3 rounded-lg flex items-center gap-3",
              km.rebuildStatus.error
                ? "bg-danger-50 border border-danger-200"
                : "bg-success-50 border border-success-200"
            )}
          >
            {km.rebuildStatus.error ? (
              <AlertTriangle className="w-4 h-4 text-danger shrink-0" />
            ) : (
              <CircleCheckBig className="w-4 h-4 text-success shrink-0" />
            )}
            <p className="text-sm flex-1">
              {km.rebuildStatus.error
                ? km.rebuildStatus.error
                : `重建完成：已处理 ${km.rebuildStatus.processed_docs}/${km.rebuildStatus.total_docs} 个文档，失败 ${km.rebuildStatus.failed_docs} 个`}
            </p>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              radius="full"
              onPress={km.clearRebuildStatus}
              className="w-6 h-6 min-w-0"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}

        {/* 配置信息 */}
        {km.config.enabled && (
          <div className="px-5 py-2.5 border-b border-border/50 flex items-center gap-4 text-[11px] text-muted-foreground/70">
            <span>
              Embedding:{" "}
              <strong className="text-foreground/70">
                {km.config.embedding_provider}/{km.config.embedding_model}
              </strong>
            </span>
            <span className="text-muted-foreground/30">·</span>
            <span>
              向量存储: <strong className="text-foreground/70">{km.config.vector_store}</strong>
            </span>
            <span className="text-muted-foreground/30">·</span>
            <span>
              维度: <strong className="text-foreground/70">{km.config.vector_dimension}</strong>
            </span>
          </div>
        )}

        {/* 筛选栏 */}
        <div className="shrink-0 px-5 py-3 border-b border-border/50 flex items-center gap-3">
          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat" size="sm" className="h-8 gap-1.5 min-w-[100px]">
                {STATUS_FILTER_OPTIONS.find(o => o.key === km.statusFilter)?.label || "全部状态"}
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="状态筛选"
              selectedKeys={new Set([km.statusFilter])}
              selectionMode="single"
              onSelectionChange={keys => {
                const v = Array.from(keys)[0] as string;
                km.setStatusFilter((v ?? "") as KnowledgeDocumentStatus | "");
              }}
            >
              {STATUS_FILTER_OPTIONS.map(o => (
                <DropdownItem key={o.key}>{o.label}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {km.selectedIds.length > 0 && (
            <>
              <Button
                size="sm"
                color="danger"
                variant="flat"
                startContent={<Trash2 className="w-3.5 h-3.5" />}
                onPress={km.batchDeleteModal.onOpen}
                isDisabled={km.isOperating}
              >
                批量删除 ({km.selectedIds.length})
              </Button>
              <Button
                size="sm"
                color="danger"
                variant="flat"
                onPress={km.clearModal.onOpen}
                isDisabled={km.isOperating || km.stats.total_documents === 0}
              >
                清空知识库
              </Button>
            </>
          )}
        </div>

        {/* 文档表格 */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <Table
            isHeaderSticky
            aria-label="知识库文档表格"
            selectionMode="multiple"
            color="default"
            checkboxesProps={{ color: "primary" }}
            selectedKeys={new Set(km.selectedIds.map(String))}
            onSelectionChange={km.handleSelectionChange}
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
              base: "flex-1 min-h-0 flex flex-col",
              wrapper: "flex-1 min-h-0 px-3! py-0! shadow-none! rounded-none! border-none!",
              table: "border-separate border-spacing-y-1.5 -mt-1.5",
              thead: "[&>tr]:first:shadow-none! after:hidden!",
              th: "bg-[#F6F7FA] dark:bg-default-100 first:rounded-tl-lg! last:rounded-tr-lg!",
              tr: "rounded-xl!",
              td: "first:before:rounded-s-xl! last:before:rounded-e-xl!",
            }}
          >
            <TableHeader columns={TABLE_COLUMNS}>
              {column => (
                <TableColumn
                  key={column.key}
                  align={
                    column.key === "actions" ||
                    column.key === "chunk_count" ||
                    column.key === "content_length" ||
                    column.key === "index"
                      ? "center"
                      : "start"
                  }
                  width={column.width}
                >
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={km.documents}
              emptyContent={
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center mb-3">
                    <Brain className="w-6 h-6 text-muted-foreground/40" />
                  </div>
                  <p className="text-sm text-muted-foreground/60">
                    {km.statusFilter ? "没有找到匹配的文档" : "暂无知识库文档"}
                  </p>
                  <p className="text-xs text-muted-foreground/40 mt-1">
                    {km.statusFilter ? "试试调整筛选条件" : "添加文档或同步文章开始使用"}
                  </p>
                </div>
              }
              isLoading={km.isFetching && !km.isLoading}
              loadingContent={<Spinner size="sm" label="加载中..." />}
            >
              {doc => (
                <TableRow key={doc.id}>
                  {columnKey => <TableCell>{renderCell(doc, columnKey, km.documents.indexOf(doc))}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* 浮动选择操作栏 */}
      <AnimatePresence>
        {km.selectedIds.length > 0 && (
          <FloatingSelectionBar
            count={km.selectedIds.length}
            actions={[
              {
                key: "delete",
                label: "删除",
                icon: <Trash2 className="w-3.5 h-3.5" />,
                onClick: km.batchDeleteModal.onOpen,
                variant: "danger",
              },
            ]}
            onClear={() => km.setSelectedIds([])}
          />
        )}
      </AnimatePresence>

      {/* 弹窗集合 */}
      <AddDocumentModal km={km} />
      <DocumentDetailDrawer km={km} />

      <ConfirmDialog
        isOpen={km.deleteModal.isOpen}
        onOpenChange={km.deleteModal.onOpenChange}
        title="删除文档"
        description={`确定要删除文档「${km.deleteTarget?.title || ""}」吗？此操作将同时删除相关的分块和向量数据。`}
        confirmText="删除"
        confirmColor="danger"
        icon={<ShieldAlert className="w-5 h-5 text-danger" />}
        iconBg="bg-danger-50"
        loading={false}
        onConfirm={km.handleDeleteConfirm}
      />

      <ConfirmDialog
        isOpen={km.batchDeleteModal.isOpen}
        onOpenChange={km.batchDeleteModal.onOpenChange}
        title="批量删除"
        description={`确定要删除选中的 ${km.selectedIds.length} 个文档吗？此操作将同时删除相关的分块和向量数据。`}
        confirmText={`删除 ${km.selectedIds.length} 个文档`}
        confirmColor="danger"
        icon={<ShieldAlert className="w-5 h-5 text-danger" />}
        iconBg="bg-danger-50"
        loading={km.isBatchDeleting}
        onConfirm={km.handleBatchDeleteConfirm}
      />

      <ConfirmDialog
        isOpen={km.clearModal.isOpen}
        onOpenChange={km.clearModal.onOpenChange}
        title="清空知识库"
        description={`确定要清空整个知识库吗？当前共有 ${km.stats.total_documents} 个文档、${km.stats.total_chunks} 个分块。此操作不可恢复！`}
        confirmText="确认清空"
        confirmColor="danger"
        icon={<ShieldAlert className="w-5 h-5 text-danger" />}
        iconBg="bg-danger-50"
        loading={km.isClearing}
        onConfirm={km.handleClearConfirm}
      />
    </motion.div>
  );
}
