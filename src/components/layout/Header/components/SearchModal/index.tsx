"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ChevronRight } from "lucide-react";
import { Input } from "@heroui/react";
import { cn } from "@/lib/utils";

import styles from "./styles.module.css";

interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  author: string;
  category: string;
  tags: string[];
  publish_date: string;
  cover_url?: string;
  abbrlink?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [tipsVisible, setTipsVisible] = useState(true);

  // 动画状态控制
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const pageSize = 10;
  const defaultCover = "/static/img/default_cover.jpg";

  // 执行搜索
  const performSearch = useCallback(
    async (page: number = 1) => {
      if (!keyword.trim()) {
        setSearchResults([]);
        setTotal(0);
        setTotalPages(0);
        return;
      }

      setLoading(true);
      setCurrentPage(page);

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(keyword.trim())}&page=${page}&size=${pageSize}`
        );

        if (!response.ok) {
          throw new Error(`搜索请求失败: ${response.status}`);
        }

        const data = await response.json();

        if (data.code === 200 && data.data) {
          const regex = new RegExp(keyword.trim(), "gi");
          setSearchResults(
            data.data.hits?.map((hit: SearchResult) => ({
              ...hit,
              title: hit.title.replace(regex, match => `<em>${match}</em>`),
              snippet: hit.snippet.replace(regex, match => `<em>${match}</em>`),
            })) || []
          );
          setTotal(data.data.pagination?.total || 0);
          setTotalPages(data.data.pagination?.totalPages || 0);
        } else {
          throw new Error(data.message || "搜索失败");
        }
      } catch (error) {
        console.error("搜索错误:", error);
        setSearchResults([]);
        setTotal(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    },
    [keyword]
  );

  // 处理输入
  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    setTipsVisible(false);
  }, []);

  // 处理回车
  const handleEnter = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && keyword.trim()) {
        performSearch(1);
      }
    },
    [keyword, performSearch]
  );

  // 切换页面
  const changePage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        performSearch(page);
      }
    },
    [performSearch, totalPages]
  );

  // 点击搜索结果
  const handleResultClick = useCallback(
    (result: SearchResult) => {
      const targetId = result.abbrlink || result.id;
      router.push(`/posts/${targetId}`);
      onClose();
    },
    [router, onClose]
  );

  // 格式化日期
  const formatDate = useCallback((dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  }, []);

  // 关闭弹窗
  const closeModal = useCallback(() => {
    setKeyword("");
    setSearchResults([]);
    setTotal(0);
    setTotalPages(0);
    setTipsVisible(true);
    onClose();
  }, [onClose]);

  // 监听快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC 关闭
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        closeModal();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeModal]);

  // 打开时聚焦输入框
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // 控制打开/关闭动画
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isOpen) {
      // 打开时：先渲染 DOM，等待一帧后触发动画
      setShouldRender(true);
      // 使用 setTimeout 确保浏览器完成初始渲染
      timer = setTimeout(() => {
        setIsAnimating(true);
      }, 20);
    } else {
      // 关闭时：先触发关闭动画
      setIsAnimating(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen]);

  // 动画结束后卸载组件
  const handleAnimationEnd = useCallback(() => {
    if (!isAnimating && !isOpen) {
      setShouldRender(false);
    }
  }, [isAnimating, isOpen]);

  // 延迟搜索
  useEffect(() => {
    if (!keyword.trim()) {
      setSearchResults([]);
      setTotal(0);
      setTotalPages(0);
      return;
    }

    const timer = setTimeout(() => {
      performSearch(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword, performSearch]);

  if (!shouldRender) return null;

  return (
    <div className={styles.searchModal}>
      {/* 搜索对话框 */}
      <div className={cn(styles.searchDialog, isAnimating && styles.show)} onTransitionEnd={handleAnimationEnd}>
        <div className={styles.searchWrap}>
          {/* 关闭按钮 */}
          <button className={styles.searchCloseButton} aria-label="关闭搜索框" onClick={closeModal}>
            <X size={16} />
          </button>

          {/* 搜索输入框 */}
          <Input
            ref={inputRef}
            value={keyword}
            onChange={handleInput}
            onKeyDown={handleEnter}
            type="text"
            placeholder="搜索文章..."
            size="md"
            variant="flat"
            startContent={<Search size={16} className="text-default-400" />}
            classNames={{
              base: "w-full",
              inputWrapper: [
                "bg-default-100/70",
                "hover:bg-default-100",
                "group-data-[focus=true]:bg-default-100",
                "border-none",
                "shadow-none",
                "h-10",
              ],
              input: "text-sm",
            }}
          />

          {/* 提示 */}
          {tipsVisible && !keyword.trim() && (
            <div className={styles.searchTips}>
              <kbd>Esc</kbd>
              <span>关闭</span>
              <span>·</span>
              <kbd>⌘K</kbd>
              <span>打开</span>
            </div>
          )}

          {/* 搜索结果 */}
          {keyword.trim() && !loading && searchResults.length > 0 && (
            <div className={styles.searchResults}>
              <div className={styles.resultsHeader}>
                <span className={styles.resultsCount}>找到 {total} 条结果</span>
              </div>

              <div className={styles.resultsList}>
                {searchResults.map(result => (
                  <div key={result.id} className={styles.resultItem} onClick={() => handleResultClick(result)}>
                    <div className={styles.resultThumbnail}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={result.cover_url || defaultCover} alt={result.title} />
                    </div>
                    <div className={styles.resultDetails}>
                      <div className={styles.resultContent}>
                        <div className={styles.resultTitleWrapper}>
                          <div className={styles.resultTitle} dangerouslySetInnerHTML={{ __html: result.title }} />
                        </div>
                        <div className={styles.resultSnippet} dangerouslySetInnerHTML={{ __html: result.snippet }} />
                      </div>
                      <div className={styles.resultFooter}>
                        <div className={styles.resultMeta}>
                          <span className={styles.resultAuthor}>{result.author}</span>
                          <span className={styles.resultDate}>{formatDate(result.publish_date)}</span>
                          {result.tags && result.tags.length > 0 && (
                            <span className={styles.resultTags}>
                              {result.tags.slice(0, 3).map(tag => (
                                <span key={tag} className={styles.tag}>
                                  {tag}
                                </span>
                              ))}
                            </span>
                          )}
                        </div>
                        <div className={styles.resultArrow}>
                          <ChevronRight size={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 分页 */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    className={styles.pageBtn}
                    disabled={currentPage <= 1}
                    onClick={() => changePage(currentPage - 1)}
                  >
                    上一页
                  </button>
                  <span className={styles.pageInfo}>
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    className={styles.pageBtn}
                    disabled={currentPage >= totalPages}
                    onClick={() => changePage(currentPage + 1)}
                  >
                    下一页
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 无结果 */}
          {keyword.trim() && !loading && searchResults.length === 0 && (
            <div className={styles.noResults}>
              <div className={styles.noResultsText}>未找到相关结果</div>
              <div className={styles.noResultsTip}>尝试使用其他关键词或检查拼写</div>
            </div>
          )}

          {/* 加载中 */}
          {loading && (
            <div className={styles.loading}>
              <div className={styles.loadingSpinner} />
              <div className={styles.loadingText}>搜索中...</div>
            </div>
          )}
        </div>
      </div>

      {/* 遮罩 */}
      <div
        className={cn(styles.searchMask, isAnimating && styles.show)}
        onClick={closeModal}
        onTransitionEnd={handleAnimationEnd}
      />
    </div>
  );
}
