"use client";

import { FormInput } from "@/components/ui/form-input";
import { FormSwitch } from "@/components/ui/form-switch";
import { FormImageUpload } from "@/components/ui/form-image-upload";
import { SettingsSection, SettingsFieldGroup } from "./SettingsSection";
import { Spinner } from "@/components/ui/spinner";
import {
  KEY_ESSAY_TITLE,
  KEY_ESSAY_SUBTITLE,
  KEY_ESSAY_TIPS,
  KEY_ESSAY_BUTTON_TEXT,
  KEY_ESSAY_BUTTON_LINK,
  KEY_ESSAY_LIMIT,
  KEY_ESSAY_HOME_ENABLE,
  KEY_ESSAY_TOP_BACKGROUND,
} from "@/lib/settings/setting-keys";

interface EssayPageFormProps {
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  loading?: boolean;
}

export function EssayPageForm({ values, onChange, loading }: EssayPageFormProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 即刻页面配置 */}
      <SettingsSection title="即刻页面配置 (PRO)">
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="标题"
            placeholder="请输入即刻页面标题"
            value={values[KEY_ESSAY_TITLE]}
            onValueChange={(v) => onChange(KEY_ESSAY_TITLE, v)}
          />
          <FormInput
            label="副标题"
            placeholder="请输入即刻页面副标题"
            value={values[KEY_ESSAY_SUBTITLE]}
            onValueChange={(v) => onChange(KEY_ESSAY_SUBTITLE, v)}
          />
        </SettingsFieldGroup>
        <FormInput
          label="提示文字"
          placeholder="请输入提示文字"
          value={values[KEY_ESSAY_TIPS]}
          onValueChange={(v) => onChange(KEY_ESSAY_TIPS, v)}
        />
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="按钮文字"
            placeholder="请输入按钮文字"
            value={values[KEY_ESSAY_BUTTON_TEXT]}
            onValueChange={(v) => onChange(KEY_ESSAY_BUTTON_TEXT, v)}
          />
          <FormInput
            label="按钮链接"
            placeholder="请输入按钮跳转链接"
            value={values[KEY_ESSAY_BUTTON_LINK]}
            onValueChange={(v) => onChange(KEY_ESSAY_BUTTON_LINK, v)}
          />
        </SettingsFieldGroup>
        <FormInput
          label="每页条数"
          placeholder="请输入每页显示条数"
          value={values[KEY_ESSAY_LIMIT]}
          onValueChange={(v) => onChange(KEY_ESSAY_LIMIT, v)}
        />
        <FormSwitch
          label="首页显示"
          description="在首页显示即刻模块"
          checked={values[KEY_ESSAY_HOME_ENABLE] === "true"}
          onCheckedChange={(v) => onChange(KEY_ESSAY_HOME_ENABLE, String(v))}
          isPro
        />
        <FormImageUpload
          label="顶部背景图"
          value={values[KEY_ESSAY_TOP_BACKGROUND]}
          onValueChange={(v) => onChange(KEY_ESSAY_TOP_BACKGROUND, v)}
          placeholder="请输入顶部背景图 URL"
        />
      </SettingsSection>
    </div>
  );
}
