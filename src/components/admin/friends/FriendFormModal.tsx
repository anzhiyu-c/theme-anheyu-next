"use client";

import { useState, useCallback } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Switch, addToast } from "@heroui/react";
import { Plus } from "lucide-react";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { FormSelect, FormSelectItem } from "@/components/ui/form-select";
import {
  useLinkCategories,
  useLinkTags,
  useCreateLink,
  useUpdateLink,
  useCreateCategory,
  useCreateTag,
} from "@/hooks/queries/use-friends";
import type { LinkItem, LinkStatus, CreateLinkRequest } from "@/types/friends";

interface FriendFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editItem?: LinkItem | null;
}

const STATUS_OPTIONS = [
  { key: "APPROVED", label: "已通过" },
  { key: "PENDING", label: "待审核" },
  { key: "REJECTED", label: "已拒绝" },
];

/**
 * 友链创建/编辑弹窗
 * 使用 wrapper + inner content 模式，避免 useEffect setState
 */
export default function FriendFormModal({ isOpen, onClose, editItem }: FriendFormModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>{isOpen && <FriendFormContent editItem={editItem} onClose={onClose} />}</ModalContent>
    </Modal>
  );
}

function FriendFormContent({ editItem, onClose }: { editItem?: LinkItem | null; onClose: () => void }) {
  const isEdit = !!editItem;

  // 表单状态
  const [name, setName] = useState(editItem?.name ?? "");
  const [url, setUrl] = useState(editItem?.url ?? "");
  const [logo, setLogo] = useState(editItem?.logo ?? "");
  const [description, setDescription] = useState(editItem?.description ?? "");
  const [siteshot, setSiteshot] = useState(editItem?.siteshot ?? "");
  const [email, setEmail] = useState(editItem?.email ?? "");
  const [categoryId, setCategoryId] = useState<string>(editItem?.category?.id ? String(editItem.category.id) : "");
  const [tagId, setTagId] = useState<string>(editItem?.tag?.id ? String(editItem.tag.id) : "");
  const [status, setStatus] = useState<string>(editItem?.status ?? "PENDING");
  const [sortOrder, setSortOrder] = useState(String(editItem?.sort_order ?? 0));
  const [skipHealthCheck, setSkipHealthCheck] = useState(editItem?.skip_health_check ?? false);

  // 快速新建分类/标签
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showNewTag, setShowNewTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#3B82F6");

  // Queries & Mutations
  const { data: categories = [] } = useLinkCategories();
  const { data: tags = [] } = useLinkTags();
  const createLink = useCreateLink();
  const updateLink = useUpdateLink();
  const createCategory = useCreateCategory();
  const createTag = useCreateTag();

  const handleQuickCreateCategory = useCallback(async () => {
    if (!newCategoryName.trim()) return;
    try {
      const result = await createCategory.mutateAsync({
        name: newCategoryName.trim(),
        style: "card",
      });
      setCategoryId(String(result.id));
      setNewCategoryName("");
      setShowNewCategory(false);
      addToast({ title: "分类创建成功", color: "success", timeout: 2000 });
    } catch (error) {
      addToast({
        title: error instanceof Error ? error.message : "创建分类失败",
        color: "danger",
        timeout: 3000,
      });
    }
  }, [newCategoryName, createCategory]);

  const handleQuickCreateTag = useCallback(async () => {
    if (!newTagName.trim()) return;
    try {
      const result = await createTag.mutateAsync({
        name: newTagName.trim(),
        color: newTagColor,
      });
      setTagId(String(result.id));
      setNewTagName("");
      setShowNewTag(false);
      addToast({ title: "标签创建成功", color: "success", timeout: 2000 });
    } catch (error) {
      addToast({
        title: error instanceof Error ? error.message : "创建标签失败",
        color: "danger",
        timeout: 3000,
      });
    }
  }, [newTagName, newTagColor, createTag]);

  const handleSubmit = useCallback(async () => {
    if (!name.trim()) {
      addToast({ title: "请输入网站名称", color: "warning", timeout: 3000 });
      return;
    }
    if (!url.trim()) {
      addToast({ title: "请输入网站地址", color: "warning", timeout: 3000 });
      return;
    }
    if (!logo.trim()) {
      addToast({ title: "请输入网站 Logo", color: "warning", timeout: 3000 });
      return;
    }
    if (!categoryId) {
      addToast({ title: "请选择分类", color: "warning", timeout: 3000 });
      return;
    }

    const data: CreateLinkRequest = {
      name: name.trim(),
      url: url.trim(),
      logo: logo.trim(),
      description: description.trim(),
      siteshot: siteshot.trim(),
      email: email.trim(),
      category_id: Number(categoryId),
      tag_id: tagId ? Number(tagId) : null,
      status: status as LinkStatus,
      sort_order: Number(sortOrder) || 0,
      skip_health_check: skipHealthCheck,
    };

    try {
      if (isEdit && editItem) {
        await updateLink.mutateAsync({ id: editItem.id, data });
        addToast({ title: "友链更新成功", color: "success", timeout: 3000 });
      } else {
        await createLink.mutateAsync(data);
        addToast({ title: "友链创建成功", color: "success", timeout: 3000 });
      }
      onClose();
    } catch (error) {
      addToast({
        title: error instanceof Error ? error.message : "操作失败",
        color: "danger",
        timeout: 3000,
      });
    }
  }, [
    name,
    url,
    logo,
    description,
    siteshot,
    email,
    categoryId,
    tagId,
    status,
    sortOrder,
    skipHealthCheck,
    isEdit,
    editItem,
    createLink,
    updateLink,
    onClose,
  ]);

  const isSubmitting = createLink.isPending || updateLink.isPending;

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">{isEdit ? "编辑友链" : "新建友链"}</ModalHeader>
      <ModalBody className="gap-4">
        {/* 基本信息 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput label="网站名称" placeholder="输入网站名称" value={name} onValueChange={setName} isRequired />
          <FormInput label="网站地址" placeholder="https://example.com" value={url} onValueChange={setUrl} isRequired />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="网站 Logo"
            placeholder="https://example.com/logo.png"
            value={logo}
            onValueChange={setLogo}
            isRequired
          />
          <FormInput
            label="网站快照"
            placeholder="https://example.com/screenshot.png"
            value={siteshot}
            onValueChange={setSiteshot}
          />
        </div>

        <FormTextarea
          label="网站描述"
          placeholder="输入网站描述"
          value={description}
          onValueChange={setDescription}
          minRows={2}
          maxRows={4}
        />

        <FormInput label="联系邮箱" placeholder="admin@example.com" value={email} onValueChange={setEmail} />

        {/* 分类选择 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FormSelect
              label="分类"
              placeholder="选择分类"
              value={categoryId}
              onValueChange={setCategoryId}
              isRequired
              className="flex-1"
            >
              {categories.map(cat => (
                <FormSelectItem key={String(cat.id)}>{cat.name}</FormSelectItem>
              ))}
            </FormSelect>
            <Button
              isIconOnly
              variant="flat"
              size="sm"
              className="mt-6"
              onPress={() => setShowNewCategory(!showNewCategory)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {showNewCategory && (
            <div className="flex items-center gap-2 pl-1">
              <FormInput
                size="sm"
                placeholder="新分类名称"
                value={newCategoryName}
                onValueChange={setNewCategoryName}
                className="flex-1"
              />
              <Button
                size="sm"
                color="primary"
                isLoading={createCategory.isPending}
                onPress={handleQuickCreateCategory}
              >
                创建
              </Button>
            </div>
          )}
        </div>

        {/* 标签选择 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FormSelect
              label="标签"
              placeholder="选择标签（可选）"
              value={tagId}
              onValueChange={setTagId}
              className="flex-1"
            >
              {tags.map(tag => (
                <FormSelectItem
                  key={String(tag.id)}
                  startContent={
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: tag.color || "#999" }}
                    />
                  }
                >
                  {tag.name}
                </FormSelectItem>
              ))}
            </FormSelect>
            <Button isIconOnly variant="flat" size="sm" className="mt-6" onPress={() => setShowNewTag(!showNewTag)}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {showNewTag && (
            <div className="flex items-center gap-2 pl-1">
              <FormInput
                size="sm"
                placeholder="新标签名称"
                value={newTagName}
                onValueChange={setNewTagName}
                className="flex-1"
              />
              <input
                type="color"
                value={newTagColor}
                onChange={e => setNewTagColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-default-200"
              />
              <Button size="sm" color="primary" isLoading={createTag.isPending} onPress={handleQuickCreateTag}>
                创建
              </Button>
            </div>
          )}
        </div>

        {/* 状态 & 排序 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormSelect label="状态" value={status} onValueChange={setStatus}>
            {STATUS_OPTIONS.map(opt => (
              <FormSelectItem key={opt.key}>{opt.label}</FormSelectItem>
            ))}
          </FormSelect>
          <FormInput
            label="排序权重"
            placeholder="数字越大越靠前"
            type="number"
            value={sortOrder}
            onValueChange={setSortOrder}
          />
        </div>

        {/* 跳过健康检查 */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-default-50 border border-default-200">
          <div>
            <p className="text-sm font-medium">跳过健康检查</p>
            <p className="text-xs text-default-400">开启后该友链不参与自动健康检查</p>
          </div>
          <Switch isSelected={skipHealthCheck} onValueChange={setSkipHealthCheck} size="sm" />
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="flat" onPress={onClose}>
          取消
        </Button>
        <Button color="primary" onPress={handleSubmit} isLoading={isSubmitting}>
          {isEdit ? "保存修改" : "创建友链"}
        </Button>
      </ModalFooter>
    </>
  );
}
