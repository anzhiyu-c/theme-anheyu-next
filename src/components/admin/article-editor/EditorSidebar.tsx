"use client";

import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import {
  X,
  Plus,
  ChevronDown,
  Check,
  ImageIcon,
  Search,
  CircleDot,
  FileEdit,
  Clock3,
  Archive,
  Loader2,
  Upload,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { articleApi } from "@/lib/api/article";
import { postManagementApi } from "@/lib/api/post-management";
import type { Editor } from "@tiptap/react";
import type { ArticleStatus } from "@/types/post-management";
import type { PostCategory, PostTag } from "@/types/article";
import type { ArticleMeta } from "./use-article-meta";

// ═══════════════════════════════════════════
//  Props & 常量
// ═══════════════════════════════════════════

interface EditorSidebarProps {
  editor: Editor | null;
  meta: ArticleMeta;
  onUpdateField: <K extends keyof ArticleMeta>(key: K, value: ArticleMeta[K]) => void;
  categories: PostCategory[];
  tags: PostTag[];
  isLoadingCategories?: boolean;
  isLoadingTags?: boolean;
}

const STATUS_OPTIONS: {
  key: ArticleStatus;
  label: string;
  icon: ReactNode;
  activeClass: string;
}[] = [
  {
    key: "PUBLISHED",
    label: "发布",
    icon: <CircleDot className="w-3.5 h-3.5" />,
    activeClass: "sb-status-published",
  },
  {
    key: "DRAFT",
    label: "草稿",
    icon: <FileEdit className="w-3.5 h-3.5" />,
    activeClass: "sb-status-draft",
  },
  {
    key: "SCHEDULED",
    label: "定时",
    icon: <Clock3 className="w-3.5 h-3.5" />,
    activeClass: "sb-status-scheduled",
  },
  {
    key: "ARCHIVED",
    label: "归档",
    icon: <Archive className="w-3.5 h-3.5" />,
    activeClass: "sb-status-archived",
  },
];

const QUICK_TIMES = [
  { label: "1小时后", hours: 1 },
  { label: "3小时后", hours: 3 },
  { label: "6小时后", hours: 6 },
  { label: "明天", hours: 24 },
  { label: "后天", hours: 48 },
  { label: "一周后", hours: 168 },
];

// ═══════════════════════════════════════════
//  原子 UI 组件（纯手写，不依赖任何 UI 库）
// ═══════════════════════════════════════════

/** 自定义输入框 */
function SbInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  const [id] = useState(() => `sb-${crypto.randomUUID().slice(0, 8)}`);
  return (
    <div className={`sb-field ${className}`}>
      {label && (
        <label htmlFor={id} className="sb-label">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="sb-input"
      />
    </div>
  );
}

/** 自定义文本域 */
function SbTextarea({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  // 自适应高度
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0";
    el.style.height = `${Math.max(el.scrollHeight, 32)}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={1}
      className={`sb-input sb-textarea ${className}`}
    />
  );
}

/** 自定义开关 */
function SbToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button type="button" className="sb-toggle-row" onClick={() => onChange(!checked)}>
      <div className="min-w-0 flex-1">
        <span className="sb-toggle-label">{label}</span>
        {description && <span className="sb-toggle-desc">{description}</span>}
      </div>
      <span className={`sb-switch ${checked ? "sb-switch-on" : ""}`} aria-hidden>
        <span className="sb-switch-thumb" />
      </span>
    </button>
  );
}

/** 自定义多选下拉 */
function SbMultiSelect({
  label,
  placeholder,
  options,
  selectedIds,
  onChange,
  isLoading,
  onCreate,
  createLabel,
}: {
  label?: string;
  placeholder?: string;
  options: { id: string; name: string }[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  isLoading?: boolean;
  onCreate?: (name: string) => Promise<{ id: string; name: string } | null>;
  createLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle = (id: string) => {
    onChange(selectedIds.includes(id) ? selectedIds.filter(x => x !== id) : [...selectedIds, id]);
  };

  const filtered = search ? options.filter(o => o.name.toLowerCase().includes(search.toLowerCase())) : options;

  const selectedNames = selectedIds.map(id => options.find(o => o.id === id)?.name).filter(Boolean);

  // 是否显示「创建」按钮：有 onCreate 回调 + 搜索词不为空 + 搜索词不完全匹配已有选项
  const canCreate =
    onCreate && search.trim() && !options.some(o => o.name.toLowerCase() === search.trim().toLowerCase());

  const handleCreate = async () => {
    if (!onCreate || !search.trim()) return;
    setIsCreating(true);
    try {
      const created = await onCreate(search.trim());
      if (created) {
        onChange([...selectedIds, created.id]);
        setSearch("");
      }
    } catch (err) {
      console.error("创建失败:", err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="sb-field" ref={containerRef}>
      {label && <span className="sb-label">{label}</span>}
      <button type="button" className="sb-select-trigger" onClick={() => setOpen(!open)}>
        {isLoading ? (
          <span className="sb-select-placeholder">
            <Loader2 className="w-3 h-3 animate-spin inline mr-1" />
            加载中...
          </span>
        ) : selectedNames.length > 0 ? (
          <span className="sb-select-value truncate">{selectedNames.join("、")}</span>
        ) : (
          <span className="sb-select-placeholder">{placeholder || "请选择"}</span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* 下拉面板 */}
      {open && (
        <div className="sb-dropdown">
          {/* 搜索 */}
          <div className="sb-dropdown-search">
            <Search className="w-3 h-3 text-(--sb-muted)" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜索..."
              className="sb-dropdown-search-input"
              autoFocus
              onKeyDown={e => {
                if (e.key === "Enter" && canCreate) {
                  e.preventDefault();
                  handleCreate();
                }
              }}
            />
          </div>
          {/* 选项列表 */}
          <div className="sb-dropdown-list">
            {filtered.length === 0 && !canCreate && <div className="sb-dropdown-empty">无匹配项</div>}
            {filtered.map(opt => {
              const isSelected = selectedIds.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={`sb-dropdown-item ${isSelected ? "sb-dropdown-item-active" : ""}`}
                  onClick={() => toggle(opt.id)}
                >
                  <span className={`sb-checkbox ${isSelected ? "sb-checkbox-checked" : ""}`}>
                    {isSelected && <Check className="w-2.5 h-2.5" />}
                  </span>
                  <span className="truncate">{opt.name}</span>
                </button>
              );
            })}
            {/* 创建新选项 */}
            {canCreate && (
              <button
                type="button"
                className="sb-dropdown-item sb-dropdown-create"
                onClick={handleCreate}
                disabled={isCreating}
              >
                {isCreating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                <span className="truncate">
                  {createLabel || "创建"} &ldquo;{search.trim()}&rdquo;
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** 可折叠分区 */
function SbSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(defaultOpen ? undefined : 0);

  useEffect(() => {
    if (!contentRef.current) return;
    if (open) {
      const h = contentRef.current.scrollHeight;
      setHeight(h);
      // 动画结束后切换到 auto，确保内部变动自动撑开
      const timer = setTimeout(() => setHeight(undefined), 250);
      return () => clearTimeout(timer);
    } else {
      // 先设为当前实际高度，然后下一帧设为 0 触发 CSS 过渡
      setHeight(contentRef.current.scrollHeight);
      requestAnimationFrame(() => setHeight(0));
    }
  }, [open]);

  return (
    <div className="sb-section">
      <button type="button" className="sb-section-trigger" onClick={() => setOpen(!open)}>
        <span className="sb-section-title">{title}</span>
        <ChevronDown
          className={`w-3 h-3 text-(--sb-muted) transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        ref={contentRef}
        className="sb-section-body"
        style={{ height: height !== undefined ? `${height}px` : "auto" }}
      >
        <div className="sb-section-content">{children}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
//  封面图预览
// ═══════════════════════════════════════════

function CoverPreview({ url }: { url: string }) {
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [prevUrl, setPrevUrl] = useState(url);

  if (url !== prevUrl) {
    setPrevUrl(url);
    setHasError(false);
    setLoaded(false);
  }

  if (!url || hasError) {
    return (
      <div className="sb-cover-empty">
        <ImageIcon className="w-5 h-5" />
        <span>粘贴图片链接预览</span>
      </div>
    );
  }

  return (
    <div className="sb-cover">
      {!loaded && (
        <div className="sb-cover-loading">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt="封面预览"
        className={`sb-cover-img ${loaded ? "sb-cover-img-loaded" : ""}`}
        onLoad={() => setLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  );
}

// ═══════════════════════════════════════════
//  已选标签 pill
// ═══════════════════════════════════════════

function TagPill({ name, onRemove }: { name: string; onRemove: () => void }) {
  return (
    <span className="sb-tag">
      {name}
      <button type="button" className="sb-tag-remove" onClick={onRemove}>
        <X className="w-2.5 h-2.5" />
      </button>
    </span>
  );
}

// ═══════════════════════════════════════════
//  大纲 (TOC) 组件
// ═══════════════════════════════════════════

interface Heading {
  level: number;
  text: string;
  pos: number;
}

interface TOCNode {
  heading: Heading;
  children: TOCNode[];
}

function extractHeadings(editor: Editor): Heading[] {
  const headings: Heading[] = [];
  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === "heading") {
      headings.push({ level: node.attrs.level as number, text: node.textContent, pos });
    }
  });
  return headings;
}

function buildTree(headings: Heading[]): TOCNode[] {
  const root: TOCNode[] = [];
  const stack: { node: TOCNode; level: number }[] = [];
  for (const h of headings) {
    const newNode: TOCNode = { heading: h, children: [] };
    while (stack.length > 0 && stack[stack.length - 1].level >= h.level) stack.pop();
    if (stack.length === 0) root.push(newNode);
    else stack[stack.length - 1].node.children.push(newNode);
    stack.push({ node: newNode, level: h.level });
  }
  return root;
}

function TOCTreeNode({
  node,
  onClickPos,
  depth = 0,
}: {
  node: TOCNode;
  onClickPos: (pos: number) => void;
  depth?: number;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const hasChildren = node.children.length > 0;

  return (
    <li className="select-none">
      <div className="flex items-center gap-1 leading-8" style={{ paddingLeft: `${depth * 18}px` }}>
        {hasChildren ? (
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              setCollapsed(!collapsed);
            }}
            className="w-4 h-4 flex items-center justify-center shrink-0 text-default-400 hover:text-default-500 transition-colors"
          >
            <span
              className={`text-[9px] leading-none transition-transform duration-150 ${collapsed ? "" : "rotate-90"}`}
            >
              ▶
            </span>
          </button>
        ) : (
          <span className="w-4 shrink-0" />
        )}
        <button
          type="button"
          onClick={() => onClickPos(node.heading.pos)}
          className={`flex-1 text-left text-[13px] truncate hover:text-primary transition-colors min-w-0 ${
            depth === 0 ? "font-semibold text-default-700" : "text-default-500"
          }`}
          title={node.heading.text || "（空标题）"}
        >
          {node.heading.text || <span className="text-default-300 italic">（空标题）</span>}
        </button>
      </div>
      {hasChildren && !collapsed && (
        <ul>
          {node.children.map((child, i) => (
            <TOCTreeNode key={`${child.heading.pos}-${i}`} node={child} onClickPos={onClickPos} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function TOCContent({ editor }: { editor: Editor | null }) {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    if (!editor) return;
    const update = () => setHeadings(extractHeadings(editor));
    update();
    editor.on("update", update);
    return () => {
      editor.off("update", update);
    };
  }, [editor]);

  const handleClick = useCallback(
    (pos: number) => {
      if (!editor) return;
      editor.chain().focus().setTextSelection(pos).scrollIntoView().run();
    },
    [editor]
  );

  if (!editor) return <p className="text-xs text-default-300 py-2">编辑器未就绪</p>;
  if (headings.length === 0) return <p className="text-xs text-default-300 py-2">暂无标题</p>;

  const tree = buildTree(headings);
  return (
    <ul>
      {tree.map((node, i) => (
        <TOCTreeNode key={`${node.heading.pos}-${i}`} node={node} onClickPos={handleClick} />
      ))}
    </ul>
  );
}

// ═══════════════════════════════════════════
//  文章设置主内容
// ═══════════════════════════════════════════

interface SettingsContentProps {
  meta: ArticleMeta;
  onUpdateField: EditorSidebarProps["onUpdateField"];
  categories: PostCategory[];
  tags: PostTag[];
  isLoadingCategories?: boolean;
  isLoadingTags?: boolean;
}

function SettingsContent({
  meta,
  onUpdateField,
  categories,
  tags,
  isLoadingCategories,
  isLoadingTags,
}: SettingsContentProps) {
  const queryClient = useQueryClient();
  const topImgInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingTopImg, setIsUploadingTopImg] = useState(false);
  const coverImgInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  // 创建分类
  const handleCreateCategory = useCallback(
    async (name: string) => {
      const created = await articleApi.createCategory({ name });
      queryClient.invalidateQueries({ queryKey: ["post-categories"] });
      return created;
    },
    [queryClient]
  );

  // 创建标签
  const handleCreateTag = useCallback(
    async (name: string) => {
      const created = await articleApi.createTag(name);
      queryClient.invalidateQueries({ queryKey: ["post-tags"] });
      return created;
    },
    [queryClient]
  );

  // 上传顶部大图
  const handleTopImgUpload = useCallback(
    async (file: File) => {
      setIsUploadingTopImg(true);
      try {
        const url = await postManagementApi.uploadArticleImage(file);
        onUpdateField("top_img_url", url);
      } catch (err) {
        console.error("顶部大图上传失败:", err);
      } finally {
        setIsUploadingTopImg(false);
      }
    },
    [onUpdateField]
  );

  // 上传封面图
  const handleCoverUpload = useCallback(
    async (file: File) => {
      setIsUploadingCover(true);
      try {
        const url = await postManagementApi.uploadArticleImage(file);
        onUpdateField("cover_url", url);
      } catch (err) {
        console.error("封面图上传失败:", err);
      } finally {
        setIsUploadingCover(false);
      }
    },
    [onUpdateField]
  );

  return (
    <div className="sb-body">
      {/* ── 状态选择器 ── */}
      <div className="sb-status-bar">
        {STATUS_OPTIONS.map(opt => (
          <button
            key={opt.key}
            type="button"
            onClick={() => onUpdateField("status", opt.key)}
            className={`sb-status-item ${meta.status === opt.key ? opt.activeClass : ""}`}
          >
            {opt.icon}
            <span>{opt.label}</span>
          </button>
        ))}
      </div>

      {/* ── 基础设置 ── */}
      <SbSection title="基础" defaultOpen>
        <SbMultiSelect
          label="分类"
          placeholder="选择分类"
          options={categories}
          selectedIds={meta.post_category_ids}
          onChange={ids => onUpdateField("post_category_ids", ids)}
          isLoading={isLoadingCategories}
          onCreate={handleCreateCategory}
          createLabel="新建分类"
        />

        <SbMultiSelect
          label="标签"
          placeholder="选择标签"
          options={tags}
          selectedIds={meta.post_tag_ids}
          onChange={ids => onUpdateField("post_tag_ids", ids)}
          isLoading={isLoadingTags}
          onCreate={handleCreateTag}
          createLabel="新建标签"
        />
        {meta.post_tag_ids.length > 0 && (
          <div className="sb-tags-wrap">
            {meta.post_tag_ids.map(id => {
              const tag = tags.find(t => t.id === id);
              return tag ? (
                <TagPill
                  key={id}
                  name={tag.name}
                  onRemove={() =>
                    onUpdateField(
                      "post_tag_ids",
                      meta.post_tag_ids.filter(tid => tid !== id)
                    )
                  }
                />
              ) : null;
            })}
          </div>
        )}

        {/* 封面 */}
        <div className="sb-field">
          <span className="sb-label">封面图</span>
          <CoverPreview url={meta.cover_url} />
          <div className="flex gap-1.5 mt-1.5">
            <input
              type="text"
              value={meta.cover_url}
              onChange={e => onUpdateField("cover_url", e.target.value)}
              placeholder="https://..."
              className="sb-input flex-1"
            />
            <button
              type="button"
              className="sb-upload-btn"
              onClick={() => coverImgInputRef.current?.click()}
              disabled={isUploadingCover}
              title="上传封面图"
            >
              {isUploadingCover ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            </button>
            <input
              ref={coverImgInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleCoverUpload(file);
                e.target.value = "";
              }}
            />
          </div>
        </div>

        {/* 顶部大图 */}
        <div className="sb-field">
          <span className="sb-label">顶部大图</span>
          <CoverPreview url={meta.top_img_url} />
          <div className="flex gap-1.5 mt-1.5">
            <input
              type="text"
              value={meta.top_img_url}
              onChange={e => onUpdateField("top_img_url", e.target.value)}
              placeholder="https://..."
              className="sb-input flex-1"
            />
            <button
              type="button"
              className="sb-upload-btn"
              onClick={() => topImgInputRef.current?.click()}
              disabled={isUploadingTopImg}
              title="上传顶部大图"
            >
              {isUploadingTopImg ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
            </button>
            <input
              ref={topImgInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleTopImgUpload(file);
                e.target.value = "";
              }}
            />
          </div>
        </div>

        <SbToggle
          label="转载文章"
          description="开启后显示版权来源"
          checked={meta.is_reprint}
          onChange={v => onUpdateField("is_reprint", v)}
        />
      </SbSection>

      {/* ── 摘要 & SEO ── */}
      <SbSection title="摘要 & SEO" defaultOpen>
        <div className="sb-field">
          <span className="sb-label">摘要</span>
          <div className="space-y-1.5">
            {meta.summaries.map((s, i) => (
              <div key={i} className="group flex gap-1 items-start">
                <SbTextarea
                  value={s}
                  onChange={v => {
                    const arr = [...meta.summaries];
                    arr[i] = v;
                    onUpdateField("summaries", arr);
                  }}
                  placeholder={`摘要 ${i + 1}`}
                  className="flex-1"
                />
                <button
                  type="button"
                  className="sb-icon-btn opacity-0 group-hover:opacity-100 mt-1.5"
                  onClick={() =>
                    onUpdateField(
                      "summaries",
                      meta.summaries.filter((_, j) => j !== i)
                    )
                  }
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {meta.summaries.length < 3 && (
              <button
                type="button"
                className="sb-add-btn"
                onClick={() => onUpdateField("summaries", [...meta.summaries, ""])}
              >
                <Plus className="w-3 h-3" />
                添加摘要
              </button>
            )}
          </div>
        </div>

        <SbInput
          label="关键词"
          value={meta.keywords}
          onChange={v => onUpdateField("keywords", v)}
          placeholder="用英文逗号分隔"
        />
        <SbInput
          label="永久链接"
          value={meta.abbrlink}
          onChange={v => onUpdateField("abbrlink", v)}
          placeholder="自动生成或手动输入"
        />
      </SbSection>

      {/* ── 显示 ── */}
      <SbSection title="显示">
        <SbToggle
          label="首页展示"
          description="在首页文章列表中可见"
          checked={meta.show_on_home}
          onChange={v => onUpdateField("show_on_home", v)}
        />
        <div className="grid grid-cols-2 gap-2">
          <SbInput
            label="首页排序"
            value={String(meta.home_sort)}
            onChange={v => onUpdateField("home_sort", Number(v) || 0)}
            type="number"
          />
          <SbInput
            label="置顶排序"
            value={String(meta.pin_sort)}
            onChange={v => onUpdateField("pin_sort", Number(v) || 0)}
            type="number"
          />
        </div>

        <SbToggle
          label="手动主色调"
          description="覆盖从封面自动提取的颜色"
          checked={meta.is_primary_color_manual}
          onChange={v => onUpdateField("is_primary_color_manual", v)}
        />
        {meta.is_primary_color_manual && (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={meta.primary_color || "#4259ef"}
              onChange={e => onUpdateField("primary_color", e.target.value)}
              className="sb-color-input"
            />
            <input
              type="text"
              value={meta.primary_color}
              onChange={e => onUpdateField("primary_color", e.target.value)}
              placeholder="#4259ef"
              className="sb-input flex-1"
            />
          </div>
        )}
      </SbSection>

      {/* ── 版权（仅转载时） ── */}
      {meta.is_reprint && (
        <SbSection title="版权" defaultOpen>
          <SbInput label="原作者" value={meta.copyright_author} onChange={v => onUpdateField("copyright_author", v)} />
          <SbInput
            label="作者链接"
            value={meta.copyright_author_href}
            onChange={v => onUpdateField("copyright_author_href", v)}
            placeholder="https://..."
          />
          <SbInput
            label="原文链接"
            value={meta.copyright_url}
            onChange={v => onUpdateField("copyright_url", v)}
            placeholder="https://..."
          />
        </SbSection>
      )}

      {/* ── 高级 ── */}
      <SbSection title="高级">
        <SbInput
          label="IP 属地"
          value={meta.ip_location}
          onChange={v => onUpdateField("ip_location", v)}
          placeholder="自动获取或手动填写"
        />
        <SbToggle
          label="文档模式"
          description="作为系列文档的一部分"
          checked={meta.is_doc}
          onChange={v => onUpdateField("is_doc", v)}
        />
        {meta.is_doc && (
          <div className="sb-sub-group">
            <SbInput label="系列 ID" value={meta.doc_series_id} onChange={v => onUpdateField("doc_series_id", v)} />
            <SbInput
              label="文档排序"
              value={String(meta.doc_sort)}
              onChange={v => onUpdateField("doc_sort", Number(v) || 0)}
              type="number"
            />
          </div>
        )}
      </SbSection>

      {/* ── 定时发布（仅定时状态时） ── */}
      {meta.status === "SCHEDULED" && (
        <SbSection title="定时发布" defaultOpen>
          <SbInput
            label="发布时间"
            value={meta.scheduled_at}
            onChange={v => onUpdateField("scheduled_at", v)}
            type="datetime-local"
          />
          <div className="sb-field">
            <span className="sb-label">快捷设定</span>
            <div className="sb-quick-times">
              {QUICK_TIMES.map(qt => (
                <button
                  key={qt.label}
                  type="button"
                  className="sb-quick-btn"
                  onClick={() => {
                    const target = new Date(Date.now() + qt.hours * 3600000);
                    onUpdateField("scheduled_at", target.toISOString().slice(0, 16));
                  }}
                >
                  {qt.label}
                </button>
              ))}
            </div>
          </div>
        </SbSection>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
//  EditorSidebar 主入口
// ═══════════════════════════════════════════

export function EditorSidebar({
  meta,
  onUpdateField,
  categories,
  tags,
  isLoadingCategories,
  isLoadingTags,
}: Omit<EditorSidebarProps, "editor">) {
  return (
    <div className="sb-root">
      <div className="sb-header">
        <span>文章设置</span>
      </div>
      <div className="sb-scroll">
        <SettingsContent
          meta={meta}
          onUpdateField={onUpdateField}
          categories={categories}
          tags={tags}
          isLoadingCategories={isLoadingCategories}
          isLoadingTags={isLoadingTags}
        />
      </div>
    </div>
  );
}
