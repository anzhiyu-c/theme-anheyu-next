"use client";

import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { FormSwitch } from "@/components/ui/form-switch";
import { FormCodeEditor } from "@/components/ui/form-code-editor";
import { SettingsSection, SettingsFieldGroup } from "./SettingsSection";
import { Spinner } from "@/components/ui/spinner";
import {
  KEY_COMMENT_ENABLE,
  KEY_COMMENT_LOGIN_REQUIRED,
  KEY_COMMENT_PAGE_SIZE,
  KEY_COMMENT_MASTER_TAG,
  KEY_COMMENT_PLACEHOLDER,
  KEY_COMMENT_EMOJI_CDN,
  KEY_COMMENT_BLOGGER_EMAIL,
  KEY_COMMENT_ANONYMOUS_EMAIL,
  KEY_COMMENT_SHOW_UA,
  KEY_COMMENT_SHOW_REGION,
  KEY_COMMENT_ALLOW_IMAGE_UPLOAD,
  KEY_COMMENT_LIMIT_PER_MINUTE,
  KEY_COMMENT_LIMIT_LENGTH,
  KEY_COMMENT_FORBIDDEN_WORDS,
  KEY_COMMENT_AI_DETECT_ENABLE,
  KEY_COMMENT_AI_DETECT_API_URL,
  KEY_COMMENT_AI_DETECT_ACTION,
  KEY_COMMENT_AI_DETECT_RISK_LEVEL,
  KEY_COMMENT_QQ_API_URL,
  KEY_COMMENT_QQ_API_KEY,
  KEY_COMMENT_NOTIFY_ADMIN,
  KEY_COMMENT_NOTIFY_REPLY,
  KEY_COMMENT_SMTP_SENDER_NAME,
  KEY_COMMENT_SMTP_SENDER_EMAIL,
  KEY_COMMENT_SMTP_HOST,
  KEY_COMMENT_SMTP_PORT,
  KEY_COMMENT_SMTP_USER,
  KEY_COMMENT_SMTP_PASS,
  KEY_COMMENT_SMTP_SECURE,
  KEY_PUSHOO_CHANNEL,
  KEY_PUSHOO_URL,
  KEY_WEBHOOK_REQUEST_BODY,
  KEY_WEBHOOK_HEADERS,
  KEY_SC_MAIL_NOTIFY,
  KEY_COMMENT_MAIL_SUBJECT,
  KEY_COMMENT_MAIL_TEMPLATE,
  KEY_COMMENT_MAIL_SUBJECT_ADMIN,
  KEY_COMMENT_MAIL_TEMPLATE_ADMIN,
} from "@/lib/settings/setting-keys";

interface CommentSettingsFormProps {
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  loading?: boolean;
}

