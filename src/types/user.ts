/**
 * 用户信息类型
 */
export interface User {
  id: string;
  username: string;
  nickname: string;
  email: string;
  avatar: string;
  website?: string;
  userGroupID: number;
  status: number;
  role?: string; // 用户角色：admin, user 等
  roles?: string[]; // 用户角色列表
  created_at: string;
  updated_at: string;
  lastLoginAt?: string;
}

/**
 * 登录请求参数
 */
export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

/**
 * 登录响应数据
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expires: number;
  roles: string[];
  userInfo: User;
}

/**
 * 认证信息
 */
export interface AuthInfo {
  accessToken: string;
  refreshToken: string;
  expires: number;
  roles: string[];
  userInfo: User;
}

/**
 * OAuth 提供者
 */
export interface OAuthProvider {
  name: string;
  displayName: string;
  icon: string;
  enabled: boolean;
}

/**
 * OAuth 授权响应
 */
export interface OAuthAuthorizeResponse {
  url: string;
}
