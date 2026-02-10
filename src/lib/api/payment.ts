/**
 * 支付配置 API
 * 用于管理员后台配置支付方式（支付宝、微信支付、易支付、虎皮椒）
 */
import { apiClient } from "./client";
import type { ApiResponse } from "@/types";

// ========== 支付配置类型 ==========

/** 支付宝配置 */
export interface AlipayConfig {
  app_id: string;
  app_private_key: string;
  alipay_public_key: string;
}

/** 微信支付配置 */
export interface WechatConfig {
  app_id: string;
  mch_id: string;
  mch_serial_no: string;
  api_v3_key: string;
  private_key_data: string;
}

/** 易支付配置 */
export interface EpayConfig {
  mch_id: string;
  key: string;
  gateway: string;
  return_url?: string;
}

/** 虎皮椒V3配置 */
export interface HupijiaoConfig {
  app_id: string;
  app_secret: string;
  gateway?: string;
  return_url?: string;
}

/** 单个支付方式的配置详情（公共字段） */
interface ProviderConfigBase {
  enabled: boolean;
  configured: boolean;
  notify_url: string;
  description: string;
  created_at: string;
  updated_at: string;
}

/** 支付宝配置详情 */
export interface AlipayConfigDetails extends ProviderConfigBase {
  app_id: string;
  app_private_key: string;
  alipay_public_key: string;
  has_private_key: boolean;
  has_public_key: boolean;
}

/** 微信支付配置详情 */
export interface WechatConfigDetails extends ProviderConfigBase {
  app_id: string;
  mch_id: string;
  mch_serial_no: string;
  api_v3_key: string;
  private_key_data: string;
  has_api_v3_key: boolean;
  has_private_key: boolean;
}

/** 易支付配置详情 */
export interface EpayConfigDetails extends ProviderConfigBase {
  mch_id: string;
  key: string;
  gateway: string;
  return_url: string;
  has_key: boolean;
}

/** 虎皮椒V3配置详情 */
export interface HupijiaoConfigDetails extends ProviderConfigBase {
  app_id: string;
  app_secret: string;
  gateway: string;
  return_url: string;
  has_app_secret: boolean;
}

/** 全部支付配置详情 */
export interface PaymentConfigDetails {
  alipay: AlipayConfigDetails;
  wechat: WechatConfigDetails;
  epay: EpayConfigDetails;
  hupijiao: HupijiaoConfigDetails;
  available_providers: string[];
  provider_names: Record<string, string>;
}

/** 支付方式类型 */
export type PaymentProvider = "ALIPAY" | "WECHAT" | "EPAY" | "HUPIJIAO";

// ========== 支付配置 API ==========

export const paymentApi = {
  /**
   * 获取全部支付配置详情
   */
  async getConfigDetails(): Promise<ApiResponse<PaymentConfigDetails>> {
    return apiClient.get<PaymentConfigDetails>("/api/pro/payment/config/details");
  },

  /**
   * 保存支付宝配置
   */
  async setAlipayConfig(config: AlipayConfig): Promise<ApiResponse<void>> {
    return apiClient.post<void>("/api/pro/payment/config/alipay", config);
  },

  /**
   * 保存微信支付配置
   */
  async setWechatConfig(config: WechatConfig): Promise<ApiResponse<void>> {
    return apiClient.post<void>("/api/pro/payment/config/wechat", config);
  },

  /**
   * 保存易支付配置
   */
  async setEpayConfig(config: EpayConfig): Promise<ApiResponse<void>> {
    return apiClient.post<void>("/api/pro/payment/config/epay", config);
  },

  /**
   * 保存虎皮椒V3配置
   */
  async setHupijiaoConfig(config: HupijiaoConfig): Promise<ApiResponse<void>> {
    return apiClient.post<void>("/api/pro/payment/config/hupijiao", config);
  },

  /**
   * 启用/禁用支付方式
   * @param provider - 支付方式（ALIPAY/WECHAT/EPAY/HUPIJIAO）
   * @param enabled - 是否启用
   */
  async toggleProvider(provider: string, enabled: boolean): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/api/pro/payment/config/${provider}/toggle`, { enabled });
  },

  /**
   * 测试支付配置连接
   * @param provider - 支付方式（ALIPAY/WECHAT/EPAY/HUPIJIAO）
   */
  async testConfig(provider: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/api/pro/payment/config/${provider}/test`);
  },
};
