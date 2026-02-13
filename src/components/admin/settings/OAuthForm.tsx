"use client";

import { useMemo } from "react";
import { Link, Copy } from "lucide-react";
import { addToast } from "@heroui/react";
import { FormInput } from "@/components/ui/form-input";
import { FormSwitch } from "@/components/ui/form-switch";
import { SettingsSection, SettingsFieldGroup } from "./SettingsSection";
import { Spinner } from "@/components/ui/spinner";
import { useSiteConfigStore } from "@/store/site-config-store";
import { KEY_SITE_URL } from "@/lib/settings/setting-keys";
import {
  KEY_QQ_ENABLE,
  KEY_QQ_APP_ID,
  KEY_QQ_APP_KEY,
  KEY_QQ_AUTO_REGISTER,
  KEY_WECHAT_ENABLE,
  KEY_WECHAT_APP_ID,
  KEY_WECHAT_APP_SECRET,
  KEY_WECHAT_LOGIN_MODE,
  KEY_WECHAT_TOKEN,
  KEY_WECHAT_ENCODING_AES_KEY,
  KEY_WECHAT_QRCODE_LOGIN_REPLY,
  KEY_WECHAT_QRCODE_BIND_REPLY,
  KEY_WECHAT_AUTO_REGISTER,
  KEY_LOGTO_ENABLE,
  KEY_LOGTO_APP_ID,
  KEY_LOGTO_APP_SECRET,
  KEY_LOGTO_ENDPOINT,
  KEY_LOGTO_DIRECT_CONNECTOR,
  KEY_LOGTO_DISPLAY_NAME,
  KEY_LOGTO_AUTO_REGISTER,
  KEY_OIDC_ENABLE,
  KEY_OIDC_CLIENT_ID,
  KEY_OIDC_CLIENT_SECRET,
  KEY_OIDC_SCOPE,
  KEY_OIDC_WELLKNOWN,
  KEY_OIDC_DISPLAY_NAME,
  KEY_OIDC_AUTO_REGISTER,
  KEY_RAINBOW_ENABLE,
  KEY_RAINBOW_API_URL,
  KEY_RAINBOW_APP_ID,
  KEY_RAINBOW_APP_KEY,
  KEY_RAINBOW_LOGIN_METHODS,
} from "@/lib/settings/setting-keys";

interface OAuthFormProps {
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  loading?: boolean;
}

