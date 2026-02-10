/**
 * 文章管理 Query Hooks
 * 对接管理端文章 API，提供服务端分页查询和各类 mutation
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  queryOptions,
  keepPreviousData,
} from "@tanstack/react-query";
import { postManagementApi } from "@/lib/api/post-management";
import type {
  AdminArticleListParams,
  ReviewArticleRequest,
  RejectArticleRequest,
  TakedownArticleRequest,
  ImportArticlesParams,
  CreateArticleRequest,
  UpdateArticleRequest,
} from "@/types/post-management";

// ===================================
//          Query Keys
// ===================================

export const postManagementKeys = {
  all: ["post-management"] as const,
  lists: () => [...postManagementKeys.all, "list"] as const,
  list: (params: AdminArticleListParams) => [...postManagementKeys.lists(), params] as const,
  detail: (id: string) => [...postManagementKeys.all, "detail", id] as const,
  editDetail: (id: string) => [...postManagementKeys.all, "edit-detail", id] as const,
};

// ===================================
//          Query Options
// ===================================

export const adminArticlesQueryOptions = (params: AdminArticleListParams = {}) =>
  queryOptions({
    queryKey: postManagementKeys.list(params),
    queryFn: () => postManagementApi.getArticles(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2, // 2 分钟
  });

export const adminArticleDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: postManagementKeys.detail(id),
    queryFn: () => postManagementApi.getArticle(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

export const adminArticleEditDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: postManagementKeys.editDetail(id),
    queryFn: () => postManagementApi.getArticleForEdit(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

// ===================================
//          Query Hooks
// ===================================

/**
 * 管理端文章列表（服务端分页）
 */
export function useAdminArticles(
  params: AdminArticleListParams = {},
  options?: { enabled?: boolean }
) {
  return useQuery({
    ...adminArticlesQueryOptions(params),
    enabled: options?.enabled ?? true,
  });
}

/**
 * 管理端文章详情
 */
export function useAdminArticleDetail(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    ...adminArticleDetailQueryOptions(id),
    enabled: (options?.enabled ?? true) && !!id,
  });
}

/**
 * 编辑用文章详情（包含 content_md / content_html）
 */
export function useArticleForEdit(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    ...adminArticleEditDetailQueryOptions(id),
    enabled: (options?.enabled ?? true) && !!id,
  });
}

// ===================================
//          Mutation Hooks
// ===================================

/**
 * 创建文章
 */
export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateArticleRequest) => postManagementApi.createArticle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postManagementKeys.lists() });
    },
  });
}

/**
 * 更新文章
 */
export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateArticleRequest }) =>
      postManagementApi.updateArticle(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: postManagementKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postManagementKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: postManagementKeys.editDetail(variables.id) });
    },
  });
}

/**
 * 删除单篇文章
 */
export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postManagementApi.deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postManagementKeys.lists() });
    },
  });
}

/**
 * 批量删除文章
 */
export function useBatchDeleteArticles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articleIds: string[]) => postManagementApi.batchDeleteArticles(articleIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postManagementKeys.lists() });
    },
  });
}

/**
 * 审核通过文章
 */
export function useApproveArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: ReviewArticleRequest }) =>
      postManagementApi.approveArticle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postManagementKeys.lists() });
    },
  });
}

/**
 * 审核拒绝文章
 */
export function useRejectArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RejectArticleRequest }) =>
      postManagementApi.rejectArticle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postManagementKeys.lists() });
    },
  });
}

/**
 * 下架文章
 */
export function useTakedownArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TakedownArticleRequest }) =>
      postManagementApi.takedownArticle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postManagementKeys.lists() });
    },
  });
}

/**
 * 恢复下架文章
 */
export function useRestoreArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postManagementApi.restoreArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postManagementKeys.lists() });
    },
  });
}

/**
 * 导出文章
 */
export function useExportArticles() {
  return useMutation({
    mutationFn: (articleIds: string[]) => postManagementApi.exportArticles(articleIds),
    onSuccess: (blob) => {
      // 触发浏览器下载
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `articles-export-${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
  });
}

/**
 * 导入文章
 */
export function useImportArticles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: ImportArticlesParams) => postManagementApi.importArticles(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postManagementKeys.lists() });
    },
  });
}
