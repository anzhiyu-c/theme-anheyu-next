"use client";

import { FormInput } from "@/components/ui/form-input";
import { FormImageUpload } from "@/components/ui/form-image-upload";
import { FormJsonEditor } from "@/components/ui/form-json-editor";
import { SettingsSection } from "./SettingsSection";
import { Spinner } from "@/components/ui/spinner";
import {
  KEY_EQUIPMENT_BANNER_BG,
  KEY_EQUIPMENT_BANNER_TITLE,
  KEY_EQUIPMENT_BANNER_DESC,
  KEY_EQUIPMENT_BANNER_TIP,
  KEY_EQUIPMENT_LIST,
} from "@/lib/settings/setting-keys";

interface EquipmentPageFormProps {
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  loading?: boolean;
}

export function EquipmentPageForm({ values, onChange, loading }: EquipmentPageFormProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 横幅配置 */}
      <SettingsSection title="横幅配置">
        <FormImageUpload
          label="背景图"
          value={values[KEY_EQUIPMENT_BANNER_BG]}
          onValueChange={(v) => onChange(KEY_EQUIPMENT_BANNER_BG, v)}
          placeholder="请输入横幅背景图 URL"
        />
        <FormInput
          label="标题"
          placeholder="请输入页面标题"
          value={values[KEY_EQUIPMENT_BANNER_TITLE]}
          onValueChange={(v) => onChange(KEY_EQUIPMENT_BANNER_TITLE, v)}
        />
        <FormInput
          label="描述"
          placeholder="请输入页面描述"
          value={values[KEY_EQUIPMENT_BANNER_DESC]}
          onValueChange={(v) => onChange(KEY_EQUIPMENT_BANNER_DESC, v)}
        />
        <FormInput
          label="提示文字"
          placeholder="请输入提示文字"
          value={values[KEY_EQUIPMENT_BANNER_TIP]}
          onValueChange={(v) => onChange(KEY_EQUIPMENT_BANNER_TIP, v)}
        />
      </SettingsSection>

      {/* 装备列表 */}
      <SettingsSection title="装备列表">
        <FormJsonEditor
          label="装备配置"
          description="装备列表 JSON 配置，包含分类和装备项"
          value={values[KEY_EQUIPMENT_LIST]}
          onValueChange={(v) => onChange(KEY_EQUIPMENT_LIST, v)}
          minRows={10}
        />
      </SettingsSection>
    </div>
  );
}
