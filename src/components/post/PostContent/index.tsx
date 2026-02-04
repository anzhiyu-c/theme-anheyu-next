/**
 * 文章内容组件
 * 渲染文章 HTML 内容，支持自定义标签插件
 */
"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import { Fancybox } from "@fancyapps/ui";
import { addToast } from "@heroui/react";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import "katex/dist/katex.min.css";
import styles from "./PostContent.module.css";
import "./code-highlight.css";
import { useSiteConfigStore } from "@/store/siteConfigStore";
import { apiClient } from "@/lib/api/client";

interface PostContentProps {
  content: string;
}

// Mermaid 缩放功能的清理函数类型
type MermaidCleanupFn = (() => void) | null;

// 扩展 Window 接口以支持全局音乐播放器函数
declare global {
  interface Window {
    __musicPlayerToggle?: (playerId: string) => Promise<void>;
    __musicPlayerSeek?: (playerId: string, event: MouseEvent) => void;
  }
}

export function PostContent({ content }: PostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const mermaidCleanupRef = useRef<MermaidCleanupFn>(null);
  const siteConfig = useSiteConfigStore(state => state.siteConfig);

  // 代码块配置
  const codeBlockConfig = useMemo(() => {
    const codeMaxLines = siteConfig?.post?.code_block?.code_max_lines ?? 10;
    // 每行高度约 26px (font-size 16px * line-height 1.6)，加上 padding 20px
    const collapsedHeight = codeMaxLines > 0 ? codeMaxLines * 26 + 20 : 0;
    return { codeMaxLines, collapsedHeight };
  }, [siteConfig?.post?.code_block?.code_max_lines]);

  // 存储 Tip 清理函数
  const tipCleanupFnsRef = useRef<(() => void)[]>([]);

  // 初始化 Tip 提示框事件
  const initTipEvents = useCallback(() => {
    if (!contentRef.current) return;

    // 清理之前的事件监听
    tipCleanupFnsRef.current.forEach(fn => fn());
    tipCleanupFnsRef.current = [];

    const tipWrappers = contentRef.current.querySelectorAll(".anzhiyu-tip-wrapper");

    tipWrappers.forEach(wrapper => {
      const wrapperEl = wrapper as HTMLElement;
      const tipText = wrapperEl.querySelector(".anzhiyu-tip-text") as HTMLElement;
      const tip = wrapperEl.querySelector(".anzhiyu-tip") as HTMLElement;

      if (!tipText || !tip) return;

      // 检查触发方式
      const trigger = tip.getAttribute("data-trigger") || "hover";
      // 获取延迟时间（毫秒），默认无延迟
      const delay = parseInt(tip.getAttribute("data-delay") || "0", 10);

      // 显示 tip 的函数
      const showTip = () => {
        tip.style.visibility = "visible";
        tip.style.opacity = "1";
        tip.classList.add("show");
        tip.setAttribute("data-visible", "true");
      };

      // 隐藏 tip 的函数
      const hideTip = () => {
        tip.style.visibility = "hidden";
        tip.style.opacity = "0";
        tip.classList.remove("show");
        tip.setAttribute("data-visible", "false");
      };

      if (trigger === "click") {
        // 点击触发的 tip：只绑定点击事件，不绑定 hover 事件
        const handleClick = (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          const isVisible = tip.getAttribute("data-visible") === "true";
          if (isVisible) {
            hideTip();
          } else {
            showTip();
          }
        };

        // 点击外部区域关闭
        const handleDocumentClick = (e: Event) => {
          if (!wrapperEl.contains(e.target as Node)) {
            hideTip();
          }
        };

        tipText.addEventListener("click", handleClick);
        document.addEventListener("click", handleDocumentClick);

        // 添加清理函数
        tipCleanupFnsRef.current.push(() => {
          tipText.removeEventListener("click", handleClick);
          document.removeEventListener("click", handleDocumentClick);
        });
      } else {
        // Hover 触发的 tip：绑定 mouseenter/mouseleave 事件
        let showTimer: ReturnType<typeof setTimeout> | null = null;
        let hideTimer: ReturnType<typeof setTimeout> | null = null;

        const handleMouseEnter = () => {
          if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
          }
          showTimer = setTimeout(showTip, delay);
        };

        const handleMouseLeave = () => {
          if (showTimer) {
            clearTimeout(showTimer);
            showTimer = null;
          }
          hideTimer = setTimeout(hideTip, 100);
        };

        tipText.addEventListener("mouseenter", handleMouseEnter);
        tipText.addEventListener("mouseleave", handleMouseLeave);

        // 添加清理函数
        tipCleanupFnsRef.current.push(() => {
          tipText.removeEventListener("mouseenter", handleMouseEnter);
          tipText.removeEventListener("mouseleave", handleMouseLeave);
          if (showTimer) clearTimeout(showTimer);
          if (hideTimer) clearTimeout(hideTimer);
        });
      }
    });
  }, []);

  // 初始化 Hidden 隐藏内容事件
  const initHiddenEvents = useCallback(() => {
    if (!contentRef.current) return;

    const hideButtons = contentRef.current.querySelectorAll(".hide-button");

    hideButtons.forEach(button => {
      const handleClick = () => {
        const parent = button.closest(".hide-block, .hide-inline");
        if (!parent) return;

        const content = parent.querySelector(".hide-content") as HTMLElement;
        if (!content) return;

        // 切换显示状态
        if (content.style.display === "none" || !content.style.display) {
          content.style.display = parent.classList.contains("hide-inline") ? "inline" : "block";
          button.textContent = "收起";
        } else {
          content.style.display = "none";
          // 恢复原始按钮文字
          const originalText = button.getAttribute("data-display") || "查看";
          button.textContent = originalText;
        }
      };

      // 保存原始文字
      if (!button.getAttribute("data-display")) {
        button.setAttribute("data-display", button.textContent || "查看");
      }

      button.addEventListener("click", handleClick);
    });

    // 初始隐藏所有隐藏内容
    const hideContents = contentRef.current.querySelectorAll(".hide-content") as NodeListOf<HTMLElement>;
    hideContents.forEach(content => {
      content.style.display = "none";
    });
  }, []);

  // 初始化 Tabs 标签页事件
  const initTabsEvents = useCallback(() => {
    if (!contentRef.current) return;

    const tabContainers = contentRef.current.querySelectorAll(".tabs");

    tabContainers.forEach(container => {
      const tabs = container.querySelectorAll(".nav-tabs .tab");
      const contents = container.querySelectorAll(".tab-contents .tab-item-content");

      tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => {
          // 移除所有 active 状态
          tabs.forEach(t => t.classList.remove("active"));
          contents.forEach(c => c.classList.remove("active"));

          // 添加当前 active 状态
          tab.classList.add("active");
          if (contents[index]) {
            contents[index].classList.add("active");
          }
        });
      });

      // 默认激活第一个标签
      if (tabs.length > 0 && !container.querySelector(".tab.active")) {
        tabs[0].classList.add("active");
        if (contents[0]) {
          contents[0].classList.add("active");
        }
      }
    });
  }, []);

  // 初始化行内密码遮挡事件
  const initInlinePasswordEvents = useCallback(() => {
    if (!contentRef.current) return;

    const passwords = contentRef.current.querySelectorAll(".inline-password");

    passwords.forEach(pw => {
      pw.addEventListener("click", () => {
        pw.classList.toggle("revealed");
      });
    });
  }, []);

  // 初始化代码块图标（展开箭头和复制按钮）
  const initCodeBlockIcons = useCallback(() => {
    if (!contentRef.current) return;

    const { codeMaxLines, collapsedHeight } = codeBlockConfig;

    // SVG 图标
    // 展开箭头 (fa6-solid:chevron-down) - 向下箭头，收起时旋转向右
    const expandIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 448 512"><path fill="currentColor" d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7L86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>`;

    // 展开更多按钮 (fa6-solid:angles-down)
    const expandMoreIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 448 512"><path fill="currentColor" d="M246.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L224 402.7l137.4-137.3c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-160 160zm160-352l-160 160c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L224 210.7L361.4 73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3z"/></svg>`;

    // 复制按钮 (ion:copy 填充版)
    const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M408 480H184a72 72 0 0 1-72-72V184a72 72 0 0 1 72-72h224a72 72 0 0 1 72 72v224a72 72 0 0 1-72 72"/><path fill="currentColor" d="M160 80h235.88A72.12 72.12 0 0 0 328 32H104a72 72 0 0 0-72 72v224a72.12 72.12 0 0 0 48 67.88V160a80 80 0 0 1 80-80"/></svg>`;

    // 复制成功图标 (fa6-solid:check)
    const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 448 512"><path fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>`;

    // 查找所有代码块
    const codeBlocks = contentRef.current.querySelectorAll(".md-editor-code");

    codeBlocks.forEach(codeBlock => {
      const codeHead = codeBlock.querySelector(".md-editor-code-head");
      if (!codeHead) return;

      // 计算代码行数
      let lineCount = 0;
      const preElement = codeBlock.querySelector("pre");
      if (preElement) {
        const rnWrapper = preElement.querySelector("span[rn-wrapper]");
        if (rnWrapper) {
          // 通过行号计算行数
          lineCount = rnWrapper.children.length;
        } else {
          // 通过换行符计算行数
          const codeContent = preElement.textContent || "";
          lineCount = (codeContent.match(/\n/g) || []).length + 1;
        }
      }

      // 判断是否需要折叠（codeMaxLines 为 -1 表示不折叠）
      const needsCollapse = codeMaxLines !== -1 && lineCount > codeMaxLines;

      // 添加复制按钮图标（所有代码块都需要）
      let copyBtn = codeHead.querySelector(".copy-button");
      if (!copyBtn) {
        copyBtn = document.createElement("span");
        copyBtn.className = "copy-button";
        copyBtn.innerHTML = copyIcon;
        copyBtn.setAttribute("data-copy-icon", copyIcon);
        copyBtn.setAttribute("data-check-icon", checkIcon);
        copyBtn.setAttribute("title", "复制代码");
        codeHead.appendChild(copyBtn);
      } else if (!copyBtn.querySelector("svg")) {
        copyBtn.innerHTML = copyIcon;
        copyBtn.setAttribute("data-copy-icon", copyIcon);
        copyBtn.setAttribute("data-check-icon", checkIcon);
      }

      // 所有代码块都添加展开箭头图标（用于展开/收起代码内容）
      let expandBtn = codeHead.querySelector(".expand") as HTMLElement | null;
      if (!expandBtn) {
        expandBtn = document.createElement("span");
        expandBtn.className = "expand";
        expandBtn.innerHTML = expandIcon;
        // 使用内联 onclick 控制代码块的展开/收起
        expandBtn.setAttribute(
          "onclick",
          `event.preventDefault(); event.stopPropagation(); const details = this.closest('details'); if(details) { details.open = !details.open; }`
        );
        codeHead.insertBefore(expandBtn, codeHead.firstChild);
      } else if (!expandBtn.querySelector("svg")) {
        expandBtn.innerHTML = expandIcon;
      }

      // 只有需要折叠的代码块才添加高度限制和展开更多按钮
      if (needsCollapse) {
        // 添加可折叠类
        codeBlock.classList.add("is-collapsible");

        // 如果还没有 open 属性，添加折叠状态
        if (!codeBlock.hasAttribute("open")) {
          codeBlock.classList.add("is-collapsed");
          // 设置折叠高度
          if (preElement) {
            (preElement as HTMLElement).style.height = `${collapsedHeight}px`;
            (preElement as HTMLElement).style.overflow = "hidden";
          }
        }

        // 添加展开更多按钮（使用内联 onclick 处理器）
        let expandMoreBtn = codeBlock.querySelector(".code-expand-btn") as HTMLElement | null;
        if (!expandMoreBtn) {
          expandMoreBtn = document.createElement("div");
          expandMoreBtn.className = "code-expand-btn";
          expandMoreBtn.innerHTML = `<i>${expandMoreIcon}</i>`;
          // 使用内联 onclick 避免事件委托问题
          expandMoreBtn.setAttribute(
            "onclick",
            `const container = this.closest('details.md-editor-code'); const pre = container.querySelector('pre'); const icon = this.querySelector('i'); if(container.classList.contains('is-collapsed')) { container.classList.remove('is-collapsed'); if(pre) { pre.style.height = ''; pre.style.overflow = ''; } if(icon) { icon.style.transform = 'rotate(180deg)'; } this.classList.add('is-expanded'); } else { container.classList.add('is-collapsed'); if(pre) { pre.style.height = '${collapsedHeight}px'; pre.style.overflow = 'hidden'; } if(icon) { icon.style.transform = 'rotate(0deg)'; } this.classList.remove('is-expanded'); }`
          );
          codeBlock.appendChild(expandMoreBtn);
        } else if (!expandMoreBtn.querySelector("svg")) {
          const iconWrapper = expandMoreBtn.querySelector("i");
          if (iconWrapper) {
            iconWrapper.innerHTML = expandMoreIcon;
          } else {
            expandMoreBtn.innerHTML = `<i>${expandMoreIcon}</i>`;
          }
        }
      } else {
        // 不需要折叠的代码块，移除折叠相关类和展开更多按钮
        codeBlock.classList.remove("is-collapsible", "is-collapsed");
        const existingExpandMoreBtn = codeBlock.querySelector(".code-expand-btn");
        if (existingExpandMoreBtn) existingExpandMoreBtn.remove();

        // 确保代码块是展开的
        codeBlock.setAttribute("open", "");
        if (preElement) {
          (preElement as HTMLElement).style.height = "";
          (preElement as HTMLElement).style.overflow = "";
        }
      }
    });
  }, [codeBlockConfig]);

  // 代码块展开/收起事件已通过内联 onclick 处理，无需额外事件委托
  const initCodeExpandEvents = useCallback(() => {
    // 事件处理已在 initCodeBlockIcons 中通过内联 onclick 实现
  }, []);

  // 初始化代码高亮
  const initCodeHighlight = useCallback(async () => {
    if (!contentRef.current) return;

    // 查找所有代码块中的代码内容
    const codeBlocks = contentRef.current.querySelectorAll(".md-editor-code-block");
    if (codeBlocks.length === 0) return;

    // 动态导入 highlight.js
    const hljs = await import("highlight.js").then(m => m.default);

    codeBlocks.forEach(block => {
      // 获取语言类型
      const codeElement = block.closest("code");
      const language = codeElement?.getAttribute("language") || "";

      // 如果已经高亮过，跳过
      if (block.getAttribute("data-highlighted") === "yes") return;

      // 获取代码内容
      const codeText = block.textContent || "";

      try {
        let highlighted: string;
        if (language && hljs.getLanguage(language)) {
          // 指定语言高亮
          highlighted = hljs.highlight(codeText, { language }).value;
        } else {
          // 自动检测语言
          highlighted = hljs.highlightAuto(codeText).value;
        }

        // 更新内容
        block.innerHTML = highlighted;
        block.setAttribute("data-highlighted", "yes");
      } catch (err) {
        console.warn("代码高亮失败:", err);
      }
    });
  }, []);

  // 初始化 KaTeX 数学公式渲染
  const initKatex = useCallback(async () => {
    if (!contentRef.current) return;

    // 查找所有未渲染的 KaTeX 元素（md-editor 格式）
    const katexInlineElements = contentRef.current.querySelectorAll(".md-editor-katex-inline:not([data-processed])");
    const katexBlockElements = contentRef.current.querySelectorAll(".md-editor-katex-block:not([data-processed])");

    // 如果没有 md-editor 格式的 KaTeX 元素，尝试处理原始 $...$ 格式
    const needsRawProcessing =
      katexInlineElements.length === 0 &&
      katexBlockElements.length === 0 &&
      (contentRef.current.innerHTML.includes("$") ||
        contentRef.current.innerHTML.includes("\\(") ||
        contentRef.current.innerHTML.includes("\\["));

    if (katexInlineElements.length === 0 && katexBlockElements.length === 0 && !needsRawProcessing) {
      return;
    }

    // 动态导入 KaTeX 和 auto-render
    const katex = await import("katex").then(m => m.default);

    // 渲染 md-editor 格式的行内公式
    katexInlineElements.forEach(element => {
      try {
        const latex = element.textContent || "";
        katex.render(latex, element as HTMLElement, {
          throwOnError: false,
          displayMode: false,
        });
        element.setAttribute("data-processed", "true");
      } catch (err) {
        console.warn("KaTeX 行内公式渲染失败:", err);
      }
    });

    // 渲染 md-editor 格式的块级公式
    katexBlockElements.forEach(element => {
      try {
        const latex = element.textContent || "";
        katex.render(latex, element as HTMLElement, {
          throwOnError: false,
          displayMode: true,
        });
        element.setAttribute("data-processed", "true");
      } catch (err) {
        console.warn("KaTeX 块级公式渲染失败:", err);
      }
    });

    // 处理原始 $...$ 和 $$...$$ 格式
    if (needsRawProcessing) {
      try {
        const renderMathInElement = await import("katex/contrib/auto-render").then(m => m.default);
        renderMathInElement(contentRef.current, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\[", right: "\\]", display: true },
            { left: "\\(", right: "\\)", display: false },
          ],
          throwOnError: false,
        });
      } catch (err) {
        console.warn("KaTeX auto-render 失败:", err);
      }
    }
  }, []);

  /**
   * 格式化时间（音乐播放器用）
   */
  const formatTime = useCallback((seconds: number) => {
    if (!isFinite(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  /**
   * 将 http:// 链接转换为 https://
   */
  const ensureHttps = useCallback((url: string) => {
    if (!url) return url;
    if (url.startsWith("http://")) {
      return url.replace("http://", "https://");
    }
    return url;
  }, []);

  /**
   * 通过 API 获取音频资源
   */
  const fetchAudioUrl = useCallback(
    async (neteaseId: string): Promise<string | null> => {
      try {
        const result = await apiClient.post<{ audioUrl?: string }>("/api/public/music/song-resources", { neteaseId });
        if (result.code === 200 && result.data?.audioUrl) {
          return ensureHttps(result.data.audioUrl);
        }
        return null;
      } catch (error) {
        console.error("[音乐播放器] 获取音频资源失败:", error);
        return null;
      }
    },
    [ensureHttps]
  );

  /**
   * 初始化音乐播放器数据（通过 API 动态获取音频源）
   */
  const initMusicPlayerData = useCallback(
    async (playerId: string) => {
      const player = document.getElementById(playerId);
      if (!player || player.dataset.audioLoaded) return;

      const audio = player.querySelector(".music-audio-element") as HTMLAudioElement;
      const errorEl = player.querySelector(".music-error") as HTMLElement;

      if (!audio) {
        console.error("[音乐播放器] 未找到 audio 元素:", playerId);
        return;
      }

      try {
        const musicDataAttr = player.getAttribute("data-music-data");
        if (!musicDataAttr) {
          console.error("[音乐播放器] 没有找到 data-music-data 属性");
          if (errorEl) errorEl.style.display = "flex";
          return;
        }

        // 解码 HTML 实体
        const decodedData = musicDataAttr
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'")
          .replace(/&amp;/g, "&");

        const musicData = JSON.parse(decodedData);

        // 音频链接具有时效性，需要通过 API 动态获取
        if (!musicData.neteaseId) {
          console.error("[音乐播放器] 缺少网易云音乐 ID，无法获取音频资源");
          if (errorEl) errorEl.style.display = "flex";
          return;
        }

        console.log("[音乐播放器] 通过 API 获取音频链接 - 网易云 ID:", musicData.neteaseId);
        player.classList.add("loading");

        const audioUrl = await fetchAudioUrl(musicData.neteaseId);
        if (audioUrl) {
          audio.src = audioUrl;
          audio.preload = "metadata";

          // 监听 loadedmetadata 事件以更新播放时长
          const durationEl = player.querySelector(".duration") as HTMLElement;
          const updateDuration = () => {
            if (durationEl && audio.duration) {
              durationEl.textContent = formatTime(audio.duration);
            }
          };

          if (audio.readyState >= 1) {
            updateDuration();
          } else {
            audio.addEventListener("loadedmetadata", updateDuration, { once: true });
          }

          audio.load();
          player.dataset.audioLoaded = "true";
          player.classList.remove("loading");
          console.log("[音乐播放器] 加载完成:", musicData.name);
        } else {
          console.error("[音乐播放器] 无法获取音频 URL");
          if (errorEl) errorEl.style.display = "flex";
          player.classList.remove("loading");
        }
      } catch (error) {
        console.error("[音乐播放器] 初始化失败:", error);
        if (errorEl) errorEl.style.display = "flex";
        player.classList.remove("loading");
      }
    },
    [fetchAudioUrl, formatTime]
  );

  /**
   * 音乐播放器切换播放/暂停
   * 供 HTML 中的内联 onclick 事件调用
   */
  const handleMusicPlayerToggle = useCallback(
    async (playerId: string) => {
      const player = document.getElementById(playerId);
      if (!player) return;

      const audio = player.querySelector(".music-audio-element") as HTMLAudioElement;
      if (!audio) return;

      // 如果音频还未加载，先通过 API 获取音频链接
      if (!player.dataset.audioLoaded) {
        await initMusicPlayerData(playerId);
      }

      if (audio.paused) {
        audio.play().catch(err => console.error("[音乐播放器] 播放失败:", err));
      } else {
        audio.pause();
      }
    },
    [initMusicPlayerData]
  );

  /**
   * 音乐播放器进度条跳转
   * 供 HTML 中的内联 onclick 事件调用
   */
  const handleMusicPlayerSeek = useCallback((playerId: string, event: MouseEvent) => {
    const player = document.getElementById(playerId);
    if (!player) return;

    const audio = player.querySelector(".music-audio-element") as HTMLAudioElement;
    const progressBar = event.currentTarget as HTMLElement;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    if (audio.duration) {
      audio.currentTime = percent * audio.duration;
    }
  }, []);

  /**
   * 初始化所有音乐播放器
   */
  const initMusicPlayers = useCallback(
    (container: HTMLElement) => {
      const musicPlayers = container.querySelectorAll(".markdown-music-player[data-music-id]");

      musicPlayers.forEach(playerEl => {
        const player = playerEl as HTMLElement;
        const audio = player.querySelector(".music-audio-element") as HTMLAudioElement;

        if (!audio || audio.dataset.eventsAttached) return;
        audio.dataset.eventsAttached = "true";

        const artworkWrapper = player.querySelector(".music-artwork-wrapper") as HTMLElement;
        const needleEl = player.querySelector(".artwork-image-needle-background") as HTMLElement;
        const playIcon = player.querySelector(".music-play-icon") as HTMLElement;
        const pauseIcon = player.querySelector(".music-pause-icon") as HTMLElement;
        const progressFill = player.querySelector(".music-progress-fill") as HTMLElement;
        const currentTimeEl = player.querySelector(".current-time") as HTMLElement;
        const durationEl = player.querySelector(".duration") as HTMLElement;

        // 音频事件监听
        audio.addEventListener("play", () => {
          if (artworkWrapper) artworkWrapper.classList.add("is-playing");
          if (needleEl) needleEl.classList.add("needle-playing");
          if (playIcon) playIcon.style.display = "none";
          if (pauseIcon) pauseIcon.style.display = "block";
        });

        audio.addEventListener("pause", () => {
          if (artworkWrapper) artworkWrapper.classList.remove("is-playing");
          if (needleEl) needleEl.classList.remove("needle-playing");
          if (playIcon) playIcon.style.display = "block";
          if (pauseIcon) pauseIcon.style.display = "none";
        });

        audio.addEventListener("timeupdate", () => {
          if (progressFill && audio.duration) {
            const progress = (audio.currentTime / audio.duration) * 100 || 0;
            progressFill.style.width = progress + "%";
          }
          if (currentTimeEl) {
            currentTimeEl.textContent = formatTime(audio.currentTime);
          }
        });

        audio.addEventListener("loadedmetadata", () => {
          if (durationEl) {
            durationEl.textContent = formatTime(audio.duration);
          }
        });

        audio.addEventListener("ended", () => {
          audio.currentTime = 0;
          if (artworkWrapper) artworkWrapper.classList.remove("is-playing");
          if (needleEl) needleEl.classList.remove("needle-playing");
        });

        // 预加载音频元数据以显示时长
        const preloadAudioMetadata = async () => {
          try {
            const musicDataAttr = player.getAttribute("data-music-data");
            if (!musicDataAttr) return;

            const decodedData = musicDataAttr
              .replace(/&quot;/g, '"')
              .replace(/&#039;/g, "'")
              .replace(/&amp;/g, "&");

            const musicData = JSON.parse(decodedData);

            // 应用封面主色到进度条
            if (musicData.color && progressFill) {
              progressFill.style.background = musicData.color;
              console.log("[音乐播放器] 应用主色:", musicData.color);
            }

            if (!musicData.neteaseId) return;

            console.log(`[音乐播放器] 预加载元数据 - ${musicData.name || "未知歌曲"}`);

            // 调用 API 获取音频链接
            const audioUrl = await fetchAudioUrl(musicData.neteaseId);
            if (audioUrl) {
              audio.src = audioUrl;
              audio.preload = "metadata"; // 只预加载元数据，不下载整个音频
              player.dataset.audioLoaded = "true";
              console.log(`[音乐播放器] 元数据预加载完成 - ${musicData.name || "未知歌曲"}`);
            }
          } catch (error) {
            console.error("[音乐播放器] 预加载元数据失败:", error);
          }
        };

        // 异步预加载
        preloadAudioMetadata();
      });
    },
    [formatTime, fetchAudioUrl]
  );

  // 初始化代码复制事件
  const initCodeCopyEvents = useCallback(() => {
    if (!contentRef.current) return;

    // 查找所有代码块的复制按钮
    const copyButtons = contentRef.current.querySelectorAll(".md-editor-code .copy-button");

    copyButtons.forEach(btn => {
      const handleClick = async () => {
        // 查找对应的代码内容
        const codeBlock = btn.closest(".md-editor-code");
        if (!codeBlock) return;

        const codeElement = codeBlock.querySelector(".md-editor-code-block");
        if (!codeElement) return;

        const codeText = codeElement.textContent || "";

        try {
          await navigator.clipboard.writeText(codeText);
          // 显示复制成功状态
          const checkIcon =
            btn.getAttribute("data-check-icon") ||
            `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 448 512"><path fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>`;
          const copyIcon = btn.getAttribute("data-copy-icon") || btn.innerHTML;
          btn.innerHTML = checkIcon;
          btn.classList.add("copied");

          // 显示复制成功提示
          addToast({
            title: "复制成功",
            color: "success",
            timeout: 2000,
          });

          setTimeout(() => {
            btn.innerHTML = copyIcon;
            btn.classList.remove("copied");
          }, 2000);
        } catch (err) {
          console.error("复制失败:", err);
          // 显示复制失败提示
          addToast({
            title: "复制失败",
            color: "danger",
            timeout: 2000,
          });
        }
      };

      btn.addEventListener("click", handleClick);
    });
  }, []);

  /**
   * 初始化 Mermaid 图表的缩放功能
   * 模拟 md-editor-v3 的行为，动态添加 action 按钮
   */
  const initMermaidZoom = useCallback((container: HTMLElement): (() => void) | null => {
    const mermaidContainers = container.matches(".md-editor-mermaid")
      ? [container]
      : Array.from(container.querySelectorAll(".md-editor-mermaid"));

    if (mermaidContainers.length === 0) return null;

    const removeEventsMap = new Map<Element, { removeEvent?: () => void; removeClick?: () => void }>();

    // Pin 图标 SVG
    const pinOffIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"></path><path d="M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89"></path><path d="m2 2 20 20"></path><path d="M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11"></path></svg>`;
    const pinIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"></path><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"></path></svg>`;

    // 添加缩放/平移事件
    const addZoomEvent = (mm: Element) => {
      const el = mm as HTMLElement;
      let scale = 1;
      let translateX = 0;
      let translateY = 0;
      let isDragging = false;
      let startX = 0;
      let startY = 0;

      const updateTransform = () => {
        const svg = el.querySelector("svg");
        if (svg) {
          (
            svg as unknown as HTMLElement
          ).style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
          (svg as unknown as HTMLElement).style.transformOrigin = "center center";
        }
      };

      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        scale = Math.max(0.5, Math.min(3, scale + delta));
        updateTransform();
      };

      const onMouseDown = (e: MouseEvent) => {
        if (e.button !== 0) return;
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        el.style.cursor = "grabbing";
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateTransform();
      };

      const onMouseUp = () => {
        isDragging = false;
        el.style.cursor = "grab";
      };

      const onMouseLeave = () => {
        isDragging = false;
        el.style.cursor = "grab";
      };

      // 触摸事件支持
      let lastTouchDistance = 0;
      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 2) {
          lastTouchDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
        } else if (e.touches.length === 1) {
          isDragging = true;
          startX = e.touches[0].clientX - translateX;
          startY = e.touches[0].clientY - translateY;
        }
      };

      const onTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        if (e.touches.length === 2) {
          const distance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
          const delta = (distance - lastTouchDistance) * 0.01;
          scale = Math.max(0.5, Math.min(3, scale + delta));
          lastTouchDistance = distance;
          updateTransform();
        } else if (isDragging && e.touches.length === 1) {
          translateX = e.touches[0].clientX - startX;
          translateY = e.touches[0].clientY - startY;
          updateTransform();
        }
      };

      const onTouchEnd = () => {
        isDragging = false;
        lastTouchDistance = 0;
      };

      el.addEventListener("wheel", onWheel, { passive: false });
      el.addEventListener("mousedown", onMouseDown);
      el.addEventListener("mousemove", onMouseMove);
      el.addEventListener("mouseup", onMouseUp);
      el.addEventListener("mouseleave", onMouseLeave);
      el.addEventListener("touchstart", onTouchStart, { passive: false });
      el.addEventListener("touchmove", onTouchMove, { passive: false });
      el.addEventListener("touchend", onTouchEnd);

      el.style.cursor = "grab";
      el.style.overflow = "hidden";

      return () => {
        el.removeEventListener("wheel", onWheel);
        el.removeEventListener("mousedown", onMouseDown);
        el.removeEventListener("mousemove", onMouseMove);
        el.removeEventListener("mouseup", onMouseUp);
        el.removeEventListener("mouseleave", onMouseLeave);
        el.removeEventListener("touchstart", onTouchStart);
        el.removeEventListener("touchmove", onTouchMove);
        el.removeEventListener("touchend", onTouchEnd);

        // 重置变换
        const svg = el.querySelector("svg");
        if (svg) {
          (svg as unknown as HTMLElement).style.transform = "";
        }
        el.style.cursor = "";
        el.removeAttribute("data-grab");
      };
    };

    mermaidContainers.forEach(mm => {
      // 检查是否已有 action div
      let actionDiv = mm.querySelector(".md-editor-mermaid-action");
      // 如果子元素中没有，检查下一个兄弟元素是否是 action div
      if (!actionDiv && mm.nextElementSibling?.classList.contains("md-editor-mermaid-action")) {
        actionDiv = mm.nextElementSibling;
        mm.appendChild(actionDiv);
      }
      if (!actionDiv) {
        // 创建 action div
        const div = document.createElement("div");
        div.className = "md-editor-mermaid-action";
        div.innerHTML = pinOffIcon;
        mm.appendChild(div);
        actionDiv = div;
      }

      const onClick = () => {
        const current = removeEventsMap.get(mm);
        if (current?.removeEvent) {
          // 已启用缩放，点击后禁用
          current.removeEvent();
          mm.removeAttribute("data-grab");
          removeEventsMap.set(mm, { removeClick: current.removeClick });
          actionDiv!.innerHTML = pinOffIcon;
        } else {
          // 未启用缩放，点击后启用
          const removeEvent = addZoomEvent(mm);
          mm.setAttribute("data-grab", "");
          removeEventsMap.set(mm, {
            removeEvent,
            removeClick: current?.removeClick,
          });
          actionDiv!.innerHTML = pinIcon;
        }
      };

      (actionDiv as HTMLElement).addEventListener("click", onClick);
      removeEventsMap.set(mm, {
        removeClick: () => (actionDiv as HTMLElement).removeEventListener("click", onClick),
      });
    });

    // 返回清理函数
    return () => {
      removeEventsMap.forEach(({ removeEvent, removeClick }) => {
        removeEvent?.();
        removeClick?.();
      });
      removeEventsMap.clear();
    };
  }, []);

  // 处理文章内容中的链接、标签插件等
  useEffect(() => {
    if (!contentRef.current) return;

    // 保存 ref 的当前值，用于清理函数
    const currentContent = contentRef.current;

    // 为外部链接添加 target="_blank"
    const links = currentContent.querySelectorAll('a[href^="http"]');
    links.forEach(link => {
      if (!link.getAttribute("target")) {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      }
    });

    // 处理图片懒加载
    const images = currentContent.querySelectorAll("img[data-src]");
    if (images.length > 0 && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              const dataSrc = img.getAttribute("data-src");
              if (dataSrc) {
                img.src = dataSrc;
                img.removeAttribute("data-src");
              }
              observer.unobserve(img);
            }
          });
        },
        { rootMargin: "100px" }
      );

      images.forEach(img => observer.observe(img));
    }

    // 初始化标签插件事件
    initTipEvents();
    initHiddenEvents();
    initTabsEvents();
    initInlinePasswordEvents();
    initCodeBlockIcons(); // 先添加图标
    initCodeExpandEvents(); // 绑定展开/收起事件
    initCodeCopyEvents(); // 再绑定复制事件
    initCodeHighlight(); // 代码高亮
    initKatex(); // KaTeX 数学公式渲染

    // 初始化音乐播放器
    // 注册全局函数（供 HTML 内联事件使用）
    window.__musicPlayerToggle = handleMusicPlayerToggle;
    window.__musicPlayerSeek = handleMusicPlayerSeek;
    initMusicPlayers(currentContent);

    // 初始化 Mermaid 缩放功能
    if (mermaidCleanupRef.current) {
      mermaidCleanupRef.current();
    }
    mermaidCleanupRef.current = initMermaidZoom(currentContent);

    // 初始化 Fancybox 图片查看器
    Fancybox.bind(currentContent, "img:not(a img)", {
      groupAll: true,
    });

    // 清理函数
    return () => {
      if (mermaidCleanupRef.current) {
        mermaidCleanupRef.current();
        mermaidCleanupRef.current = null;
      }
      // 清理全局音乐播放器函数
      delete window.__musicPlayerToggle;
      delete window.__musicPlayerSeek;
      // 清理 Fancybox
      Fancybox.unbind(currentContent);
      Fancybox.close(true);
    };
  }, [
    content,
    initTipEvents,
    initHiddenEvents,
    initTabsEvents,
    initInlinePasswordEvents,
    initCodeBlockIcons,
    initCodeExpandEvents,
    initCodeCopyEvents,
    initCodeHighlight,
    initKatex,
    initMusicPlayers,
    handleMusicPlayerToggle,
    handleMusicPlayerSeek,
    initMermaidZoom,
  ]);

  return <article ref={contentRef} className={styles.postContent} dangerouslySetInnerHTML={{ __html: content }} />;
}

export default PostContent;
