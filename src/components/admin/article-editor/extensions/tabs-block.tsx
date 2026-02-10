/**
 * TabsBlock 扩展
 * 标签页面板，样式与文章详情一致
 * 支持多 Tab 切换、标题编辑、内容编辑、添加/删除 Tab
 */
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { useState } from "react";
import { Plus, X } from "lucide-react";

// ---- 类型定义 ----
interface TabItem {
  title: string;
  content: string;
}

const DEFAULT_TABS: TabItem[] = [
  { title: "标签 1", content: "" },
  { title: "标签 2", content: "" },
];

// ---- React NodeView 组件 ----
function TabsBlockView({ node, updateAttributes }: NodeViewProps) {
  const tabsRaw = (node.attrs.tabs as string) || JSON.stringify(DEFAULT_TABS);

  let tabs: TabItem[] = [];
  try {
    tabs = JSON.parse(tabsRaw);
  } catch {
    tabs = [...DEFAULT_TABS];
  }

  const [activeIdx, setActiveIdx] = useState(parseInt((node.attrs.activeIndex as string) || "0", 10));
  const [editingTab, setEditingTab] = useState<number | null>(null);

  const safeIdx = Math.min(Math.max(0, activeIdx), tabs.length - 1);

  const saveTabs = (newTabs: TabItem[], newIdx?: number) => {
    const idx = newIdx ?? safeIdx;
    updateAttributes({ tabs: JSON.stringify(newTabs), activeIndex: String(idx) });
    if (newIdx !== undefined) setActiveIdx(newIdx);
  };

  const handleAddTab = () => {
    const newTabs = [...tabs, { title: `标签 ${tabs.length + 1}`, content: "" }];
    saveTabs(newTabs);
  };

  const handleRemoveTab = (index: number) => {
    if (tabs.length <= 1) return;
    const newTabs = tabs.filter((_, i) => i !== index);
    const newIdx = safeIdx >= newTabs.length ? newTabs.length - 1 : safeIdx;
    saveTabs(newTabs, newIdx);
  };

  const handleTitleChange = (index: number, value: string) => {
    const newTabs = [...tabs];
    newTabs[index] = { ...newTabs[index], title: value };
    saveTabs(newTabs);
  };

  const handleContentChange = (value: string) => {
    const newTabs = [...tabs];
    newTabs[safeIdx] = { ...newTabs[safeIdx], content: value };
    saveTabs(newTabs);
  };

  return (
    <NodeViewWrapper className="tabs-block-wrapper my-3">
      <div className="editor-node-hover-wrap" contentEditable={false}>
        <div className="editor-tabs">
        {/* 标签导航 */}
        <div className="editor-tabs-nav">
          {tabs.map((tab, i) => (
            <div key={i} className="editor-tabs-tab-wrap">
              <button
                type="button"
                className={`editor-tabs-tab ${i === safeIdx ? "is-active" : ""}`}
                onClick={() => {
                  setActiveIdx(i);
                  updateAttributes({ activeIndex: String(i) });
                }}
                onDoubleClick={e => {
                  e.stopPropagation();
                  setEditingTab(i);
                }}
              >
                {editingTab === i ? (
                  <input
                    value={tab.title}
                    onChange={e => handleTitleChange(i, e.target.value)}
                    onBlur={() => setEditingTab(null)}
                    onKeyDown={e => {
                      if (e.key === "Enter" || e.key === "Escape") setEditingTab(null);
                    }}
                    onClick={e => e.stopPropagation()}
                    className="editor-tabs-tab-input"
                    autoFocus
                  />
                ) : (
                  tab.title
                )}
              </button>
              {tabs.length > 1 && (
                <button
                  type="button"
                  className="editor-tabs-tab-remove"
                  onClick={e => {
                    e.stopPropagation();
                    handleRemoveTab(i);
                  }}
                  title="删除标签"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}

          {/* 添加按钮 */}
          <button type="button" className="editor-tabs-add" onClick={handleAddTab} title="添加标签">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 内容区 */}
        <div className="editor-tabs-content">
          <textarea
            value={tabs[safeIdx]?.content || ""}
            onChange={e => handleContentChange(e.target.value)}
            className="editor-tabs-textarea"
            placeholder="输入标签内容..."
          />
        </div>

        </div>
      </div>
    </NodeViewWrapper>
  );
}

// ---- 命令类型声明 ----
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    tabsBlock: {
      insertTabsBlock: (attrs?: { tabs?: string; activeIndex?: number }) => ReturnType;
    };
  }
}

// ---- Tiptap 扩展 ----
export const TabsBlock = Node.create({
  name: "tabsBlock",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      activeIndex: { default: "0" },
      tabs: {
        default: JSON.stringify(DEFAULT_TABS),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div.tabs",
        getAttrs: (el: HTMLElement) => {
          const parsedTabs: TabItem[] = [];
          const navButtons = el.querySelectorAll(".nav-tabs button, .nav-tabs .tab-button, .nav-tabs .tab");
          const contentDivs = el.querySelectorAll(
            ".tab-item-content, .tab-content > .tab-pane, .tab-contents > .tab-item-content"
          );

          if (navButtons.length > 0) {
            navButtons.forEach((btn, i) => {
              parsedTabs.push({
                title: btn.textContent?.trim() || `标签 ${i + 1}`,
                content: contentDivs[i]?.textContent?.trim() || "",
              });
            });
          }

          let activeIndex = "0";
          const activeBtn = el.querySelector(".nav-tabs .active, .nav-tabs [aria-selected='true']");
          if (activeBtn && navButtons.length > 0) {
            const idx = Array.from(navButtons).indexOf(activeBtn);
            if (idx >= 0) activeIndex = String(idx);
          }

          return {
            tabs: JSON.stringify(parsedTabs.length > 0 ? parsedTabs : DEFAULT_TABS),
            activeIndex,
          };
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    let tabs: TabItem[] = [];
    try {
      tabs = JSON.parse((node.attrs.tabs as string) || "[]");
    } catch {
      tabs = [...DEFAULT_TABS];
    }
    const activeIndex = parseInt((node.attrs.activeIndex as string) || "0", 10);

    const navTabs = tabs.map((tab, i) => [
      "button",
      { class: `tab${i === activeIndex ? " active" : ""}`, "data-index": String(i) },
      tab.title,
    ]);

    const contentDivs = tabs.map((tab, i) => [
      "div",
      { class: `tab-item-content${i === activeIndex ? " active" : ""}` },
      tab.content,
    ]);

    return [
      "div",
      mergeAttributes(HTMLAttributes, { class: "tabs" }),
      ["div", { class: "nav-tabs" }, ...navTabs],
      ["div", { class: "tab-contents" }, ...contentDivs],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TabsBlockView);
  },

  addCommands() {
    return {
      insertTabsBlock:
        (attrs = {}) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              tabs: attrs?.tabs ?? JSON.stringify(DEFAULT_TABS),
              activeIndex: String(attrs?.activeIndex ?? 0),
            },
          });
        },
    };
  },
});
