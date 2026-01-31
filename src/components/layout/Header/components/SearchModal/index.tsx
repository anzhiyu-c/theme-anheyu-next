"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

import styles from "./styles.module.css";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // 聚焦输入框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

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

  // 处理搜索
  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        // TODO: 实现搜索逻辑
        console.log("搜索:", searchQuery);
      }
    },
    [searchQuery]
  );

  // 清除搜索
  const handleClear = useCallback(() => {
    setSearchQuery("");
    inputRef.current?.focus();
  }, []);

  if (!isOpen) return null;

  return (
    <div className={styles.searchModal}>
      {/* 遮罩 */}
      <div className={styles.searchMask} onClick={onClose} />

      {/* 搜索框容器 */}
      <div className={styles.searchContainer}>
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.searchInputWrapper}>
            <Search className={styles.searchIcon} size={20} />
            <input
              ref={inputRef}
              type="text"
              className={styles.searchInput}
              placeholder="搜索文章..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button type="button" className={styles.clearButton} onClick={handleClear}>
                <X size={16} />
              </button>
            )}
          </div>
          <div className={styles.searchTips}>
            <span>
              按 <kbd>ESC</kbd> 关闭
            </span>
            <span>
              按 <kbd>Enter</kbd> 搜索
            </span>
          </div>
        </form>

        {/* 搜索结果区域 */}
        {searchQuery && (
          <div className={styles.searchResults}>
            <div className={styles.noResults}>暂无搜索结果</div>
          </div>
        )}
      </div>
    </div>
  );
}
