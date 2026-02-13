"use client";

import * as React from "react";
import { Input } from "@heroui/react";
import { AnimatePresence, motion, Reorder, useDragControls } from "framer-motion";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormIconSelector } from "@/components/ui/form-icon-selector";

// ─── 类型 ──────────────────────────────────────────────────────────

interface NavSubItem {
  name: string;
  link: string;
  icon: string;
}

interface NavGroup {
  title: string;
  items: NavSubItem[];
  _id?: string;
}

interface NavMenuEditorProps {
  label?: string;
  description?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

// ─── 工具函数 ──────────────────────────────────────────────────────

function parseNavGroups(value: string | undefined): NavGroup[] {
  if (value == null) return [];
  if (Array.isArray(value)) return value as unknown as NavGroup[];
  if (typeof value === "object") return [];
  if (!value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((g: NavGroup) => ({ ...g }));
  } catch {
    return [];
  }
}

function ensureStableNavGroupIds(nextGroups: NavGroup[], prevGroups: NavGroup[] = []): NavGroup[] {
  return nextGroups.map((group, index) => ({
    ...group,
    _id: group._id || prevGroups[index]?._id || `ng-${index}-${Math.random().toString(36).slice(2)}`,
  }));
}

function serializeNavGroups(groups: NavGroup[]): string {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- omit _id for serialization
  const strip = groups.map(({ _id: _, ...rest }) => rest);
  return JSON.stringify(strip, null, 2);
}

const ICON_BUTTON_CLASS = cn(
  "inline-flex h-7 w-7 items-center justify-center rounded-lg border border-transparent",
  "text-default-500 transition-all duration-200",
  "hover:border-default-200 hover:bg-background hover:text-foreground",
  "disabled:cursor-not-allowed disabled:opacity-35"
);

const DANGER_ICON_BUTTON_CLASS = cn(
  "inline-flex h-7 w-7 items-center justify-center rounded-lg border border-transparent",
  "text-default-400 transition-all duration-200",
  "hover:border-danger/20 hover:bg-danger-50 hover:text-danger"
);

const DASHED_ADD_BUTTON_CLASS = cn(
  "flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-default-300/80 bg-background/80",
  "py-2 text-xs font-medium text-default-600 transition-all duration-200",
  "hover:border-primary/45 hover:bg-primary/5 hover:text-primary"
);

// ─── 输入框 ─────────────────────────────────────────────────────

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
        label: "text-[11px] font-medium tracking-wide text-foreground/60",
        inputWrapper: cn(
          "h-9 min-h-9 rounded-xl border border-default-200/80 bg-white dark:bg-default-100/50 shadow-none!",
          "data-[hover=true]:bg-white! dark:data-[hover=true]:bg-default-100/60 data-[hover=true]:border-default-300/90",
          "group-data-[focus=true]:bg-white! dark:group-data-[focus=true]:bg-default-100/60 group-data-[focus=true]:border-primary/65 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-primary/15",
          "transition-all duration-200"
        ),
        input: "text-sm text-foreground/90 placeholder:text-default-400/80",
      }}
    />
  );
}

// ─── 子项行 ─────────────────────────────────────────────────────

