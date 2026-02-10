"use client";

import { FormInput } from "@/components/ui/form-input";
import { FormSwitch } from "@/components/ui/form-switch";
import { FormJsonEditor } from "@/components/ui/form-json-editor";
import { FormCodeEditor } from "@/components/ui/form-code-editor";
import { SettingsSection, SettingsFieldGroup } from "./SettingsSection";
import { Spinner } from "@/components/ui/spinner";
import {
  KEY_FRIEND_LINK_DEFAULT_CATEGORY,
  KEY_FRIEND_LINK_APPLY_CONDITION,
  KEY_FRIEND_LINK_APPLY_CUSTOM_CODE,
  KEY_FRIEND_LINK_APPLY_CUSTOM_CODE_HTML,
  KEY_FRIEND_LINK_PLACEHOLDER_NAME,
  KEY_FRIEND_LINK_PLACEHOLDER_URL,
  KEY_FRIEND_LINK_PLACEHOLDER_LOGO,
  KEY_FRIEND_LINK_PLACEHOLDER_DESC,
  KEY_FRIEND_LINK_PLACEHOLDER_SITESHOT,
  KEY_FRIEND_LINK_NOTIFY_ADMIN,
  KEY_FRIEND_LINK_SC_MAIL_NOTIFY,
  KEY_FRIEND_LINK_PUSHOO_CHANNEL,
  KEY_FRIEND_LINK_PUSHOO_URL,
  KEY_FRIEND_LINK_WEBHOOK_BODY,
  KEY_FRIEND_LINK_WEBHOOK_HEADERS,
  KEY_FRIEND_LINK_MAIL_SUBJECT_ADMIN,
  KEY_FRIEND_LINK_MAIL_TEMPLATE_ADMIN,
  KEY_FRIEND_LINK_REVIEW_MAIL_ENABLE,
  KEY_FRIEND_LINK_REVIEW_MAIL_SUBJECT_APPROVED,
  KEY_FRIEND_LINK_REVIEW_MAIL_TEMPLATE_APPROVED,
  KEY_FRIEND_LINK_REVIEW_MAIL_SUBJECT_REJECTED,
  KEY_FRIEND_LINK_REVIEW_MAIL_TEMPLATE_REJECTED,
} from "@/lib/settings/setting-keys";

interface FriendLinkSettingsFormProps {
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  loading?: boolean;
}

