"use client";

import { useState, useRef, useCallback } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Switch, addToast } from "@heroui/react";
import { FormSelect, FormSelectItem } from "@/components/ui/form-select";
import { Upload, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { ESSAY_STATUS_OPTIONS } from "@/lib/constants/essay";
import { useImportEssays } from "@/hooks/queries/use-essays";

interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 即刻导入弹窗
 */
export default function ImportDialog({ isOpen, onClose }: ImportDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>{isOpen && <ImportContent onClose={onClose} />}</ModalContent>
    </Modal>
  );
}

function ImportContent({ onClose }: { onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [skipExisting, setSkipExisting] = useState(true);
  const [defaultStatus, setDefaultStatus] = useState("1");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importEssays = useImportEssays();

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
  }, []);

  const handleImport = useCallback(async () => {
    if (!file) {
      addToast({ title: "请选择文件", color: "warning", timeout: 3000 });
      return;
    }

    try {
      const result = await importEssays.mutateAsync({
        file,
        options: {
          skip_existing: skipExisting,
          default_status: Number(defaultStatus),
        },
      });

      addToast({
        title: `导入完成：成功 ${result.success_count} 条，跳过 ${result.skipped_count} 条${
          result.failed_count > 0 ? `，失败 ${result.failed_count} 条` : ""
        }`,
        color: result.failed_count > 0 ? "warning" : "success",
        timeout: 5000,
      });

      setFile(null);
      onClose();
    } catch (error) {
      addToast({
        title: error instanceof Error ? error.message : "导入失败",
        color: "danger",
        timeout: 3000,
      });
    }
  }, [file, skipExisting, defaultStatus, importEssays, onClose]);

  return (
    <>
      <ModalHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary-50">
            <Upload className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-lg font-semibold">导入说说</span>
            <p className="text-xs text-default-400 font-normal mt-0.5">支持 JSON 或 ZIP 格式</p>
          </div>
        </div>
      </ModalHeader>

      <ModalBody className="gap-4">
        {/* 文件选择区域 */}
        <input ref={fileInputRef} type="file" accept=".json,.zip" onChange={handleFileSelect} className="hidden" />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "w-full border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer",
            file
              ? "border-primary/50 bg-primary-50/30"
              : "border-default-200 hover:border-primary/30 hover:bg-default-50"
          )}
        >
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <div className="p-2.5 rounded-xl bg-primary-100">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-medium">{file.name}</span>
              <span className="text-xs text-default-400">{(file.size / 1024).toFixed(1)} KB</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-default-400">
              <div className="p-2.5 rounded-xl bg-default-100">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">点击选择文件</span>
              <span className="text-xs text-default-300">JSON / ZIP</span>
            </div>
          )}
        </button>

        {/* 导入选项 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">跳过已存在的</p>
              <p className="text-xs text-muted-foreground">通过内容和创建时间匹配重复项</p>
            </div>
            <Switch isSelected={skipExisting} onValueChange={setSkipExisting} size="sm" />
          </div>

          <FormSelect
            label="默认状态"
            value={defaultStatus}
            onValueChange={setDefaultStatus}
            size="sm"
            description="导入的说说将使用此状态（除非文件中已指定）"
          >
            {ESSAY_STATUS_OPTIONS.map(opt => (
              <FormSelectItem key={opt.key}>{opt.label}</FormSelectItem>
            ))}
          </FormSelect>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="light" onPress={onClose} isDisabled={importEssays.isPending}>
          取消
        </Button>
        <Button color="primary" onPress={handleImport} isDisabled={!file} isLoading={importEssays.isPending}>
          开始导入
        </Button>
      </ModalFooter>
    </>
  );
}
