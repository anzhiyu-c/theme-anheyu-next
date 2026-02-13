"use client";

import { useState, useRef, useCallback } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { Upload, FileArchive, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

interface UploadThemeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File, forceUpdate?: boolean) => Promise<void>;
  isUploading: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadThemeDialog({ isOpen, onOpenChange, onUpload, isUploading }: UploadThemeDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith(".zip")) {
      return;
    }
    if (file.size > MAX_SIZE) {
      return;
    }
    setSelectedFile(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      if (inputRef.current) inputRef.current.value = "";
    },
    [handleFile]
  );

  const handleClose = useCallback(() => {
    setSelectedFile(null);
    setDragOver(false);
    onOpenChange(false);
  }, [onOpenChange]);

  const handleUploadClick = useCallback(async () => {
    if (!selectedFile) return;
    await onUpload(selectedFile);
    setSelectedFile(null);
  }, [selectedFile, onUpload]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={handleClose} size="md">
      <ModalContent>
        <ModalHeader className="text-base font-semibold">上传主题</ModalHeader>
        <ModalBody className="gap-4">
          {/* 提示 */}
          <div className="flex flex-col gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>文件格式：ZIP 压缩包，不超过 50MB</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>必须包含：theme.json、index.html</span>
            </div>
          </div>

          {/* 拖拽上传区 */}
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200",
              dragOver ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/40"
            )}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="w-8 h-8 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">拖拽文件到此处或点击上传</p>
            <p className="text-[11px] text-muted-foreground/50 mt-1">支持 ZIP 格式</p>
            <input ref={inputRef} type="file" accept=".zip" className="hidden" onChange={handleInputChange} />
          </div>

          {/* 已选文件 */}
          {selectedFile && (
            <div className="flex items-center gap-3 px-3 py-2.5 bg-default-50 dark:bg-white/[0.03] rounded-xl">
              <FileArchive className="w-5 h-5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                <p className="text-[11px] text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
              </div>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                radius="full"
                className="text-default-400 hover:text-foreground"
                onPress={() => setSelectedFile(null)}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={handleClose}>
            取消
          </Button>
          {selectedFile && (
            <Button color="primary" onPress={handleUploadClick} isLoading={isUploading}>
              上传主题
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
