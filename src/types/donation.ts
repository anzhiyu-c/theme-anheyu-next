/**
 * 打赏管理类型定义（管理端）
 */

export interface DonationItem {
  id: number;
  name: string;
  amount: number;
  suffix: string;
  status: number;
  sort_order: number;
  custom_published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDonationRequest {
  name: string;
  amount: number;
  suffix?: string;
  status?: number;
  sort_order?: number;
  custom_published_at?: string;
}

export interface UpdateDonationRequest {
  name?: string;
  amount?: number;
  suffix?: string;
  status?: number;
  sort_order?: number;
  custom_published_at?: string;
}

export interface ListDonationsRequest {
  page?: number;
  page_size?: number;
  status?: number;
}

export interface ListDonationsResponse {
  list: DonationItem[];
  total: number;
  page: number;
  page_size: number;
}

export interface TotalAmountResponse {
  total_amount: number;
}

export interface ImportDonationOptions {
  skip_existing: boolean;
  default_status: number;
}

export interface ImportDonationResult {
  total_count: number;
  success_count: number;
  skipped_count: number;
  failed_count: number;
  errors?: string[];
}
