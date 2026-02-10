"use client";

import { FormInput } from "@/components/ui/form-input";
import { FormSwitch } from "@/components/ui/form-switch";
import { FormSelect, FormSelectItem } from "@/components/ui/form-select";
import { SettingsSection, SettingsFieldGroup } from "./SettingsSection";
import { Spinner } from "@/components/ui/spinner";
import {
  KEY_CAPTCHA_PROVIDER,
  KEY_TURNSTILE_ENABLE,
  KEY_TURNSTILE_SITE_KEY,
  KEY_TURNSTILE_SECRET_KEY,
  KEY_GEETEST_CAPTCHA_ID,
  KEY_GEETEST_CAPTCHA_KEY,
  KEY_IMAGE_CAPTCHA_LENGTH,
  KEY_IMAGE_CAPTCHA_EXPIRE,
} from "@/lib/settings/setting-keys";

interface CaptchaSettingsFormProps {
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  loading?: boolean;
}

export function CaptchaSettingsForm({ values, onChange, loading }: CaptchaSettingsFormProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 验证方式 */}
      <SettingsSection title="验证方式">
        <FormSelect
          label="验证码提供商"
          placeholder="请选择验证方式"
          value={values[KEY_CAPTCHA_PROVIDER]}
          onValueChange={v => onChange(KEY_CAPTCHA_PROVIDER, v)}
        >
          <FormSelectItem key="none">无</FormSelectItem>
          <FormSelectItem key="turnstile">Cloudflare Turnstile</FormSelectItem>
          <FormSelectItem key="geetest">极验 GeeTest</FormSelectItem>
          <FormSelectItem key="image">系统图形验证码</FormSelectItem>
        </FormSelect>
      </SettingsSection>

      {/* Turnstile 配置 */}
      <SettingsSection title="Turnstile 配置">
        <FormSwitch
          label="启用 Turnstile"
          description="兼容旧配置，建议优先使用「验证码提供商」选择"
          checked={values[KEY_TURNSTILE_ENABLE] === "true"}
          onCheckedChange={v => onChange(KEY_TURNSTILE_ENABLE, String(v))}
        />
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="Site Key"
            placeholder="请输入 Turnstile Site Key"
            value={values[KEY_TURNSTILE_SITE_KEY]}
            onValueChange={v => onChange(KEY_TURNSTILE_SITE_KEY, v)}
            autoComplete="off"
          />
          <FormInput
            label="Secret Key"
            placeholder="请输入 Turnstile Secret Key"
            type="password"
            value={values[KEY_TURNSTILE_SECRET_KEY]}
            onValueChange={v => onChange(KEY_TURNSTILE_SECRET_KEY, v)}
            autoComplete="new-password"
          />
        </SettingsFieldGroup>
      </SettingsSection>

      {/* GeeTest 配置 */}
      <SettingsSection title="GeeTest 配置">
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="Captcha ID"
            placeholder="请输入极验 Captcha ID"
            value={values[KEY_GEETEST_CAPTCHA_ID]}
            onValueChange={v => onChange(KEY_GEETEST_CAPTCHA_ID, v)}
            autoComplete="off"
          />
          <FormInput
            label="Captcha Key"
            placeholder="请输入极验 Captcha Key"
            type="password"
            value={values[KEY_GEETEST_CAPTCHA_KEY]}
            onValueChange={v => onChange(KEY_GEETEST_CAPTCHA_KEY, v)}
            autoComplete="new-password"
          />
        </SettingsFieldGroup>
      </SettingsSection>

      {/* 图形验证码 */}
      <SettingsSection title="图形验证码">
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="验证码长度"
            placeholder="请输入验证码字符长度"
            value={values[KEY_IMAGE_CAPTCHA_LENGTH]}
            onValueChange={v => onChange(KEY_IMAGE_CAPTCHA_LENGTH, v)}
          />
          <FormInput
            label="过期时间"
            placeholder="请输入过期时间"
            value={values[KEY_IMAGE_CAPTCHA_EXPIRE]}
            onValueChange={v => onChange(KEY_IMAGE_CAPTCHA_EXPIRE, v)}
            description="单位：秒"
          />
        </SettingsFieldGroup>
      </SettingsSection>
    </div>
  );
}
