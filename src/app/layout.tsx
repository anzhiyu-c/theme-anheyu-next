import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * 获取后端 API 地址
 */
function getBackendUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8091";
}

/**
 * 站点配置类型（部分字段）
 */
interface SiteConfig {
  APP_NAME?: string;
  SUB_TITLE?: string;
  ICON_URL?: string;
  LOGO_URL?: string;
  LOGO_URL_192x192?: string;
  SITE_URL?: string;
}

/**
 * 动态生成 Metadata
 * 从后端 API 获取站点配置，实现 SEO 动态化
 */
export async function generateMetadata(): Promise<Metadata> {
  // 默认值
  const defaults = {
    title: "AnHeYu",
    description: "现代化博客主题",
    siteName: "AnHeYu",
  };

  try {
    const backendUrl = getBackendUrl();
    const response = await fetch(`${backendUrl}/api/public/site-config`, {
      next: { revalidate: 60 }, // 缓存 60 秒
    });

    if (!response.ok) {
      console.warn("[Layout] Failed to fetch site config:", response.status);
      return createMetadata(defaults);
    }

    const result = await response.json();
    const config: SiteConfig = result.data || result;

    const appName = config.APP_NAME || defaults.title;
    const subTitle = config.SUB_TITLE || defaults.description;
    const fullTitle = subTitle ? `${appName} - ${subTitle}` : appName;

    return createMetadata({
      title: fullTitle,
      description: subTitle,
      siteName: appName,
      iconUrl: config.ICON_URL,
      logoUrl: config.LOGO_URL || config.LOGO_URL_192x192,
      siteUrl: config.SITE_URL,
    });
  } catch (error) {
    console.warn("[Layout] Error fetching site config:", error);
    return createMetadata(defaults);
  }
}

/**
 * 创建 Metadata 对象
 */
function createMetadata(config: {
  title: string;
  description: string;
  siteName: string;
  iconUrl?: string;
  logoUrl?: string;
  siteUrl?: string;
}): Metadata {
  const iconUrl = config.iconUrl || "/favicon.ico";
  const logoUrl = config.logoUrl || "/static/img/logo-192x192.png";

  // 判断图标类型（.ico 文件实际可能是 PNG）
  const isSvg = iconUrl.endsWith(".svg");
  const iconType = isSvg ? "image/svg+xml" : "image/png";

  // 设置 metadataBase 用于解析相对路径
  const metadataBase = config.siteUrl
    ? new URL(config.siteUrl)
    : process.env.NODE_ENV === "development"
    ? new URL("http://localhost:3000")
    : undefined;

  return {
    metadataBase,
    title: {
      template: `%s | ${config.siteName}`,
      default: config.title,
    },
    description: config.description,
    keywords: ["博客", "Next.js", "HeroUI", "React", "TypeScript"],
    icons: {
      icon: [{ url: iconUrl, type: iconType }],
      shortcut: [{ url: iconUrl, type: iconType }],
      apple: logoUrl,
    },
    manifest: "/manifest.json",
    openGraph: {
      type: "website",
      locale: "zh_CN",
      siteName: config.siteName,
      title: config.title,
      description: config.description,
      ...(config.siteUrl && { url: config.siteUrl }),
      ...(config.logoUrl && { images: [config.logoUrl] }),
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        {/* 初始加载动画 - 纯 CSS + SVG，JS 加载前就显示，样式在 globals.css */}
        <div id="initial-loader" aria-label="加载中" role="status">
          <svg className="loader-spinner" viewBox="0 0 50 50" aria-hidden="true">
            <circle className="loader-bg" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
            <circle className="loader-inner" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
          </svg>
          <span className="sr-only">页面加载中</span>
        </div>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
