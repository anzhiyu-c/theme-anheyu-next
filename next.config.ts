import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // standalone 输出模式，便于 Docker 部署
  output: 'standalone',

  // 图片配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },

  // API 代理配置
  async rewrites() {
    const apiUrl = process.env.API_URL || 'http://localhost:8091'

    return [
      // API 请求代理到后端
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
      // 后台管理请求代理
      {
        source: '/admin/:path*',
        destination: `${apiUrl}/admin/:path*`,
      },
      // SEO 文件代理
      {
        source: '/sitemap.xml',
        destination: `${apiUrl}/sitemap.xml`,
      },
      {
        source: '/robots.txt',
        destination: `${apiUrl}/robots.txt`,
      },
      {
        source: '/rss.xml',
        destination: `${apiUrl}/rss.xml`,
      },
    ]
  },

  // 实验性功能
  experimental: {
    // React Compiler（可选，目前稳定）
    // reactCompiler: true,
  },
}

export default nextConfig