function NavSubItemRow({
  item,
  index,
  isFirst,
  isLast,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  item: NavSubItem;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (field: keyof NavSubItem, val: string) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-default-200/75 bg-default-50/35 p-3 transition-colors hover:border-default-300/80 hover:bg-default-50/60">
      <span className="mt-2 inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-background text-[11px] font-medium text-default-500 ring-1 ring-default-200/80">
        {index + 1}
      </span>
      <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-3">
        <SmallInput label="名称" value={item.name || ""} placeholder="链接名称" onChange={v => onUpdate("name", v)} />
        <SmallInput
          label="链接"
          value={item.link || ""}
          placeholder="https://..."
          onChange={v => onUpdate("link", v)}
        />
        <div className="flex flex-col gap-[5px]">
          <label className="text-[11px] font-medium tracking-wide text-foreground/60">图标</label>
          <FormIconSelector
            value={item.icon || ""}
            onValueChange={v => onUpdate("icon", v)}
            placeholder="选择图标或输入 URL"
            size="sm"
          />
        </div>
      </div>
      <div className="mt-5 flex shrink-0 items-center gap-1.5">
        <button type="button" onClick={onMoveUp} disabled={isFirst} className={ICON_BUTTON_CLASS}>
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
        <button type="button" onClick={onMoveDown} disabled={isLast} className={ICON_BUTTON_CLASS}>
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
        <button type="button" onClick={onRemove} className={DANGER_ICON_BUTTON_CLASS}>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── 分组卡片 ────────────────────────────────────────────────────

function NavGroupCard({
  group,
  index,
  isFirst,
  isLast,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  reorderValue,
}: {
  group: NavGroup;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (updated: NavGroup) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  reorderValue?: NavGroup;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const dragControls = useDragControls();
  const subItems = group.items || [];

  const addSubItem = () => {
    onUpdate({ ...group, items: [...subItems, { name: "", link: "", icon: "" }] });
  };

  const removeSubItem = (subIdx: number) => {
    onUpdate({ ...group, items: subItems.filter((_, i) => i !== subIdx) });
  };

  const updateSubItem = (subIdx: number, field: keyof NavSubItem, val: string) => {
    const newSubs = [...subItems];
    newSubs[subIdx] = { ...newSubs[subIdx], [field]: val };
    onUpdate({ ...group, items: newSubs });
  };

  const moveSubItem = (from: number, to: number) => {
    const newSubs = [...subItems];
    [newSubs[from], newSubs[to]] = [newSubs[to], newSubs[from]];
    onUpdate({ ...group, items: newSubs });
  };

  const content = (
    <div className="overflow-hidden rounded-2xl border border-default-200/75 bg-background/95 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.6)] transition-all duration-200 hover:border-default-300/85">
      {/* 头部 */}
      <div
        className="flex cursor-pointer select-none items-center gap-2.5 bg-linear-to-r from-default-50/60 via-default-50/20 to-transparent px-3.5 py-2.5 transition-colors hover:from-default-100/55"
        onClick={() => setExpanded(!expanded)}
      >
        {reorderValue != null && (
          <div
            onPointerDown={e => {
              e.stopPropagation();
              dragControls.start(e);
            }}
            className="flex w-8 shrink-0 touch-none items-center justify-center self-stretch rounded-lg text-default-400 transition-colors hover:bg-background/80 hover:text-foreground active:cursor-grabbing"
            onClick={e => e.stopPropagation()}
          >
            <GripVertical className="w-4 h-4" />
          </div>
        )}
        <svg
          className={cn("w-4 h-4 text-default-400 transition-transform duration-200 shrink-0", expanded && "rotate-90")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full border border-default-200/80 bg-background text-[11px] font-semibold text-default-500">
          {index + 1}
        </span>
        <span className="flex flex-1 items-center gap-2 truncate text-sm font-medium text-foreground/85">
          {group.title || "未命名分组"}
          <span className="rounded-full bg-default-100/70 px-2 py-0.5 text-[11px] font-normal text-default-500">
            {subItems.length} 项
          </span>
        </span>
        <div className="flex shrink-0 items-center gap-1" onClick={e => e.stopPropagation()}>
          <button type="button" onClick={onMoveUp} disabled={isFirst} className={ICON_BUTTON_CLASS}>
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
          <button type="button" onClick={onMoveDown} disabled={isLast} className={ICON_BUTTON_CLASS}>
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
          <button type="button" onClick={onRemove} className={DANGER_ICON_BUTTON_CLASS}>
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
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-3.5 border-t border-default-200/70 bg-default-50/18 px-3.5 py-3.5">
              <SmallInput
                label="分组标题"
                value={group.title || ""}
                placeholder="例如：常用工具"
                onChange={v => onUpdate({ ...group, title: v })}
              />

              <div className="space-y-2.5">
                {subItems.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {subItems.map((sub, subIdx) => (
                      <NavSubItemRow
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
                  <div className="rounded-xl border border-dashed border-default-300/80 bg-background/70 py-4 text-center">
                    <p className="text-xs text-default-500">暂无链接，点击下方添加</p>
                  </div>
                )}
                <button type="button" onClick={addSubItem} className={DASHED_ADD_BUTTON_CLASS}>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  添加链接
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (reorderValue != null) {
    return (
      <Reorder.Item value={reorderValue} dragListener={false} dragControls={dragControls} className="relative">
        {content}
      </Reorder.Item>
    );
  }
  return content;
}

// ─── 主组件 ───────────────────────────────────────────────────────

export function NavMenuEditor({ label, description, value, onValueChange, className }: NavMenuEditorProps) {
  const [groups, setGroups] = React.useState<NavGroup[]>(() => ensureStableNavGroupIds(parseNavGroups(value)));

  React.useEffect(() => {
    setGroups(prevGroups => {
      const parsedGroups = parseNavGroups(value);
      const nextGroups = ensureStableNavGroupIds(parsedGroups, prevGroups);
      return serializeNavGroups(nextGroups) === serializeNavGroups(prevGroups) ? prevGroups : nextGroups;
    });
  }, [value]);

  const updateGroups = React.useCallback(
    (newGroups: NavGroup[]) => {
      setGroups(newGroups);
      onValueChange?.(serializeNavGroups(newGroups));
    },
    [onValueChange]
  );

  const handleAdd = () => {
    updateGroups([...groups, { title: "", items: [], _id: `ng-${Date.now()}-${Math.random().toString(36).slice(2)}` }]);
  };

  const handleRemove = (index: number) => {
    updateGroups(groups.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, updated: NavGroup) => {
    const newGroups = [...groups];
    newGroups[index] = { ...updated, _id: groups[index]._id };
    updateGroups(newGroups);
  };

  const handleMove = (from: number, to: number) => {
    const newGroups = [...groups];
    [newGroups[from], newGroups[to]] = [newGroups[to], newGroups[from]];
    updateGroups(newGroups);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-default-200/70 bg-linear-to-b from-background to-default-50/25 p-4 shadow-[0_12px_36px_-30px_rgba(15,23,42,0.7)] md:p-5",
        className
      )}
    >
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold tracking-tight text-foreground/80">{label}</label>
          <span className="rounded-full bg-default-100/70 px-2 py-0.5 text-[11px] font-medium text-default-500">
            {groups.length} 组
          </span>
        </div>
      )}

      {groups.length > 0 ? (
        <Reorder.Group axis="y" values={groups} onReorder={updateGroups} className="flex flex-col gap-2.5">
          {groups.map((group, index) => (
            <NavGroupCard
              key={group._id ?? index}
              group={group}
              index={index}
              isFirst={index === 0}
              isLast={index === groups.length - 1}
              onUpdate={updated => handleUpdate(index, updated)}
              onRemove={() => handleRemove(index)}
              onMoveUp={() => handleMove(index, index - 1)}
              onMoveDown={() => handleMove(index, index + 1)}
              reorderValue={group}
            />
          ))}
        </Reorder.Group>
      ) : (
        <div className="rounded-2xl border border-dashed border-default-300/80 bg-background/70 py-8 text-center">
          <p className="text-sm text-default-500">暂无菜单分组</p>
          <p className="mt-1 text-xs text-default-400">点击下方添加菜单分组</p>
        </div>
      )}

      <button
        type="button"
        onClick={handleAdd}
        className={cn(
          "flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-default-300/80 bg-background/80 py-2.5",
          "text-sm font-medium text-default-600 transition-all duration-200",
          "hover:border-primary/45 hover:bg-primary/5 hover:text-primary"
        )}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        添加菜单分组
      </button>

      {description && <p className="text-xs leading-relaxed text-default-400">{description}</p>}
    </div>
  );
}
