"use client";

import { useMemo } from "react";
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
import { HardDrive } from "lucide-react";
import { SettingsSection } from "@/components/admin/settings/SettingsSection";
import {
  STORAGE_TYPE_LABELS,
  POLICY_FLAGS,
  POLICY_FLAG_LABELS,
  type StoragePolicy,
  type StoragePolicyType,
} from "@/types/storage-policy";
import { LocalForm } from "./LocalForm";
import { AliyunOssForm } from "./AliyunOssForm";
import { TencentCosForm } from "./TencentCosForm";
import { AwsS3Form } from "./AwsS3Form";
import { QiniuKodoForm } from "./QiniuKodoForm";
import { OneDriveForm } from "./OneDriveForm";

/** 文件大小单位 */
const SIZE_UNITS = [
  { key: "B", label: "B", multiplier: 1 },
  { key: "KB", label: "KB", multiplier: 1024 },
  { key: "MB", label: "MB", multiplier: 1024 * 1024 },
  { key: "GB", label: "GB", multiplier: 1024 * 1024 * 1024 },
];

function bytesToDisplay(bytes: number): { value: string; unit: string } {
  if (bytes <= 0) return { value: "0", unit: "MB" };
  if (bytes >= 1024 * 1024 * 1024) return { value: String(Math.round(bytes / (1024 * 1024 * 1024))), unit: "GB" };
  if (bytes >= 1024 * 1024) return { value: String(Math.round(bytes / (1024 * 1024))), unit: "MB" };
  if (bytes >= 1024) return { value: String(Math.round(bytes / 1024)), unit: "KB" };
  return { value: String(bytes), unit: "B" };
}

interface PolicyFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  storageType: StoragePolicyType;
  form: Partial<StoragePolicy>;
  onFormChange: (form: Partial<StoragePolicy>) => void;
  onConfirm: () => void;
  isLoading: boolean;
  /** 额外状态: max_size 的显示单位 */
  sizeUnit: string;
  onSizeUnitChange: (unit: string) => void;
  sizeValue: string;
  onSizeValueChange: (value: string) => void;
}

