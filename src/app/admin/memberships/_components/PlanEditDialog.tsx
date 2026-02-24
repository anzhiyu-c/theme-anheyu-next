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
} from "@heroui/react";
import type { MembershipPlan, CreatePlanRequest, UpdatePlanRequest } from "@/types/membership";

interface PlanEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  plan: MembershipPlan | null;
  onSubmit: (payload: CreatePlanRequest | UpdatePlanRequest) => Promise<void>;
  isSubmitting?: boolean;
}

interface PlanFormState {
  name: string;
  description: string;
  price: string;
  original_price: string;
  duration_days: string;
  status: string;
}

const defaultFormState: PlanFormState = {
  name: "",
  description: "",
  price: "9900",
  original_price: "",
  duration_days: "365",
  status: "1",
};

function createInitialFormState(plan: MembershipPlan | null): PlanFormState {
  if (!plan) {
    return defaultFormState;
  }
  return {
    name: plan.name || "",
    description: plan.description || "",
    price: String(plan.price || 0),
    original_price: plan.original_price ? String(plan.original_price) : "",
    duration_days: String(plan.duration_days || 365),
    status: String(plan.status || 1),
  };
}

export function PlanEditDialog({ isOpen, onOpenChange, plan, onSubmit, isSubmitting = false }: PlanEditDialogProps) {
  const [form, setForm] = useState<PlanFormState>(() => createInitialFormState(plan));
  const [error, setError] = useState("");

  const isEditMode = !!plan;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" backdrop="blur">
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>{isEditMode ? "编辑会员套餐" : "创建会员套餐"}</ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  label="套餐名称"
                  value={form.name}
                  onValueChange={value => setForm(prev => ({ ...prev, name: value }))}
                  placeholder="如：年度会员"
                  isRequired
                />
                <Select
                  label="状态"
                  selectedKeys={[form.status]}
                  onSelectionChange={keys => {
                    const key = Array.from(keys)[0];
                    setForm(prev => ({ ...prev, status: key ? String(key) : "1" }));
                  }}
                >
                  <SelectItem key="1">启用</SelectItem>
                  <SelectItem key="2">停用</SelectItem>
                </Select>
                <Input
                  label="价格（分）"
                  type="number"
                  min={0}
                  value={form.price}
                  onValueChange={value => setForm(prev => ({ ...prev, price: value }))}
                />
                <Input
                  label="原价（分）"
                  type="number"
                  min={0}
                  value={form.original_price}
                  onValueChange={value => setForm(prev => ({ ...prev, original_price: value }))}
                  placeholder="可选"
                />
                <Input
                  label="有效期（天）"
                  type="number"
                  min={1}
                  value={form.duration_days}
                  onValueChange={value => setForm(prev => ({ ...prev, duration_days: value }))}
                />
                <div className="flex items-end pb-2 text-xs text-default-500">
                  预览：¥{(Number(form.price || 0) / 100).toFixed(2)} / {form.duration_days || "0"} 天
                </div>
              </div>
              <Textarea
                label="套餐描述"
                value={form.description}
                onValueChange={value => setForm(prev => ({ ...prev, description: value }))}
                placeholder="简要描述套餐权益"
                minRows={3}
              />
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
                  const price = Number(form.price);
                  const duration = Number(form.duration_days);
                  const originalPrice = Number(form.original_price);

                  if (!form.name.trim()) {
                    setError("请输入套餐名称");
                    return;
                  }
                  if (!Number.isFinite(price) || price < 0) {
                    setError("请输入有效价格");
                    return;
                  }
                  if (!Number.isFinite(duration) || duration <= 0) {
                    setError("请输入有效天数");
                    return;
                  }

                  setError("");
                  await onSubmit({
                    name: form.name.trim(),
                    description: form.description.trim() || undefined,
                    price,
                    original_price: Number.isFinite(originalPrice) && originalPrice > 0 ? originalPrice : undefined,
                    duration_days: duration,
                    status: Number(form.status) || 1,
                  });
                }}
              >
                {isEditMode ? "保存修改" : "创建套餐"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
