"use client";

import { useState, useEffect, useRef } from "react";
import { addToast, Spinner, useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import TurndownService from "turndown";
import { EditorHeader } from "./EditorHeader";
import { EditorToolbar } from "./EditorToolbar";
import { TiptapEditor } from "./TiptapEditor";
import { EditorSidebar, TOCContent } from "./EditorSidebar";
import { useArticleEditor } from "./use-article-editor";
import { useArticleMeta } from "./use-article-meta";
import { useAutoSave } from "./use-auto-save";
import { useArticleForEdit, useCreateArticle, useUpdateArticle } from "@/hooks/queries/use-post-management";
import { processHtmlForSave } from "@/lib/content-processor";
import { AIWritingDialog } from "./AIWritingDialog";
import { articleApi } from "@/lib/api/article";

import type { Editor } from "@tiptap/react";

interface ArticleEditorPageProps {
  /** 文章 ID（编辑模式时传入） */
  articleId?: string;
}

/** 字数统计组件 - 固定在编辑器左下角 */
function WordCount({ editor }: { editor: Editor | null }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      const text = editor.state.doc.textContent;
      // 统计中文字符 + 英文单词
      const chineseChars = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
      const englishWords = (text.replace(/[\u4e00-\u9fff\u3400-\u4dbf]/g, " ").match(/[a-zA-Z0-9]+/g) || []).length;
      setCount(chineseChars + englishWords);
    };

    update();
    editor.on("update", update);
    return () => {
      editor.off("update", update);
    };
  }, [editor]);

  return (
    <div className="absolute bottom-2 left-3 pointer-events-none z-10">
      <span className="text-xs text-default-400 tabular-nums">{count}字</span>
    </div>
  );
}

/** HTML -> Markdown 转换器（单例） */
const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

