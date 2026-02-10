/**
 * 相册管理 Query Hooks
 * 对接相册 API，提供列表查询和 CRUD mutation
 */

import { useQuery, useMutation, useQueryClient, queryOptions, keepPreviousData } from "@tanstack/react-query";
import { albumApi } from "@/lib/api/album";
import type { AlbumForm, AlbumListParams } from "@/types/album";

// ===================================
//          Query Keys
// ===================================

export const albumKeys = {
  all: ["albums"] as const,
  lists: () => [...albumKeys.all, "list"] as const,
  list: (params: AlbumListParams) => [...albumKeys.lists(), params] as const,
};

// ===================================
//          Query Options
// ===================================

export const albumListQueryOptions = (params: AlbumListParams = {}) =>
  queryOptions({
    queryKey: albumKeys.list(params),
    queryFn: () => albumApi.getList(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2,
  });

// ===================================
//          Query Hooks
// ===================================

/** 相册图片列表（分页） */
export function useAlbumList(params: AlbumListParams = {}) {
  return useQuery(albumListQueryOptions(params));
}

// ===================================
//       Mutation Hooks
// ===================================

/** 新增图片 */
export function useCreateAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AlbumForm) => albumApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: albumKeys.lists() });
    },
  });
}

/** 更新图片 */
export function useUpdateAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AlbumForm }) => albumApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: albumKeys.lists() });
    },
  });
}

/** 删除图片 */
export function useDeleteAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => albumApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: albumKeys.lists() });
    },
  });
}

/** 批量删除图片 */
export function useBatchDeleteAlbums() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => albumApi.batchDelete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: albumKeys.lists() });
    },
  });
}