export function FriendLinkSettingsForm({ values, onChange, loading }: FriendLinkSettingsFormProps) {
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
      <SettingsSection title="基本配置">
        <FormInput
          label="默认分类"
          placeholder="请输入友链默认分类名"
          value={values[KEY_FRIEND_LINK_DEFAULT_CATEGORY]}
          onValueChange={v => onChange(KEY_FRIEND_LINK_DEFAULT_CATEGORY, v)}
        />
        <FormJsonEditor
          label="申请条件"
          description="友链申请条件 JSON 配置"
          value={values[KEY_FRIEND_LINK_APPLY_CONDITION]}
          onValueChange={v => onChange(KEY_FRIEND_LINK_APPLY_CONDITION, v)}
        />
      </SettingsSection>

      {/* 申请表单 */}
      <SettingsSection title="申请表单">
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="名称占位符"
            placeholder="请输入站点名称"
            value={values[KEY_FRIEND_LINK_PLACEHOLDER_NAME]}
            onValueChange={v => onChange(KEY_FRIEND_LINK_PLACEHOLDER_NAME, v)}
          />
          <FormInput
            label="URL 占位符"
            placeholder="https://example.com"
            value={values[KEY_FRIEND_LINK_PLACEHOLDER_URL]}
            onValueChange={v => onChange(KEY_FRIEND_LINK_PLACEHOLDER_URL, v)}
          />
        </SettingsFieldGroup>
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="Logo 占位符"
            placeholder="https://example.com/logo.png"
            value={values[KEY_FRIEND_LINK_PLACEHOLDER_LOGO]}
            onValueChange={v => onChange(KEY_FRIEND_LINK_PLACEHOLDER_LOGO, v)}
          />
          <FormInput
            label="描述占位符"
            placeholder="一句话介绍你的站点"
            value={values[KEY_FRIEND_LINK_PLACEHOLDER_DESC]}
            onValueChange={v => onChange(KEY_FRIEND_LINK_PLACEHOLDER_DESC, v)}
          />
        </SettingsFieldGroup>
        <FormInput
          label="截图占位符"
          placeholder="https://example.com/screenshot.png"
          value={values[KEY_FRIEND_LINK_PLACEHOLDER_SITESHOT]}
          onValueChange={v => onChange(KEY_FRIEND_LINK_PLACEHOLDER_SITESHOT, v)}
        />
      </SettingsSection>

      {/* 自定义代码 */}
      <SettingsSection title="自定义代码">
        <FormCodeEditor
          label="自定义 CSS/JS"
          description="友链申请页面自定义代码"
          language="css"
          value={values[KEY_FRIEND_LINK_APPLY_CUSTOM_CODE]}
          onValueChange={v => onChange(KEY_FRIEND_LINK_APPLY_CUSTOM_CODE, v)}
        />
        <FormCodeEditor
          label="自定义 HTML"
          description="友链申请页面自定义 HTML 内容"
          language="html"
          value={values[KEY_FRIEND_LINK_APPLY_CUSTOM_CODE_HTML]}
          onValueChange={v => onChange(KEY_FRIEND_LINK_APPLY_CUSTOM_CODE_HTML, v)}
        />
      </SettingsSection>

      {/* 通知配置 */}
      <SettingsSection title="通知配置">
        <FormSwitch
          label="通知管理员"
          description="有新的友链申请时通知管理员"
          checked={values[KEY_FRIEND_LINK_NOTIFY_ADMIN] === "true"}
          onCheckedChange={v => onChange(KEY_FRIEND_LINK_NOTIFY_ADMIN, String(v))}
        />
        <FormSwitch
          label="邮件通知"
          description="通过邮件通知管理员"
          checked={values[KEY_FRIEND_LINK_SC_MAIL_NOTIFY] === "true"}
          onCheckedChange={v => onChange(KEY_FRIEND_LINK_SC_MAIL_NOTIFY, String(v))}
        />
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="Pushoo Channel"
            placeholder="请输入 Pushoo 渠道"
            value={values[KEY_FRIEND_LINK_PUSHOO_CHANNEL]}
            onValueChange={v => onChange(KEY_FRIEND_LINK_PUSHOO_CHANNEL, v)}
          />
          <FormInput
            label="Pushoo URL"
            placeholder="请输入 Pushoo 推送地址"
            value={values[KEY_FRIEND_LINK_PUSHOO_URL]}
            onValueChange={v => onChange(KEY_FRIEND_LINK_PUSHOO_URL, v)}
          />
        </SettingsFieldGroup>
        <FormJsonEditor
          label="Webhook Body"
          description="Webhook 请求体 JSON 模板"
          value={values[KEY_FRIEND_LINK_WEBHOOK_BODY]}
          onValueChange={v => onChange(KEY_FRIEND_LINK_WEBHOOK_BODY, v)}
        />
        <FormJsonEditor
          label="Webhook Headers"
          description="Webhook 请求头 JSON"
          value={values[KEY_FRIEND_LINK_WEBHOOK_HEADERS]}
          onValueChange={v => onChange(KEY_FRIEND_LINK_WEBHOOK_HEADERS, v)}
        />
        <FormInput
          label="管理员邮件主题"
          placeholder="新友链申请通知"
          value={values[KEY_FRIEND_LINK_MAIL_SUBJECT_ADMIN]}
          onValueChange={v => onChange(KEY_FRIEND_LINK_MAIL_SUBJECT_ADMIN, v)}
        />
        <FormCodeEditor
          label="管理员邮件模板"
          language="html"
          value={values[KEY_FRIEND_LINK_MAIL_TEMPLATE_ADMIN]}
          onValueChange={v => onChange(KEY_FRIEND_LINK_MAIL_TEMPLATE_ADMIN, v)}
          minRows={6}
        />
      </SettingsSection>

      {/* 审核邮件 */}
      <SettingsSection title="审核邮件">
        <FormSwitch
          label="启用审核邮件"
          description="友链审核结果通过邮件通知申请者"
          checked={values[KEY_FRIEND_LINK_REVIEW_MAIL_ENABLE] === "true"}
          onCheckedChange={v => onChange(KEY_FRIEND_LINK_REVIEW_MAIL_ENABLE, String(v))}
        />
        <FormInput
          label="通过邮件主题"
          placeholder="友链申请已通过"
          value={values[KEY_FRIEND_LINK_REVIEW_MAIL_SUBJECT_APPROVED]}
          onValueChange={v => onChange(KEY_FRIEND_LINK_REVIEW_MAIL_SUBJECT_APPROVED, v)}
        />
        <FormCodeEditor
          label="通过邮件模板"
          language="html"
          value={values[KEY_FRIEND_LINK_REVIEW_MAIL_TEMPLATE_APPROVED]}
          onValueChange={v => onChange(KEY_FRIEND_LINK_REVIEW_MAIL_TEMPLATE_APPROVED, v)}
          minRows={6}
        />
        <FormInput
          label="拒绝邮件主题"
          placeholder="友链申请未通过"
          value={values[KEY_FRIEND_LINK_REVIEW_MAIL_SUBJECT_REJECTED]}
          onValueChange={v => onChange(KEY_FRIEND_LINK_REVIEW_MAIL_SUBJECT_REJECTED, v)}
        />
        <FormCodeEditor
          label="拒绝邮件模板"
          language="html"
          value={values[KEY_FRIEND_LINK_REVIEW_MAIL_TEMPLATE_REJECTED]}
          onValueChange={v => onChange(KEY_FRIEND_LINK_REVIEW_MAIL_TEMPLATE_REJECTED, v)}
          minRows={6}
        />
      </SettingsSection>
    </div>
  );
}
