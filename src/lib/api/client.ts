/**
 * 客户端 API 封装
 * 用于客户端组件的数据获取
 */

import type { ApiResponse } from "@/types";

const API_BASE_URL = "/api";

// 不需要携带 Token 的白名单路径
const TOKEN_WHITE_LIST = ["/auth/refresh-token", "/auth/login", "/auth/check-email", "/public/"];

// 检查路径是否在白名单中
function isWhitelisted(url: string): boolean {
  return TOKEN_WHITE_LIST.some(path => url.includes(path));
}

// 获取存储的认证信息
function getStoredAuth(): { accessToken?: string; refreshToken?: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("anheyu-user-info");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

// 设置存储的认证信息
function setStoredAuth(auth: { accessToken: string; refreshToken: string; user?: unknown }): void {
  if (typeof window === "undefined") return;
  const existing = getStoredAuth();
  localStorage.setItem("anheyu-user-info", JSON.stringify({ ...existing, ...auth }));
}

// 清除存储的认证信息
export function clearStoredAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("anheyu-user-info");
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
      return retryResponse.json();
    }
    // 刷新失败，跳转到登录页
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  return response.json();
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
