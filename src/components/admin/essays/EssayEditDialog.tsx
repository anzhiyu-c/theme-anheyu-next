"use client";

import { useState, useCallback, useRef } from "react";
import { ModalBody, ModalFooter, Button, addToast } from "@heroui/react";
import { AdminDialog } from "@/components/admin/AdminDialog";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { FormSelect, FormSelectItem } from "@/components/ui/form-select";
import { X, Link as LinkIcon, Plus, Loader2 } from "lucide-react";
import { ESSAY_STATUS_OPTIONS } from "@/lib/constants/essay";
import { useCreateEssay, useUpdateEssay } from "@/hooks/queries/use-essays";
import { postManagementApi } from "@/lib/api/post-management";
import type { Essay } from "@/lib/api/essay";

interface EssayEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editItem?: Essay | null;
}

export default function EssayEditDialog({ isOpen, onClose, editItem }: EssayEditDialogProps) {
  const isEdit = !!editItem;

  return (
    <AdminDialog
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      header={{
        title: isEdit ? "编辑说说" : "发布说说",
        description: isEdit ? "修改即刻动态内容" : "发布一条新的即刻动态",
        icon: Plus,
      }}
    >
      {isOpen && <EssayEditContent editItem={editItem} onClose={onClose} />}
    </AdminDialog>
  );
}

