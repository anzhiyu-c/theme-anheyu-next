/**
 * 文章元数据管理 Hook
 * 管理编辑器之外的所有文章属性：分类、标签、封面、状态、摘要、SEO、版权等
 */
"use client";

import { useState, useCallback } from "react";
import type { ArticleStatus, ArticleDetailForEdit, CreateArticleRequest } from "@/types/post-management";

/** 文章元数据状态 */
export interface ArticleMeta {
  // 基础
  status: ArticleStatus;
  post_category_ids: string[];
  post_tag_ids: string[];
  cover_url: string;
  top_img_url: string;
  is_reprint: boolean;
  copyright_author: string;
  // 摘要 & SEO
  summaries: string[];
  keywords: string;
  abbrlink: string;
  // 显示控制
  show_on_home: boolean;
  home_sort: number;
  pin_sort: number;
  primary_color: string;
  is_primary_color_manual: boolean;
  // 版权
  copyright: boolean;
  copyright_author_href: string;
  copyright_url: string;
  // 高级
  ip_location: string;
  is_doc: boolean;
  doc_series_id: string;
  doc_sort: number;
  // 定时发布
  scheduled_at: string;
}

const DEFAULT_META: ArticleMeta = {
  status: "PUBLISHED",
  post_category_ids: [],
  post_tag_ids: [],
  cover_url: "",
  top_img_url: "",
  is_reprint: false,
  copyright_author: "",
  summaries: [],
  keywords: "",
  abbrlink: "",
  show_on_home: true,
  home_sort: 0,
  pin_sort: 0,
  primary_color: "",
  is_primary_color_manual: false,
  copyright: true,
  copyright_author_href: "",
  copyright_url: "",
  ip_location: "",
  is_doc: false,
  doc_series_id: "",
  doc_sort: 0,
  scheduled_at: "",
};

/**
 * 从文章数据初始化元数据
 */
function initFromArticle(article: ArticleDetailForEdit): ArticleMeta {
  return {
    status: article.status || "PUBLISHED",
    post_category_ids: article.post_categories?.map(c => c.id) || [],
    post_tag_ids: article.post_tags?.map(t => t.id) || [],
    cover_url: article.cover_url || "",
    top_img_url: article.top_img_url || "",
    is_reprint: article.is_reprint || false,
    copyright_author: article.copyright_author || "",
    summaries: article.summaries || [],
    keywords: article.keywords || "",
    abbrlink: article.abbrlink || "",
    show_on_home: article.show_on_home ?? true,
    home_sort: article.home_sort || 0,
    pin_sort: article.pin_sort || 0,
    primary_color: article.primary_color || "",
    is_primary_color_manual: article.is_primary_color_manual || false,
    copyright: article.copyright ?? true,
    copyright_author_href: article.copyright_author_href || "",
    copyright_url: article.copyright_url || "",
    ip_location: article.ip_location || "",
    is_doc: article.is_doc || false,
    doc_series_id: article.doc_series_id || "",
    doc_sort: article.doc_sort || 0,
    scheduled_at: article.scheduled_at || "",
  };
}

export function useArticleMeta(article?: ArticleDetailForEdit | null) {
  const [meta, setMeta] = useState<ArticleMeta>(
    article ? initFromArticle(article) : { ...DEFAULT_META }
  );
  const [initialized, setInitialized] = useState(false);

  // 从文章数据初始化（仅首次）
  const initFromData = useCallback((data: ArticleDetailForEdit) => {
    if (!initialized) {
      setMeta(initFromArticle(data));
      setInitialized(true);
    }
  }, [initialized]);

  // 更新单个字段
  const updateField = useCallback(<K extends keyof ArticleMeta>(key: K, value: ArticleMeta[K]) => {
    setMeta(prev => ({ ...prev, [key]: value }));
  }, []);

  // 批量更新
  const updateFields = useCallback((updates: Partial<ArticleMeta>) => {
    setMeta(prev => ({ ...prev, ...updates }));
  }, []);

  // 生成提交数据（合并到 CreateArticleRequest）
  const getSubmitData = useCallback((): Partial<CreateArticleRequest> => {
    const data: Partial<CreateArticleRequest> = {
      status: meta.status,
      post_category_ids: meta.post_category_ids.length > 0 ? meta.post_category_ids : undefined,
      post_tag_ids: meta.post_tag_ids.length > 0 ? meta.post_tag_ids : undefined,
      cover_url: meta.cover_url || undefined,
      top_img_url: meta.top_img_url || undefined,
      summaries: meta.summaries.length > 0 ? meta.summaries : undefined,
      keywords: meta.keywords || undefined,
      abbrlink: meta.abbrlink || undefined,
      show_on_home: meta.show_on_home,
      home_sort: meta.home_sort,
      pin_sort: meta.pin_sort,
      primary_color: meta.primary_color || undefined,
      is_primary_color_manual: meta.is_primary_color_manual,
      copyright: meta.copyright,
      is_reprint: meta.is_reprint,
      copyright_author: meta.copyright_author || undefined,
      copyright_author_href: meta.copyright_author_href || undefined,
      copyright_url: meta.copyright_url || undefined,
      is_doc: meta.is_doc,
      doc_series_id: meta.doc_series_id || undefined,
      doc_sort: meta.doc_sort,
    };
    return data;
  }, [meta]);

  return {
    meta,
    updateField,
    updateFields,
    initFromData,
    getSubmitData,
  };
}
