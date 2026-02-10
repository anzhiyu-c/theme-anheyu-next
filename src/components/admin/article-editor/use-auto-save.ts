"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import type { Editor } from "@tiptap/react";
import { postManagementApi } from "@/lib/api/post-management";
import { processHtmlForSave } from "@/lib/content-processor";
import TurndownService from "turndown";

/** 自动保存状态 */
export type AutoSaveStatus = "idle" | "saving" | "saved" | "error";

interface UseAutoSaveOptions {
  /** 文章 ID（仅编辑模式时有效） */
  articleId?: string;
  /** 编辑器实例 */
  editor: Editor | null;
  /** 标题 */
  title: string;
  /** 获取元数据的函数 */
  getSubmitData: () => Record<string, unknown>;
  /** 自动保存间隔（毫秒），默认 30 秒 */
  interval?: number;
  /** 是否启用自动保存 */
  enabled?: boolean;
}

interface UseAutoSaveReturn {
  /** 当前自动保存状态 */
  status: AutoSaveStatus;
  /** 上次保存的时间 */
  lastSavedAt: Date | null;
  /** 手动触发保存 */
  triggerSave: () => void;
  /** 标记为已保存（供手动保存成功后调用，同步状态和内容哈希） */
  markAsSaved: () => void;
}

/** HTML -> Markdown 转换器（单例） */
const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

/**
 * 自动保存 Hook
 *
 * 在编辑模式下，定期检测内容变化并自动保存。
 * 使用内容哈希判断是否有变化，避免无意义的保存。
 */
export function useAutoSave({
  articleId,
  editor,
  title,
  getSubmitData,
  interval = 30000,
  enabled = true,
}: UseAutoSaveOptions): UseAutoSaveReturn {
  const [status, setStatus] = useState<AutoSaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  // 用于追踪上次保存的内容哈希，避免重复保存
  const lastContentHashRef = useRef<string>("");
  const savingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /** 计算内容的简单哈希 */
  const computeHash = useCallback((t: string, html: string) => {
    // 使用简单的字符串拼接作为哈希（足以检测变化）
    return `${t}::${html.length}::${html.slice(0, 200)}::${html.slice(-200)}`;
  }, []);

  /** 执行保存 */
  const doSave = useCallback(async () => {
    if (!articleId || !editor || editor.isDestroyed || savingRef.current) return;
    if (!title.trim()) return;

    const rawHtml = editor.getHTML();
    const hash = computeHash(title, rawHtml);

    // 内容没有变化，跳过
    if (hash === lastContentHashRef.current) return;

    savingRef.current = true;
    setStatus("saving");

    try {
      const html = processHtmlForSave(rawHtml);
      const markdown = turndownService.turndown(html);
      const metaData = getSubmitData();

      await postManagementApi.updateArticle(articleId, {
        title: title.trim(),
        content_html: html,
        content_md: markdown,
        ...metaData,
      });

      lastContentHashRef.current = hash;
      setLastSavedAt(new Date());
      setStatus("saved");
    } catch {
      setStatus("error");
    } finally {
      savingRef.current = false;
    }
  }, [articleId, editor, title, getSubmitData, computeHash]);

  /** 手动触发保存 */
  const triggerSave = useCallback(() => {
    doSave();
  }, [doSave]);

  /** 标记为已保存（供手动保存成功后调用） */
  const markAsSaved = useCallback(() => {
    // 更新内容哈希，防止自动保存重复提交刚手动保存过的内容
    if (editor && !editor.isDestroyed) {
      const rawHtml = editor.getHTML();
      lastContentHashRef.current = computeHash(title, rawHtml);
    }
    setLastSavedAt(new Date());
    setStatus("saved");
  }, [editor, title, computeHash]);

  // 定时器：定期检测并保存
  useEffect(() => {
    if (!enabled || !articleId) return;

    timerRef.current = setInterval(() => {
      doSave();
    }, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [enabled, articleId, interval, doSave]);

  // 页面卸载前尝试保存
  useEffect(() => {
    if (!enabled || !articleId) return;

    const handleBeforeUnload = () => {
      // 同步检查是否需要保存（不等待结果）
      if (editor && !editor.isDestroyed && title.trim()) {
        const rawHtml = editor.getHTML();
        const hash = computeHash(title, rawHtml);
        if (hash !== lastContentHashRef.current) {
          // 尝试用 sendBeacon 发送（更可靠）
          const html = processHtmlForSave(rawHtml);
          const markdown = turndownService.turndown(html);
          const data = JSON.stringify({
            title: title.trim(),
            content_html: html,
            content_md: markdown,
          });
          navigator.sendBeacon?.(`/api/pro/articles/${articleId}`, new Blob([data], { type: "application/json" }));
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [enabled, articleId, editor, title, computeHash]);

  return { status, lastSavedAt, triggerSave, markAsSaved };
}
