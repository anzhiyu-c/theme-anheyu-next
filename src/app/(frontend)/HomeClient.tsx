'use client'

import Link from 'next/link'
import { Hero, ArticleCard, Sidebar } from '@/components/frontend/home'
import type { ArticleSummary, ArticleStatistics } from '@/lib/api/types'

interface HomeClientProps {
  articles: ArticleSummary[]
  statistics: ArticleStatistics
}

export function HomeClient({ articles, statistics }: HomeClientProps) {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      {/* Hero 区域 */}
      <Hero />

      {/* 主体区域：文章列表 + 侧边栏 */}
      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        {/* 左侧：文章列表 */}
        <main className="flex-1">
          {/* 标题栏 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#49b1f5] text-white text-sm font-medium rounded">
                首页
              </span>
            </div>
            <Link 
              href="/categories" 
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#49b1f5] transition-colors"
            >
              更多
            </Link>
          </div>

          {/* 文章卡片网格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {articles.map((article, index) => (
              <ArticleCard
                key={article.id}
                article={article}
                index={index}
                isLatest={index === 0}
              />
            ))}
          </div>

          {/* 加载更多 */}
          {articles.length > 0 && (
            <div className="mt-6 text-center">
              <Link
                href="/posts"
                className="inline-block px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-sm text-gray-600 dark:text-gray-400 hover:border-[#49b1f5] hover:text-[#49b1f5] transition-colors"
              >
                查看更多文章
              </Link>
            </div>
          )}
        </main>

        {/* 右侧：侧边栏 */}
        <aside className="w-full lg:w-[300px] flex-shrink-0">
          <Sidebar statistics={statistics} />
        </aside>
      </div>
    </div>
  )
}
