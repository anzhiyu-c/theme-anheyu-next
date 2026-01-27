"use client";

import { motion } from "framer-motion";
import { Button, Card, CardBody, Image, Chip } from "@heroui/react";
import { Home, ArrowLeft, Search, Sparkles, Calendar } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, parseISO, isValid } from "date-fns";
import { zhCN } from "date-fns/locale";
import type { Article } from "@/types";

interface NotFoundContentProps {
  articles: Article[];
}

// 安全格式化日期
function formatDate(dateValue: string | Date | undefined | null): string {
  if (!dateValue) return "未知日期";

  try {
    const date = typeof dateValue === "string" ? parseISO(dateValue) : dateValue;
    if (!isValid(date)) return "未知日期";
    return format(date, "MM月dd日", { locale: zhCN });
  } catch {
    return "未知日期";
  }
}

// 动画变体
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const floatVariants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const glowVariants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.3, 0.6, 0.3],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export function NotFoundContent({ articles }: NotFoundContentProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* 背景装饰 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* 渐变光晕 */}
        <motion.div
          variants={glowVariants}
          animate="animate"
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/20 blur-3xl"
        />
        <motion.div
          variants={glowVariants}
          animate="animate"
          style={{ animationDelay: "1.5s" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-secondary/20 blur-3xl"
        />
        {/* 网格背景 */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(var(--anzhiyu-fontcolor) 1px, transparent 1px),
              linear-gradient(90deg, var(--anzhiyu-fontcolor) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 container mx-auto px-4 py-12 md:py-20"
      >
        {/* 主要内容区 */}
        <div className="max-w-4xl mx-auto">
          {/* 404 主区域 */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            {/* 浮动的 404 */}
            <motion.div variants={floatVariants} animate="animate" className="relative inline-block mb-6">
              {/* 背景光效 */}
              <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-primary/40 via-secondary/40 to-primary/40 rounded-full scale-150" />

              {/* 404 数字 */}
              <h1 className="relative text-[8rem] md:text-[12rem] font-black leading-none">
                <span className="bg-gradient-to-br from-primary via-primary/80 to-secondary bg-clip-text text-transparent drop-shadow-2xl">
                  404
                </span>
              </h1>

              {/* 装饰星星 */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -right-4"
              >
                <Sparkles className="w-8 h-8 text-primary/60" />
              </motion.div>
            </motion.div>

            {/* 提示文字 */}
            <motion.div variants={itemVariants}>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">哎呀，页面走丢了</h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto mb-8">
                这个页面可能已经被移除，或者链接有误。别担心，下面有一些精选内容推荐给你。
              </p>
            </motion.div>

            {/* 操作按钮 */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                color="primary"
                variant="shadow"
                size="lg"
                startContent={<Home className="w-4 h-4" />}
                className="font-medium"
                onPress={() => router.push("/")}
              >
                返回首页
              </Button>
              <Button
                variant="bordered"
                size="lg"
                startContent={<ArrowLeft className="w-4 h-4" />}
                onPress={() => router.back()}
                className="font-medium"
              >
                返回上一页
              </Button>
              <Button
                variant="light"
                size="lg"
                startContent={<Search className="w-4 h-4" />}
                className="font-medium"
                onPress={() => router.push("/")}
              >
                站内搜索
              </Button>
            </motion.div>
          </motion.div>

          {/* 推荐文章区域 */}
          {articles.length > 0 && (
            <motion.div variants={itemVariants}>
              {/* 标题 */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-border" />
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  推荐阅读
                </h3>
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-border" />
              </div>

              {/* 文章列表 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {articles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Link href={`/posts/${article.slug}`} className="block">
                      <Card
                        isPressable
                        className="group bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                      >
                        <CardBody className="p-0">
                          <div className="flex gap-4 p-4">
                            {/* 封面图 */}
                            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                              {article.cover ? (
                                <Image
                                  removeWrapper
                                  alt={article.title}
                                  src={article.cover}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                                  <span className="text-3xl font-bold text-primary/30">{article.title.charAt(0)}</span>
                                </div>
                              )}
                              {/* 置顶标签 */}
                              {article.is_top && (
                                <Chip size="sm" color="primary" className="absolute top-1 left-1 text-[10px] h-5">
                                  置顶
                                </Chip>
                              )}
                            </div>

                            {/* 内容 */}
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                              {/* 分类标签 */}
                              {article.category && (
                                <Chip size="sm" variant="flat" color="primary" className="w-fit mb-2 text-[10px] h-5">
                                  {article.category.name}
                                </Chip>
                              )}

                              {/* 标题 */}
                              <h4 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
                                {article.title}
                              </h4>

                              {/* 日期 */}
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(article.published_at || article.created_at)}</span>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* 查看更多 */}
              <motion.div variants={itemVariants} className="text-center mt-6">
                <Button variant="flat" color="primary" className="font-medium" onPress={() => router.push("/archives")}>
                  查看更多文章
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
