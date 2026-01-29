/**
 * 客户端 API 封装
 * 用于客户端组件的数据获取
 */

import type { ApiResponse } from "@/types";
import { API_TOKEN_WHITELIST, CACHE_KEYS } from "@/lib/constants";

const API_BASE_URL = "/api";

// 检查路径是否在白名单中
function isWhitelisted(url: string): boolean {
  return API_TOKEN_WHITELIST.some(path => url.includes(path));
}

// 获取存储的认证信息
function getStoredAuth(): { accessToken?: string; refreshToken?: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(CACHE_KEYS.AUTH_INFO);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

// 设置存储的认证信息
function setStoredAuth(auth: { accessToken: string; refreshToken: string; user?: unknown }): void {
  if (typeof window === "undefined") return;
  const existing = getStoredAuth();
  localStorage.setItem(CACHE_KEYS.AUTH_INFO, JSON.stringify({ ...existing, ...auth }));
}

// 清除存储的认证信息
export function clearStoredAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CACHE_KEYS.AUTH_INFO);
}

// Token 刷新状态
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

// 刷新 Token
async function refreshToken(): Promise<string | null> {
  const auth = getStoredAuth();
  if (!auth?.refreshToken) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: auth.refreshToken }),
    });

    if (!response.ok) {
      clearStoredAuth();
      return null;
    }

    const result: ApiResponse<{ accessToken: string; refreshToken: string }> = await response.json();
    // anheyu-pro 使用 code === 200 表示成功
    if (result.code === 200 && result.data) {
      setStoredAuth(result.data);
      return result.data.accessToken;
    }

    clearStoredAuth();
    return null;
  } catch {
    clearStoredAuth();
    return null;
  }
}

// 处理 401 错误，尝试刷新 Token
async function handleUnauthorized(): Promise<string | null> {
  if (isRefreshing) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = refreshToken().finally(() => {
    isRefreshing = false;
    refreshPromise = null;
  });

  return refreshPromise;
}

// 安全解析 JSON 响应
async function safeParseJson<T>(response: Response): Promise<ApiResponse<T>> {
  // 检查响应状态
  if (!response.ok) {
    // 尝试解析错误响应
    try {
      const text = await response.text();
      // 尝试解析为 JSON
      try {
        return JSON.parse(text);
      } catch {
        // 非 JSON 响应，返回标准错误格式
        return {
          code: response.status,
          message: text || response.statusText || "请求失败",
          data: null as T,
        };
      }
    } catch {
      return {
        code: response.status,
        message: response.statusText || "请求失败",
        data: null as T,
      };
    }
  }

  // 响应成功，解析 JSON
  try {
    const text = await response.text();
    if (!text) {
      return {
        code: 200,
        message: "success",
        data: null as T,
      };
    }
    return JSON.parse(text);
  } catch {
    return {
      code: 500,
      message: "响应解析失败",
      data: null as T,
    };
  }
}

// 通用请求函数
async function request<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;

  // 构建请求头
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // 添加认证 Token（非白名单路径）
  if (!isWhitelisted(url)) {
    const auth = getStoredAuth();
    if (auth?.accessToken) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${auth.accessToken}`;
    }
  }

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    // 处理 401 错误
    if (response.status === 401 && !isWhitelisted(url)) {
      const newToken = await handleUnauthorized();
      if (newToken) {
        // 使用新 Token 重试请求
        (headers as Record<string, string>)["Authorization"] = `Bearer ${newToken}`;
        const retryResponse = await fetch(fullUrl, { ...options, headers });
        return safeParseJson<T>(retryResponse);
      }
      // 刷新失败，跳转到登录页
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return safeParseJson<T>(response);
  } catch (error) {
    // 网络错误或其他异常
    console.error("API request failed:", error);
    return {
      code: 0,
      message: error instanceof Error ? error.message : "网络请求失败",
      data: null as T,
    };
  }
}

// API 客户端类
export const apiClient = {
  // GET 请求
  get<T>(url: string, params?: Record<string, string | number | boolean | undefined>): Promise<ApiResponse<T>> {
    let queryString = "";
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
      queryString = searchParams.toString();
    }
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    return request<T>(fullUrl, { method: "GET" });
  },

  // POST 请求
  post<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    return request<T>(url, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  // PUT 请求
  put<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    return request<T>(url, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  // DELETE 请求
  delete<T>(url: string): Promise<ApiResponse<T>> {
    return request<T>(url, { method: "DELETE" });
  },
};

export default apiClient;
