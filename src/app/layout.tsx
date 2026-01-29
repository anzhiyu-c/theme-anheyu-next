import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";

const inter = Inter({ subsets: ["latin"] });

/**
 * 默认 Metadata - 会被 DynamicHead 组件根据站点配置动态覆盖
 * favicon、og:image 等由 DynamicHead 客户端动态设置
 */
export const metadata: Metadata = {
  title: "AnHeYu Next - 现代博客主题",
  description: "一个基于 Next.js 和 HeroUI 构建的现代化博客主题",
  keywords: ["博客", "Next.js", "React", "AnHeYu"],
  authors: [{ name: "安知鱼" }],
  // 默认 favicon - 会被 DynamicHead 根据配置覆盖
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.svg",
  },
  // Open Graph 默认值
  openGraph: {
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* 默认 favicon - 会被 DynamicHead 动态替换 */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
