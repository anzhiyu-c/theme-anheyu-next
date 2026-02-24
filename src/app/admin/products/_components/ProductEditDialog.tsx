"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Switch,
} from "@heroui/react";
import { Plus, Trash2 } from "lucide-react";
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  DeliveryMethod,
  ProductStatus,
} from "@/types/product";

interface ProductEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSubmit: (payload: CreateProductRequest | UpdateProductRequest) => Promise<void>;
  isSubmitting?: boolean;
}

interface VariantFormItem {
  id?: string;
  name: string;
  price: string;
  delivery_method: DeliveryMethod;
  fixed_reply_content: string;
  sort_order: string;
}

interface ProductFormState {
  title: string;
  description: string;
  cover_url: string;
  status: ProductStatus;
  exclude_from_membership: boolean;
  show_on_homepage: boolean;
  sort_order: string;
  variants: VariantFormItem[];
}

const defaultVariant: VariantFormItem = {
  name: "",
  price: "0",
  delivery_method: "FIXED_REPLY" as DeliveryMethod,
  fixed_reply_content: "",
  sort_order: "0",
};

const defaultFormState: ProductFormState = {
  title: "",
  description: "",
  cover_url: "",
  status: 2,
  exclude_from_membership: false,
  show_on_homepage: true,
  sort_order: "0",
  variants: [{ ...defaultVariant }],
};

function createInitialFormState(product: Product | null): ProductFormState {
  if (!product) {
    return defaultFormState;
  }
  return {
    title: product.title || "",
    description: product.description || "",
    cover_url: product.cover_url || "",
    status: product.status || 2,
    exclude_from_membership: !!product.exclude_from_membership,
    show_on_homepage: product.show_on_homepage !== false,
    sort_order: String(product.sort_order ?? 0),
    variants:
      product.variants && product.variants.length > 0
        ? product.variants.map(item => ({
            id: item.id,
            name: item.name || "",
            price: String(item.price ?? 0),
            delivery_method: item.delivery_method,
            fixed_reply_content: item.fixed_reply_content || "",
            sort_order: String(item.sort_order ?? 0),
          }))
        : [{ ...defaultVariant }],
  };
}

