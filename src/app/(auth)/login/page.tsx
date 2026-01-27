"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardBody, CardHeader, Input, Button, Checkbox, Divider, Spinner } from "@heroui/react";
import { Eye, EyeOff, Mail, Lock, Github, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { login } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/admin";

  const setAuth = useAuthStore(state => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("请输入邮箱和密码");
      return;
    }

    setIsLoading(true);

    try {
      const response = await login({ email, password, remember });

      // anheyu-pro 使用 code === 200 表示成功
      if (response.code === 200 && response.data) {
        // 设置认证状态
        setAuth(response.data);
        // 跳转到目标页面
        router.push(redirectUrl);
      } else {
        setError(response.message || "登录失败，请重试");
      }
    } catch (err) {
      setError("登录失败，请检查网络连接");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    // OAuth 登录逻辑
    window.location.href = `/api/pro/oauth/${provider}/authorize?redirectUrl=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-4">
      <Card className="bg-card border border-border shadow-card">
        <CardHeader className="flex flex-col items-center pt-8 pb-4">
          {/* Logo */}
          <Link href="/" className="text-3xl font-bold text-primary mb-2">
            AnHeYu
          </Link>
          <p className="text-muted-foreground text-sm">登录以继续</p>
        </CardHeader>

        <CardBody className="px-6 pb-8">
          {/* 错误提示 */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* 登录表单 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="邮箱"
              placeholder="请输入邮箱地址"
              value={email}
              onValueChange={setEmail}
              startContent={<Mail className="w-4 h-4 text-muted-foreground" />}
              isRequired
              classNames={{
                inputWrapper: "bg-secondary/50",
              }}
            />

            <Input
              type={showPassword ? "text" : "password"}
              label="密码"
              placeholder="请输入密码"
              value={password}
              onValueChange={setPassword}
              startContent={<Lock className="w-4 h-4 text-muted-foreground" />}
              endContent={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              }
              isRequired
              classNames={{
                inputWrapper: "bg-secondary/50",
              }}
            />

            <div className="flex items-center justify-between">
              <Checkbox isSelected={remember} onValueChange={setRemember} size="sm">
                <span className="text-sm text-muted-foreground">记住我</span>
              </Checkbox>

              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                忘记密码？
              </Link>
            </div>

            <Button type="submit" color="primary" className="w-full font-medium" size="lg" isLoading={isLoading}>
              登录
            </Button>
          </form>

          {/* 分割线 */}
          <div className="my-6 flex items-center gap-4">
            <Divider className="flex-1" />
            <span className="text-sm text-muted-foreground">或</span>
            <Divider className="flex-1" />
          </div>

          {/* OAuth 登录按钮 */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="bordered"
              startContent={<Github className="w-4 h-4" />}
              onPress={() => handleOAuthLogin("github")}
              className="font-medium"
            >
              GitHub
            </Button>
            <Button
              variant="bordered"
              startContent={<MessageCircle className="w-4 h-4" />}
              onPress={() => handleOAuthLogin("wechat")}
              className="font-medium"
            >
              微信
            </Button>
          </div>

          {/* 注册链接 */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            还没有账号？{" "}
            <Link href="/register" className="text-primary hover:underline">
              立即注册
            </Link>
          </p>
        </CardBody>
      </Card>

      {/* 返回首页 */}
      <p className="mt-4 text-center">
        <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          ← 返回首页
        </Link>
      </p>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center">
          <Spinner size="lg" color="primary" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
