"use client";

import { useState, useCallback } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  addToast,
} from "@heroui/react";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { FormSelect, FormSelectItem } from "@/components/ui/form-select";
import { Plus, X, Music, Image as ImageIcon } from "lucide-react";
import { ESSAY_STATUS_OPTIONS } from "@/lib/constants/essay";
import { useCreateEssay, useUpdateEssay } from "@/hooks/queries/use-essays";
import type { Essay } from "@/lib/api/essay";

interface EssayEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editItem?: Essay | null;
}

/**
 * 即刻编辑/创建弹窗
 * 使用 wrapper + inner content 模式
 */
export default function EssayEditDialog({ isOpen, onClose, editItem }: EssayEditDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>{isOpen && <EssayEditContent editItem={editItem} onClose={onClose} />}</ModalContent>
    </Modal>
  );
}

function EssayEditContent({ editItem, onClose }: { editItem?: Essay | null; onClose: () => void }) {
  const isEdit = !!editItem;

  // 表单状态
  const [content, setContent] = useState(editItem?.content ?? "");
  const [address, setAddress] = useState(editItem?.address ?? "");
  const [from, setFrom] = useState(editItem?.from ?? "");
  const [link, setLink] = useState(editItem?.link ?? "");
  const [status, setStatus] = useState(String(editItem?.status ?? 1));
  const [sortOrder, setSortOrder] = useState(String(editItem?.sort_order ?? 0));
  const [aplayerId, setAplayerId] = useState(editItem?.aplayer?.id ?? "");
  const [images, setImages] = useState<string[]>(editItem?.image ?? []);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Mutations
  const createEssay = useCreateEssay();
  const updateEssay = useUpdateEssay();
  const isSubmitting = createEssay.isPending || updateEssay.isPending;

  // 添加图片
  const handleAddImage = useCallback(() => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;
    if (images.includes(trimmed)) {
      addToast({ title: "该图片已添加", color: "warning", timeout: 2000 });
      return;
    }
    setImages(prev => [...prev, trimmed]);
    setNewImageUrl("");
  }, [newImageUrl, images]);

  // 移除图片
  const handleRemoveImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  // 提交
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
      <ModalHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary-50">
            <Plus className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-lg font-semibold">{isEdit ? "编辑说说" : "发布说说"}</span>
            <p className="text-xs text-default-400 font-normal mt-0.5">
              {isEdit ? "修改即刻动态内容" : "发布一条新的即刻动态"}
            </p>
          </div>
        </div>
      </ModalHeader>

      <ModalBody className="gap-4">
        {/* 内容 */}
        <FormTextarea
          label="内容"
          placeholder="分享你的动态..."
          value={content}
          onValueChange={setContent}
          minRows={4}
          maxRows={10}
          isRequired
          description="支持文本内容"
        />

        {/* 地址和发布者 */}
        <div className="grid grid-cols-2 gap-3">
          <FormInput label="地址" placeholder="如：深圳" value={address} onValueChange={setAddress} />
          <FormInput label="发布者" placeholder="留空则显示为 -" value={from} onValueChange={setFrom} />
        </div>

        {/* 链接 */}
        <FormInput label="相关链接" placeholder="https://..." value={link} onValueChange={setLink} />

        {/* 音乐 */}
        <FormInput
          label="音乐 ID"
          placeholder="网易云音乐歌曲 ID"
          value={aplayerId}
          onValueChange={setAplayerId}
          startContent={<Music className="w-4 h-4 text-default-400" />}
          description="填写网易云音乐歌曲 ID 以添加音乐播放器"
        />

        {/* 图片列表 */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">图片</p>
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="relative group rounded-lg border border-border/50 overflow-hidden aspect-video bg-muted"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`图片 ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <FormInput
              placeholder="输入图片 URL"
              value={newImageUrl}
              onValueChange={setNewImageUrl}
              size="sm"
              startContent={<ImageIcon className="w-4 h-4 text-default-400" />}
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
              variant="flat"
              onPress={handleAddImage}
              isDisabled={!newImageUrl.trim()}
              className="shrink-0"
            >
              添加
            </Button>
          </div>
        </div>

        {/* 状态和排序 */}
        <div className="grid grid-cols-2 gap-3">
          <FormSelect
            label="状态"
            value={status}
            onValueChange={setStatus}
          >
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
          />
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="light" onPress={onClose} isDisabled={isSubmitting}>
          取消
        </Button>
        <Button color="primary" onPress={handleSubmit} isLoading={isSubmitting}>
          {isEdit ? "保存修改" : "发布说说"}
        </Button>
      </ModalFooter>
    </>
  );
}
