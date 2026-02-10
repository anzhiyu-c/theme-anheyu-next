/**
 * AI 写作 API
 * 对接 anheyu-pro 后端 POST /api/pro/admin/ai/writing (SSE 流式输出)
 */
import { tokenManager } from "./client";

export interface AIWritingRequest {
  /** 写作主题或大纲 */
  topic: string;
  /** 写作风格 */
  style?: "professional" | "casual" | "academic" | "creative";
  /** 目标长度 */
  length?: "short" | "medium" | "long";
  /** 是否使用标签插件 */
  useTags?: boolean;
  /** 自定义提示词 */
  customPrompt?: string;
}

export interface AIWritingCallbacks {
  onChunk: (chunk: string) => void;
  onDone: (fullContent: string) => void;
  onError: (error: Error) => void;
}

/**
 * 调用 AI 写作接口（SSE 流式输出）
 * @returns AbortController 用于取消请求
 */
export function generateAIWriting(
  params: AIWritingRequest,
  callbacks: AIWritingCallbacks
): AbortController {
  const controller = new AbortController();
  const token = tokenManager.getToken();

  (async () => {
    try {
      const response = await fetch("/api/pro/admin/ai/writing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(params),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`AI 写作请求失败: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("无法读取响应流");

      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        // Parse SSE events
        const lines = text.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              callbacks.onDone(fullContent);
              return;
            }
            try {
              const parsed = JSON.parse(data);
              const chunk = parsed.content || parsed.text || data;
              fullContent += chunk;
              callbacks.onChunk(chunk);
            } catch {
              // Plain text chunk
              fullContent += data;
              callbacks.onChunk(data);
            }
          }
        }
      }

      callbacks.onDone(fullContent);
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        callbacks.onError(error as Error);
      }
    }
  })();

  return controller;
}
