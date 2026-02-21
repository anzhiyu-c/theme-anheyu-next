"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { addToast } from "@heroui/react";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/store/auth-store";
import { Spinner } from "@/components/ui";

/**
 * OAuth 回调页面
 *
 * 路由规则：
 * /callback/qq           → provider = "qq"
 * /callback/openid/0     → provider = "logto"
 * /callback/openid/2     → provider = "oidc"
 * /callback/rainbow      → provider = "rainbow"
 */

function OAuthCallbackContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const processedRef = useRef(false);

  useEffect(() => {
    // 防止 StrictMode 双重执行
    if (processedRef.current) return;
    processedRef.current = true;

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCallback() {
    try {
      const code = searchParams.get("code");
      const state = searchParams.get("state") || "";
      const type = searchParams.get("type") || undefined; // 彩虹聚合返回 type 参数

      // 解析路由参数确定 provider
      const segments = Array.isArray(params.provider) ? params.provider : [params.provider];
      let provider: string;

      if (segments[0] === "qq") {
        provider = "qq";
      } else if (segments[0] === "rainbow") {
        provider = "rainbow";
      } else if (segments[0] === "openid") {
        const connector = segments[1];
        if (connector === "0") {
          provider = "logto";
        } else if (connector === "2") {
          provider = "oidc";
        } else {
          throw new Error(`未知的 OpenID 连接器: ${connector}`);
        }
      } else {
        // 尝试从 sessionStorage 获取 provider
        const savedProvider = sessionStorage.getItem("oauth_provider");
        if (savedProvider) {
          provider = savedProvider;
        } else {
          throw new Error("无法识别 OAuth 提供商");
        }
      }

      if (!code) {
        throw new Error("缺少授权码参数");
      }

      // 验证 state（彩虹聚合登录不需要 state 验证）
      const isRainbow = provider === "rainbow";
      if (!isRainbow) {
        const savedState = sessionStorage.getItem("oauth_state");
        if (savedState && state !== savedState) {
          throw new Error("状态验证失败，可能存在安全风险");
        }
      }

      // 调用后端回调 API
      const stateParam = isRainbow ? "" : state;
      const typeParam = isRainbow ? type : undefined;

      const res = await authApi.handleOAuthCallback(provider, code, stateParam, typeParam);

      if (res.code === 200 && res.data) {
        // 需要绑定账号
        if (res.data.need_binding) {
          addToast({ title: "该账号未绑定，请先绑定或注册账号", color: "warning", timeout: 3000 });
          router.push("/login");
          return;
        }

        // 保存认证信息
        if (res.data.token && res.data.refresh_token) {
          setAuth({
            accessToken: res.data.token,
            refreshToken: res.data.refresh_token,
            expires: res.data.expires_at
              ? new Date(res.data.expires_at * 1000).toISOString()
              : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            userInfo: {
              id: "",
              created_at: "",
              updated_at: "",
              username: res.data.user?.nickname || "",
              nickname: res.data.user?.nickname || "",
              avatar: res.data.user?.avatar || "",
              email: res.data.user?.email || "",
              lastLoginAt: null,
              userGroupID: 0,
              userGroup: { id: "", name: "", description: "" },
              status: 1,
            },
            roles: [],
          });

          setStatus("success");
          addToast({
            title: res.data.is_new_user ? "注册并登录成功！" : "登录成功！",
            color: "success",
            timeout: 2000,
          });

          // 延迟跳转（使用存储的目标 URL）
          const returnUrl = sessionStorage.getItem("oauth_return_url") || "/admin";
          setTimeout(() => {
            router.push(returnUrl);
          }, 1000);
        } else {
          throw new Error("未收到登录令牌");
        }
      } else {
        throw new Error(res.message || "登录失败");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "登录失败，请重试";
      setStatus("error");
      setErrorMsg(message);
      addToast({ title: message, color: "danger", timeout: 3000 });

      // 3 秒后跳转回登录页
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } finally {
      // 清理 sessionStorage
      sessionStorage.removeItem("oauth_state");
      sessionStorage.removeItem("oauth_provider");
      sessionStorage.removeItem("oauth_login_type");
      sessionStorage.removeItem("oauth_source");
      sessionStorage.removeItem("oauth_return_url");
    }
  }

  return (
    <div className="w-full max-w-sm mx-4">
      <div className="p-8 bg-card rounded-2xl border border-border shadow-lg text-center space-y-4">
        {status === "loading" && (
          <>
            <Loader2 className="w-10 h-10 mx-auto animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">正在处理登录...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="w-10 h-10 mx-auto text-green-500" />
            <p className="text-sm font-medium text-foreground">登录成功！</p>
            <p className="text-xs text-muted-foreground">正在跳转...</p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-10 h-10 mx-auto text-destructive" />
            <p className="text-sm font-medium text-foreground">登录失败</p>
            <p className="text-xs text-muted-foreground">{errorMsg}</p>
            <p className="text-xs text-muted-foreground">3 秒后返回登录页...</p>
          </>
        )}
      </div>
    </div>
  );
}

export function OAuthCallbackPageClient() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  );
}
