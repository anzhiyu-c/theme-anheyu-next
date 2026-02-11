"use client";

import * as React from "react";
import { Input, Switch } from "@heroui/react";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── 类型 ──────────────────────────────────────────────────────────

interface ProjectLink {
  title: string;
  link: string;
  external?: boolean;
}

interface ProjectGroup {
  title: string;
  links: ProjectLink[];
  _id?: string;
}

interface ProjectListEditorProps {
  label?: string;
  description?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

// ─── 工具函数 ──────────────────────────────────────────────────────

function parseGroups(value: string | undefined): ProjectGroup[] {
  if (value == null) return [];
  if (Array.isArray(value)) return value as unknown as ProjectGroup[];
  if (typeof value === "object") return [];
  if (!value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((g: ProjectGroup, i: number) => ({
      ...g,
      _id: g._id || `pg-${i}-${Math.random().toString(36).slice(2)}`,
    }));
  } catch {
    return [];
  }
}

function serializeGroups(groups: ProjectGroup[]): string {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- omit _id for serialization
  const strip = groups.map(({ _id: _, ...rest }) => rest);
  return JSON.stringify(strip, null, 2);
}

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

// ─── 链接行 ─────────────────────────────────────────────────────

function LinkRow({
  item,
  index,
  isFirst,
  isLast,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  item: ProjectLink;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (field: keyof ProjectLink, val: string | boolean) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="flex items-start gap-2 p-2 rounded-lg bg-default-50 border border-default-100">
      <span className="text-xs font-mono text-default-400 mt-2 shrink-0 w-4 text-center">{index + 1}</span>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
        <SmallInput label="标题" value={item.title || ""} placeholder="链接标题" onChange={v => onUpdate("title", v)} />
        <SmallInput
          label="链接"
          value={item.link || ""}
          placeholder="https://..."
          onChange={v => onUpdate("link", v)}
        />
      </div>
      <div className="flex items-center gap-2 shrink-0 mt-5">
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-foreground/60 whitespace-nowrap">新标签页</label>
          <Switch
            size="sm"
            isSelected={!!item.external}
            onValueChange={v => onUpdate("external", v)}
            aria-label="新标签页打开"
            classNames={{ wrapper: "group-data-[selected=true]:bg-primary" }}
          />
        </div>
        <button
          type="button"
          onClick={onMoveUp}
          disabled={isFirst}
          className="p-1 rounded-md hover:bg-default-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── 分组卡片 ────────────────────────────────────────────────────

function GroupCard({
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
  group: ProjectGroup;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (updated: ProjectGroup) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  reorderValue?: ProjectGroup;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const dragControls = useDragControls();
  const links = group.links || [];

  const addLink = () => {
    onUpdate({ ...group, links: [...links, { title: "", link: "", external: false }] });
  };

  const removeLink = (idx: number) => {
    onUpdate({ ...group, links: links.filter((_, i) => i !== idx) });
  };

  const updateLink = (idx: number, field: keyof ProjectLink, val: string | boolean) => {
    const newLinks = [...links];
    newLinks[idx] = { ...newLinks[idx], [field]: val };
    onUpdate({ ...group, links: newLinks });
  };

  const moveLink = (from: number, to: number) => {
    const newLinks = [...links];
    [newLinks[from], newLinks[to]] = [newLinks[to], newLinks[from]];
    onUpdate({ ...group, links: newLinks });
  };

  const content = (
    <div className="rounded-xl border border-default-200 bg-background overflow-hidden">
      <div
        className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-default-50 transition-colors select-none"
        onClick={() => setExpanded(!expanded)}
      >
        {reorderValue != null && (
          <div
            onPointerDown={e => {
              e.stopPropagation();
              dragControls.start(e);
            }}
            className="shrink-0 flex items-center justify-center w-7 self-stretch cursor-grab active:cursor-grabbing touch-none text-default-400 hover:text-foreground"
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
        <span className="text-xs font-mono text-default-400 shrink-0 w-5 text-center">{index + 1}</span>
        <span className="text-sm text-foreground/80 truncate flex-1">
          {group.title || "未命名分组"}
          <span className="ml-2 text-xs text-default-400">({links.length} 条链接)</span>
        </span>
        <div className="flex items-center gap-0.5 shrink-0" onClick={e => e.stopPropagation()}>
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            className="p-1 rounded-md hover:bg-default-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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

      {expanded && (
        <div className="border-t border-default-100 px-3 py-3 space-y-3">
          <SmallInput
            label="分组标题"
            value={group.title || ""}
            placeholder="例如：我的项目"
            onChange={v => onUpdate({ ...group, title: v })}
          />
          <div className="space-y-2">
            {links.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {links.map((link, idx) => (
                  <LinkRow
                    key={idx}
                    item={link}
                    index={idx}
                    isFirst={idx === 0}
                    isLast={idx === links.length - 1}
                    onUpdate={(field, val) => updateLink(idx, field, val)}
                    onRemove={() => removeLink(idx)}
                    onMoveUp={() => moveLink(idx, idx - 1)}
                    onMoveDown={() => moveLink(idx, idx + 1)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-default-200 py-3 text-center">
                <p className="text-xs text-default-400">暂无链接</p>
              </div>
            )}
            <button
              type="button"
              onClick={addLink}
              className={cn(
                "flex items-center justify-center gap-1 w-full rounded-lg border-2 border-dashed border-default-200 py-1.5",
                "text-xs text-default-500 hover:text-primary hover:border-primary/50 hover:bg-primary/5",
                "transition-all duration-200"
              )}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              添加链接
            </button>
          </div>
        </div>
      )}
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

export function ProjectListEditor({ label, description, value, onValueChange, className }: ProjectListEditorProps) {
  const groups = React.useMemo(() => parseGroups(value), [value]);

  const updateGroups = React.useCallback(
    (newGroups: ProjectGroup[]) => {
      onValueChange?.(serializeGroups(newGroups));
    },
    [onValueChange]
  );

  const handleAdd = () => {
    updateGroups([...groups, { title: "", links: [], _id: `pg-${Date.now()}-${Math.random().toString(36).slice(2)}` }]);
  };

  const handleRemove = (index: number) => {
    updateGroups(groups.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, updated: ProjectGroup) => {
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
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground/70">{label}</label>
          <span className="text-xs text-default-400">{groups.length} 组</span>
        </div>
      )}

      {groups.length > 0 ? (
        <Reorder.Group axis="y" values={groups} onReorder={updateGroups} className="flex flex-col gap-2">
          {groups.map((group, index) => (
            <GroupCard
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
        <div className="rounded-xl border-2 border-dashed border-default-200 py-6 text-center">
          <p className="text-sm text-default-400">暂无项目分组</p>
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
        添加项目分组
      </button>

      {description && <p className="text-xs text-default-400">{description}</p>}
    </div>
  );
}
