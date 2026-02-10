"use client";

import { FormInput } from "@/components/ui/form-input";
import { FormSwitch } from "@/components/ui/form-switch";
import { SettingsSection, SettingsFieldGroup } from "./SettingsSection";
import { Spinner } from "@/components/ui/spinner";
import {
  KEY_QQ_ENABLE,
  KEY_QQ_APP_ID,
  KEY_QQ_APP_KEY,
  KEY_QQ_AUTO_REGISTER,
  KEY_QQ_CALLBACK_URL,
  KEY_WECHAT_ENABLE,
  KEY_WECHAT_APP_ID,
  KEY_WECHAT_APP_SECRET,
  KEY_WECHAT_LOGIN_MODE,
  KEY_WECHAT_TOKEN,
  KEY_WECHAT_ENCODING_AES_KEY,
  KEY_WECHAT_QRCODE_LOGIN_REPLY,
  KEY_WECHAT_QRCODE_BIND_REPLY,
  KEY_WECHAT_AUTO_REGISTER,
  KEY_WECHAT_CALLBACK_URL,
  KEY_LOGTO_ENABLE,
  KEY_LOGTO_APP_ID,
  KEY_LOGTO_APP_SECRET,
  KEY_LOGTO_ENDPOINT,
  KEY_LOGTO_DIRECT_CONNECTOR,
  KEY_LOGTO_DISPLAY_NAME,
  KEY_LOGTO_AUTO_REGISTER,
  KEY_LOGTO_CALLBACK_URL,
  KEY_OIDC_ENABLE,
  KEY_OIDC_CLIENT_ID,
  KEY_OIDC_CLIENT_SECRET,
  KEY_OIDC_SCOPE,
  KEY_OIDC_WELLKNOWN,
  KEY_OIDC_DISPLAY_NAME,
  KEY_OIDC_AUTO_REGISTER,
  KEY_OIDC_CALLBACK_URL,
  KEY_RAINBOW_ENABLE,
  KEY_RAINBOW_API_URL,
  KEY_RAINBOW_APP_ID,
  KEY_RAINBOW_APP_KEY,
  KEY_RAINBOW_LOGIN_METHODS,
  KEY_RAINBOW_CALLBACK_URL,
} from "@/lib/settings/setting-keys";

interface OAuthFormProps {
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  loading?: boolean;
}

