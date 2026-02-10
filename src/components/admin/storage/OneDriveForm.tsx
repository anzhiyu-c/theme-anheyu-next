"use client";

import { Input, Select, SelectItem } from "@heroui/react";
import type { StoragePolicy } from "@/types/storage-policy";

interface OneDriveFormProps {
  form: Partial<StoragePolicy>;
  onChange: (form: Partial<StoragePolicy>) => void;
}

const ENDPOINTS = [
  { key: "https://graph.microsoft.com", label: "Microsoft Graph（国际版）" },
  { key: "https://microsoftgraph.chinacloudapi.cn", label: "世纪互联（中国版）" },
];

const DRIVE_TYPES = [
  { key: "default", label: "默认 OneDrive" },
  { key: "sharepoint", label: "SharePoint 文档库" },
];

export function OneDriveForm({ form, onChange }: OneDriveFormProps) {
  const settings = form.settings ?? {};
  const updateSettings = (patch: Record<string, unknown>) => {
    onChange({ ...form, settings: { ...settings, ...patch } });
  };

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-primary border-b border-border/40 pb-2">OneDrive 配置</div>

      <Select
        label="Microsoft Graph 端点"
        labelPlacement="outside"
        placeholder="请选择端点"
        size="sm"
        isRequired
        selectedKeys={form.server ? [form.server] : []}
        onSelectionChange={keys => {
          const v = Array.from(keys)[0] as string;
          if (v) onChange({ ...form, server: v });
        }}
        description="国际版或世纪互联版"
      >
        {ENDPOINTS.map(ep => (
          <SelectItem key={ep.key}>{ep.label}</SelectItem>
        ))}
      </Select>

      <Input
        label="应用 (客户端) ID"
        labelPlacement="outside"
        placeholder="Azure AD 应用的 Client ID"
        size="sm"
        isRequired
        value={form.bucket_name ?? ""}
        onValueChange={v => onChange({ ...form, bucket_name: v })}
        description="在 Azure 门户注册的应用程序 ID"
      />

      <Input
        label="客户端密码"
        labelPlacement="outside"
        size="sm"
        type="password"
        isRequired
        value={form.secret_key ?? ""}
        onValueChange={v => onChange({ ...form, secret_key: v })}
        description="Azure AD 应用的客户端密码"
      />

      <Select
        label="OneDrive 类型"
        labelPlacement="outside"
        placeholder="请选择类型"
        size="sm"
        selectedKeys={settings.drive_type ? [settings.drive_type] : ["default"]}
        onSelectionChange={keys => {
          const v = Array.from(keys)[0] as string;
          if (v) updateSettings({ drive_type: v });
        }}
      >
        {DRIVE_TYPES.map(dt => (
          <SelectItem key={dt.key}>{dt.label}</SelectItem>
        ))}
      </Select>

      {settings.drive_type === "sharepoint" && (
        <Input
          label="SharePoint Drive ID"
          labelPlacement="outside"
          placeholder="SharePoint 文档库 Drive ID"
          size="sm"
          value={settings.drive_id ?? ""}
          onValueChange={v => updateSettings({ drive_id: v })}
          description="选择 SharePoint 类型时必填"
        />
      )}

      <div className="text-sm font-medium text-primary border-b border-border/40 pb-2 mt-6">路径设置</div>

      <Input
        label="云端存储根目录"
        labelPlacement="outside"
        placeholder="例如 /AnHeYu 或留空"
        size="sm"
        value={form.base_path ?? ""}
        onValueChange={v => onChange({ ...form, base_path: v })}
        description="文件在 OneDrive 中的存放根目录"
      />

      <Input
        label="应用内挂载路径"
        labelPlacement="outside"
        placeholder="例如 /onedrive"
        size="sm"
        isRequired
        value={form.virtual_path ?? ""}
        onValueChange={v => onChange({ ...form, virtual_path: v })}
        description="此策略在应用内部的访问路径，需唯一"
      />

      <div className="p-3 rounded-lg bg-warning-50 border border-warning-200 mt-4">
        <p className="text-xs text-warning-700">
          创建策略后需要在编辑页面完成 OAuth 授权，才能正常使用 OneDrive 存储。
        </p>
      </div>
    </div>
  );
}
