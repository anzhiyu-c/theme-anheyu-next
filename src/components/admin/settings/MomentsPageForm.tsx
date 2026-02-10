"use client";

import { FormInput } from "@/components/ui/form-input";
import { FormSwitch } from "@/components/ui/form-switch";
import { FormImageUpload } from "@/components/ui/form-image-upload";
import { FormJsonEditor } from "@/components/ui/form-json-editor";
import { FormCodeEditor } from "@/components/ui/form-code-editor";
import { SettingsSection, SettingsFieldGroup } from "./SettingsSection";
import { Spinner } from "@/components/ui/spinner";
import {
  KEY_MOMENTS_ENABLE,
  KEY_MOMENTS_TITLE,
  KEY_MOMENTS_SUBTITLE,
  KEY_MOMENTS_TIPS,
  KEY_MOMENTS_BUTTON_TEXT,
  KEY_MOMENTS_BUTTON_LINK,
  KEY_MOMENTS_TOP_BACKGROUND,
  KEY_MOMENTS_FETCH_INTERVAL,
  KEY_MOMENTS_MAX_ITEMS,
  KEY_MOMENTS_DISPLAY_LIMIT,
  KEY_MOMENTS_CACHE_DURATION,
  KEY_MOMENTS_RSS_TIMEOUT,
  KEY_MOMENTS_MIN_FETCH_INTERVAL,
  KEY_MOMENTS_NOTIFY_ADMIN,
  KEY_MOMENTS_SC_MAIL_NOTIFY,
  KEY_MOMENTS_PUSHOO_CHANNEL,
  KEY_MOMENTS_PUSHOO_URL,
  KEY_MOMENTS_WEBHOOK_BODY,
  KEY_MOMENTS_WEBHOOK_HEADERS,
  KEY_MOMENTS_MAIL_SUBJECT_ADMIN,
  KEY_MOMENTS_MAIL_TEMPLATE_ADMIN,
} from "@/lib/settings/setting-keys";

interface MomentsPageFormProps {
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  loading?: boolean;
}

