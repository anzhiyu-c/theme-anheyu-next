import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";

const inter = Inter({ subsets: ["latin"] });

/**
 * 获取后端 API 地址
 * 服务端直接调用后端，不经过 Next.js 代理
 */
function getBackendUrl(): string {
  const isDev = process.env.NODE_ENV === "development";
  return isDev ? process.env.BACKEND_URL || "http://localhost:8091" : process.env.API_URL || "http://anheyu:8091";
}

/**
 * 站点配置类型（部分字段）
 */
interface SiteConfig {
  APP_NAME?: string;
  SUB_TITLE?: string;
  ICON_URL?: string;
  LOGO_URL?: string;
  SITE_URL?: string;
}

/**
 * 动态生成 Metadata
 * 从后端 API 获取站点配置，实现 SEO 动态化
 */
export async function generateMetadata(): Promise<Metadata> {
  // 默认值
  const defaults = {
    title: "Blog",
    description: "A modern blog theme",
    siteName: "Blog",
  };

  try {
    const backendUrl = getBackendUrl();
    const response = await fetch(`${backendUrl}/api/public/site-config`, {
      // 缓存配置：revalidate 每 60 秒
      next: { revalidate: 60 },
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
      logoUrl: config.LOGO_URL,
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
  const logoUrl = config.logoUrl || "/logo.svg";

  // 判断图标类型（.ico 文件实际可能是 PNG）
  const isSvg = iconUrl.endsWith(".svg");
  const iconType = isSvg ? "image/svg+xml" : "image/png";

  return {
    title: {
      template: `%s | ${config.siteName}`,
      default: config.title,
    },
    description: config.description,
    keywords: ["博客", "Blog"],
    icons: {
      icon: [
        {
          url: iconUrl,
          type: iconType,
        },
      ],
      shortcut: [
        {
          url: iconUrl,
          type: iconType,
        },
      ],
      apple: logoUrl,
    },
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>{/* favicon 由 generateMetadata 动态设置 */}</head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