export function CommentSettingsForm({ values, onChange, loading }: CommentSettingsFormProps) {
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
        <FormSwitch
          label="启用评论"
          description="是否启用评论功能"
          checked={values[KEY_COMMENT_ENABLE] === "true"}
          onCheckedChange={v => onChange(KEY_COMMENT_ENABLE, String(v))}
        />
        <FormSwitch
          label="登录后评论"
          description="是否需要登录后才能评论"
          checked={values[KEY_COMMENT_LOGIN_REQUIRED] === "true"}
          onCheckedChange={v => onChange(KEY_COMMENT_LOGIN_REQUIRED, String(v))}
        />
        <FormInput
          label="每页评论数"
          placeholder="10"
          value={values[KEY_COMMENT_PAGE_SIZE]}
          onValueChange={v => onChange(KEY_COMMENT_PAGE_SIZE, v)}
        />
        <FormInput
          label="博主标识"
          placeholder="博主"
          value={values[KEY_COMMENT_MASTER_TAG]}
          onValueChange={v => onChange(KEY_COMMENT_MASTER_TAG, v)}
          description="博主评论旁显示的身份标识"
        />
        <FormInput
          label="评论占位文本"
          placeholder="说点什么吧..."
          value={values[KEY_COMMENT_PLACEHOLDER]}
          onValueChange={v => onChange(KEY_COMMENT_PLACEHOLDER, v)}
        />
        <FormInput
          label="Emoji CDN"
          placeholder="https://cdn.example.com/emoji/"
          value={values[KEY_COMMENT_EMOJI_CDN]}
          onValueChange={v => onChange(KEY_COMMENT_EMOJI_CDN, v)}
          description="评论表情包的 CDN 地址"
        />
      </SettingsSection>

      {/* 用户配置 */}
      <SettingsSection title="用户配置">
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="博主邮箱"
            placeholder="admin@example.com"
            value={values[KEY_COMMENT_BLOGGER_EMAIL]}
            onValueChange={v => onChange(KEY_COMMENT_BLOGGER_EMAIL, v)}
            description="用于识别博主评论"
          />
          <FormInput
            label="匿名邮箱"
            placeholder="anonymous@example.com"
            value={values[KEY_COMMENT_ANONYMOUS_EMAIL]}
            onValueChange={v => onChange(KEY_COMMENT_ANONYMOUS_EMAIL, v)}
            description="匿名评论使用的默认邮箱"
          />
        </SettingsFieldGroup>

        <FormSwitch
          label="显示 UA 信息"
          description="在评论中显示浏览器和操作系统信息"
          checked={values[KEY_COMMENT_SHOW_UA] === "true"}
          onCheckedChange={v => onChange(KEY_COMMENT_SHOW_UA, String(v))}
        />
        <FormSwitch
          label="显示地区信息"
          description="在评论中显示评论者的地区信息"
          checked={values[KEY_COMMENT_SHOW_REGION] === "true"}
          onCheckedChange={v => onChange(KEY_COMMENT_SHOW_REGION, String(v))}
        />
        <FormSwitch
          label="允许上传图片"
          description="是否允许在评论中上传图片"
          checked={values[KEY_COMMENT_ALLOW_IMAGE_UPLOAD] === "true"}
          onCheckedChange={v => onChange(KEY_COMMENT_ALLOW_IMAGE_UPLOAD, String(v))}
        />
      </SettingsSection>

      {/* 限制配置 */}
      <SettingsSection title="限制配置">
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="每分钟评论限制"
            placeholder="5"
            value={values[KEY_COMMENT_LIMIT_PER_MINUTE]}
            onValueChange={v => onChange(KEY_COMMENT_LIMIT_PER_MINUTE, v)}
            description="同一 IP 每分钟最多发表的评论数"
          />
          <FormInput
            label="评论长度限制"
            placeholder="1000"
            value={values[KEY_COMMENT_LIMIT_LENGTH]}
            onValueChange={v => onChange(KEY_COMMENT_LIMIT_LENGTH, v)}
            description="单条评论最大字符数"
          />
        </SettingsFieldGroup>
        <FormTextarea
          label="违禁词列表"
          placeholder="每行一个违禁词"
          value={values[KEY_COMMENT_FORBIDDEN_WORDS]}
          onValueChange={v => onChange(KEY_COMMENT_FORBIDDEN_WORDS, v)}
          minRows={4}
          description="包含违禁词的评论将被自动拦截"
        />
      </SettingsSection>

      {/* AI 检测 */}
      <SettingsSection title="AI 检测">
        <FormSwitch
          label="启用 AI 检测"
          description="使用 AI 检测垃圾评论和恶意内容"
          checked={values[KEY_COMMENT_AI_DETECT_ENABLE] === "true"}
          onCheckedChange={v => onChange(KEY_COMMENT_AI_DETECT_ENABLE, String(v))}
        />
        <FormInput
          label="AI 检测 API 地址"
          placeholder="https://api.example.com/detect"
          value={values[KEY_COMMENT_AI_DETECT_API_URL]}
          onValueChange={v => onChange(KEY_COMMENT_AI_DETECT_API_URL, v)}
        />
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="检测动作"
            placeholder="mark / block / delete"
            value={values[KEY_COMMENT_AI_DETECT_ACTION]}
            onValueChange={v => onChange(KEY_COMMENT_AI_DETECT_ACTION, v)}
            description="检测到风险时执行的动作"
          />
          <FormInput
            label="风险等级阈值"
            placeholder="0.8"
            value={values[KEY_COMMENT_AI_DETECT_RISK_LEVEL]}
            onValueChange={v => onChange(KEY_COMMENT_AI_DETECT_RISK_LEVEL, v)}
            description="超过该阈值视为风险评论"
          />
        </SettingsFieldGroup>
      </SettingsSection>

      {/* QQ 头像 */}
      <SettingsSection title="QQ 头像">
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="QQ 头像 API 地址"
            placeholder="https://api.example.com/qq"
            value={values[KEY_COMMENT_QQ_API_URL]}
            onValueChange={v => onChange(KEY_COMMENT_QQ_API_URL, v)}
          />
          <FormInput
            label="QQ API Key"
            type="password"
            placeholder="请输入 API Key"
            value={values[KEY_COMMENT_QQ_API_KEY]}
            onValueChange={v => onChange(KEY_COMMENT_QQ_API_KEY, v)}
          />
        </SettingsFieldGroup>
      </SettingsSection>

      {/* 通知配置 */}
      <SettingsSection title="通知配置">
        <SettingsFieldGroup cols={2}>
          <FormSwitch
            label="通知管理员"
            description="新评论时通知管理员"
            checked={values[KEY_COMMENT_NOTIFY_ADMIN] === "true"}
            onCheckedChange={v => onChange(KEY_COMMENT_NOTIFY_ADMIN, String(v))}
          />
          <FormSwitch
            label="通知被回复者"
            description="评论被回复时通知原评论者"
            checked={values[KEY_COMMENT_NOTIFY_REPLY] === "true"}
            onCheckedChange={v => onChange(KEY_COMMENT_NOTIFY_REPLY, String(v))}
          />
        </SettingsFieldGroup>

        <FormSwitch
          label="邮件通知"
          description="通过邮件发送评论通知"
          checked={values[KEY_SC_MAIL_NOTIFY] === "true"}
          onCheckedChange={v => onChange(KEY_SC_MAIL_NOTIFY, String(v))}
        />

        <SettingsFieldGroup cols={2}>
          <FormInput
            label="Pushoo 渠道"
            placeholder="wechat / telegram / dingtalk"
            value={values[KEY_PUSHOO_CHANNEL]}
            onValueChange={v => onChange(KEY_PUSHOO_CHANNEL, v)}
          />
          <FormInput
            label="Pushoo URL"
            placeholder="https://pushoo.example.com/send"
            value={values[KEY_PUSHOO_URL]}
            onValueChange={v => onChange(KEY_PUSHOO_URL, v)}
          />
        </SettingsFieldGroup>

        <FormCodeEditor
          label="Webhook 请求体"
          language="json"
          value={values[KEY_WEBHOOK_REQUEST_BODY]}
          onValueChange={v => onChange(KEY_WEBHOOK_REQUEST_BODY, v)}
          minRows={6}
          description="支持变量：{{title}}, {{content}}, {{url}}"
        />
        <FormCodeEditor
          label="Webhook 请求头"
          language="json"
          value={values[KEY_WEBHOOK_HEADERS]}
          onValueChange={v => onChange(KEY_WEBHOOK_HEADERS, v)}
          minRows={4}
        />
      </SettingsSection>

      {/* 评论独立邮件配置 */}
      <SettingsSection title="评论独立邮件配置">
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="发件人名称"
            placeholder="评论通知"
            value={values[KEY_COMMENT_SMTP_SENDER_NAME]}
            onValueChange={v => onChange(KEY_COMMENT_SMTP_SENDER_NAME, v)}
            description="留空则使用系统 SMTP 配置"
          />
          <FormInput
            label="发件人邮箱"
            placeholder="noreply@example.com"
            value={values[KEY_COMMENT_SMTP_SENDER_EMAIL]}
            onValueChange={v => onChange(KEY_COMMENT_SMTP_SENDER_EMAIL, v)}
          />
        </SettingsFieldGroup>
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="SMTP 主机"
            placeholder="smtp.example.com"
            value={values[KEY_COMMENT_SMTP_HOST]}
            onValueChange={v => onChange(KEY_COMMENT_SMTP_HOST, v)}
          />
          <FormInput
            label="SMTP 端口"
            placeholder="465"
            value={values[KEY_COMMENT_SMTP_PORT]}
            onValueChange={v => onChange(KEY_COMMENT_SMTP_PORT, v)}
          />
        </SettingsFieldGroup>
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="SMTP 用户名"
            placeholder="user@example.com"
            value={values[KEY_COMMENT_SMTP_USER]}
            onValueChange={v => onChange(KEY_COMMENT_SMTP_USER, v)}
          />
          <FormInput
            label="SMTP 密码"
            type="password"
            placeholder="请输入 SMTP 密码"
            value={values[KEY_COMMENT_SMTP_PASS]}
            onValueChange={v => onChange(KEY_COMMENT_SMTP_PASS, v)}
          />
        </SettingsFieldGroup>
        <FormSwitch
          label="启用 SSL/TLS"
          description="使用加密连接发送评论通知邮件"
          checked={values[KEY_COMMENT_SMTP_SECURE] === "true"}
          onCheckedChange={v => onChange(KEY_COMMENT_SMTP_SECURE, String(v))}
        />
      </SettingsSection>

      {/* 邮件模板 */}
      <SettingsSection
        title="邮件模板"
        description="评论回复通知发给被回复用户，管理员通知在收到新评论时发给站长。下方模板支持变量替换。"
      >
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="回复通知邮件主题"
            placeholder="{{site_name}} - 您的评论收到了回复"
            value={values[KEY_COMMENT_MAIL_SUBJECT]}
            onValueChange={v => onChange(KEY_COMMENT_MAIL_SUBJECT, v)}
          />
          <FormInput
            label="管理员通知邮件主题"
            placeholder="{{site_name}} - 收到新评论"
            value={values[KEY_COMMENT_MAIL_SUBJECT_ADMIN]}
            onValueChange={v => onChange(KEY_COMMENT_MAIL_SUBJECT_ADMIN, v)}
          />
        </SettingsFieldGroup>

        <FormCodeEditor
          label="回复通知邮件模板"
          language="html"
          value={values[KEY_COMMENT_MAIL_TEMPLATE]}
          onValueChange={v => onChange(KEY_COMMENT_MAIL_TEMPLATE, v)}
          minRows={10}
          description="支持变量：{{nick}}, {{reply_nick}}, {{content}}, {{url}}, {{site_name}}"
        />
        <FormCodeEditor
          label="管理员通知邮件模板"
          language="html"
          value={values[KEY_COMMENT_MAIL_TEMPLATE_ADMIN]}
          onValueChange={v => onChange(KEY_COMMENT_MAIL_TEMPLATE_ADMIN, v)}
          minRows={10}
          description="支持变量：{{nick}}, {{content}}, {{url}}, {{site_name}}"
        />
      </SettingsSection>
    </div>
  );
}
