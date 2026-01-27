'use client'

import { Card, CardBody } from '@heroui/react'
import { motion } from 'motion/react'
import { FileText, Eye, Tag, Folder } from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import type { ArticleStatistics } from '@/lib/api/types'

interface StatisticsProps {
  stats: ArticleStatistics
}

const statItems = [
  { key: 'total_articles', label: '文章数', icon: FileText, color: 'text-blue-500' },
  { key: 'total_views', label: '总浏览', icon: Eye, color: 'text-green-500' },
  { key: 'total_categories', label: '分类数', icon: Folder, color: 'text-purple-500' },
  { key: 'total_tags', label: '标签数', icon: Tag, color: 'text-orange-500' },
] as const

export function Statistics({ stats }: StatisticsProps) {
  return (
    <section className="py-16 bg-default-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold">博客统计</h2>
          <p className="mt-2 text-foreground/60">记录成长的每一步</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {statItems.map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="text-center">
                <CardBody className="py-6">
                  <div className={`inline-flex p-3 rounded-full bg-default-100 ${item.color} mb-4`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-bold">
                    {formatNumber(stats[item.key])}
                  </div>
                  <div className="text-sm text-foreground/60 mt-1">
                    {item.label}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