export function PolicyFormModal({
  isOpen,
  onOpenChange,
  mode,
  storageType,
  form,
  onFormChange,
  onConfirm,
  isLoading,
  sizeUnit,
  onSizeUnitChange,
  sizeValue,
  onSizeValueChange,
}: PolicyFormModalProps) {
  const title =
    mode === "create"
      ? `添加${STORAGE_TYPE_LABELS[storageType]}存储策略`
      : `编辑${STORAGE_TYPE_LABELS[storageType]}存储策略`;

  const chunkSizeDisplay = useMemo(() => {
    return bytesToDisplay(form.settings?.chunk_size ?? 0);
  }, [form.settings?.chunk_size]);

  /** 渲染存储类型对应的子表单 */
  const renderTypeForm = () => {
    const commonProps = { form, onChange: onFormChange };
    switch (storageType) {
      case "local":
        return <LocalForm {...commonProps} />;
      case "aliyun_oss":
        return <AliyunOssForm {...commonProps} />;
      case "tencent_cos":
        return <TencentCosForm {...commonProps} />;
      case "aws_s3":
        return <AwsS3Form {...commonProps} />;
      case "qiniu_kodo":
        return <QiniuKodoForm {...commonProps} />;
      case "onedrive":
        return <OneDriveForm {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      placement="center"
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex items-center gap-3 pb-2">
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                <HardDrive className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="text-lg font-semibold">{title}</span>
              </div>
            </ModalHeader>

            <ModalBody className="gap-6">
              {/* 基本信息区 */}
              <SettingsSection title="基本信息" description="策略的名称、标志和存储类型">
                <Input
                  label="策略名称"
                  labelPlacement="outside"
                  placeholder="例如：阿里云图片存储"
                  size="sm"
                  isRequired
                  value={form.name ?? ""}
                  onValueChange={v => onFormChange({ ...form, name: v })}
                />

                <Select
                  label="策略标志（可选）"
                  labelPlacement="outside"
                  placeholder="留空为无特殊标志"
                  size="sm"
                  selectedKeys={form.flag ? [form.flag] : []}
                  onSelectionChange={keys => {
                    const v = Array.from(keys)[0] as string | undefined;
                    onFormChange({ ...form, flag: v ?? "" });
                  }}
                  description="设置后将作为对应类型文件的默认存储策略"
                >
                  {POLICY_FLAGS.map(f => (
                    <SelectItem key={f}>{POLICY_FLAG_LABELS[f]}</SelectItem>
                  ))}
                </Select>

                <Input
                  label="存储类型"
                  labelPlacement="outside"
                  size="sm"
                  isReadOnly
                  value={STORAGE_TYPE_LABELS[storageType]}
                  classNames={{ inputWrapper: "bg-muted/30" }}
                />
              </SettingsSection>

              {/* 存储配置区 - 动态加载各类型子表单 */}
              <SettingsSection title="存储配置" description={`配置 ${STORAGE_TYPE_LABELS[storageType]} 的连接参数`}>
                {renderTypeForm()}
              </SettingsSection>

              {/* 上传设置区 */}
              <SettingsSection title="上传设置" description="配置文件上传的大小限制和分片参数">
                <div className="flex gap-2 items-end">
                  <Input
                    label="最大文件大小"
                    labelPlacement="outside"
                    placeholder="0 为不限制"
                    size="sm"
                    type="number"
                    className="flex-1"
                    value={sizeValue}
                    onValueChange={onSizeValueChange}
                    description="单个文件的最大上传大小，设为 0 表示不限制"
                  />
                  <Select
                    size="sm"
                    className="w-24"
                    selectedKeys={[sizeUnit]}
                    onSelectionChange={keys => {
                      const v = Array.from(keys)[0] as string;
                      if (v) onSizeUnitChange(v);
                    }}
                    aria-label="文件大小单位"
                  >
                    {SIZE_UNITS.map(u => (
                      <SelectItem key={u.key}>{u.label}</SelectItem>
                    ))}
                  </Select>
                </div>

                <div className="flex gap-2 items-end">
                  <Input
                    label="分片大小"
                    labelPlacement="outside"
                    placeholder="例如 25"
                    size="sm"
                    type="number"
                    className="flex-1"
                    value={chunkSizeDisplay.value}
                    onValueChange={v => {
                      const num = Number(v) || 0;
                      const multiplier =
                        SIZE_UNITS.find(u => u.key === chunkSizeDisplay.unit)?.multiplier ?? 1024 * 1024;
                      onFormChange({
                        ...form,
                        settings: { ...form.settings, chunk_size: num * multiplier },
                      });
                    }}
                    description="分片上传时每个分片的大小"
                  />
                  <Select
                    size="sm"
                    className="w-24"
                    selectedKeys={[chunkSizeDisplay.unit]}
                    onSelectionChange={keys => {
                      const newUnit = Array.from(keys)[0] as string;
                      if (!newUnit) return;
                      const displayVal = Number(chunkSizeDisplay.value) || 0;
                      const newMultiplier = SIZE_UNITS.find(u => u.key === newUnit)?.multiplier ?? 1024 * 1024;
                      onFormChange({
                        ...form,
                        settings: { ...form.settings, chunk_size: displayVal * newMultiplier },
                      });
                    }}
                    aria-label="分片大小单位"
                  >
                    {SIZE_UNITS.map(u => (
                      <SelectItem key={u.key}>{u.label}</SelectItem>
                    ))}
                  </Select>
                </div>
              </SettingsSection>
            </ModalBody>

            <ModalFooter>
              <Button variant="flat" onPress={onClose} size="sm">
                取消
              </Button>
              <Button color="primary" onPress={onConfirm} isLoading={isLoading} size="sm">
                {mode === "create" ? "创建" : "保存"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
