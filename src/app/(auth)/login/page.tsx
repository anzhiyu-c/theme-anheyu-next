"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input, Button, Checkbox, Spinner, Card, CardBody, Divider } from "@heroui/react";
import { Eye, EyeOff, Github, MessageCircle } from "lucide-react";
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

      if (response.code === 200 && response.data) {
        setAuth(response.data);
        router.push(redirectUrl);
      } else {
        setError(response.message || "登录失败，请重试");
      }
    } catch {
      setError("登录失败，请检查网络连接");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    window.location.href = `/api/pro/oauth/${provider}/authorize?redirectUrl=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-[400px] mx-4"
    >
      <Card shadow="md" classNames={{ base: "border border-default-200" }}>
        <CardBody className="p-8">
          {/* 头部 */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block text-2xl font-bold text-primary mb-2">
              AnHeYu
            </Link>
            <p className="text-default-500 text-sm">登录以继续</p>
          </div>

          {/* 错误提示 */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 rounded-medium bg-danger-50 text-danger text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {/* 登录表单 */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* 邮箱输入框 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                邮箱 <span className="text-danger">*</span>
              </label>
              <Input
                type="email"
                placeholder="请输入邮箱地址"
                value={email}
                onValueChange={setEmail}
                variant="bordered"
                classNames={{
                  inputWrapper: "h-11",
                }}
              />
            </div>

            {/* 密码输入框 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                密码 <span className="text-danger">*</span>
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="请输入密码"
                value={password}
                onValueChange={setPassword}
                variant="bordered"
                classNames={{
                  inputWrapper: "h-11",
                }}
                endContent={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-default-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-default-400" />
                    )}
                  </button>
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Checkbox isSelected={remember} onValueChange={setRemember} size="sm">
                <span className="text-sm text-default-500">记住我</span>
              </Checkbox>

              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                忘记密码？
              </Link>
            </div>

            <Button type="submit" color="primary" className="w-full font-medium h-11" isLoading={isLoading}>
              登录
            </Button>
          </form>

          {/* 分割线 */}
          <div className="flex items-center gap-4 my-6">
            <Divider className="flex-1" />
            <span className="text-xs text-default-400">或</span>
            <Divider className="flex-1" />
          </div>

          {/* OAuth 登录按钮 */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="bordered"
              className="h-11"
              startContent={<Github className="w-4 h-4" />}
              onPress={() => handleOAuthLogin("github")}
            >
              GitHub
            </Button>
            <Button
              variant="bordered"
              className="h-11"
              startContent={<MessageCircle className="w-4 h-4" />}
              onPress={() => handleOAuthLogin("wechat")}
            >
              微信
            </Button>
          </div>

          {/* 注册链接 */}
          <p className="mt-8 text-center text-sm text-default-500">
            还没有账号？{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              立即注册
            </Link>
          </p>
        </CardBody>
      </Card>

      {/* 返回首页 */}
      <p className="mt-6 text-center">
        <Link href="/" className="text-sm text-default-500 hover:text-primary transition-colors">
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
