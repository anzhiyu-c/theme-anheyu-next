"use client";

import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { FormSwitch } from "@/components/ui/form-switch";
import { FormSelect, FormSelectItem } from "@/components/ui/form-select";
import { SettingsSection, SettingsFieldGroup } from "./SettingsSection";
import { Spinner } from "@/components/ui/spinner";
import {
  KEY_APP_NAME,
  KEY_SUB_TITLE,
  KEY_SITE_DESCRIPTION,
  KEY_SITE_KEYWORDS,
  KEY_SITE_URL,
  KEY_SITE_ANNOUNCEMENT,
  KEY_ICP_NUMBER,
  KEY_POLICE_RECORD_NUMBER,
  KEY_POLICE_RECORD_ICON,
  KEY_ENABLE_REGISTRATION,
  KEY_DEFAULT_THEME_MODE,
  KEY_THEME_COLOR,
  KEY_ABOUT_LINK,
  KEY_DEFAULT_THUMB_PARAM,
  KEY_DEFAULT_BIG_PARAM,
} from "@/lib/settings/setting-keys";

interface SiteBasicFormProps {
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  loading?: boolean;
}

export function SiteBasicForm({ values, onChange, loading }: SiteBasicFormProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 站点信息 */}
      <SettingsSection title="站点信息">
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="站点名称"
            placeholder="请输入站点名称"
            value={values[KEY_APP_NAME]}
            onValueChange={v => onChange(KEY_APP_NAME, v)}
          />
          <FormInput
            label="副标题"
            placeholder="请输入副标题"
            value={values[KEY_SUB_TITLE]}
            onValueChange={v => onChange(KEY_SUB_TITLE, v)}
          />
        </SettingsFieldGroup>

        <FormTextarea
          label="站点描述"
          placeholder="请输入站点描述"
          value={values[KEY_SITE_DESCRIPTION]}
          onValueChange={v => onChange(KEY_SITE_DESCRIPTION, v)}
          minRows={3}
        />

        <FormInput
          label="站点关键词"
          placeholder="关键词之间用英文逗号分隔"
          value={values[KEY_SITE_KEYWORDS]}
          onValueChange={v => onChange(KEY_SITE_KEYWORDS, v)}
          description="用于 SEO，多个关键词用英文逗号分隔"
        />

        <SettingsFieldGroup cols={2}>
          <FormInput
            label="站点 URL"
            placeholder="https://example.com"
            value={values[KEY_SITE_URL]}
            onValueChange={v => onChange(KEY_SITE_URL, v)}
          />
          <FormInput
            label="ICP 备案号"
            placeholder="京ICP备XXXXXXXX号"
            value={values[KEY_ICP_NUMBER]}
            onValueChange={v => onChange(KEY_ICP_NUMBER, v)}
          />
        </SettingsFieldGroup>

        <SettingsFieldGroup cols={2}>
          <FormInput
            label="公安备案号"
            placeholder="京公网安备XXXXXXXXXXXXXX号"
            value={values[KEY_POLICE_RECORD_NUMBER]}
            onValueChange={v => onChange(KEY_POLICE_RECORD_NUMBER, v)}
          />
          <FormInput
            label="公安备案图标"
            placeholder="公安备案图标 URL"
            value={values[KEY_POLICE_RECORD_ICON]}
            onValueChange={v => onChange(KEY_POLICE_RECORD_ICON, v)}
          />
        </SettingsFieldGroup>
      </SettingsSection>

      {/* 站点功能 */}
      <SettingsSection title="站点功能">
        <FormSwitch
          label="开放注册"
          description="是否允许新用户注册账号"
          checked={values[KEY_ENABLE_REGISTRATION] === "true"}
          onCheckedChange={v => onChange(KEY_ENABLE_REGISTRATION, String(v))}
        />

        <FormSelect
          label="默认主题模式"
          value={values[KEY_DEFAULT_THEME_MODE]}
          onValueChange={v => onChange(KEY_DEFAULT_THEME_MODE, v)}
          placeholder="请选择默认主题"
          description="新访客首次访问时的默认主题"
        >
          <FormSelectItem key="light">浅色模式</FormSelectItem>
          <FormSelectItem key="dark">深色模式</FormSelectItem>
        </FormSelect>

        <FormTextarea
          label="站点公告"
          placeholder="请输入站点公告内容"
          value={values[KEY_SITE_ANNOUNCEMENT]}
          onValueChange={v => onChange(KEY_SITE_ANNOUNCEMENT, v)}
          minRows={3}
        />

        <SettingsFieldGroup cols={2}>
          <FormInput
            label="主题色"
            placeholder="#163bf2"
            value={values[KEY_THEME_COLOR]}
            onValueChange={v => onChange(KEY_THEME_COLOR, v)}
            description="站点主题色，如 #163bf2"
          />
          <FormInput
            label="关于链接"
            placeholder="/about"
            value={values[KEY_ABOUT_LINK]}
            onValueChange={v => onChange(KEY_ABOUT_LINK, v)}
          />
        </SettingsFieldGroup>

        <SettingsFieldGroup cols={2}>
          <FormInput
            label="默认缩略图参数"
            placeholder="?imageView2/1/w/400/h/250"
            value={values[KEY_DEFAULT_THUMB_PARAM]}
            onValueChange={v => onChange(KEY_DEFAULT_THUMB_PARAM, v)}
            description="图片缩略图 URL 后缀参数"
          />
          <FormInput
            label="默认大图参数"
            placeholder="?imageView2/0/w/1920"
            value={values[KEY_DEFAULT_BIG_PARAM]}
            onValueChange={v => onChange(KEY_DEFAULT_BIG_PARAM, v)}
            description="图片大图 URL 后缀参数"
          />
        </SettingsFieldGroup>
      </SettingsSection>
    </div>
  );
}
