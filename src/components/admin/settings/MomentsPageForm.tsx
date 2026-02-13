"use client";

import { FormInput } from "@/components/ui/form-input";
import { FormSelect, FormSelectItem } from "@/components/ui/form-select";
import { FormSwitch } from "@/components/ui/form-switch";
import { FormImageUpload } from "@/components/ui/form-image-upload";
import { FormJsonEditor } from "@/components/ui/form-json-editor";
import { FormMonacoEditor } from "@/components/ui/form-monaco-editor";
import { PlaceholderHelpPanel } from "@/components/ui/placeholder-help-panel";
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

  const notifyAdminEnabled = values[KEY_MOMENTS_NOTIFY_ADMIN] === "true";
  const hasNotifyHistory =
    !notifyAdminEnabled &&
    (values[KEY_MOMENTS_SC_MAIL_NOTIFY] === "true" ||
      [
        KEY_MOMENTS_PUSHOO_CHANNEL,
        KEY_MOMENTS_PUSHOO_URL,
        KEY_MOMENTS_WEBHOOK_BODY,
        KEY_MOMENTS_WEBHOOK_HEADERS,
        KEY_MOMENTS_MAIL_SUBJECT_ADMIN,
        KEY_MOMENTS_MAIL_TEMPLATE_ADMIN,
      ]
        .map(key => values[key] ?? "")
        .some(value => value.trim() !== ""));
  const mailNotifyEnabled = values[KEY_MOMENTS_SC_MAIL_NOTIFY] === "true";
  const hasMailNotifyHistory =
    notifyAdminEnabled &&
    !mailNotifyEnabled &&
    [KEY_MOMENTS_MAIL_SUBJECT_ADMIN, KEY_MOMENTS_MAIL_TEMPLATE_ADMIN]
      .map(key => values[key] ?? "")
      .some(value => value.trim() !== "");

  const cardClass =
    "rounded-xl border border-default-200/80 bg-default-50/20 p-5 shadow-[0_0_0_0.5px_rgba(0,0,0,0.04)] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.04)]";

  return (
    <div className="space-y-10">
      {/* 基本配置 */}
      <SettingsSection title="基本配置" description="页面基本信息与展示">
        <div className={cardClass}>
          <FormSwitch
            label="启用朋友圈"
            description="开启朋友圈功能"
            checked={values[KEY_MOMENTS_ENABLE] === "true"}
            onCheckedChange={v => onChange(KEY_MOMENTS_ENABLE, String(v))}
            isPro
          />
          <div className="mt-5 space-y-5">
            <SettingsFieldGroup cols={2}>
              <FormInput
                label="标题"
                placeholder="朋友圈标题"
                value={values[KEY_MOMENTS_TITLE]}
                onValueChange={v => onChange(KEY_MOMENTS_TITLE, v)}
              />
              <FormInput
                label="副标题"
                placeholder="朋友圈副标题"
                value={values[KEY_MOMENTS_SUBTITLE]}
                onValueChange={v => onChange(KEY_MOMENTS_SUBTITLE, v)}
              />
            </SettingsFieldGroup>
            <FormInput
              label="提示"
              placeholder="提示文字"
              value={values[KEY_MOMENTS_TIPS]}
              onValueChange={v => onChange(KEY_MOMENTS_TIPS, v)}
            />
            <SettingsFieldGroup cols={2}>
              <FormInput
                label="按钮文字"
                placeholder="按钮文字"
                value={values[KEY_MOMENTS_BUTTON_TEXT]}
                onValueChange={v => onChange(KEY_MOMENTS_BUTTON_TEXT, v)}
              />
              <FormInput
                label="按钮链接"
                placeholder="跳转链接"
                value={values[KEY_MOMENTS_BUTTON_LINK]}
                onValueChange={v => onChange(KEY_MOMENTS_BUTTON_LINK, v)}
              />
            </SettingsFieldGroup>
            <FormImageUpload
              label="顶部背景"
              value={values[KEY_MOMENTS_TOP_BACKGROUND]}
              onValueChange={v => onChange(KEY_MOMENTS_TOP_BACKGROUND, v)}
              placeholder="图片 URL"
            />
          </div>
        </div>
      </SettingsSection>

      {/* 抓取配置 */}
      <SettingsSection title="抓取配置" description="RSS 抓取与缓存参数">
        <div className={cardClass}>
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
            <FormInput
              label="缓存时长（秒）"
              placeholder="如 1800"
              value={values[KEY_MOMENTS_CACHE_DURATION]}
              onValueChange={v => onChange(KEY_MOMENTS_CACHE_DURATION, v)}
            />
            <FormInput
              label="RSS 超时（秒）"
              placeholder="如 30"
              value={values[KEY_MOMENTS_RSS_TIMEOUT]}
              onValueChange={v => onChange(KEY_MOMENTS_RSS_TIMEOUT, v)}
            />
          </SettingsFieldGroup>
        </div>
      </SettingsSection>

      {/* 通知配置 */}
      <SettingsSection
        title="通知配置"
        description="支持 Pushoo、Webhook、邮件，建议先验证一条链路可达再启用其他方式。"
      >
        <div className={cardClass}>
          <div className="mb-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs text-default-500">
            <span>启用通知管理员后才会发送通知；</span>
            <span>Pushoo/Webhook/邮件可单独或组合使用；</span>
            <span>发布测试动态后可验证是否收到。</span>
          </div>
          <FormSwitch
            label="通知管理员"
            description="有新内容时通知管理员"
            checked={notifyAdminEnabled}
            onCheckedChange={v => onChange(KEY_MOMENTS_NOTIFY_ADMIN, String(v))}
            isPro
          />
          {notifyAdminEnabled ? (
            <>
              <div className="mt-5 space-y-5 border-t border-default-200/60 pt-5">
                <FormSwitch
                  label="邮件通知"
                  description="通过邮件通知管理员"
                  checked={mailNotifyEnabled}
                  onCheckedChange={v => onChange(KEY_MOMENTS_SC_MAIL_NOTIFY, String(v))}
                  isPro
                />
                <SettingsFieldGroup cols={2}>
                  <FormSelect
                    label="Pushoo Channel"
                    placeholder="推送渠道"
                    value={values[KEY_MOMENTS_PUSHOO_CHANNEL] ?? ""}
                    onValueChange={v => onChange(KEY_MOMENTS_PUSHOO_CHANNEL, v)}
                  >
                    <FormSelectItem key="bark">bark</FormSelectItem>
                    <FormSelectItem key="webhook">webhook</FormSelectItem>
                  </FormSelect>
                  <FormInput
                    label="Pushoo URL"
                    placeholder="推送地址"
                    value={values[KEY_MOMENTS_PUSHOO_URL]}
                    onValueChange={v => onChange(KEY_MOMENTS_PUSHOO_URL, v)}
                  />
                </SettingsFieldGroup>
                <FormJsonEditor
                  label="Webhook Body"
                  description="请求体 JSON 模板"
                  value={values[KEY_MOMENTS_WEBHOOK_BODY]}
                  onValueChange={v => onChange(KEY_MOMENTS_WEBHOOK_BODY, v)}
                />
                <PlaceholderHelpPanel
                  title="Webhook 变量"
                  subtitle="点击可复制"
                  items={[
                    { variable: "{{site_name}}", description: "站点名称" },
                    { variable: "{{title}}", description: "通知标题" },
                    { variable: "{{content}}", description: "通知内容" },
                    { variable: "{{url}}", description: "目标链接" },
                  ]}
                  className="mt-2"
                />
                <FormJsonEditor
                  label="Webhook Headers"
                  description="请求头 JSON"
                  value={values[KEY_MOMENTS_WEBHOOK_HEADERS]}
                  onValueChange={v => onChange(KEY_MOMENTS_WEBHOOK_HEADERS, v)}
                />
                {mailNotifyEnabled ? (
                  <>
                    <FormInput
                      label="邮件主题"
                      placeholder="朋友圈更新通知"
                      value={values[KEY_MOMENTS_MAIL_SUBJECT_ADMIN]}
                      onValueChange={v => onChange(KEY_MOMENTS_MAIL_SUBJECT_ADMIN, v)}
                    />
                    <FormMonacoEditor
                      label="邮件模板"
                      language="html"
                      value={values[KEY_MOMENTS_MAIL_TEMPLATE_ADMIN]}
                      onValueChange={v => onChange(KEY_MOMENTS_MAIL_TEMPLATE_ADMIN, v)}
                      height={180}
                      wordWrap
                    />
                    <p className="text-xs text-default-500">建议包含更新来源、时间和入口链接，便于管理员快速判断。</p>
                  </>
                ) : (
                  hasMailNotifyHistory && (
                    <div className="rounded-lg border border-warning/30 bg-warning/5 px-3 py-2 text-xs text-warning-600 dark:text-warning-400">
                      邮件通知已关闭，历史模板已保留，重新开启后继续生效。
                    </div>
                  )
                )}
              </div>
            </>
          ) : (
            hasNotifyHistory && (
              <div className="mt-5 rounded-lg border border-warning/30 bg-warning/5 px-3 py-2 text-xs text-warning-600 dark:text-warning-400">
                通知已关闭，历史配置已保留，重新开启后继续生效。
              </div>
            )
          )}
        </div>
      </SettingsSection>
    </div>
  );
}
