"use client";

import * as React from "react";
import { Select, SelectItem, type SelectProps } from "@heroui/react";
import { cn } from "@/lib/utils";

export interface FormSelectProps {
  /** 输入框上方的标签 */
  label?: string;
  /** 占位符文本 */
  placeholder?: string;
  /** 受控选中值（单选） */
  value?: string;
  /** 值变化回调 */
  onValueChange?: (value: string) => void;
  /** 是否必填 */
  isRequired?: boolean;
  /** 下方描述文本 */
  description?: string;
  /** 错误提示 */
  error?: string;
  /** 尺寸 */
  size?: "sm" | "md";
  /** 禁用状态 */
  disabled?: boolean;
  /** 容器额外 className */
  className?: string;
  /** SelectItem 子元素 */
  children: SelectProps["children"];
}

/**
 * 统一风格的下拉选择框
 * 默认灰底填充，展开/聚焦后白底 + 主题色边框
 * 内部使用 HeroUI Select，复用其下拉定位、键盘导航、无障碍能力
 */
function FormSelect({
  label,
  placeholder,
  value,
  onValueChange,
  isRequired,
  description,
  error,
  size = "md",
  disabled,
  className,
  children,
}: FormSelectProps) {
  const id = React.useId();
  const descId = `${id}-desc`;

  const handleSelectionChange = React.useCallback(
    (keys: "all" | Set<React.Key>) => {
      if (keys === "all") return;
      const selected = Array.from(keys)[0];
      if (selected !== undefined) {
        onValueChange?.(String(selected));
      }
    },
    [onValueChange]
  );

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {/* 外部 Label */}
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground/70">
          {label}
          {isRequired && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}

      <Select
        aria-label={label || placeholder || "选择"}
        placeholder={placeholder}
        selectedKeys={value ? [value] : []}
        onSelectionChange={handleSelectionChange}
        isDisabled={disabled}
        size={size === "sm" ? "sm" : "md"}
        aria-describedby={description || error ? descId : undefined}
        classNames={{
          trigger: cn(
            "bg-default-100/50 border border-default-200 rounded-xl !shadow-none",
            "data-[open=true]:!bg-white data-[open=true]:dark:!bg-default-50 data-[open=true]:border-primary data-[open=true]:ring-1 data-[open=true]:ring-primary/20",
            "data-[focus=true]:!bg-white data-[focus=true]:dark:!bg-default-50 data-[focus=true]:border-primary data-[focus=true]:ring-1 data-[focus=true]:ring-primary/20",
            "data-[hover=true]:border-default-300",
            size === "sm" ? "h-9 min-h-9" : "h-10 min-h-10",
            "transition-all duration-200",
            error && "border-danger bg-danger-50/50 data-[open=true]:border-danger data-[open=true]:ring-danger/20"
          ),
          value: "text-sm text-foreground",
          selectorIcon: "text-default-400",
          popoverContent: "rounded-xl",
          innerWrapper: "pl-0.5",
        }}
      >
        {children}
      </Select>

      {/* Description / Error */}
      {(description || error) && (
        <p
          id={descId}
          role={error ? "alert" : undefined}
          className={cn("text-xs", error ? "text-danger" : "text-default-400")}
        >
          {error || description}
        </p>
      )}
    </div>
  );
}

FormSelect.displayName = "FormSelect";

// 重新导出 SelectItem 方便使用方不需要额外导入 HeroUI
const FormSelectItem = SelectItem;

export { FormSelect, FormSelectItem };
