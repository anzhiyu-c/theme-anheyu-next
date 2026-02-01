import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types";
import type {
  LoginRequest,
  LoginResponseData,
  RegisterRequest,
  RegisterResponseData,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshTokenResponseData,
  CheckEmailResponseData,
  OAuthLoginRequest,
  OAuthLoginResponseData,
  OAuthCallbackResponseData,
} from "@/types/auth";

class AuthService {
  /**
   * 用户登录
   */
  async login(data: LoginRequest): Promise<ApiResponse<LoginResponseData>> {
    return apiClient.post<LoginResponseData>("/api/auth/login", data);
  }

  /**
   * 用户注册
   */
  async register(data: RegisterRequest): Promise<ApiResponse<RegisterResponseData>> {
    return apiClient.post<RegisterResponseData>("/api/auth/register", data);
  }

  /**
   * 检查邮箱是否已注册
   */
  async checkEmail(email: string): Promise<ApiResponse<CheckEmailResponseData>> {
    return apiClient.get<CheckEmailResponseData>(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
  }

  /**
   * 刷新访问令牌
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<RefreshTokenResponseData>> {
    return apiClient.post<RefreshTokenResponseData>(
      "/api/auth/refresh",
      { refreshToken },
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
  }

  /**
   * 忘记密码 - 发送重置邮件
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<null>> {
    return apiClient.post<null>("/api/auth/forgot-password", data);
  }

  /**
   * 重置密码
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<null>> {
    return apiClient.post<null>("/api/auth/reset-password", data);
  }

  /**
   * 激活用户账号
   */
  async activateUser(id: string, sign: string): Promise<ApiResponse<LoginResponseData>> {
    return apiClient.post<LoginResponseData>("/api/auth/activate", { id, sign });
  }

  /**
   * 获取 OAuth 授权 URL
   */
  async getOAuthAuthorizeUrl(data: OAuthLoginRequest): Promise<ApiResponse<OAuthLoginResponseData>> {
    return apiClient.post<OAuthLoginResponseData>(`/api/pro/oauth/${data.provider}/authorize`, {
      redirect_url: data.redirect_url,
      login_type: data.login_type,
    });
  }

  /**
   * 处理 OAuth 回调
   */
  async handleOAuthCallback(
    provider: string,
    code: string,
    state: string,
    type?: string
  ): Promise<ApiResponse<OAuthCallbackResponseData>> {
    const params = new URLSearchParams({ code, state });
    if (type) params.append("type", type);
    return apiClient.get<OAuthCallbackResponseData>(`/api/pro/oauth/${provider}/callback?${params}`);
  }
}

export const authService = new AuthService();
