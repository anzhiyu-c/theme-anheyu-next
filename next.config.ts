/*
 * @Description:
 * @Author: 安知鱼
 * @Date: 2026-01-30 16:51:16
 * @LastEditTime: 2026-01-31 14:30:00
 * @LastEditors: 安知鱼
 */
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "*.picsum.photos",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      // 允许 anheyu 相关域名
      {
        protocol: "https",
        hostname: "*.anheyu.com",
      },
      {
        protocol: "https",
        hostname: "anheyu.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      // 允许常用的图床和 CDN
      {
        protocol: "https",
        hostname: "*.aliyuncs.com",
      },
      {
        protocol: "https",
        hostname: "*.qiniudn.com",
      },
      {
        protocol: "https",
        hostname: "*.cloudflare.com",
      },
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
      },
    ],
  },

  // 代理配置 - 客户端请求代理到 Go 后端
  async rewrites() {
    // 开发环境使用 BACKEND_URL，生产环境使用 API_URL（Docker 内部网络）
    const backendUrl = isDev
      ? process.env.BACKEND_URL || "http://localhost:8091"
      : process.env.API_URL || "http://anheyu:8091";

    return {
      // beforeFiles: 在检查 public 目录之前执行（API 等必须代理的路径）
      beforeFiles: [
        // API 代理
        {
          source: "/api/:path*",
          destination: `${backendUrl}/api/:path*`,
        },
        // 静态文件代理（后端上传的图片等）
        {
          source: "/static/:path*",
          destination: `${backendUrl}/static/:path*`,
        },
        // 文件代理
        {
          source: "/f/:path*",
          destination: `${backendUrl}/f/:path*`,
        },
        // 缓存文件代理
        {
          source: "/needcache/:path*",
          destination: `${backendUrl}/needcache/:path*`,
        },
      ],
      // afterFiles: SEO 和动态生成的文件
      afterFiles: [
        // SEO 相关文件代理（动态生成）
        {
          source: "/sitemap.xml",
          destination: `${backendUrl}/sitemap.xml`,
        },
        {
          source: "/robots.txt",
          destination: `${backendUrl}/robots.txt`,
        },
        // RSS Feed 代理
        {
          source: "/rss.xml",
          destination: `${backendUrl}/rss.xml`,
        },
        {
          source: "/feed.xml",
          destination: `${backendUrl}/feed.xml`,
        },
        {
          source: "/atom.xml",
          destination: `${backendUrl}/atom.xml`,
        },
      ],
      fallback: [],
    };
  },
};

export default nextConfig;
