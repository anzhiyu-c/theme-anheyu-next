"use client";

import { useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Moon, MessageCircle, Keyboard, Music, PanelRight, ChevronRight } from "lucide-react";
import { Tooltip } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useSiteConfigStore } from "@/store/siteConfigStore";

import styles from "./styles.module.css";

interface ConsoleProps {
  isOpen: boolean;
  onClose: () => void;
}

// 模拟数据 - 实际应从 API 获取
const mockTags = [
  { id: "1", name: "JavaScript", count: 12 },
  { id: "2", name: "TypeScript", count: 8 },
  { id: "3", name: "React", count: 15 },
  { id: "4", name: "Next.js", count: 6 },
  { id: "5", name: "Vue", count: 10 },
  { id: "6", name: "Node.js", count: 7 },
  { id: "7", name: "CSS", count: 5 },
  { id: "8", name: "前端", count: 20 },
];

const mockArchives = [
  { year: "2024", count: 42 },
  { year: "2023", count: 38 },
  { year: "2022", count: 25 },
  { year: "2021", count: 18 },
];

const mockComments = [
  {
    id: "1",
    nickname: "访客A",
    email_md5: "abc123",
    content_html: "<p>这篇文章写得很好！</p>",
    target_title: "React 18 新特性详解",
    target_path: "/posts/react-18",
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    nickname: "开发者",
    email_md5: "def456",
    content_html: "<p>学到了很多，感谢分享！</p>",
    target_title: "TypeScript 进阶指南",
    target_path: "/posts/typescript-guide",
    created_at: "2024-01-14T15:20:00Z",
  },
];

export function Console({ isOpen, onClose }: ConsoleProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const siteConfig = useSiteConfigStore(state => state.siteConfig);

  const isDark = theme === "dark";

  // 切换主题
  const handleThemeToggle = useCallback(() => {
    setTheme(isDark ? "light" : "dark");
  }, [isDark, setTheme]);

  // 跳转到归档
  const goToArchive = useCallback(
    (year: string) => {
      const path = year === "全部文章" ? "/archives" : `/archives/${year}/`;
      router.push(path);
      onClose();
    },
    [router, onClose]
  );

  // 跳转到文章
  const goToArticle = useCallback(
    (comment: (typeof mockComments)[0]) => {
      if (!comment?.target_path) return;
      router.push(`${comment.target_path}#comment-${comment.id}`);
      onClose();
    },
    [router, onClose]
  );

  // 格式化评论日期
  const formatCommentDate = useCallback((dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }, []);

  // 获取头像 URL
  const getAvatarUrl = useCallback((emailMd5: string) => {
    return `https://cravatar.cn/avatar/${emailMd5}?s=140&d=mp`;
  }, []);

  // 显示的归档数据
  const displayArchives = useMemo(() => {
    const totalCount = mockArchives.reduce((sum, a) => sum + a.count, 0);
    return [...mockArchives.slice(0, 7), { year: "全部文章", count: totalCount }];
  }, []);

  // ESC 关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // 禁止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className={cn(styles.console, isOpen && styles.show)}>
      <div className={styles.consoleContent}>
        <div className={styles.consoleCardGroup}>
          {/* 左侧：最近评论 */}
          <div className={styles.consoleCardGroupLeft}>
            <div className={cn(styles.consoleCard, styles.cardNewestComments)}>
              <div className={styles.cardContent}>
                <div className={styles.authorContentItemTips}>互动</div>
                <div className={styles.cardHorContent}>
                  <span className={styles.authorContentItemTitle}>最近评论</span>
                  <Link href="/recentcomments" className={styles.goToRecentComments} onClick={onClose} title="最近评论">
                    <ChevronRight size={22} />
                  </Link>
                </div>
              </div>
              <div className={styles.consoleRecentComments}>
                {mockComments.length > 0 ? (
                  mockComments.map(comment => (
                    <div key={comment.id} className={styles.commentCard} onClick={() => goToArticle(comment)}>
                      <div className={styles.commentInfo}>
                        <img src={getAvatarUrl(comment.email_md5)} alt="最近评论头像" />
                        <div>
                          <span className={styles.commentUser}>{comment.nickname}</span>
                        </div>
                        <span className={styles.commentTime}>{formatCommentDate(comment.created_at)}</span>
                      </div>
                      <div
                        className={styles.commentContent}
                        dangerouslySetInnerHTML={{ __html: comment.content_html }}
                      />
                      <div className={styles.commentTitle} title={comment.target_title}>
                        <MessageCircle size={12} />
                        {comment.target_title}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.noComments}>暂无评论</div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧：标签和归档 */}
          <div className={styles.consoleCardGroupRight}>
            {/* 标签卡片 */}
            <div className={cn(styles.consoleCard, styles.tags)}>
              <div className={styles.cardContent}>
                <div className={styles.authorContentItemTips}>标签</div>
                <div className={styles.authorContentItemTitle}>寻找感兴趣的领域</div>
              </div>
              <div className={styles.cardTagCloud}>
                {mockTags.map(tag => (
                  <Link key={tag.id} href={`/tags/${tag.name}/`} className={styles.tagItem} onClick={onClose}>
                    {tag.name}
                    <sup>{tag.count}</sup>
                  </Link>
                ))}
              </div>
            </div>

            {/* 归档卡片 */}
            <div className={cn(styles.consoleCard, styles.history)}>
              <ul className={styles.cardArchiveList}>
                {displayArchives.map(archive => (
                  <li
                    key={archive.year}
                    className={styles.cardArchiveListItem}
                    onClick={() => goToArchive(archive.year)}
                  >
                    <div className={styles.cardArchiveListLink}>
                      <div className={styles.cardArchiveListDate}>{archive.year}</div>
                      <div className={styles.cardArchiveListCountGroup}>
                        <div className={styles.cardArchiveListCount}>{archive.count}</div>
                        <div className={styles.cardArchiveListCountUnit}>篇</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 按钮组 */}
        <div className={styles.buttonGroup}>
          <Tooltip content="显示模式切换" side="top" delayDuration={300}>
            <div className={cn(styles.consoleBtnItem, isDark && styles.on)}>
              <button className={styles.darkmodeSwitch} aria-label="显示模式切换" onClick={handleThemeToggle}>
                <Moon size={24} />
              </button>
            </div>
          </Tooltip>

          <Tooltip content="热评开关" side="top" delayDuration={300}>
            <div className={styles.consoleBtnItem}>
              <button className={styles.commentBarrage} aria-label="热评开关">
                <MessageCircle size={24} />
              </button>
            </div>
          </Tooltip>

          <Tooltip content="快捷键开关" side="top" delayDuration={300}>
            <div className={styles.consoleBtnItem}>
              <button className={styles.keyboardSwitch} aria-label="快捷键开关">
                <Keyboard size={24} />
              </button>
            </div>
          </Tooltip>

          <Tooltip content="音乐胶囊开关" side="top" delayDuration={300}>
            <div className={styles.consoleBtnItem}>
              <button className={styles.musicSwitch} aria-label="音乐胶囊开关">
                <Music size={24} />
              </button>
            </div>
          </Tooltip>

          <Tooltip content="侧边栏开关" side="top" delayDuration={300}>
            <div className={styles.consoleBtnItem}>
              <button className={styles.sidebarSwitch} aria-label="侧边栏开关">
                <PanelRight size={24} />
              </button>
            </div>
          </Tooltip>
        </div>
      </div>

      {/* 遮罩 */}
      <div className={styles.consoleMask} onClick={onClose} />
    </div>
  );
}