export function ProductEditDialog({
  isOpen,
  onOpenChange,
  product,
  onSubmit,
  isSubmitting = false,
}: ProductEditDialogProps) {
  const [form, setForm] = useState<ProductFormState>(() => createInitialFormState(product));
  const [error, setError] = useState("");

  const isEditMode = !!product;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl" scrollBehavior="inside" backdrop="blur">
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>{isEditMode ? "编辑商品" : "新增商品"}</ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <Input
                  label="商品标题"
                  value={form.title}
                  onValueChange={value => setForm(prev => ({ ...prev, title: value }))}
                  placeholder="请输入商品标题"
                  isRequired
                />
                <Input
                  label="封面地址"
                  value={form.cover_url}
                  onValueChange={value => setForm(prev => ({ ...prev, cover_url: value }))}
                  placeholder="https://..."
                />
                <Select
                  label="状态"
                  selectedKeys={[String(form.status)]}
                  onSelectionChange={keys => {
                    const key = Array.from(keys)[0];
                    setForm(prev => ({ ...prev, status: Number(key || 2) as ProductStatus }));
                  }}
                >
                  <SelectItem key="1">草稿</SelectItem>
                  <SelectItem key="2">已上架</SelectItem>
                  <SelectItem key="3">已下架</SelectItem>
                </Select>
                <Input
                  label="排序值"
                  type="number"
                  value={form.sort_order}
                  onValueChange={value => setForm(prev => ({ ...prev, sort_order: value }))}
                />
              </div>

              <Textarea
                label="商品描述"
                value={form.description}
                onValueChange={value => setForm(prev => ({ ...prev, description: value }))}
                placeholder="请输入商品描述"
                minRows={3}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Switch
                  isSelected={form.show_on_homepage}
                  onValueChange={checked => setForm(prev => ({ ...prev, show_on_homepage: checked }))}
                >
                  首页显示
                </Switch>
                <Switch
                  isSelected={form.exclude_from_membership}
                  onValueChange={checked => setForm(prev => ({ ...prev, exclude_from_membership: checked }))}
                >
                  会员排除（会员不能免费获取）
                </Switch>
              </div>

              <div className="space-y-3 rounded-xl border border-default-200 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">商品型号</p>
                  <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    startContent={<Plus className="w-4 h-4" />}
                    onPress={() => {
                      setForm(prev => ({ ...prev, variants: [...prev.variants, { ...defaultVariant }] }));
                    }}
                  >
                    添加型号
                  </Button>
                </div>

                {form.variants.map((variant, index) => (
                  <div
                    key={`${variant.id || "new"}-${index}`}
                    className="rounded-lg border border-default-200 p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-default-500">型号 {index + 1}</p>
                      {form.variants.length > 1 ? (
                        <Button
                          size="sm"
                          variant="light"
                          color="danger"
                          isIconOnly
                          onPress={() => {
                            setForm(prev => ({
                              ...prev,
                              variants: prev.variants.filter((_, idx) => idx !== index),
                            }));
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      ) : null}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input
                        label="型号名称"
                        value={variant.name}
                        onValueChange={value => {
                          setForm(prev => ({
                            ...prev,
                            variants: prev.variants.map((item, idx) =>
                              idx === index ? { ...item, name: value } : item
                            ),
                          }));
                        }}
                        placeholder="如：标准版"
                      />
                      <Input
                        label="价格（分）"
                        type="number"
                        value={variant.price}
                        onValueChange={value => {
                          setForm(prev => ({
                            ...prev,
                            variants: prev.variants.map((item, idx) =>
                              idx === index ? { ...item, price: value } : item
                            ),
                          }));
                        }}
                      />
                      <Select
                        label="发货方式"
                        selectedKeys={[variant.delivery_method]}
                        onSelectionChange={keys => {
                          const key = Array.from(keys)[0];
                          const method = (key ? String(key) : "FIXED_REPLY") as DeliveryMethod;
                          setForm(prev => ({
                            ...prev,
                            variants: prev.variants.map((item, idx) =>
                              idx === index
                                ? {
                                    ...item,
                                    delivery_method: method,
                                  }
                                : item
                            ),
                          }));
                        }}
                      >
                        <SelectItem key="FIXED_REPLY">固定回复</SelectItem>
                        <SelectItem key="STOCK_ITEM">卡密库存</SelectItem>
                      </Select>
                      <Input
                        label="排序值"
                        type="number"
                        value={variant.sort_order}
                        onValueChange={value => {
                          setForm(prev => ({
                            ...prev,
                            variants: prev.variants.map((item, idx) =>
                              idx === index ? { ...item, sort_order: value } : item
                            ),
                          }));
                        }}
                      />
                    </div>
                    {variant.delivery_method === "FIXED_REPLY" ? (
                      <Textarea
                        label="固定回复内容"
                        value={variant.fixed_reply_content}
                        onValueChange={value => {
                          setForm(prev => ({
                            ...prev,
                            variants: prev.variants.map((item, idx) =>
                              idx === index ? { ...item, fixed_reply_content: value } : item
                            ),
                          }));
                        }}
                        placeholder="用户支付成功后返回的内容"
                        minRows={2}
                      />
                    ) : null}
                  </div>
                ))}
              </div>

              {error ? <p className="text-sm text-danger">{error}</p> : null}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose} isDisabled={isSubmitting}>
                取消
              </Button>
              <Button
                color="primary"
                isLoading={isSubmitting}
                onPress={async () => {
                  if (!form.title.trim()) {
                    setError("请输入商品标题");
                    return;
                  }
                  if (form.variants.length === 0) {
                    setError("请至少添加一个型号");
                    return;
                  }

                  const normalizedVariants = form.variants.map(item => ({
                    id: item.id,
                    name: item.name.trim(),
                    price: Number(item.price || 0),
                    delivery_method: item.delivery_method,
                    fixed_reply_content: item.fixed_reply_content.trim() || undefined,
                    sort_order: Number(item.sort_order || 0),
                  }));

                  const hasInvalidVariant = normalizedVariants.some(
                    item => !item.name || Number.isNaN(item.price) || item.price < 0
                  );
                  if (hasInvalidVariant) {
                    setError("请完善型号信息（名称和价格）");
                    return;
                  }

                  setError("");
                  await onSubmit({
                    title: form.title.trim(),
                    description: form.description.trim() || undefined,
                    cover_url: form.cover_url.trim() || undefined,
                    status: form.status,
                    exclude_from_membership: form.exclude_from_membership,
                    show_on_homepage: form.show_on_homepage,
                    sort_order: Number(form.sort_order || 0),
                    variants: normalizedVariants,
                  });
                }}
              >
                {isEditMode ? "保存修改" : "创建商品"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
