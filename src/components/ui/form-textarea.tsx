"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormTextareaProps {
  /** 输入框上方的标签 */
  label?: string;
  /** 占位符文本 */
  placeholder?: string;
  /** 受控值 */
  value?: string;
  /** 值变化回调（兼容 HeroUI onValueChange） */
  onValueChange?: (value: string) => void;
  /** 是否必填（label 后显示红色星号） */
  isRequired?: boolean;
  /** 输入框下方描述文本 */
  description?: string;
  /** 错误提示（非空时显示错误状态） */
  error?: string;
  /** 最小行数 */
  minRows?: number;
  /** 最大行数 */
  maxRows?: number;
  /** 最大字符数 */
  maxLength?: number;
  /** 禁用状态 */
  disabled?: boolean;
  /** 容器额外 className */
  className?: string;
  /** textarea 额外 className */
  textareaClassName?: string;
}

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      label,
      placeholder,
      value,
      onValueChange,
      isRequired,
      description,
      error,
      minRows = 3,
      maxRows,
      maxLength,
      disabled,
      className,
      textareaClassName,
    },
    ref
  ) => {
    const id = React.useId();
    const descId = `${id}-desc`;
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    // 合并外部 ref 和内部 ref
    const setRefs = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        textareaRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
        }
      },
      [ref]
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onValueChange?.(e.target.value);
      autoResize();
    };

    // 自动调整高度
    const autoResize = React.useCallback(() => {
      const el = textareaRef.current;
      if (!el) return;

      // 重置高度以获取正确的 scrollHeight
      el.style.height = "auto";

      const lineHeight = parseInt(getComputedStyle(el).lineHeight) || 20;
      const minHeight = minRows * lineHeight + 16; // 16 = py padding
      const maxHeight = maxRows ? maxRows * lineHeight + 16 : Infinity;

      const newHeight = Math.min(Math.max(el.scrollHeight, minHeight), maxHeight);
      el.style.height = `${newHeight}px`;
    }, [minRows, maxRows]);

    // 初始化时和 value 变化时调整高度
    React.useEffect(() => {
      autoResize();
    }, [value, autoResize]);

    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        {/* Label */}
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-foreground/80">
            {label}
            {isRequired && <span className="text-danger ml-0.5">*</span>}
          </label>
        )}

        {/* Textarea */}
        <textarea
          ref={setRefs}
          id={id}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          rows={minRows}
          aria-invalid={!!error}
          aria-describedby={description || error ? descId : undefined}
          onChange={handleChange}
          className={cn(
            "w-full rounded-xl border px-3.5 py-2.5 text-sm text-foreground/90 resize-none",
            "outline-none transition-all duration-200",
            "placeholder:text-default-400/80",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-danger bg-danger-50/50 focus:border-danger focus:ring-1 focus:ring-danger/20"
              : "border-default-200/80 bg-white dark:bg-default-100/50 hover:border-default-300/90 focus:bg-white dark:focus:bg-default-100/60 focus:border-primary/65 focus:ring-2 focus:ring-primary/15",
            textareaClassName
          )}
        />

        {/* Description / Error */}
        {(description || error) && (
          <p
            id={descId}
            role={error ? "alert" : undefined}
            className={cn("text-xs leading-relaxed", error ? "text-danger" : "text-default-400")}
          >
            {error || description}
          </p>
        )}
      </div>
    );
  }
);
FormTextarea.displayName = "FormTextarea";

export { FormTextarea };