export function ArticleEditorPage({ articleId }: ArticleEditorPageProps) {
  const router = useRouter();
  const isEditMode = !!articleId;

  // 编辑模式：加载文章数据
  const { data: article, isLoading: isLoadingArticle } = useArticleForEdit(articleId ?? "", { enabled: isEditMode });

  // 标题状态
  const [title, setTitle] = useState("");
  const [prevArticleId, setPrevArticleId] = useState<string | null>(null);

  // 右侧面板
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 文章元数据
  const { meta, updateField, initFromData, getSubmitData } = useArticleMeta();

  // Tiptap 编辑器实例
  const editor = useArticleEditor({
    initialContent: "",
    placeholder: "开始编写内容...",
  });

  // AI 写作对话框
  const aiWritingModal = useDisclosure();

  // 分类和标签列表
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["post-categories"],
    queryFn: () => articleApi.getCategoryList(),
    staleTime: 1000 * 60 * 5,
  });
  const { data: tags = [], isLoading: isLoadingTags } = useQuery({
    queryKey: ["post-tags"],
    queryFn: () => articleApi.getTagList("count"),
    staleTime: 1000 * 60 * 5,
  });

  // Mutations
  const createMutation = useCreateArticle();
  const updateMutation = useUpdateArticle();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  // 自动保存（仅编辑模式）
  const {
    status: autoSaveStatus,
    lastSavedAt,
    markAsSaved,
  } = useAutoSave({
    articleId,
    editor,
    title,
    getSubmitData,
    interval: 30000,
    enabled: isEditMode,
  });

  // 从文章数据初始化标题和元数据
  if (article && prevArticleId !== article.id) {
    setPrevArticleId(article.id);
    setTitle(article.title || "");
    initFromData(article);
  }

  // 同步编辑器内容
  // 使用 queueMicrotask 延迟 setContent，避免在 React commit 阶段中
  // 触发 tiptap ReactNodeViewRenderer 内部的 flushSync 调用
  const editorSyncedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!article || !editor || editor.isDestroyed) return;
    if (editorSyncedRef.current === article.id) return;
    editorSyncedRef.current = article.id;
    const contentHtml = article.content_html;
    if (contentHtml) {
      queueMicrotask(() => {
        if (!editor.isDestroyed) {
          editor.commands.setContent(contentHtml);
        }
      });
    }
  }, [article, editor]);

  // 保存文章
  const handleSave = () => {
    const rawHtml = editor?.getHTML() ?? "";
    const currentTitle = title.trim();

    if (!currentTitle) {
      addToast({ title: "请输入文章标题", color: "warning" });
      return;
    }

    const html = processHtmlForSave(rawHtml);
    const markdown = turndownService.turndown(html);

    // 合并元数据
    const metaData = getSubmitData();

    if (isEditMode && articleId) {
      updateMutation.mutate(
        {
          id: articleId,
          data: {
            title: currentTitle,
            content_html: html,
            content_md: markdown,
            ...metaData,
          },
        },
        {
          onSuccess: () => {
            markAsSaved();
            addToast({ title: "文章已更新", color: "success" });
          },
          onError: error => {
            addToast({ title: "更新失败", description: error.message, color: "danger" });
          },
        }
      );
    } else {
      createMutation.mutate(
        {
          title: currentTitle,
          content_html: html,
          content_md: markdown,
          status: meta.status,
          ...metaData,
        },
        {
          onSuccess: () => {
            addToast({ title: "文章已发布", color: "success" });
            router.push("/admin/post-management");
          },
          onError: error => {
            addToast({ title: "发布失败", description: error.message, color: "danger" });
          },
        }
      );
    }
  };

  // AI 写作内容插入
  const handleAIInsert = (content: string) => {
    if (editor && !editor.isDestroyed) {
      editor.chain().focus().insertContent(content).run();
    }
  };

  // 编辑模式加载中
  if (isEditMode && isLoadingArticle) {
    return (
      <div className="flex flex-col h-screen items-center justify-center gap-3 bg-background">
        <Spinner size="lg" />
        <p className="text-default-400">加载文章中...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* 标题栏 */}
      <EditorHeader
        title={title}
        onTitleChange={setTitle}
        onSave={handleSave}
        isSaving={isSaving}
        isEditMode={isEditMode}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        articleId={articleId}
        autoSaveStatus={autoSaveStatus}
        lastSavedAt={lastSavedAt}
        articleUpdatedAt={article?.updated_at}
      />

      {/* 工具栏 */}
      <EditorToolbar editor={editor} onAIWriting={aiWritingModal.onOpen} />

      {/* 主体区域：编辑器 + 大纲（固定布局） */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* 编辑器区域 - 始终占满剩余空间 */}
        <div className="flex-1 min-h-0 relative">
          <div className="h-full overflow-auto bg-card">
            <div className="max-w-4xl mx-auto">
              <TiptapEditor editor={editor} />
            </div>
          </div>
          {/* 字数统计 - 左下角 */}
          <WordCount editor={editor} />
        </div>

        {/* 大纲面板 - 始终显示在右侧，固定宽度 */}
        <div className="w-64 shrink-0 h-full overflow-auto py-4 px-5">
          <h3 className="text-base font-bold text-default-800 mb-3 pl-1">大纲</h3>
          <div className="border-l-2 border-default-200/60 pl-2">
            <TOCContent editor={editor} />
          </div>
        </div>

        {/* 文章设置面板 - 覆盖层，不影响内容布局 */}
        {sidebarOpen && (
          <div className="absolute top-0 right-0 h-full w-64 z-20 bg-background border-l-[0.5px] border-default-200/60 shadow-md overflow-auto">
            <EditorSidebar
              meta={meta}
              onUpdateField={updateField}
              categories={categories}
              tags={tags}
              isLoadingCategories={isLoadingCategories}
              isLoadingTags={isLoadingTags}
            />
          </div>
        )}
      </div>

      {/* AI 写作对话框 */}
      <AIWritingDialog
        isOpen={aiWritingModal.isOpen}
        onOpenChange={aiWritingModal.onOpenChange}
        onInsert={handleAIInsert}
      />
    </div>
  );
}