export function OAuthForm({ values, onChange, loading }: OAuthFormProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* QQ 互联 */}
      <SettingsSection title="QQ 互联 (PRO)">
        <FormSwitch
          label="启用 QQ 登录"
          description="允许用户通过 QQ 账号登录"
          checked={values[KEY_QQ_ENABLE] === "true"}
          onCheckedChange={v => onChange(KEY_QQ_ENABLE, String(v))}
          isPro
        />
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="App ID"
            placeholder="请输入 QQ 互联 App ID"
            value={values[KEY_QQ_APP_ID]}
            onValueChange={v => onChange(KEY_QQ_APP_ID, v)}
          />
          <FormInput
            label="App Key"
            placeholder="请输入 QQ 互联 App Key"
            type="password"
            value={values[KEY_QQ_APP_KEY]}
            onValueChange={v => onChange(KEY_QQ_APP_KEY, v)}
          />
        </SettingsFieldGroup>
        <FormSwitch
          label="自动注册"
          description="首次 QQ 登录时自动创建账号"
          checked={values[KEY_QQ_AUTO_REGISTER] === "true"}
          onCheckedChange={v => onChange(KEY_QQ_AUTO_REGISTER, String(v))}
        />
        <FormInput
          label="回调 URL"
          placeholder="https://example.com/oauth/qq/callback"
          value={values[KEY_QQ_CALLBACK_URL]}
          onValueChange={v => onChange(KEY_QQ_CALLBACK_URL, v)}
        />
      </SettingsSection>

      {/* 微信登录 */}
      <SettingsSection title="微信登录 (PRO)">
        <FormSwitch
          label="启用微信登录"
          description="允许用户通过微信账号登录"
          checked={values[KEY_WECHAT_ENABLE] === "true"}
          onCheckedChange={v => onChange(KEY_WECHAT_ENABLE, String(v))}
          isPro
        />
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="App ID"
            placeholder="请输入微信 App ID"
            value={values[KEY_WECHAT_APP_ID]}
            onValueChange={v => onChange(KEY_WECHAT_APP_ID, v)}
          />
          <FormInput
            label="App Secret"
            placeholder="请输入微信 App Secret"
            type="password"
            value={values[KEY_WECHAT_APP_SECRET]}
            onValueChange={v => onChange(KEY_WECHAT_APP_SECRET, v)}
          />
        </SettingsFieldGroup>
        <FormInput
          label="登录模式"
          placeholder="请输入登录模式（如 qrcode）"
          value={values[KEY_WECHAT_LOGIN_MODE]}
          onValueChange={v => onChange(KEY_WECHAT_LOGIN_MODE, v)}
        />
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="Token"
            placeholder="请输入微信 Token"
            type="password"
            value={values[KEY_WECHAT_TOKEN]}
            onValueChange={v => onChange(KEY_WECHAT_TOKEN, v)}
          />
          <FormInput
            label="EncodingAESKey"
            placeholder="请输入 EncodingAESKey"
            type="password"
            value={values[KEY_WECHAT_ENCODING_AES_KEY]}
            onValueChange={v => onChange(KEY_WECHAT_ENCODING_AES_KEY, v)}
          />
        </SettingsFieldGroup>
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="扫码登录回复"
            placeholder="扫码登录时的自动回复内容"
            value={values[KEY_WECHAT_QRCODE_LOGIN_REPLY]}
            onValueChange={v => onChange(KEY_WECHAT_QRCODE_LOGIN_REPLY, v)}
          />
          <FormInput
            label="扫码绑定回复"
            placeholder="扫码绑定时的自动回复内容"
            value={values[KEY_WECHAT_QRCODE_BIND_REPLY]}
            onValueChange={v => onChange(KEY_WECHAT_QRCODE_BIND_REPLY, v)}
          />
        </SettingsFieldGroup>
        <FormSwitch
          label="自动注册"
          description="首次微信登录时自动创建账号"
          checked={values[KEY_WECHAT_AUTO_REGISTER] === "true"}
          onCheckedChange={v => onChange(KEY_WECHAT_AUTO_REGISTER, String(v))}
        />
        <FormInput
          label="回调 URL"
          placeholder="https://example.com/oauth/wechat/callback"
          value={values[KEY_WECHAT_CALLBACK_URL]}
          onValueChange={v => onChange(KEY_WECHAT_CALLBACK_URL, v)}
        />
      </SettingsSection>

      {/* Logto SSO */}
      <SettingsSection title="Logto SSO (PRO)">
        <FormSwitch
          label="启用 Logto"
          description="允许用户通过 Logto SSO 登录"
          checked={values[KEY_LOGTO_ENABLE] === "true"}
          onCheckedChange={v => onChange(KEY_LOGTO_ENABLE, String(v))}
          isPro
        />
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="App ID"
            placeholder="请输入 Logto App ID"
            value={values[KEY_LOGTO_APP_ID]}
            onValueChange={v => onChange(KEY_LOGTO_APP_ID, v)}
          />
          <FormInput
            label="App Secret"
            placeholder="请输入 Logto App Secret"
            type="password"
            value={values[KEY_LOGTO_APP_SECRET]}
            onValueChange={v => onChange(KEY_LOGTO_APP_SECRET, v)}
          />
        </SettingsFieldGroup>
        <FormInput
          label="Endpoint"
          placeholder="请输入 Logto Endpoint URL"
          value={values[KEY_LOGTO_ENDPOINT]}
          onValueChange={v => onChange(KEY_LOGTO_ENDPOINT, v)}
        />
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="Direct Connector"
            placeholder="直连 Connector ID（可选）"
            value={values[KEY_LOGTO_DIRECT_CONNECTOR]}
            onValueChange={v => onChange(KEY_LOGTO_DIRECT_CONNECTOR, v)}
          />
          <FormInput
            label="显示名称"
            placeholder="登录按钮显示名称"
            value={values[KEY_LOGTO_DISPLAY_NAME]}
            onValueChange={v => onChange(KEY_LOGTO_DISPLAY_NAME, v)}
          />
        </SettingsFieldGroup>
        <FormSwitch
          label="自动注册"
          description="首次 Logto 登录时自动创建账号"
          checked={values[KEY_LOGTO_AUTO_REGISTER] === "true"}
          onCheckedChange={v => onChange(KEY_LOGTO_AUTO_REGISTER, String(v))}
        />
        <FormInput
          label="回调 URL"
          placeholder="https://example.com/oauth/logto/callback"
          value={values[KEY_LOGTO_CALLBACK_URL]}
          onValueChange={v => onChange(KEY_LOGTO_CALLBACK_URL, v)}
        />
      </SettingsSection>

      {/* OIDC */}
      <SettingsSection title="OIDC (PRO)">
        <FormSwitch
          label="启用 OIDC"
          description="允许用户通过 OpenID Connect 登录"
          checked={values[KEY_OIDC_ENABLE] === "true"}
          onCheckedChange={v => onChange(KEY_OIDC_ENABLE, String(v))}
          isPro
        />
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="Client ID"
            placeholder="请输入 OIDC Client ID"
            value={values[KEY_OIDC_CLIENT_ID]}
            onValueChange={v => onChange(KEY_OIDC_CLIENT_ID, v)}
          />
          <FormInput
            label="Client Secret"
            placeholder="请输入 OIDC Client Secret"
            type="password"
            value={values[KEY_OIDC_CLIENT_SECRET]}
            onValueChange={v => onChange(KEY_OIDC_CLIENT_SECRET, v)}
          />
        </SettingsFieldGroup>
        <FormInput
          label="Scope"
          placeholder="openid profile email"
          value={values[KEY_OIDC_SCOPE]}
          onValueChange={v => onChange(KEY_OIDC_SCOPE, v)}
          description="OAuth Scope，多个用空格分隔"
        />
        <FormInput
          label="Well-Known URL"
          placeholder="https://example.com/.well-known/openid-configuration"
          value={values[KEY_OIDC_WELLKNOWN]}
          onValueChange={v => onChange(KEY_OIDC_WELLKNOWN, v)}
        />
        <FormInput
          label="显示名称"
          placeholder="登录按钮显示名称"
          value={values[KEY_OIDC_DISPLAY_NAME]}
          onValueChange={v => onChange(KEY_OIDC_DISPLAY_NAME, v)}
        />
        <FormSwitch
          label="自动注册"
          description="首次 OIDC 登录时自动创建账号"
          checked={values[KEY_OIDC_AUTO_REGISTER] === "true"}
          onCheckedChange={v => onChange(KEY_OIDC_AUTO_REGISTER, String(v))}
        />
        <FormInput
          label="回调 URL"
          placeholder="https://example.com/oauth/oidc/callback"
          value={values[KEY_OIDC_CALLBACK_URL]}
          onValueChange={v => onChange(KEY_OIDC_CALLBACK_URL, v)}
        />
      </SettingsSection>

      {/* 彩虹聚合 */}
      <SettingsSection title="彩虹聚合 (PRO)">
        <FormSwitch
          label="启用彩虹聚合登录"
          description="允许用户通过彩虹聚合登录"
          checked={values[KEY_RAINBOW_ENABLE] === "true"}
          onCheckedChange={v => onChange(KEY_RAINBOW_ENABLE, String(v))}
          isPro
        />
        <FormInput
          label="API URL"
          placeholder="请输入彩虹聚合 API 地址"
          value={values[KEY_RAINBOW_API_URL]}
          onValueChange={v => onChange(KEY_RAINBOW_API_URL, v)}
        />
        <SettingsFieldGroup cols={2}>
          <FormInput
            label="App ID"
            placeholder="请输入彩虹聚合 App ID"
            value={values[KEY_RAINBOW_APP_ID]}
            onValueChange={v => onChange(KEY_RAINBOW_APP_ID, v)}
          />
          <FormInput
            label="App Key"
            placeholder="请输入彩虹聚合 App Key"
            type="password"
            value={values[KEY_RAINBOW_APP_KEY]}
            onValueChange={v => onChange(KEY_RAINBOW_APP_KEY, v)}
          />
        </SettingsFieldGroup>
        <FormInput
          label="登录方式"
          placeholder="如 qq,wechat,weibo"
          value={values[KEY_RAINBOW_LOGIN_METHODS]}
          onValueChange={v => onChange(KEY_RAINBOW_LOGIN_METHODS, v)}
          description="支持的登录方式，多个用英文逗号分隔"
        />
        <FormInput
          label="回调 URL"
          placeholder="https://example.com/oauth/rainbow/callback"
          value={values[KEY_RAINBOW_CALLBACK_URL]}
          onValueChange={v => onChange(KEY_RAINBOW_CALLBACK_URL, v)}
        />
      </SettingsSection>
    </div>
  );
}
