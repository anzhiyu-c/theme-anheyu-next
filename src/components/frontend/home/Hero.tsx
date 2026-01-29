"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimationFrame } from "framer-motion";
import { ArrowDown, Sparkles, Code2, Zap, Star } from "lucide-react";
import Link from "next/link";

// 浮动装饰元素配置
const floatingElements = [
  { icon: Code2, x: "10%", y: "20%", delay: 0, duration: 6 },
  { icon: Zap, x: "85%", y: "15%", delay: 1, duration: 7 },
  { icon: Star, x: "15%", y: "70%", delay: 2, duration: 5 },
  { icon: Sparkles, x: "80%", y: "65%", delay: 0.5, duration: 8 },
  { icon: Code2, x: "90%", y: "40%", delay: 1.5, duration: 6.5 },
  { icon: Star, x: "5%", y: "45%", delay: 2.5, duration: 7.5 },
];

// 网格背景组件
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 网格线 */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(var(--anzhiyu-fontcolor) 1px, transparent 1px),
            linear-gradient(90deg, var(--anzhiyu-fontcolor) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)",
        }}
      />
      {/* 渐变遮罩 - 顶部和底部淡出 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, var(--anzhiyu-background) 0%, transparent 15%, transparent 85%, var(--anzhiyu-background) 100%)",
        }}
      />
    </div>
  );
}

// 光晕背景组件
function GlowBackground({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 鼠标跟随光晕 - 非常微妙 */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--anzhiyu-theme-op-light) 0%, transparent 60%)",
          left: mouseX - 400,
          top: mouseY - 400,
          filter: "blur(60px)",
        }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 主光晕 - 中心，非常柔和 */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--anzhiyu-theme-op-light) 0%, transparent 60%)",
        }}
        animate={{
          scale: [1, 1.03, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 左上角光斑 - 更柔和 */}
      <motion.div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--anzhiyu-theme-op-light) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 右下角光斑 - 更柔和 */}
      <motion.div
        className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--anzhiyu-theme-op-light) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, -30, 0],
          y: [0, -20, 0],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

// 浮动图标组件
function FloatingIcon({
  icon: Icon,
  x,
  y,
  delay,
  duration,
}: {
  icon: React.ElementType;
  x: string;
  y: string;
  delay: number;
  duration: number;
}) {
  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.1, 0.3, 0.1],
        scale: [0.8, 1, 0.8],
        y: [0, -20, 0],
        rotate: [0, 10, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      <div
        className="p-3 rounded-xl backdrop-blur-sm"
        style={{
          background: "var(--anzhiyu-theme-op-light)",
          border: "1px solid var(--anzhiyu-theme-op)",
        }}
      >
        <Icon className="w-5 h-5" style={{ color: "var(--anzhiyu-theme)" }} />
      </div>
    </motion.div>
  );
}

// 粒子类型
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

