"use client";

import * as React from "react";
import { Input, Select, SelectItem, Switch } from "@heroui/react";
import { cn } from "@/lib/utils";

// ─── 类型 ──────────────────────────────────────────────────────────

interface MenuSubItem {
  title: string;
  path: string;
  icon?: string;
  isExternal?: boolean;
}

interface MenuItem {
  title: string;
  type?: "direct" | "dropdown";
  path?: string;
  icon?: string;
  isExternal?: boolean;
  items?: MenuSubItem[];
}

interface HeaderMenuEditorProps {
  label?: string;
  description?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

// ─── 工具函数 ──────────────────────────────────────────────────────

function parseMenuArray(value: string | undefined): MenuItem[] {
  if (value == null) return [];
  if (Array.isArray(value)) return value as unknown as MenuItem[];
  if (typeof value === "object") return [];
  if (!value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const defaultMenuItem: MenuItem = {
  title: "",
  type: "direct",
  path: "",
  icon: "",
  isExternal: false,
  items: [],
};

const defaultSubItem: MenuSubItem = {
  title: "",
  path: "",
  icon: "",
  isExternal: false,
};

// ─── 内联输入框 ─────────────────────────────────────────────────

function SmallInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <Input
      label={label}
      labelPlacement="outside"
      size="sm"
      value={value}
      placeholder={placeholder}
      onValueChange={onChange}
      classNames={{
        label: "text-xs font-medium text-foreground/60",
        inputWrapper: cn(
          "bg-default-100/50 border border-default-200 rounded-lg !shadow-none h-8 min-h-8",
          "data-[hover=true]:border-default-300",
          "group-data-[focus=true]:!bg-white group-data-[focus=true]:dark:!bg-default-50 group-data-[focus=true]:border-primary group-data-[focus=true]:ring-1 group-data-[focus=true]:ring-primary/20",
          "transition-all duration-200"
        ),
        input: "text-sm placeholder:text-default-400",
      }}
    />
  );
}

// ─── 子菜单项组件 ──────────────────────────────────────────────

function SubItemRow({
  item,
  index,
  isFirst,
  isLast,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  item: MenuSubItem;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (field: keyof MenuSubItem, val: unknown) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="flex items-start gap-2 p-2 rounded-lg bg-default-50 border border-default-100">
      <span className="text-xs font-mono text-default-400 mt-2 shrink-0 w-4 text-center">{index + 1}</span>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
        <SmallInput
          label="标题"
          value={item.title || ""}
          placeholder="子菜单标题"
          onChange={v => onUpdate("title", v)}
        />
        <SmallInput label="路径" value={item.path || ""} placeholder="/path" onChange={v => onUpdate("path", v)} />
        <SmallInput label="图标" value={item.icon || ""} placeholder="图标名称" onChange={v => onUpdate("icon", v)} />
      </div>
      <div className="flex items-center gap-0.5 shrink-0 mt-5">
        {/* 外部链接开关 */}
        <button
          type="button"
          onClick={() => onUpdate("isExternal", !item.isExternal)}
          className={cn(
            "p-1 rounded-md transition-colors text-xs",
            item.isExternal ? "bg-primary/10 text-primary" : "text-default-400 hover:bg-default-100"
          )}
          title={item.isExternal ? "外部链接" : "内部链接"}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={onMoveUp}
          disabled={isFirst}
          className="p-1 rounded-md hover:bg-default-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="上移"
        >
          <svg
            className="w-3 h-3 text-default-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={isLast}
          className="p-1 rounded-md hover:bg-default-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="下移"
        >
          <svg
            className="w-3 h-3 text-default-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="p-1 rounded-md hover:bg-danger-50 text-default-400 hover:text-danger transition-colors"
          title="删除"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── 菜单项组件 ─────────────────────────────────────────────────

function MenuItemCard({
  item,
  index,
  isFirst,
  isLast,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  item: MenuItem;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (updated: MenuItem) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const isDropdown = item.type === "dropdown";

  const handleFieldChange = (field: keyof MenuItem, val: unknown) => {
    onUpdate({ ...item, [field]: val });
  };

  // 子菜单操作
  const subItems = item.items || [];

  const addSubItem = () => {
    onUpdate({ ...item, items: [...subItems, { ...defaultSubItem }] });
  };

  const removeSubItem = (subIndex: number) => {
    onUpdate({ ...item, items: subItems.filter((_, i) => i !== subIndex) });
  };

  const updateSubItem = (subIndex: number, field: keyof MenuSubItem, val: unknown) => {
    const newSubs = [...subItems];
    newSubs[subIndex] = { ...newSubs[subIndex], [field]: val };
    onUpdate({ ...item, items: newSubs });
  };

  const moveSubItem = (from: number, to: number) => {
    const newSubs = [...subItems];
    [newSubs[from], newSubs[to]] = [newSubs[to], newSubs[from]];
    onUpdate({ ...item, items: newSubs });
  };

  return (
    <div className="rounded-xl border border-default-200 bg-background overflow-hidden transition-all duration-200">
      {/* 头部 */}
      <div
        className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-default-50 transition-colors select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <svg
          className={cn("w-4 h-4 text-default-400 transition-transform duration-200 shrink-0", expanded && "rotate-90")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-xs font-mono text-default-400 shrink-0 w-5 text-center">{index + 1}</span>
        <span className="text-sm text-foreground/80 truncate flex-1">
          {item.title || "未命名菜单"}
          <span
            className={cn(
              "ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium",
              isDropdown ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"
            )}
          >
            {isDropdown ? "下拉" : "直链"}
          </span>
        </span>
        <div className="flex items-center gap-0.5 shrink-0" onClick={e => e.stopPropagation()}>
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            className="p-1 rounded-md hover:bg-default-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="上移"
          >
            <svg
              className="w-3.5 h-3.5 text-default-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast}
            className="p-1 rounded-md hover:bg-default-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="下移"
          >
            <svg
              className="w-3.5 h-3.5 text-default-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-1 rounded-md hover:bg-danger-50 text-default-400 hover:text-danger transition-colors"
            title="删除"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 展开内容 */}
      {expanded && (
        <div className="border-t border-default-100 px-3 py-3 space-y-4">
          {/* 基本字段 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <SmallInput
              label="标题"
              value={item.title || ""}
              placeholder="菜单标题"
              onChange={v => handleFieldChange("title", v)}
            />
            <Select
              label="类型"
              labelPlacement="outside"
              size="sm"
              selectedKeys={[item.type || "direct"]}
              onSelectionChange={keys => {
                if (keys === "all") return;
                const selected = Array.from(keys)[0];
                if (selected !== undefined) handleFieldChange("type", String(selected));
              }}
              aria-label="菜单类型"
              classNames={{
                label: "text-xs font-medium text-foreground/60",
                trigger: cn(
                  "bg-default-100/50 border border-default-200 rounded-lg !shadow-none h-8 min-h-8",
                  "data-[hover=true]:border-default-300",
                  "data-[open=true]:!bg-white data-[open=true]:dark:!bg-default-50 data-[open=true]:border-primary data-[open=true]:ring-1 data-[open=true]:ring-primary/20",
                  "transition-all duration-200"
                ),
                value: "text-sm",
                popoverContent: "rounded-xl",
              }}
            >
              <SelectItem key="direct">直链</SelectItem>
              <SelectItem key="dropdown">下拉菜单</SelectItem>
            </Select>
            {!isDropdown && (
              <SmallInput
                label="路径"
                value={item.path || ""}
                placeholder="/path"
                onChange={v => handleFieldChange("path", v)}
              />
            )}
            <SmallInput
              label="图标"
              value={item.icon || ""}
              placeholder="图标名称"
              onChange={v => handleFieldChange("icon", v)}
            />
          </div>

          {/* 外部链接开关 */}
          {!isDropdown && (
            <div className="flex items-center justify-between py-1">
              <label className="text-xs font-medium text-foreground/60">外部链接</label>
              <Switch
                size="sm"
                isSelected={!!item.isExternal}
                onValueChange={checked => handleFieldChange("isExternal", checked)}
                aria-label="外部链接"
                classNames={{
                  wrapper: "group-data-[selected=true]:bg-primary",
                }}
              />
            </div>
          )}

          {/* 下拉子菜单 */}
          {isDropdown && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h6 className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">子菜单项</h6>
                <span className="text-xs text-default-400">{subItems.length} 项</span>
              </div>
              {subItems.length > 0 ? (
                <div className="flex flex-col gap-1.5">
                  {subItems.map((sub, subIdx) => (
                    <SubItemRow
                      key={subIdx}
                      item={sub}
                      index={subIdx}
                      isFirst={subIdx === 0}
                      isLast={subIdx === subItems.length - 1}
                      onUpdate={(field, val) => updateSubItem(subIdx, field, val)}
                      onRemove={() => removeSubItem(subIdx)}
                      onMoveUp={() => moveSubItem(subIdx, subIdx - 1)}
                      onMoveDown={() => moveSubItem(subIdx, subIdx + 1)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border-2 border-dashed border-default-200 py-3 text-center">
                  <p className="text-xs text-default-400">暂无子菜单项</p>
                </div>
              )}
              <button
                type="button"
                onClick={addSubItem}
                className={cn(
                  "flex items-center justify-center gap-1 w-full rounded-lg border-2 border-dashed border-default-200 py-1.5",
                  "text-xs text-default-500 hover:text-primary hover:border-primary/50 hover:bg-primary/5",
                  "transition-all duration-200"
                )}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                添加子菜单项
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── 主组件 ───────────────────────────────────────────────────────

export function HeaderMenuEditor({ label, description, value, onValueChange, className }: HeaderMenuEditorProps) {
  const items = React.useMemo(() => parseMenuArray(value), [value]);

  const updateItems = React.useCallback(
    (newItems: MenuItem[]) => {
      onValueChange?.(JSON.stringify(newItems, null, 2));
    },
    [onValueChange]
  );

  const handleAdd = () => {
    updateItems([...items, { ...defaultMenuItem }]);
  };

  const handleRemove = (index: number) => {
    updateItems(items.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, updated: MenuItem) => {
    const newItems = [...items];
    newItems[index] = updated;
    updateItems(newItems);
  };

  const handleMove = (from: number, to: number) => {
    const newItems = [...items];
    [newItems[from], newItems[to]] = [newItems[to], newItems[from]];
    updateItems(newItems);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground/70">{label}</label>
          <span className="text-xs text-default-400">{items.length} 项</span>
        </div>
      )}

      {items.length > 0 ? (
        <div className="flex flex-col gap-2">
          {items.map((item, index) => (
            <MenuItemCard
              key={index}
              item={item}
              index={index}
              isFirst={index === 0}
              isLast={index === items.length - 1}
              onUpdate={updated => handleUpdate(index, updated)}
              onRemove={() => handleRemove(index)}
              onMoveUp={() => handleMove(index, index - 1)}
              onMoveDown={() => handleMove(index, index + 1)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-default-200 py-6 text-center">
          <p className="text-sm text-default-400">暂无菜单项</p>
        </div>
      )}

      <button
        type="button"
        onClick={handleAdd}
        className={cn(
          "flex items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-default-200 py-2",
          "text-sm text-default-500 hover:text-primary hover:border-primary/50 hover:bg-primary/5",
          "transition-all duration-200"
        )}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        添加菜单项
      </button>

      {description && <p className="text-xs text-default-400">{description}</p>}
    </div>
  );
}
