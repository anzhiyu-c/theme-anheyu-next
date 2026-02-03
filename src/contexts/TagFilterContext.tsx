"use client";

import { createContext, useContext } from "react";

interface TagFilterContextValue {
  /** 当前选中的标签名称 */
  selectedTag: string;
  /** 切换标签的回调函数 */
  onTagChange: (tagName: string) => void;
}

export const TagFilterContext = createContext<TagFilterContextValue | null>(null);

/**
 * 获取标签筛选上下文
 * 只在标签详情页内使用时返回值，其他页面返回 null
 */
export function useTagFilter() {
  return useContext(TagFilterContext);
}
