/*
 * @Description:
 * @Author: 安知鱼
 * @Date: 2026-01-30 16:51:16
 * @LastEditTime: 2026-01-31 11:01:08
 * @LastEditors: 安知鱼
 */
import type { NextConfig } from "next";

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
};

export default nextConfig;
