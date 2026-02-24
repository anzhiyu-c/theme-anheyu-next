"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Textarea,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "@heroui/react";
import type { ProductListItem, ProductVariant, StockItem } from "@/types/product";
import { productApi } from "@/lib/api/product";
import { formatDateTime } from "@/utils/date";
import { addToast } from "@heroui/react";
import { getErrorMessage } from "@/lib/api/client";

function parseImportLines(text: string): string[] {
  return text
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

interface StockManageDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductListItem | null;
}

const stockStatusMap: Record<number, { label: string; color: "success" | "warning" | "danger" | "default" }> = {
  1: { label: "可用", color: "success" },
  2: { label: "已使用", color: "warning" },
  3: { label: "已作废", color: "danger" },
};

export function StockManageDialog({ isOpen, onOpenChange, product }: StockManageDialogProps) {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importText, setImportText] = useState("");

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const selectedVariant = useMemo(
    () => variants.find(item => item.id === selectedVariantId) || null,
    [variants, selectedVariantId]
  );

  const fetchVariants = useCallback(async () => {
    if (!product) return;
    setIsLoading(true);
    try {
      const response = await productApi.getAdminProduct(product.id);
      if (response.code !== 200 || !response.data) {
        throw new Error(response.message || "获取商品详情失败");
      }
      const list = response.data.variants || [];
      setVariants(list);
      setSelectedVariantId(list[0]?.id || "");
    } catch (error) {
      addToast({
        title: error instanceof Error ? error.message : "获取型号失败",
        color: "danger",
        timeout: 3000,
      });
      setVariants([]);
      setSelectedVariantId("");
    } finally {
      setIsLoading(false);
    }
  }, [product]);

  const fetchStockList = useCallback(async () => {
    if (!selectedVariantId) {
      setStockItems([]);
      setTotalItems(0);
      return;
    }
    setIsLoading(true);
    try {
      const response = await productApi.getStockList(selectedVariantId, {
        page,
        page_size: pageSize,
        status: statusFilter ?? undefined,
      });
      if (response.code !== 200 || !response.data) {
        throw new Error(response.message || "获取库存失败");
      }
      setStockItems(response.data.list || []);
      setTotalItems(response.data.total || 0);
    } catch (error) {
      addToast({
        title: error instanceof Error ? error.message : "获取库存失败",
        color: "danger",
        timeout: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedVariantId, page, pageSize, statusFilter]);

  useEffect(() => {
    if (!isOpen) return;
    setImportText("");
    setStatusFilter(null);
    setPage(1);
    fetchVariants();
  }, [isOpen, fetchVariants]);

  useEffect(() => {
    if (!isOpen) return;
    fetchStockList();
  }, [isOpen, fetchStockList]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl" scrollBehavior="inside" backdrop="blur">
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>库存管理{product ? ` - ${product.title}` : ""}</ModalHeader>
            <ModalBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr] gap-2">
                <Select
                  label="商品型号"
                  placeholder="请选择型号"
                  selectedKeys={selectedVariantId ? [selectedVariantId] : []}
                  onSelectionChange={keys => {
                    const key = Array.from(keys)[0];
                    setSelectedVariantId(key ? String(key) : "");
                    setPage(1);
                  }}
                >
                  {variants.map(item => (
                    <SelectItem key={item.id}>
                      {item.name}（¥{(item.price / 100).toFixed(2)}）
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label="库存状态"
                  placeholder="全部状态"
                  selectedKeys={statusFilter ? [String(statusFilter)] : []}
                  isClearable
                  onSelectionChange={keys => {
                    const key = Array.from(keys)[0];
                    setStatusFilter(key ? Number(key) : null);
                    setPage(1);
                  }}
                  onClear={() => {
                    setStatusFilter(null);
                    setPage(1);
                  }}
                >
                  <SelectItem key="1">可用</SelectItem>
                  <SelectItem key="2">已使用</SelectItem>
                  <SelectItem key="3">已作废</SelectItem>
                </Select>
                <div className="flex items-end">
                  <Chip variant="flat" color="secondary">
                    当前型号库存：{selectedVariant?.stock_count ?? 0}
                  </Chip>
                </div>
              </div>

              <div className="rounded-xl border border-default-200 p-3 space-y-2">
                <p className="text-sm font-medium">批量导入卡密（每行一个）</p>
                <Textarea
                  value={importText}
                  onValueChange={setImportText}
                  placeholder={"示例：\nABC-001\nABC-002\nABC-003"}
                  minRows={4}
                />
                <div className="flex justify-end">
                  <Button
                    color="primary"
                    isDisabled={!selectedVariantId || !importText.trim()}
                    isLoading={isImporting}
                    onPress={async () => {
                      if (!selectedVariantId || !importText.trim()) return;
                      const lines = parseImportLines(importText);
                      if (lines.length === 0) {
                        addToast({ title: "请输入至少一条有效卡密", color: "warning", timeout: 3000 });
                        return;
                      }
                      setIsImporting(true);
                      try {
                        const response = await productApi.importStock(selectedVariantId, {
                          items: lines,
                          item_text: importText.trim(),
                        });
                        if (response.code !== 200) {
                          throw new Error(response.message || "导入失败");
                        }
                        const data = response.data;
                        const imported = data?.imported ?? data?.imported_count ?? 0;
                        const dup = data?.duplicate ?? 0;
                        addToast({
                          title: `导入成功：新增 ${imported} 条${dup > 0 ? `，重复 ${dup} 条` : ""}`,
                          color: "success",
                          timeout: 3000,
                        });
                        setImportText("");
                        await fetchStockList();
                      } catch (error) {
                        addToast({
                          title: getErrorMessage(error),
                          color: "danger",
                          timeout: 4000,
                        });
                      } finally {
                        setIsImporting(false);
                      }
                    }}
                  >
                    导入库存
                  </Button>
                </div>
              </div>

              <Table aria-label="库存列表" removeWrapper>
                <TableHeader>
                  <TableColumn key="content">卡密内容</TableColumn>
                  <TableColumn key="status">状态</TableColumn>
                  <TableColumn key="created_at">导入时间</TableColumn>
                  <TableColumn key="used_at">使用时间</TableColumn>
                  <TableColumn key="actions" align="center">
                    操作
                  </TableColumn>
                </TableHeader>
                <TableBody
                  items={stockItems}
                  isLoading={isLoading}
                  loadingContent={"加载中..."}
                  emptyContent={selectedVariantId ? "暂无库存记录" : "请先选择型号"}
                >
                  {item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.content}</TableCell>
                      <TableCell>
                        <Chip size="sm" variant="flat" color={stockStatusMap[item.status]?.color || "default"}>
                          {stockStatusMap[item.status]?.label || "未知状态"}
                        </Chip>
                      </TableCell>
                      <TableCell>{formatDateTime(item.created_at)}</TableCell>
                      <TableCell>{item.used_at ? formatDateTime(item.used_at) : "-"}</TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Button
                            size="sm"
                            variant="light"
                            color="danger"
                            isDisabled={item.status !== 1}
                            onPress={async () => {
                              try {
                                const response = await productApi.invalidateStock(item.id);
                                if (response.code !== 200) {
                                  throw new Error(response.message || "作废失败");
                                }
                                addToast({ title: "卡密已作废", color: "success", timeout: 2500 });
                                await fetchStockList();
                              } catch (error) {
                                addToast({
                                  title: getErrorMessage(error),
                                  color: "danger",
                                  timeout: 3000,
                                });
                              }
                            }}
                          >
                            作废
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ModalBody>
            <ModalFooter className="flex items-center justify-between">
              <Pagination isCompact showControls page={page} total={totalPages} onChange={setPage} />
              <Button variant="light" onPress={onClose}>
                关闭
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
