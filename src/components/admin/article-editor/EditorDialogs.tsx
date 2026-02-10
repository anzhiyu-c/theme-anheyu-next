"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Switch } from "@heroui/react";
import { Link2, ImageIcon, Unlink, ExternalLink } from "lucide-react";

/** 校验是否为合法 URL（支持 http/https/mailto/tel 等协议） */
function isValidUrl(value: string): boolean {
  if (!value.trim()) return false;
  try {
    const url = new URL(value.trim());
    return ["http:", "https:", "mailto:", "tel:", "ftp:"].includes(url.protocol);
  } catch {
    // 允许相对路径（以 / 开头）
    return value.trim().startsWith("/");
  }
}

// ===================================
//         链接插入对话框
// ===================================

interface LinkDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** 当前已有的链接地址（编辑模式） */
  currentUrl?: string;
  /** 当前链接的 target 属性 */
  currentTarget?: string | null;
  onConfirm: (url: string, target: string) => void;
  onRemove: () => void;
}

export function LinkDialog({ isOpen, onOpenChange, currentUrl, currentTarget, onConfirm, onRemove }: LinkDialogProps) {
  const [url, setUrl] = useState("");
  const [openInNewTab, setOpenInNewTab] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  // 打开时重置状态（渲染阶段调整状态，React 推荐模式）
  if (isOpen && !prevIsOpen) {
    setUrl(currentUrl || "");
    // 编辑模式：保留当前 target；新建模式：默认新标签页打开
    setOpenInNewTab(currentUrl ? currentTarget === "_blank" : true);
    setPrevIsOpen(true);
  } else if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false);
  }

  // 打开时聚焦（仅副作用）
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // 链接校验：有输入且不合法时显示错误
  const urlTrimmed = url.trim();
  const urlError = useMemo(() => {
    if (!urlTrimmed) return "";
    return isValidUrl(urlTrimmed) ? "" : "请输入有效的链接地址";
  }, [urlTrimmed]);
  const canConfirm = urlTrimmed.length > 0 && !urlError;

  const handleConfirm = useCallback(() => {
    if (!canConfirm) return;
    onConfirm(urlTrimmed, openInNewTab ? "_blank" : "_self");
    onOpenChange(false);
  }, [canConfirm, urlTrimmed, openInNewTab, onConfirm, onOpenChange]);

  const handleRemove = useCallback(() => {
    onRemove();
    onOpenChange(false);
  }, [onRemove, onOpenChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleConfirm();
      }
    },
    [handleConfirm]
  );

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="md"
      classNames={{ wrapper: "z-[200]", backdrop: "z-[199]" }}
    >
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex items-center gap-2 text-base">
              <Link2 className="w-4 h-4" />
              <span>{currentUrl ? "编辑链接" : "插入链接"}</span>
            </ModalHeader>

            <ModalBody className="gap-3">
              <Input
                ref={inputRef}
                label="链接地址"
                placeholder="https://example.com"
                value={url}
                onValueChange={setUrl}
                onKeyDown={handleKeyDown}
                variant="bordered"
                autoComplete="url"
                isInvalid={!!urlError}
                errorMessage={urlError}
                startContent={<Link2 className="w-4 h-4 text-default-400 shrink-0" />}
              />

              <Switch
                size="sm"
                isSelected={openInNewTab}
                onValueChange={setOpenInNewTab}
                classNames={{
                  base: "flex-row-reverse justify-between w-full max-w-full py-1.5 px-1",
                  label: "text-sm text-default-600",
                }}
                thumbIcon={<ExternalLink className="w-2.5 h-2.5" />}
              >
                在新标签页打开
              </Switch>
            </ModalBody>

            <ModalFooter>
              {currentUrl && (
                <Button
                  variant="flat"
                  color="danger"
                  onPress={handleRemove}
                  size="sm"
                  startContent={<Unlink className="w-3.5 h-3.5" />}
                  className="mr-auto"
                >
                  移除链接
                </Button>
              )}
              <Button variant="flat" onPress={onClose} size="sm">
                取消
              </Button>
              <Button color="primary" onPress={handleConfirm} isDisabled={!canConfirm} size="sm">
                {currentUrl ? "更新" : "插入"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

// ===================================
//         图片插入对话框
// ===================================

interface ImageDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (url: string, alt?: string) => void;
}

export function ImageDialog({ isOpen, onOpenChange, onConfirm }: ImageDialogProps) {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [previewError, setPreviewError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  // 打开时重置状态（渲染阶段调整状态）
  if (isOpen && !prevIsOpen) {
    setUrl("");
    setAlt("");
    setPreviewError(false);
    setPrevIsOpen(true);
  } else if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false);
  }

  // 打开时聚焦
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // 图片地址校验
  const imgUrlTrimmed = url.trim();
  const imgUrlError = useMemo(() => {
    if (!imgUrlTrimmed) return "";
    return isValidUrl(imgUrlTrimmed) ? "" : "请输入有效的图片地址";
  }, [imgUrlTrimmed]);
  const canInsertImage = imgUrlTrimmed.length > 0 && !imgUrlError;

  const handleConfirm = useCallback(() => {
    if (!canInsertImage) return;
    onConfirm(imgUrlTrimmed, alt.trim() || undefined);
    onOpenChange(false);
  }, [canInsertImage, imgUrlTrimmed, alt, onConfirm, onOpenChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleConfirm();
      }
    },
    [handleConfirm]
  );

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      classNames={{ wrapper: "z-[200]", backdrop: "z-[199]" }}
    >
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex items-center gap-2 text-base">
              <ImageIcon className="w-4 h-4" />
              <span>插入图片</span>
            </ModalHeader>

            <ModalBody className="gap-3">
              <Input
                ref={inputRef}
                label="图片地址"
                placeholder="https://example.com/image.png"
                value={url}
                onValueChange={v => {
                  setUrl(v);
                  setPreviewError(false);
                }}
                onKeyDown={handleKeyDown}
                variant="bordered"
                autoComplete="url"
                isInvalid={!!imgUrlError}
                errorMessage={imgUrlError}
                startContent={<ImageIcon className="w-4 h-4 text-default-400 shrink-0" />}
              />

              <Input
                label="替代文本（可选）"
                placeholder="图片描述，用于无障碍访问"
                value={alt}
                onValueChange={setAlt}
                onKeyDown={handleKeyDown}
                variant="bordered"
                size="sm"
              />

              {/* 图片预览 */}
              {canInsertImage && (
                <div className="border border-default-200 rounded-lg overflow-hidden bg-default-50">
                  <div className="px-3 py-1.5 text-xs text-default-400 border-b border-default-200">预览</div>
                  <div className="p-3 flex items-center justify-center min-h-[120px]">
                    {previewError ? (
                      <span className="text-xs text-default-300">无法加载预览</span>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={url}
                        alt={alt || "预览"}
                        className="max-h-[200px] max-w-full object-contain rounded"
                        onError={() => setPreviewError(true)}
                      />
                    )}
                  </div>
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              <Button variant="flat" onPress={onClose} size="sm">
                取消
              </Button>
              <Button color="primary" onPress={handleConfirm} isDisabled={!canInsertImage} size="sm">
                插入图片
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
