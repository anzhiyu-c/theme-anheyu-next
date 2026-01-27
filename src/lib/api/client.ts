"use client";

import type { ApiResponse, LoginRequest, LoginResponse, UserInfo } from "./types";

// 客户端使用相对路径，由 Next.js rewrites 代理
const API_BASE_URL = "";

// 获取存储的 token
// 兼容管理后台（anheyu-user-info）和前台（auth_token）两种存储格式
function getToken(): string | null {
  if (typeof window === "undefined") return null;

  // 优先检查管理后台的 token 存储（统一认证）
  try {
    const adminUserInfo = localStorage.getItem("anheyu-user-info");
    if (adminUserInfo) {
      const parsed = JSON.parse(adminUserInfo);
      if (parsed?.accessToken) {
        return parsed.accessToken;
      }
    }
  } catch {
    // JSON 解析失败，忽略
  }

  // 回退到前台独立的 token 存储
  return localStorage.getItem("auth_token");
}

// 通用请求函数
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      // 只清除前台的 token，不影响管理后台的登录状态
      localStorage.removeItem("auth_token");
      throw new Error("认证已过期，请重新登录");
    }
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data: ApiResponse<T> = await response.json();

  if (data.code !== 200) {
    throw new Error(data.message || "API Error");
  }

  return data.data;
}

// ============== 认证 API ==============

/**
 * 用户登录
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetchApi<LoginResponse>("/api/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  // 保存 token
  localStorage.setItem("auth_token", response.token);

  return response;
}

/**
 * 用户登出
 * 注意：只清除前台的 token，不影响管理后台的登录状态
 */
export function logout(): void {
  localStorage.removeItem("auth_token");
  // 不清除 anheyu-user-info，因为那是管理后台的登录状态
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUser(): Promise<UserInfo> {
  return fetchApi<UserInfo>("/api/user/info");
}

/**
 * 检查是否已登录
 */
export function isLoggedIn(): boolean {
  return !!getToken();
}
