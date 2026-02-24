"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Switch,
  addToast,
} from "@heroui/react";
import type { ImportDonationOptions } from "@/types/donation";

interface DonationImportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  isImporting?: boolean;
  isExporting?: boolean;
  onImport: (file: File, options: ImportDonationOptions) => Promise<void>;
  onExportAll: () => Promise<void>;
  onExportSelected: () => Promise<void>;
}

interface DonationEntry {
  name: string;
  amount: number;
  [key: string]: unknown;
}

/**
 * Read the selected file, validate its JSON structure, and normalise
 * bare-array input (e.g. `[{…}]`) into the standard wrapper format
 * (`{ donations: [{…}] }`).  Returns a (possibly rewritten) File
 * ready for upload, or throws a user-facing error string.
 */
async function validateAndNormaliseDonationFile(raw: File): Promise<File> {
  const text = await raw.text();

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("文件不是有效的 JSON 格式");
  }

  let donations: unknown[];

  if (Array.isArray(parsed)) {
    donations = parsed;
  } else if (
    parsed !== null &&
    typeof parsed === "object" &&
    Array.isArray((parsed as Record<string, unknown>).donations)
  ) {
    donations = (parsed as Record<string, unknown>).donations as unknown[];
  } else {
    throw new Error("JSON 结构不正确，需要 { donations: [...] } 或 [...]");
  }

  if (donations.length === 0) {
    throw new Error("导入数据为空，donations 数组中没有记录");
  }

  for (let i = 0; i < donations.length; i++) {
    const item = donations[i] as Partial<DonationEntry>;
    if (!item.name || typeof item.name !== "string") {
      throw new Error(`第 ${i + 1} 条记录缺少有效的 name 字段`);
    }
    if (item.amount === undefined || typeof item.amount !== "number") {
      throw new Error(`第 ${i + 1} 条记录缺少有效的 amount 字段`);
    }
  }

  if (Array.isArray(parsed)) {
    const wrapped = JSON.stringify({ version: "1.0", count: donations.length, donations });
    return new File([wrapped], raw.name, { type: "application/json" });
  }

  return raw;
}

export function DonationImportDialog({
  isOpen,
  onOpenChange,
  selectedCount,
  isImporting = false,
  isExporting = false,
  onImport,
  onExportAll,
  onExportSelected,
}: DonationImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [skipExisting, setSkipExisting] = useState(true);
  const [defaultStatus, setDefaultStatus] = useState("0");
  const [isValidating, setIsValidating] = useState(false);

  const fileName = useMemo(() => file?.name || "未选择文件", [file]);

  const handleStartImport = useCallback(
    async (onClose: () => void) => {
      if (!file) return;
      setIsValidating(true);
      try {
        const normalised = await validateAndNormaliseDonationFile(file);
        await onImport(normalised, {
          skip_existing: skipExisting,
          default_status: Number(defaultStatus),
        });
        setFile(null);
        onClose();
      } catch (error) {
        addToast({
          title: error instanceof Error ? error.message : "导入校验失败",
          color: "danger",
          timeout: 4000,
        });
      } finally {
        setIsValidating(false);
      }
    },
    [file, onImport, skipExisting, defaultStatus]
  );

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" backdrop="blur">
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>打赏记录导入 / 导出</ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div className="rounded-xl border border-default-200 p-3 space-y-2">
                  <p className="text-sm font-medium">导出数据</p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="flat" color="primary" isLoading={isExporting} onPress={onExportAll}>
                      导出全部
                    </Button>
                    <Button
                      variant="flat"
                      color="secondary"
                      isDisabled={selectedCount === 0}
                      isLoading={isExporting}
                      onPress={onExportSelected}
                    >
                      导出已选（{selectedCount}）
                    </Button>
                  </div>
                </div>

                <div className="rounded-xl border border-default-200 p-3 space-y-3">
                  <p className="text-sm font-medium">导入数据</p>
                  <div className="space-y-1.5">
                    <label htmlFor="donation-import-file" className="text-sm text-default-600">
                      选择文件（JSON）
                    </label>
                    <input
                      id="donation-import-file"
                      type="file"
                      accept=".json,.txt"
                      onChange={event => {
                        const picked = event.target.files?.[0];
                        setFile(picked || null);
                      }}
                      className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-primary-foreground file:cursor-pointer"
                    />
                    <p className="text-xs text-default-500">当前文件：{fileName}</p>
                  </div>

                  <Switch isSelected={skipExisting} onValueChange={setSkipExisting}>
                    跳过已存在记录
                  </Switch>

                  <Select
                    label="导入状态策略"
                    selectedKeys={[defaultStatus]}
                    onSelectionChange={keys => {
                      const key = Array.from(keys)[0];
                      setDefaultStatus(key ? String(key) : "0");
                    }}
                  >
                    <SelectItem key="0">保持原状态</SelectItem>
                    <SelectItem key="1">统一设为显示</SelectItem>
                    <SelectItem key="2">统一设为隐藏</SelectItem>
                  </Select>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose} isDisabled={isImporting || isExporting}>
                关闭
              </Button>
              <Button
                color="primary"
                isLoading={isImporting || isValidating}
                isDisabled={!file}
                onPress={() => handleStartImport(onClose)}
              >
                开始导入
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
