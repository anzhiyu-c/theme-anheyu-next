import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AnHeYu Next - 现代博客主题",
  description: "一个基于 Next.js 和 HeroUI 构建的现代化博客主题",
  keywords: ["博客", "Next.js", "React", "AnHeYu"],
  authors: [{ name: "安知鱼" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
