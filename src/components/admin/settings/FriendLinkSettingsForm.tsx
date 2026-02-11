"use client";

import { FormInput } from "@/components/ui/form-input";
import { FormSwitch } from "@/components/ui/form-switch";
import { FormJsonEditor } from "@/components/ui/form-json-editor";
import { FormCodeEditor } from "@/components/ui/form-code-editor";
import { FormStringList } from "@/components/ui/form-string-list";
import { PlaceholderHelpPanel } from "@/components/ui/placeholder-help-panel";
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
        <FormStringList
          label="申请条件"
          description="申请友链时用户需勾选的条款，每行一条，支持 HTML（如 <b>加粗</b>）"
          value={values[KEY_FRIEND_LINK_APPLY_CONDITION]}
          onValueChange={v => onChange(KEY_FRIEND_LINK_APPLY_CONDITION, v)}
          placeholder="例如：我已添加贵站友链"
          addButtonText="添加条件"
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
          description="友链申请页自定义 HTML，支持 <details> 折叠、<b> 加粗等，提交后输出到页面"
          language="html"
          value={values[KEY_FRIEND_LINK_APPLY_CUSTOM_CODE_HTML]}
          onValueChange={v => onChange(KEY_FRIEND_LINK_APPLY_CUSTOM_CODE_HTML, v)}
          minRows={6}
        />
      </SettingsSection>

      {/* 通知配置 */}
      <SettingsSection
        title="通知配置"
        description="友链申请提交后可通知管理员（邮件、Pushoo、Webhook）。Webhook 请求体可包含申请信息变量，由后端替换后发送。"
      >
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
          description="Webhook 请求体 JSON，可包含申请相关变量（如站点名、URL、描述等），具体变量名以后端为准"
          value={values[KEY_FRIEND_LINK_WEBHOOK_BODY]}
          onValueChange={v => onChange(KEY_FRIEND_LINK_WEBHOOK_BODY, v)}
        />
        <FormJsonEditor
          label="Webhook Headers"
          description={'请求头 JSON，如 {"Content-Type": "application/json"}，用于鉴权等'}
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
          description="HTML 模板，具体可用变量以后端渲染为准。"
        />
        <PlaceholderHelpPanel
          title="可用占位符"
          subtitle="常见变量，点击可复制；以实际后端为准"
          items={[
            { variable: "{{site_name}}", description: "站点名称" },
            { variable: "{{apply_site_name}}", description: "申请者站点名" },
            { variable: "{{apply_url}}", description: "申请者 URL" },
            { variable: "{{apply_desc}}", description: "申请描述" },
          ]}
          className="mt-2"
        />
      </SettingsSection>

      {/* 审核邮件 */}
      <SettingsSection
        title="审核邮件"
        description="审核通过或拒绝后，可向申请者发送邮件。模板中可使用站点名、友链页地址等变量。"
      >
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
          description="具体可用变量以后端为准。"
        />
        <PlaceholderHelpPanel
          title="可用占位符"
          subtitle="常见变量，点击可复制；以实际后端为准"
          items={[
            { variable: "{{site_name}}", description: "站点名称" },
            { variable: "{{flink_url}}", description: "友链页地址" },
          ]}
          className="mt-2"
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
          description="具体可用变量以后端为准。"
        />
        <PlaceholderHelpPanel
          title="可用占位符"
          subtitle="常见变量，点击可复制；以实际后端为准"
          items={[
            { variable: "{{site_name}}", description: "站点名称" },
            { variable: "{{flink_url}}", description: "友链页地址" },
          ]}
          className="mt-2"
        />
      </SettingsSection>
    </div>
  );
}