// 粒子系统 - 只在客户端生成随机粒子，避免 hydration 错误
function ParticleField() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // 只在客户端生成粒子，避免服务器/客户端不匹配
    const generatedParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(generatedParticles);
  }, []);

  // 服务器端或粒子未生成时不渲染
  if (particles.length === 0) {
    return <div className="absolute inset-0 overflow-hidden pointer-events-none" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: "var(--anzhiyu-theme)",
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// 打字机效果 Hook
function useTypewriter(text: string, speed: number = 100, delay: number = 0) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let currentIndex = 0;

    const startTyping = () => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        currentIndex++;
        timeout = setTimeout(startTyping, speed);
      } else {
        setIsComplete(true);
      }
    };

    const delayTimeout = setTimeout(startTyping, delay);

    return () => {
      clearTimeout(timeout);
      clearTimeout(delayTimeout);
    };
  }, [text, speed, delay]);

  return { displayText, isComplete };
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // 鼠标位置追踪
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // 视差和淡出效果
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const titleScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.9]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // 平滑弹簧效果
  const smoothTitleY = useSpring(titleY, { stiffness: 100, damping: 30 });
  const smoothSubtitleY = useSpring(subtitleY, { stiffness: 100, damping: 30 });

  // 打字机效果
  const { displayText: titleText, isComplete: titleComplete } = useTypewriter("AnHeYu 的博客", 150, 1200);

  return (
    <section ref={containerRef} className="relative h-[90vh]">
      {/* 粘性容器 */}
      <div className="sticky top-0 flex flex-col items-center justify-center h-screen overflow-hidden">
        {/* 网格背景 */}
        <motion.div style={{ opacity: bgOpacity }}>
          <GridBackground />
        </motion.div>

        {/* 光晕背景 */}
        <motion.div style={{ scale: bgScale, opacity: bgOpacity }}>
          <GlowBackground mouseX={mousePosition.x} mouseY={mousePosition.y} />
        </motion.div>

        {/* 粒子系统 */}
        <motion.div style={{ opacity: bgOpacity }}>
          <ParticleField />
        </motion.div>

        {/* 浮动装饰元素 */}
        <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity: bgOpacity }}>
          {floatingElements.map((el, i) => (
            <FloatingIcon key={i} {...el} />
          ))}
        </motion.div>

        {/* 主内容 */}
        <div className="relative z-10 max-w-6xl px-4 mx-auto text-center sm:px-6">
          {/* 标签徽章 - 更高级的玻璃态效果 */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ opacity: subtitleOpacity, y: smoothSubtitleY }}
            className="mb-6 sm:mb-8"
          >
            <span
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-medium tracking-[0.1em] sm:tracking-[0.15em] uppercase rounded-full backdrop-blur-md"
              style={{
                background: "linear-gradient(135deg, var(--anzhiyu-theme-op-light), var(--anzhiyu-theme-op))",
                color: "var(--anzhiyu-theme)",
                border: "1px solid var(--anzhiyu-theme-op)",
                boxShadow: "0 8px 32px -8px var(--anzhiyu-theme-op), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.span>
              探索技术与生活
            </span>
          </motion.div>

          {/* 大标题 - 带打字机效果 */}
          <motion.div style={{ y: smoothTitleY, opacity: titleOpacity, scale: titleScale }}>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-[clamp(2.5rem,8vw,5.5rem)] font-bold leading-[1.1] tracking-[-0.03em] mb-6 sm:mb-8"
            >
              <span className="block text-[var(--anzhiyu-fontcolor)]">欢迎来到</span>
              <span
                className="relative block mt-2 sm:mt-3 bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, var(--anzhiyu-theme) 0%, var(--anzhiyu-blue) 25%, var(--anzhiyu-purple) 50%, var(--anzhiyu-blue) 75%, var(--anzhiyu-theme) 100%)",
                  backgroundSize: "200% auto",
                  animation: "gradient-shift 4s linear infinite",
                }}
              >
                {titleText}
                {!titleComplete && (
                  <motion.span
                    className="inline-block w-[3px] h-[0.9em] ml-1 align-middle"
                    style={{ background: "var(--anzhiyu-theme)" }}
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                )}
              </span>
            </motion.h1>
          </motion.div>

          {/* 副标题描述 */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-2xl px-2 mx-auto text-base sm:text-lg md:text-xl font-light leading-relaxed"
            style={{
              color: "var(--anzhiyu-secondtext)",
              opacity: subtitleOpacity,
              y: smoothSubtitleY,
            }}
          >
            分享技术心得、记录生活点滴、探索无限可能
            <br className="hidden sm:block" />
            在这里，你会发现有趣的想法和实用的知识
          </motion.p>

          {/* CTA 按钮组 - 简洁优雅 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{ opacity: subtitleOpacity }}
            className="flex items-center justify-center gap-6 mt-10 sm:mt-12"
          >
            {/* 主按钮 */}
            <Link href="/posts" className="group">
              <motion.div
                className="relative flex items-center gap-2 px-6 py-3 text-sm font-medium text-white rounded-full overflow-hidden"
                style={{
                  background: "var(--anzhiyu-theme)",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <span>开始阅读</span>
                <ArrowDown className="w-4 h-4 -rotate-90 transition-transform group-hover:translate-x-0.5" />
              </motion.div>
            </Link>

            {/* 分隔点 */}
            <span className="hidden sm:block w-1 h-1 rounded-full" style={{ background: "var(--anzhiyu-gray-op)" }} />

            {/* 次按钮 - 文字链接风格 */}
            <Link
              href="/about"
              className="group flex items-center gap-1.5 text-sm font-medium transition-colors"
              style={{ color: "var(--anzhiyu-secondtext)" }}
              onMouseEnter={e => {
                e.currentTarget.style.color = "var(--anzhiyu-theme)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = "var(--anzhiyu-secondtext)";
              }}
            >
              <span>了解更多</span>
              <ArrowDown className="w-3.5 h-3.5 -rotate-90 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>

        {/* 滚动指示器 - 极简风格 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{ opacity: subtitleOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            className="flex flex-col items-center gap-2 cursor-pointer"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            onClick={() => {
              window.scrollTo({ top: window.innerHeight * 0.9, behavior: "smooth" });
            }}
          >
            {/* 细线 */}
            <motion.div
              className="w-[1px] h-8"
              style={{ background: "linear-gradient(to bottom, transparent, var(--anzhiyu-gray))" }}
            />
            {/* 小箭头 */}
            <motion.div
              animate={{ y: [0, 4, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown className="w-4 h-4" style={{ color: "var(--anzhiyu-gray)" }} />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* 渐变文字动画 CSS */}
      <style jsx global>{`
        @keyframes gradient-shift {
          0% {
            background-position: 0% center;
          }
          100% {
            background-position: 200% center;
          }
        }
      `}</style>
    </section>
  );
}
