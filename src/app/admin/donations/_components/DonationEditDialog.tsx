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
  Select,
  SelectItem,
} from "@heroui/react";
import type { DonationItem, CreateDonationRequest, UpdateDonationRequest } from "@/types/donation";

interface DonationEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  donation: DonationItem | null;
  onSubmit: (data: CreateDonationRequest | UpdateDonationRequest) => Promise<void>;
  isSubmitting?: boolean;
}

interface DonationFormState {
  name: string;
  amount: string;
  suffix: string;
  sort_order: string;
  status: string;
  custom_published_at: string;
}

const defaultFormState: DonationFormState = {
  name: "",
  amount: "",
  suffix: "元",
  sort_order: "",
  status: "1",
  custom_published_at: "",
};

function normalizeDatetimeInput(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function createInitialFormState(donation: DonationItem | null): DonationFormState {
  if (!donation) {
    return defaultFormState;
  }
  return {
    name: donation.name || "",
    amount: String(donation.amount ?? ""),
    suffix: donation.suffix || "元",
    sort_order: donation.sort_order ? String(donation.sort_order) : "",
    status: String(donation.status ?? 1),
    custom_published_at: normalizeDatetimeInput(donation.custom_published_at),
  };
}

export function DonationEditDialog({
  isOpen,
  onOpenChange,
  donation,
  onSubmit,
  isSubmitting = false,
}: DonationEditDialogProps) {
  const [form, setForm] = useState<DonationFormState>(() => createInitialFormState(donation));
  const [error, setError] = useState("");

  const isEditMode = !!donation;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" placement="center" size="2xl">
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>{isEditMode ? "编辑打赏记录" : "新增打赏记录"}</ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  label="昵称"
                  placeholder="请输入打赏者昵称"
                  value={form.name}
                  onValueChange={value => setForm(prev => ({ ...prev, name: value }))}
                  isRequired
                />
                <Input
                  label="金额"
                  type="number"
                  min={0}
                  placeholder="请输入金额"
                  value={form.amount}
                  onValueChange={value => setForm(prev => ({ ...prev, amount: value }))}
                  isRequired
                />
                <Input
                  label="后缀"
                  placeholder="如 元 / CNY"
                  value={form.suffix}
                  onValueChange={value => setForm(prev => ({ ...prev, suffix: value }))}
                />
                <Input
                  label="排序值"
                  type="number"
                  placeholder="数字越小越靠前"
                  value={form.sort_order}
                  onValueChange={value => setForm(prev => ({ ...prev, sort_order: value }))}
                />
                <Select
                  label="状态"
                  selectedKeys={[form.status]}
                  onSelectionChange={keys => {
                    const value = Array.from(keys)[0];
                    setForm(prev => ({ ...prev, status: value ? String(value) : "1" }));
                  }}
                >
                  <SelectItem key="1">显示</SelectItem>
                  <SelectItem key="2">隐藏</SelectItem>
                </Select>
                <Input
                  label="自定义发布时间"
                  type="datetime-local"
                  value={form.custom_published_at}
                  onValueChange={value => setForm(prev => ({ ...prev, custom_published_at: value }))}
                />
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
                  const amount = Number(form.amount);
                  if (!form.name.trim()) {
                    setError("请输入昵称");
                    return;
                  }
                  if (!Number.isFinite(amount) || amount < 0) {
                    setError("请输入有效金额");
                    return;
                  }

                  setError("");
                  await onSubmit({
                    name: form.name.trim(),
                    amount,
                    suffix: form.suffix.trim() || "元",
                    status: Number(form.status) || 1,
                    sort_order: form.sort_order ? Number(form.sort_order) : undefined,
                    custom_published_at: form.custom_published_at || undefined,
                  });
                }}
              >
                {isEditMode ? "保存修改" : "创建记录"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
