import type { Metadata } from "next";
import { LoginClient } from "./LoginClient";

export const metadata: Metadata = {
  title: "登录",
  description: "登录到 AnHeYu 后台管理系统",
};

export default function LoginPage() {
  return <LoginClient />;
}
