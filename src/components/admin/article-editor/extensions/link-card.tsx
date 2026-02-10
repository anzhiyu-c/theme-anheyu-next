"use client";

/**
 * LinkCard 扩展
 * 链接卡片节点，样式与文章详情一致
 * 支持 Iconify 格式图标、图片 URL 图标、默认链接图标
 */
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Pencil } from "lucide-react";

/** 判断是否为 Iconify 格式（包含 ":"） */
function isIconifyIcon(icon: string): boolean {
  return !!icon && icon.includes(":");
}

/** 判断是否为图片 URL */
function isImageUrl(icon: string): boolean {
  return !!icon && (icon.startsWith("http://") || icon.startsWith("https://") || icon.startsWith("/"));
}

/** 渲染图标：支持 Iconify、图片 URL、默认链接图标 */
function CardIcon({ icon }: { icon: string }) {
  if (icon && isIconifyIcon(icon)) {
    return <Icon icon={icon} width={28} height={28} style={{ color: "var(--anzhiyu-fontcolor, var(--foreground))" }} />;
  }
  if (icon && isImageUrl(icon)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={icon}
        alt=""
        onError={e => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }
  // 默认链接图标
  return <i className="anzhiyu-icon-link" />;
}

// ---- React NodeView 组件 ----
function LinkCardView({ node, updateAttributes }: NodeViewProps) {
  const [editing, setEditing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const url = (node.attrs.url as string) || "";
  const title = (node.attrs.title as string) || "";
  const sitename = (node.attrs.sitename as string) || "";
  const icon = (node.attrs.icon as string) || "";
  const tips = (node.attrs.tips as string) || "";

  const displayTips = tips || "引用站外地址";

  // 点击外部关闭编辑
  useEffect(() => {
    if (!editing) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as globalThis.Node)) {
        setEditing(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [editing]);

  if (editing) {
    return (
      <NodeViewWrapper className="link-card-wrapper my-3">
        <div ref={panelRef} className="editor-linkcard-edit-panel" contentEditable={false}>
          <div className="editor-btn-header">
            <span className="editor-btn-title">编辑链接卡片</span>
            <button type="button" className="editor-btn-done" onClick={() => setEditing(false)}>
              完成
            </button>
          </div>

          {/* 实时预览 */}
          <div className="editor-linkcard-preview">
            <div className="anzhiyu-tag-link">
              <div className="tag-Link">
                <div className="tag-link-tips">{displayTips}</div>
                <div className="tag-link-bottom">
                  <div className="tag-link-left">
                    <CardIcon icon={icon} />
                  </div>
                  <div className="tag-link-right">
                    <div className="tag-link-title">{title || url || "链接标题"}</div>
                    {sitename && <div className="tag-link-sitename">{sitename}</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 表单 */}
          <div className="editor-btn-form">
            <div className="editor-btn-row">
              <label className="editor-btn-field">
                <span className="editor-btn-label">链接地址</span>
                <input
                  value={url}
                  onChange={e => updateAttributes({ url: e.target.value })}
                  className="editor-btn-input"
                  placeholder="https://example.com"
                  autoFocus
                />
              </label>
              <label className="editor-btn-field">
                <span className="editor-btn-label">标题</span>
                <input
                  value={title}
                  onChange={e => updateAttributes({ title: e.target.value })}
                  className="editor-btn-input"
                  placeholder="网站标题"
                />
              </label>
            </div>
            <div className="editor-btn-row">
              <label className="editor-btn-field">
                <span className="editor-btn-label">站点名</span>
                <input
                  value={sitename}
                  onChange={e => updateAttributes({ sitename: e.target.value })}
                  className="editor-btn-input"
                  placeholder="站点名称"
                />
              </label>
              <label className="editor-btn-field">
                <span className="editor-btn-label">提示文字</span>
                <input
                  value={tips}
                  onChange={e => updateAttributes({ tips: e.target.value })}
                  className="editor-btn-input"
                  placeholder="引用站外地址"
                />
              </label>
            </div>
            <label className="editor-btn-field">
              <span className="editor-btn-label">图标（Iconify 格式或图片 URL）</span>
              <input
                value={icon}
                onChange={e => updateAttributes({ icon: e.target.value })}
                className="editor-btn-input"
                placeholder="simple-icons:github 或 https://example.com/icon.png"
              />
            </label>
          </div>
        </div>
      </NodeViewWrapper>
    );
  }

  // ---- 预览模式 ----
  return (
    <NodeViewWrapper className="link-card-wrapper my-3">
      <div className="editor-node-hover-wrap" contentEditable={false}>
        <div className="editor-node-edit-btn" onClick={(e) => { e.stopPropagation(); setEditing(true); }} contentEditable={false}>
          <Pencil /> 编辑
        </div>
        <div className="anzhiyu-tag-link">
          <div className="tag-Link">
            <div className="tag-link-tips">{displayTips}</div>
            <div className="tag-link-bottom">
              <div className="tag-link-left">
                <CardIcon icon={icon} />
              </div>
              <div className="tag-link-right">
                <div className="tag-link-title">{title || url || "链接卡片"}</div>
                {sitename && <div className="tag-link-sitename">{sitename}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
}

// ---- 命令类型声明 ----
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    linkCard: {
      insertLinkCard: (attrs?: {
        url?: string;
        title?: string;
        sitename?: string;
        icon?: string;
        tips?: string;
      }) => ReturnType;
    };
  }
}

// ---- Tiptap 扩展 ----
export const LinkCard = Node.create({
  name: "linkCard",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      url: { default: "" },
      title: { default: "" },
      sitename: { default: "" },
      icon: { default: "" },
      tips: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div.anzhiyu-tag-link",
        getAttrs: (el: HTMLElement) => {
          const link = el.querySelector("a.tag-Link") as HTMLAnchorElement | null;
          const tipsEl = el.querySelector(".tag-link-tips");
          const titleEl = el.querySelector(".tag-link-title");
          const sitenameEl = el.querySelector(".tag-link-sitename");
          const iconImg = el.querySelector(".tag-link-left img") as HTMLImageElement | null;
          const iconI = el.querySelector(".tag-link-left i") as HTMLElement | null;
          const iconSpan = el.querySelector(".tag-link-left .iconify") as HTMLElement | null;

          // 图标：图片 URL > Iconify data-icon > i class
          let iconVal = "";
          if (iconImg) {
            iconVal = iconImg.getAttribute("src") || iconImg.getAttribute("data-src") || "";
          } else if (iconSpan) {
            iconVal = iconSpan.getAttribute("data-icon") || "";
          } else if (iconI && !iconI.classList.contains("anzhiyu-icon-link")) {
            iconVal = iconI.className || "";
          }

          return {
            url: link?.getAttribute("href") || "",
            title: titleEl?.textContent || "",
            sitename: sitenameEl?.textContent || "",
            icon: iconVal,
            tips: tipsEl?.textContent || "",
          };
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const url = (node.attrs.url as string) || "";
    const nodeTitle = (node.attrs.title as string) || "";
    const sitename = (node.attrs.sitename as string) || "";
    const nodeIcon = (node.attrs.icon as string) || "";
    const tips = (node.attrs.tips as string) || "";

    const linkChildren: unknown[] = [];

    // tips
    const displayTips = tips || "引用站外地址";
    linkChildren.push(["div", { class: "tag-link-tips" }, displayTips]);

    // icon
    const leftContent: unknown[] = [];
    if (nodeIcon && isIconifyIcon(nodeIcon)) {
      // Iconify 图标：输出为 <span class="iconify" data-icon="...">
      leftContent.push(["span", { class: "iconify", "data-icon": nodeIcon, style: "font-size: 28px" }]);
    } else if (nodeIcon && isImageUrl(nodeIcon)) {
      leftContent.push(["img", { src: nodeIcon, alt: "", loading: "lazy" }]);
    } else {
      leftContent.push(["i", { class: "anzhiyu-icon-link" }]);
    }

    // right
    const rightContent: unknown[] = [["span", { class: "tag-link-title" }, nodeTitle || url]];
    if (sitename) {
      rightContent.push(["span", { class: "tag-link-sitename" }, sitename]);
    }

    linkChildren.push([
      "div",
      { class: "tag-link-bottom" },
      ["div", { class: "tag-link-left" }, ...leftContent],
      ["div", { class: "tag-link-right" }, ...rightContent],
    ]);

    return [
      "div",
      mergeAttributes(HTMLAttributes, { class: "anzhiyu-tag-link" }),
      [
        "a",
        { class: "tag-Link", href: url, target: "_blank", rel: "noopener noreferrer" },
        ...linkChildren,
      ] as unknown as string,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(LinkCardView);
  },

  addCommands() {
    return {
      insertLinkCard:
        (attrs = {}) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              url: attrs.url || "",
              title: attrs.title || "",
              sitename: attrs.sitename || "",
              icon: attrs.icon || "",
              tips: attrs.tips || "",
            },
          });
        },
    };
  },
});
