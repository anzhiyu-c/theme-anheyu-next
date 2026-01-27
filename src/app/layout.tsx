import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Providers } from '@/providers'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'AnHeYu Blog',
    template: '%s | AnHeYu',
  },
  description: 'AnHeYu 个人博客 - 分享技术、生活与思考',
  keywords: ['博客', 'AnHeYu', '技术', '前端', '后端'],
  authors: [{ name: 'AnHeYu' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: 'AnHeYu Blog',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
