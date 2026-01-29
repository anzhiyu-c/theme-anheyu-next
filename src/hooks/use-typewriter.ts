"use client";

import { useState, useEffect } from "react";

/**
 * 打字机效果 Hook
 * @param text - 要显示的完整文本
 * @param speed - 每个字符的打字速度（毫秒），默认 100ms
 * @param delay - 开始打字前的延迟（毫秒），默认 0ms
 * @returns { displayText, isComplete } - 当前显示的文本和是否完成
 */
export function useTypewriter(text: string, speed: number = 100, delay: number = 0) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let currentIndex = 0;

    // 重置状态
    setDisplayText("");
    setIsComplete(false);

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