export function MomentsPageForm({ values, onChange, loading }: MomentsPageFormProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 基本配置 */}
      <SettingsSection title="基本配置 (PRO)">
        <FormSwitch
          label="启用朋友圈"
          description="开启朋友圈功能"
          checked={values[KEY_MOMENTS_ENABLE] === "true"}
          onCheckedChange={v => onChange(KEY_MOMENTS_ENABLE, String(v))}
          isPro
        />
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="标题"
            placeholder="请输入朋友圈标题"
            value={values[KEY_MOMENTS_TITLE]}
            onValueChange={v => onChange(KEY_MOMENTS_TITLE, v)}
          />
          <FormInput
            label="副标题"
            placeholder="请输入朋友圈副标题"
            value={values[KEY_MOMENTS_SUBTITLE]}
            onValueChange={v => onChange(KEY_MOMENTS_SUBTITLE, v)}
          />
        </SettingsFieldGroup>
        <FormInput
          label="提示文字"
          placeholder="请输入提示文字"
          value={values[KEY_MOMENTS_TIPS]}
          onValueChange={v => onChange(KEY_MOMENTS_TIPS, v)}
        />
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="按钮文字"
            placeholder="请输入按钮文字"
            value={values[KEY_MOMENTS_BUTTON_TEXT]}
            onValueChange={v => onChange(KEY_MOMENTS_BUTTON_TEXT, v)}
          />
          <FormInput
            label="按钮链接"
            placeholder="请输入按钮跳转链接"
            value={values[KEY_MOMENTS_BUTTON_LINK]}
            onValueChange={v => onChange(KEY_MOMENTS_BUTTON_LINK, v)}
          />
        </SettingsFieldGroup>
        <FormImageUpload
          label="顶部背景图"
          value={values[KEY_MOMENTS_TOP_BACKGROUND]}
          onValueChange={v => onChange(KEY_MOMENTS_TOP_BACKGROUND, v)}
          placeholder="请输入顶部背景图 URL"
        />
      </SettingsSection>

      {/* 抓取配置 */}
      <SettingsSection title="抓取配置 (PRO)">
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="抓取间隔（秒）"
            placeholder="如 3600"
            value={values[KEY_MOMENTS_FETCH_INTERVAL]}
            onValueChange={v => onChange(KEY_MOMENTS_FETCH_INTERVAL, v)}
          />
          <FormInput
            label="最小抓取间隔（秒）"
            placeholder="如 600"
            value={values[KEY_MOMENTS_MIN_FETCH_INTERVAL]}
            onValueChange={v => onChange(KEY_MOMENTS_MIN_FETCH_INTERVAL, v)}
          />
        </SettingsFieldGroup>
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="最大条目数"
            placeholder="如 200"
            value={values[KEY_MOMENTS_MAX_ITEMS]}
            onValueChange={v => onChange(KEY_MOMENTS_MAX_ITEMS, v)}
          />
          <FormInput
            label="每页显示条数"
            placeholder="如 20"
            value={values[KEY_MOMENTS_DISPLAY_LIMIT]}
            onValueChange={v => onChange(KEY_MOMENTS_DISPLAY_LIMIT, v)}
          />
        </SettingsFieldGroup>
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="缓存时长（秒）"
            placeholder="如 1800"
            value={values[KEY_MOMENTS_CACHE_DURATION]}
            onValueChange={v => onChange(KEY_MOMENTS_CACHE_DURATION, v)}
          />
          <FormInput
            label="RSS 超时时间（秒）"
            placeholder="如 30"
            value={values[KEY_MOMENTS_RSS_TIMEOUT]}
            onValueChange={v => onChange(KEY_MOMENTS_RSS_TIMEOUT, v)}
          />
        </SettingsFieldGroup>
      </SettingsSection>

      {/* 通知配置 */}
      <SettingsSection title="通知配置 (PRO)">
        <FormSwitch
          label="通知管理员"
          description="朋友圈有新内容时通知管理员"
          checked={values[KEY_MOMENTS_NOTIFY_ADMIN] === "true"}
          onCheckedChange={v => onChange(KEY_MOMENTS_NOTIFY_ADMIN, String(v))}
          isPro
        />
        <FormSwitch
          label="邮件通知"
          description="通过邮件通知管理员"
          checked={values[KEY_MOMENTS_SC_MAIL_NOTIFY] === "true"}
          onCheckedChange={v => onChange(KEY_MOMENTS_SC_MAIL_NOTIFY, String(v))}
          isPro
        />
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="Pushoo Channel"
            placeholder="请输入 Pushoo 渠道"
            value={values[KEY_MOMENTS_PUSHOO_CHANNEL]}
            onValueChange={v => onChange(KEY_MOMENTS_PUSHOO_CHANNEL, v)}
          />
          <FormInput
            label="Pushoo URL"
            placeholder="请输入 Pushoo 推送地址"
            value={values[KEY_MOMENTS_PUSHOO_URL]}
            onValueChange={v => onChange(KEY_MOMENTS_PUSHOO_URL, v)}
          />
        </SettingsFieldGroup>
        <FormJsonEditor
          label="Webhook Body"
          description="Webhook 请求体 JSON 模板"
          value={values[KEY_MOMENTS_WEBHOOK_BODY]}
          onValueChange={v => onChange(KEY_MOMENTS_WEBHOOK_BODY, v)}
        />
        <FormJsonEditor
          label="Webhook Headers"
          description="Webhook 请求头 JSON"
          value={values[KEY_MOMENTS_WEBHOOK_HEADERS]}
          onValueChange={v => onChange(KEY_MOMENTS_WEBHOOK_HEADERS, v)}
        />
        <FormInput
          label="管理员邮件主题"
          placeholder="朋友圈更新通知"
          value={values[KEY_MOMENTS_MAIL_SUBJECT_ADMIN]}
          onValueChange={v => onChange(KEY_MOMENTS_MAIL_SUBJECT_ADMIN, v)}
        />
        <FormCodeEditor
          label="管理员邮件模板"
          language="html"
          value={values[KEY_MOMENTS_MAIL_TEMPLATE_ADMIN]}
          onValueChange={v => onChange(KEY_MOMENTS_MAIL_TEMPLATE_ADMIN, v)}
          minRows={6}
        />
      </SettingsSection>
    </div>
  );
}
