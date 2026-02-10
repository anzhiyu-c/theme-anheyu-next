"use client";

import { useState, useRef } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, addToast } from "@heroui/react";
import { Upload, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { useImportArticles } from "@/hooks/queries/use-post-management";

interface ImportModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: ReturnType<typeof useImportArticles>;
}

export function ImportModal({ isOpen, onOpenChange, onImport }: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async () => {
    if (!file) {
      addToast({ title: "请选择文件", color: "warning", timeout: 3000 });
      return;
    }
    try {
      const result = await onImport.mutateAsync({ file });
      addToast({
        title: `导入完成：成功 ${result.imported} 篇，跳过 ${result.skipped} 篇`,
        color: "success",
        timeout: 5000,
      });
      setFile(null);
      onOpenChange(false);
    } catch (error) {
      addToast({ title: error instanceof Error ? error.message : "导入失败", color: "danger", timeout: 3000 });
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" placement="center">
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary-50">
                  <Upload className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span>导入文章</span>
                  <p className="text-xs text-default-400 font-normal mt-0.5">支持 JSON 或 ZIP 格式</p>
                </div>
              </div>
            </ModalHeader>
            <ModalBody>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.zip"
                onChange={e => setFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
              <button
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
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose} isDisabled={onImport.isPending}>
                取消
              </Button>
              <Button color="primary" onPress={handleImport} isDisabled={!file} isLoading={onImport.isPending}>
                开始导入
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