export function OAuthForm({ values, onChange, loading }: OAuthFormProps) {
  const getSiteUrl = useSiteConfigStore(state => state.getSiteUrl);
  const siteUrlFromValues = values[KEY_SITE_URL];

  // 参考 anheyu-pro：从站点 URL 计算回调地址，优先用表单中的 SITE_URL（来自 site-basic）
  const siteUrl = useMemo(() => {
    const url = siteUrlFromValues || getSiteUrl() || "";
    return url.replace(/\/$/, "");
  }, [siteUrlFromValues, getSiteUrl]);

  const qqCallbackUrl = useMemo(() => (siteUrl ? `${siteUrl}/callback/qq` : ""), [siteUrl]);
  const wechatCallbackUrl = useMemo(() => (siteUrl ? `${siteUrl}/callback/wechat` : ""), [siteUrl]);
  const logtoCallbackUrl = useMemo(() => (siteUrl ? `${siteUrl}/callback/openid/0` : ""), [siteUrl]);
  const oidcCallbackUrl = useMemo(() => (siteUrl ? `${siteUrl}/callback/openid/2` : ""), [siteUrl]);
  const rainbowCallbackUrl = useMemo(() => (siteUrl ? `${siteUrl}/callback/rainbow` : ""), [siteUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    );
  }

  const callbackDescription = "回调地址（从站点 URL 自动生成），需将该地址原样配置到第三方平台回调白名单。";

  const handleCopyCallback = async (url: string) => {
    if (!url) {
      addToast({ title: "暂无可复制的回调地址", color: "warning", timeout: 1800 });
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      addToast({ title: "回调 URL 已复制", color: "success", timeout: 1500 });
    } catch {
      addToast({ title: "复制失败，请手动复制", color: "danger", timeout: 2000 });
    }
  };

  const getCopyButton = (url: string) => (
    <button
      type="button"
      onClick={() => handleCopyCallback(url)}
      className="flex items-center justify-center w-8 h-8 -mr-1 rounded-lg shrink-0 text-default-400 hover:text-default-600 hover:bg-default-100 dark:hover:text-default-300 dark:hover:bg-default-200/20 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50"
      aria-label="复制回调地址"
      title="复制"
    >
      <Copy className="w-4 h-4" />
    </button>
  );

  const getLinkIcon = () => (
    <span className="flex items-center justify-center w-8 h-8 shrink-0 text-default-400" aria-hidden>
      <Link className="w-4 h-4" />
    </span>
  );

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
        {values[KEY_QQ_ENABLE] === "true" && (
          <div className="space-y-5 rounded-xl border border-default-200 bg-default-50/30 p-4 shadow-[0_0_0_0.5px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06),0_2px_8px_rgba(0,0,0,0.3)]">
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
              label="回调地址（自动生成）"
              placeholder="https://your-domain.com/callback/qq"
              value={qqCallbackUrl}
              readOnly
              startContent={getLinkIcon()}
              endContent={getCopyButton(qqCallbackUrl)}
              description={callbackDescription}
            />
          </div>
        )}
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
        {values[KEY_WECHAT_ENABLE] === "true" && (
          <div className="space-y-5 rounded-xl border border-default-200 bg-default-50/30 p-4 shadow-[0_0_0_0.5px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06),0_2px_8px_rgba(0,0,0,0.3)]">
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
              placeholder="qrcode"
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
              label="回调地址（自动生成）"
              placeholder="https://your-domain.com/callback/wechat"
              value={wechatCallbackUrl}
              readOnly
              startContent={getLinkIcon()}
              endContent={getCopyButton(wechatCallbackUrl)}
              description={callbackDescription}
            />
          </div>
        )}
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
        {values[KEY_LOGTO_ENABLE] === "true" && (
          <div className="space-y-5 rounded-xl border border-default-200 bg-default-50/30 p-4 shadow-[0_0_0_0.5px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06),0_2px_8px_rgba(0,0,0,0.3)]">
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
              placeholder="https://your-app.logto.app"
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
              label="回调地址（自动生成）"
              placeholder="https://your-domain.com/callback/openid/0"
              value={logtoCallbackUrl}
              readOnly
              startContent={getLinkIcon()}
              endContent={getCopyButton(logtoCallbackUrl)}
              description={callbackDescription}
            />
          </div>
        )}
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
        {values[KEY_OIDC_ENABLE] === "true" && (
          <div className="space-y-5 rounded-xl border border-default-200 bg-default-50/30 p-4 shadow-[0_0_0_0.5px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06),0_2px_8px_rgba(0,0,0,0.3)]">
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
              label="回调地址（自动生成）"
              placeholder="https://your-domain.com/callback/openid/2"
              value={oidcCallbackUrl}
              readOnly
              startContent={getLinkIcon()}
              endContent={getCopyButton(oidcCallbackUrl)}
              description={callbackDescription}
            />
          </div>
        )}
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
        {values[KEY_RAINBOW_ENABLE] === "true" && (
          <div className="space-y-5 rounded-xl border border-default-200 bg-default-50/30 p-4 shadow-[0_0_0_0.5px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06),0_2px_8px_rgba(0,0,0,0.3)]">
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
              placeholder="qq,wechat,weibo"
              value={values[KEY_RAINBOW_LOGIN_METHODS]}
              onValueChange={v => onChange(KEY_RAINBOW_LOGIN_METHODS, v)}
              description="支持的登录方式，多个用英文逗号分隔"
            />
            <FormInput
              label="回调地址（自动生成）"
              placeholder="https://your-domain.com/callback/rainbow"
              value={rainbowCallbackUrl}
              readOnly
              startContent={getLinkIcon()}
              endContent={getCopyButton(rainbowCallbackUrl)}
              description={callbackDescription}
            />
          </div>
        )}
      </SettingsSection>
    </div>
  );
}
