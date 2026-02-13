"use client";

import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  /** 区域标题 */
  title: string;
  /** 区域描述 */
  description?: string;
  /** 子内容 */
  children: React.ReactNode;
  /** 额外 className */
  className?: string;
}

/**
 * 设置表单区域分组组件
 * 用于将相关的设置项分组显示，采用简洁的视觉分隔
 */
export function SettingsSection({ title, description, children, className }: SettingsSectionProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-default-200/50 bg-white dark:bg-content1 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
        className
      )}
    >
      <div className="pb-3 mb-4 border-b border-default-200/40">
        <h3 className="text-[14px] font-semibold text-foreground/85 tracking-tight">{title}</h3>
        {description && <p className="text-xs text-default-400 mt-1 leading-relaxed">{description}</p>}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

interface SettingsFieldGroupProps {
  /** 子内容 */
  children: React.ReactNode;
  /** 列数 */
  cols?: 1 | 2 | 3;
  /** 额外 className */
  className?: string;
}

const colsClassMap = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
};

/**
 * 设置字段分组（用于并排显示多个字段）
 */
export function SettingsFieldGroup({ children, cols = 2, className }: SettingsFieldGroupProps) {
  return <div className={cn("grid gap-x-5 gap-y-5 min-w-0", colsClassMap[cols], className)}>{children}</div>;
}
