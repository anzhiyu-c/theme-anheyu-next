"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardBody, CardHeader, Input, Button, Checkbox, Divider } from "@heroui/react";
import { motion } from "motion/react";
import { Eye, EyeOff, Lock, User, ArrowLeft } from "lucide-react";
import { login } from "@/lib/api/client";
import { useAuthStore } from "@/store/auth-store";

// 表单验证 Schema
const loginSchema = z.object({
  username: z.string().min(1, "请输入用户名"),
  password: z.string().min(1, "请输入密码"),
  remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginClient() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login: storeLogin } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await login({
        username: data.username,
        password: data.password,
      });

      // 更新 Zustand store
      storeLogin(response.user, response.token);

      // 跳转到后台
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background to-default-100">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        {/* 返回首页 */}
        <Button as={Link} href="/" variant="light" startContent={<ArrowLeft className="w-4 h-4" />} className="mb-6">
          返回首页
        </Button>

        <Card className="shadow-xl">
          <CardHeader className="flex flex-col items-center gap-2 pt-8 pb-4">
            <Link href="/" className="text-3xl font-bold text-gradient">
              AnHeYu
            </Link>
            <p className="text-foreground/60 text-sm">登录到后台管理系统</p>
          </CardHeader>

          <Divider />

          <CardBody className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* 错误提示 */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-danger/10 text-danger text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* 用户名 */}
              <Input
                {...register("username")}
                label="用户名"
                placeholder="请输入用户名"
                startContent={<User className="w-4 h-4 text-foreground/50" />}
                isInvalid={!!errors.username}
                errorMessage={errors.username?.message}
                autoComplete="username"
              />

              {/* 密码 */}
              <Input
                {...register("password")}
                label="密码"
                placeholder="请输入密码"
                type={showPassword ? "text" : "password"}
                startContent={<Lock className="w-4 h-4 text-foreground/50" />}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-foreground/50 hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
                autoComplete="current-password"
              />

              {/* 记住登录 */}
              <div className="flex items-center justify-between">
                <Checkbox {...register("remember")} size="sm">
                  记住登录状态
                </Checkbox>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  忘记密码？
                </Link>
              </div>

              {/* 登录按钮 */}
              <Button type="submit" color="primary" className="w-full" size="lg" isLoading={isLoading}>
                {isLoading ? "登录中..." : "登录"}
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* 底部信息 */}
        <p className="text-center text-foreground/60 text-sm mt-8">
          © {new Date().getFullYear()} AnHeYu. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