function EssayEditContent({ editItem, onClose }: { editItem?: Essay | null; onClose: () => void }) {
  const isEdit = !!editItem;

  const [content, setContent] = useState(editItem?.content ?? "");
  const [address, setAddress] = useState(editItem?.address ?? "");
  const [from, setFrom] = useState(editItem?.from ?? "");
  const [link, setLink] = useState(editItem?.link ?? "");
  const [status, setStatus] = useState(String(editItem?.status ?? 1));
  const [sortOrder, setSortOrder] = useState(String(editItem?.sort_order ?? 0));
  const [aplayerId, setAplayerId] = useState(editItem?.aplayer?.id ?? "");
  const [images, setImages] = useState<string[]>(editItem?.image ?? []);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const createEssay = useCreateEssay();
  const updateEssay = useUpdateEssay();
  const isSubmitting = createEssay.isPending || updateEssay.isPending;

  const handleAddImage = useCallback(() => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;
    if (images.includes(trimmed)) {
      addToast({ title: "该图片已添加", color: "warning", timeout: 2000 });
      return;
    }
    setImages(prev => [...prev, trimmed]);
    setNewImageUrl("");
    setShowUrlInput(false);
  }, [newImageUrl, images]);

  const handleRemoveImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        addToast({ title: "请选择图片文件", color: "warning", timeout: 2000 });
        return;
      }
      setUploading(true);
      try {
        const url = await postManagementApi.uploadArticleImage(file);
        if (images.includes(url)) {
          addToast({ title: "该图片已添加", color: "warning", timeout: 2000 });
          return;
        }
        setImages(prev => [...prev, url]);
        addToast({ title: "上传成功", color: "success", timeout: 2000 });
      } catch (err) {
        addToast({
          title: "上传失败",
          description: err instanceof Error ? err.message : "请稍后重试",
          color: "danger",
          timeout: 3000,
        });
      } finally {
        setUploading(false);
      }
    },
    [images]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileUpload(file);
      e.target.value = "";
    },
    [handleFileUpload]
  );

  const handleSubmit = useCallback(async () => {
    if (!content.trim()) {
      addToast({ title: "内容不能为空", color: "warning", timeout: 2000 });
      return;
    }

    const formData = {
      content: content.trim(),
      address: address.trim() || undefined,
      from: from.trim() || undefined,
      link: link.trim() || undefined,
      image: images.length > 0 ? images : undefined,
      aplayer: aplayerId.trim() ? { id: aplayerId.trim() } : undefined,
      status: Number(status),
      sort_order: Number(sortOrder) || 0,
    };

    try {
      if (isEdit && editItem) {
        await updateEssay.mutateAsync({ id: editItem.id, data: formData });
        addToast({ title: "说说已更新", color: "success", timeout: 3000 });
      } else {
        await createEssay.mutateAsync(formData);
        addToast({ title: "说说已发布", color: "success", timeout: 3000 });
      }
      onClose();
    } catch (error) {
      addToast({
        title: error instanceof Error ? error.message : isEdit ? "更新失败" : "发布失败",
        color: "danger",
        timeout: 3000,
      });
    }
  }, [
    content,
    address,
    from,
    link,
    images,
    aplayerId,
    status,
    sortOrder,
    isEdit,
    editItem,
    createEssay,
    updateEssay,
    onClose,
  ]);

  return (
    <>
      <ModalBody className="gap-5 pt-0">
        {/* 相关链接 */}
        <FormInput
          label="相关链接"
          placeholder="https://example.com（可选）"
          value={link}
          onValueChange={setLink}
          startContent={<LinkIcon className="w-4 h-4 text-default-400" />}
        />

        {/* 说说内容 */}
        <FormTextarea
          label="说说内容"
          placeholder="请输入说说内容..."
          value={content}
          onValueChange={setContent}
          minRows={4}
          maxRows={8}
          isRequired
          description={`${content.length} / 5000`}
          maxLength={5000}
        />

        {/* 图片列表 */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">图片列表</p>

          <div className="flex flex-wrap gap-2">
            {/* 已添加的图片 */}
            {images.map((img, index) => (
              <div
                key={index}
                className="relative group w-20 h-20 rounded-xl border border-default-200 overflow-hidden bg-default-50"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`图片 ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* 上传图片按钮 */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-20 h-20 rounded-xl border-2 border-dashed border-default-300 hover:border-primary/50 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-default-50 hover:bg-primary-50/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5 text-default-400" />
                  <span className="text-[10px] text-default-400">上传图片</span>
                </>
              )}
            </button>

            {/* 添加链接按钮 */}
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="w-20 h-20 rounded-xl border-2 border-dashed border-default-300 hover:border-primary/50 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-default-50 hover:bg-primary-50/30"
            >
              <LinkIcon className="w-5 h-5 text-default-400" />
              <span className="text-[10px] text-default-400">添加链接</span>
            </button>
          </div>

          {/* URL 输入 */}
          {showUrlInput && (
            <div className="flex gap-2 items-center">
              <FormInput
                placeholder="输入图片 URL"
                value={newImageUrl}
                onValueChange={setNewImageUrl}
                size="sm"
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddImage();
                  }
                }}
                className="flex-1"
              />
              <Button
                size="sm"
                color="primary"
                variant="flat"
                onPress={handleAddImage}
                isDisabled={!newImageUrl.trim()}
                className="shrink-0"
              >
                添加
              </Button>
            </div>
          )}

          <p className="text-xs text-default-400">支持 JPG、PNG、WEBP 格式，建议尺寸 800x600，也可以直接输入图片链接</p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* 音乐配置 */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">音乐配置</p>
          <div className="rounded-xl bg-default-50 border border-default-200 p-3 space-y-3">
            <div>
              <p className="text-sm text-foreground/80">只支持网易云音乐</p>
              <p className="text-xs text-default-400 mt-0.5">
                请在网易云音乐中找到歌曲，复制歌曲 ID（歌曲链接中的数字）
              </p>
            </div>
            <FormInput
              placeholder="请输入网易云音乐歌曲 ID，如：1901371647"
              value={aplayerId}
              onValueChange={setAplayerId}
              size="sm"
              startContent={
                <span className="text-xs text-default-500 border-r border-default-300 pr-2 mr-1 shrink-0">歌曲 ID</span>
              }
            />
          </div>
        </div>

        {/* 地址、发布者、状态、排序 - 折叠为更多设置 */}
        <div className="grid grid-cols-2 gap-3">
          <FormInput label="地址" placeholder="如：深圳" value={address} onValueChange={setAddress} size="sm" />
          <FormInput label="发布者" placeholder="留空则不显示" value={from} onValueChange={setFrom} size="sm" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormSelect label="状态" value={status} onValueChange={setStatus} size="sm">
            {ESSAY_STATUS_OPTIONS.map(opt => (
              <FormSelectItem key={opt.key}>{opt.label}</FormSelectItem>
            ))}
          </FormSelect>
          <FormInput
            label="排序"
            placeholder="0"
            value={sortOrder}
            onValueChange={setSortOrder}
            type="number"
            description="数值越大越靠前"
            size="sm"
          />
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="flat" onPress={onClose} isDisabled={isSubmitting}>
          取消
        </Button>
        <Button color="primary" onPress={handleSubmit} isLoading={isSubmitting}>
          {isEdit ? "保存修改" : "发布"}
        </Button>
      </ModalFooter>
    </>
  );
}
