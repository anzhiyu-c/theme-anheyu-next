"use client";

import { FormInput } from "@/components/ui/form-input";
import { FormSwitch } from "@/components/ui/form-switch";
import { FormCodeEditor } from "@/components/ui/form-code-editor";
import { PlaceholderHelpPanel } from "@/components/ui/placeholder-help-panel";
import { SettingsSection, SettingsFieldGroup } from "./SettingsSection";
import { Spinner } from "@/components/ui/spinner";
import {
  KEY_SMTP_HOST,
  KEY_SMTP_PORT,
  KEY_SMTP_USERNAME,
  KEY_SMTP_PASSWORD,
  KEY_SMTP_SENDER_NAME,
  KEY_SMTP_SENDER_EMAIL,
  KEY_SMTP_REPLY_TO_EMAIL,
  KEY_SMTP_FORCE_SSL,
  KEY_RESET_PASSWORD_SUBJECT,
  KEY_RESET_PASSWORD_TEMPLATE,
  KEY_ACTIVATE_ACCOUNT_SUBJECT,
  KEY_ACTIVATE_ACCOUNT_TEMPLATE,
  KEY_ENABLE_USER_ACTIVATION,
} from "@/lib/settings/setting-keys";

interface EmailSettingsFormProps {
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  loading?: boolean;
}

export function EmailSettingsForm({ values, onChange, loading }: EmailSettingsFormProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* SMTP 配置 */}
      <SettingsSection
        title="SMTP 配置"
        description="用于发送密码重置、账号激活等系统邮件。请使用支持 SMTP 的邮箱服务（如 QQ 邮箱、163、SendGrid 等），并在邮箱设置中开启 SMTP 并获取授权码。"
      >
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="SMTP 主机"
            placeholder="smtp.example.com"
            value={values[KEY_SMTP_HOST]}
            onValueChange={v => onChange(KEY_SMTP_HOST, v)}
          />
          <FormInput
            label="SMTP 端口"
            placeholder="465"
            value={values[KEY_SMTP_PORT]}
            onValueChange={v => onChange(KEY_SMTP_PORT, v)}
          />
        </SettingsFieldGroup>

        <SettingsFieldGroup cols={2}>
          <FormInput
            label="用户名"
            placeholder="user@example.com"
            value={values[KEY_SMTP_USERNAME]}
            onValueChange={v => onChange(KEY_SMTP_USERNAME, v)}
          />
          <FormInput
            label="密码"
            type="password"
            placeholder="请输入 SMTP 密码"
            value={values[KEY_SMTP_PASSWORD]}
            onValueChange={v => onChange(KEY_SMTP_PASSWORD, v)}
          />
        </SettingsFieldGroup>

        <SettingsFieldGroup cols={2}>
          <FormInput
            label="发件人名称"
            placeholder="AnHeYu Blog"
            value={values[KEY_SMTP_SENDER_NAME]}
            onValueChange={v => onChange(KEY_SMTP_SENDER_NAME, v)}
          />
          <FormInput
            label="发件人邮箱"
            placeholder="noreply@example.com"
            value={values[KEY_SMTP_SENDER_EMAIL]}
            onValueChange={v => onChange(KEY_SMTP_SENDER_EMAIL, v)}
          />
        </SettingsFieldGroup>

        <FormInput
          label="回复邮箱"
          placeholder="reply@example.com"
          value={values[KEY_SMTP_REPLY_TO_EMAIL]}
          onValueChange={v => onChange(KEY_SMTP_REPLY_TO_EMAIL, v)}
          description="收件人回复时使用的邮箱地址"
        />

        <FormSwitch
          label="强制 SSL"
          description="使用 SSL/TLS 加密连接 SMTP 服务器"
          checked={values[KEY_SMTP_FORCE_SSL] === "true"}
          onCheckedChange={v => onChange(KEY_SMTP_FORCE_SSL, String(v))}
        />
      </SettingsSection>

      {/* 密码重置 */}
      <SettingsSection title="密码重置" description="用户请求重置密码时发送的邮件。">
        <FormInput
          label="邮件主题"
          placeholder="[{{site_name}}] 密码重置"
          value={values[KEY_RESET_PASSWORD_SUBJECT]}
          onValueChange={v => onChange(KEY_RESET_PASSWORD_SUBJECT, v)}
        />
        <PlaceholderHelpPanel
          title="可用占位符"
          subtitle="点击可复制"
          items={[{ variable: "{{site_name}}", description: "站点名称" }]}
          className="mt-2"
        />
        <FormCodeEditor
          label="邮件模板"
          language="html"
          value={values[KEY_RESET_PASSWORD_TEMPLATE]}
          onValueChange={v => onChange(KEY_RESET_PASSWORD_TEMPLATE, v)}
          minRows={10}
        />
        <PlaceholderHelpPanel
          title="可用占位符"
          subtitle="点击可复制"
          items={[
            { variable: "{{nick}}", description: "用户昵称" },
            { variable: "{{reset_link}}", description: "重置链接" },
            { variable: "{{site_name}}", description: "站点名称" },
            { variable: "{{expire_minutes}}", description: "链接有效分钟数" },
          ]}
          className="mt-2"
        />
      </SettingsSection>

      {/* 账号激活 */}
      <SettingsSection title="账号激活" description="启用后，新用户注册将收到激活邮件，点击链接后账号才可用。">
        <FormSwitch
          label="启用账号激活"
          description="新用户注册后需要通过邮件激活账号"
          checked={values[KEY_ENABLE_USER_ACTIVATION] === "true"}
          onCheckedChange={v => onChange(KEY_ENABLE_USER_ACTIVATION, String(v))}
        />
        <FormInput
          label="邮件主题"
          placeholder="[{{site_name}}] 账号激活"
          value={values[KEY_ACTIVATE_ACCOUNT_SUBJECT]}
          onValueChange={v => onChange(KEY_ACTIVATE_ACCOUNT_SUBJECT, v)}
        />
        <PlaceholderHelpPanel
          title="可用占位符"
          subtitle="点击可复制"
          items={[{ variable: "{{site_name}}", description: "站点名称" }]}
          className="mt-2"
        />
        <FormCodeEditor
          label="邮件模板"
          language="html"
          value={values[KEY_ACTIVATE_ACCOUNT_TEMPLATE]}
          onValueChange={v => onChange(KEY_ACTIVATE_ACCOUNT_TEMPLATE, v)}
          minRows={10}
        />
        <PlaceholderHelpPanel
          title="可用占位符"
          subtitle="点击可复制"
          items={[
            { variable: "{{nick}}", description: "用户昵称" },
            { variable: "{{activate_link}}", description: "激活链接" },
            { variable: "{{site_name}}", description: "站点名称" },
            { variable: "{{expire_minutes}}", description: "链接有效分钟数" },
          ]}
          className="mt-2"
        />
      </SettingsSection>
    </div>
  );
}
