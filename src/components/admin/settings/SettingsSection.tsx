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
    <section className={cn("space-y-5", className)}>
      <div className="pb-2">
        <h3 className="text-[15px] font-semibold text-foreground tracking-tight">{title}</h3>
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
  cols?: 1 | 2;
  /** 额外 className */
  className?: string;
}

/**
 * 设置字段分组（用于并排显示多个字段）
 */
export function SettingsFieldGroup({ children, cols = 2, className }: SettingsFieldGroupProps) {
  return (
    <div className={cn("grid gap-x-5 gap-y-5", cols === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1", className)}>
      {children}
    </div>
  );
}
