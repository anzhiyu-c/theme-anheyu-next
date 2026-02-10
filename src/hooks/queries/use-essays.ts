/**
 * 即刻(说说)管理 Query Hooks
 * 对接管理端即刻 API，提供服务端分页查询和各类 mutation
 */

import { useQuery, useMutation, useQueryClient, queryOptions, keepPreviousData } from "@tanstack/react-query";
import {
  essayApi,
  type EssayListParams,
  type EssayListResponse,
  type AdminEssayListParams,
  type CreateEssayData,
  type UpdateEssayData,
  type ImportEssayOptions,
} from "@/lib/api/essay";

// ===================================
//          Query Keys
// ===================================

export const essayKeys = {
  all: ["essays"] as const,
  lists: () => [...essayKeys.all, "list"] as const,
  list: (params: EssayListParams) => [...essayKeys.lists(), params] as const,
  publicList: (params: EssayListParams) => [...essayKeys.all, "public", params] as const,
  adminLists: () => [...essayKeys.all, "admin-list"] as const,
  adminList: (params: AdminEssayListParams) => [...essayKeys.adminLists(), params] as const,
  detail: (id: number) => [...essayKeys.all, "detail", id] as const,
};

// ===================================
//          公开列表 Query
// ===================================

/**
 * 即刻公开列表查询配置
 * 使用 queryOptions 工厂模式，便于在 SSR 和客户端复用
 */
export const publicEssaysQueryOptions = (params: EssayListParams = {}) =>
  queryOptions({
    queryKey: essayKeys.publicList(params),
    queryFn: () => essayApi.getPublicList(params),
    staleTime: 1000 * 60 * 5, // 5 分钟内数据被认为是新鲜的
  });

/**
 * 获取公开即刻列表的 Hook
 */
export function usePublicEssays(params: EssayListParams = {}, options?: { enabled?: boolean }) {
  return useQuery({
    ...publicEssaysQueryOptions(params),
    enabled: options?.enabled ?? true,
  });
}

// ===================================
//          管理端列表 Query
// ===================================

export const adminEssaysQueryOptions = (params: AdminEssayListParams) =>
  queryOptions({
    queryKey: essayKeys.adminList(params),
    queryFn: () => essayApi.getAdminList(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2, // 2 分钟
  });

/**
 * 管理端即刻列表（服务端分页）
 */
export function useAdminEssays(params: AdminEssayListParams, options?: { enabled?: boolean }) {
  return useQuery({
    ...adminEssaysQueryOptions(params),
    enabled: options?.enabled ?? true,
  });
}

// ===================================
//          Mutation Hooks
// ===================================

/**
 * 创建即刻
 */
export function useCreateEssay() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEssayData) => essayApi.create(data),
    onSuccess: () => {
      // 使用 essayKeys.all 确保管理端列表和公开列表缓存都被刷新
      queryClient.invalidateQueries({ queryKey: essayKeys.all });
    },
  });
}

/**
 * 更新即刻
 */
export function useUpdateEssay() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEssayData }) => essayApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: essayKeys.all });
    },
  });
}

/**
 * 删除即刻
 */
export function useDeleteEssay() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => essayApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: essayKeys.all });
    },
  });
}

/**
 * 批量删除即刻
 */
export function useBatchDeleteEssays() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => essayApi.batchDelete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: essayKeys.all });
    },
  });
}

/**
 * 导出即刻
 */
export function useExportEssays() {
  return useMutation({
    mutationFn: (essayIds: number[]) => essayApi.exportEssays(essayIds),
    onSuccess: blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `essays-export-${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
  });
}

/**
 * 导入即刻
 */
export function useImportEssays() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, options }: { file: File; options: ImportEssayOptions }) =>
      essayApi.importEssays(file, options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: essayKeys.all });
    },
  });
}

/**
 * 即刻数据类型导出
 */
export type { EssayListResponse };
