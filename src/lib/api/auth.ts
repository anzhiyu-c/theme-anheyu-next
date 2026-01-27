/**
 * 认证相关 API
 */

import type { ApiResponse, LoginRequest, LoginResponse, User, OAuthProvider, OAuthAuthorizeResponse } from "@/types";
import { apiClient, clearStoredAuth } from "./client";

// ===================== 登录相关 =====================

/**
 * 用户登录
 */
export async function login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  const response = await apiClient.post<LoginResponse>("/auth/login", data);

  // 登录成功后存储认证信息（anheyu-pro 使用 code === 200）
  if (response.code === 200 && response.data) {
    if (typeof window !== "undefined") {
      localStorage.setItem("anheyu-user-info", JSON.stringify(response.data));
    }
  }

  return response;
}

/**
 * 刷新 Token
 */
export async function refreshToken(token: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
  return apiClient.post("/auth/refresh-token", { refreshToken: token });
}

/**
 * 用户登出
 */
export function logout(): void {
  clearStoredAuth();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

/**
 * 检查邮箱是否存在
 */
export async function checkEmail(email: string): Promise<ApiResponse<{ exists: boolean }>> {
  return apiClient.get("/auth/check-email", { email });
}

// ===================== 用户信息 =====================

/**
 * 获取当前用户信息
 */
export async function getCurrentUser(): Promise<ApiResponse<User>> {
  return apiClient.get("/user/profile");
}

/**
 * 更新用户信息
 */
export async function updateUserProfile(data: Partial<User>): Promise<ApiResponse<User>> {
  return apiClient.put("/user/profile", data);
}

/**
 * 修改密码
 */
export async function changePassword(data: { oldPassword: string; newPassword: string }): Promise<ApiResponse<void>> {
  return apiClient.post("/user/change-password", data);
}

// ===================== OAuth 相关 =====================

/**
 * 获取 OAuth 提供商列表
 */
export async function getOAuthProviders(): Promise<ApiResponse<OAuthProvider[]>> {
  return apiClient.get("/public/oauth/providers");
}

/**
 * 获取 OAuth 授权 URL
 */
export async function getOAuthAuthorizeUrl(
  provider: string,
  redirectUrl?: string
): Promise<ApiResponse<OAuthAuthorizeResponse>> {
  return apiClient.post(`/pro/oauth/${provider}/authorize`, { redirectUrl });
}

// ===================== 工具函数 =====================

/**
 * 检查用户是否已登录
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const stored = localStorage.getItem("anheyu-user-info");
    if (!stored) return false;

    const auth = JSON.parse(stored);
    return !!auth.accessToken;
  } catch {
    return false;
  }
}

/**
 * 获取存储的用户信息
 */
export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem("anheyu-user-info");
    if (!stored) return null;

    const auth = JSON.parse(stored);
    return auth.user || null;
  } catch {
    return null;
  }
}

/**
 * 获取存储的 Access Token
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem("anheyu-user-info");
    if (!stored) return null;

    const auth = JSON.parse(stored);
    return auth.accessToken || null;
  } catch {
    return null;
  }
}
