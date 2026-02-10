/**
 * 存储策略类型定义（对齐 anheyu-app 后端）
 */

// ===================================
//          存储类型
// ===================================

export const STORAGE_TYPES = ["local", "onedrive", "tencent_cos", "aliyun_oss", "aws_s3", "qiniu_kodo"] as const;

export type StoragePolicyType = (typeof STORAGE_TYPES)[number];

/** 存储类型显示名称 */
export const STORAGE_TYPE_LABELS: Record<StoragePolicyType, string> = {
  local: "本机存储",
  onedrive: "OneDrive",
  tencent_cos: "腾讯云 COS",
  aliyun_oss: "阿里云 OSS",
  aws_s3: "AWS S3",
  qiniu_kodo: "七牛云存储",
};

/** 策略标志类型 */
export const POLICY_FLAGS = ["article_image", "comment_image", "user_avatar"] as const;
export type PolicyFlag = (typeof POLICY_FLAGS)[number];

export const POLICY_FLAG_LABELS: Record<string, string> = {
  article_image: "文章图片默认",
  comment_image: "评论图片默认",
  user_avatar: "用户头像默认",
};

// ===================================
//     存储策略设置（JSON 字段）
// ===================================

export interface StoragePolicySettings {
  chunk_size?: number;
  // OneDrive
  drive_type?: "default" | "sharepoint";
  drive_id?: string;
  // 云存储通用
  upload_method?: "client" | "server";
  cdn_domain?: string;
  source_auth?: boolean;
  custom_proxy?: boolean;
  style_separator?: string;
  // AWS S3
  force_path_style?: boolean;
  endpoint_url?: string;
}

// ===================================
//          存储策略
// ===================================

export interface StoragePolicy {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  type: StoragePolicyType;
  server?: string;
  bucket_name?: string;
  is_private: boolean;
  access_key?: string;
  secret_key?: string;
  max_size: number;
  base_path?: string;
  virtual_path?: string;
  flag?: string;
  settings?: StoragePolicySettings;
}

// ===================================
//        请求/响应类型
// ===================================

export interface StoragePolicyListParams {
  page?: number;
  pageSize?: number;
}

export interface StoragePolicyListResponse {
  list: StoragePolicy[];
  total: number;
}

export type StoragePolicyCreateRequest = Omit<StoragePolicy, "id" | "created_at" | "updated_at">;

export type StoragePolicyUpdateRequest = Partial<StoragePolicyCreateRequest>;
