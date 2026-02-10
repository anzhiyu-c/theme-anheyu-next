"use client";

import * as React from "react";
import { Input } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormInputProps {
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
  /** 输入类型 */
  type?: React.HTMLInputTypeAttribute;
  /** 最大字符数 */
  maxLength?: number;
  /** 尺寸 */
  size?: "sm" | "md";
  /** 前缀内容（图标等） */
  startContent?: React.ReactNode;
  /** 后缀内容 */
  endContent?: React.ReactNode;
  /** 禁用状态 */
  disabled?: boolean;
  /** 容器额外 className */
  className?: string;
  /** 输入框额外 className */
  inputClassName?: string;
  /** 键盘事件 */
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /** 自动完成属性，用于控制浏览器自动填充行为 */
  autoComplete?: string;
}

/** 密码可见性切换按钮 */
function PasswordToggle({ visible, onToggle }: { visible: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex items-center justify-center w-7 h-7 -mr-1 rounded-lg shrink-0",
        "text-default-400 hover:text-default-600 dark:hover:text-default-300",
        "hover:bg-default-100 dark:hover:bg-default-200/20",
        "transition-all duration-150 cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50"
      )}
      aria-label={visible ? "隐藏密码" : "显示密码"}
      tabIndex={-1}
    >
      {visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
    </button>
  );
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      placeholder,
      value,
      onValueChange,
      isRequired,
      description,
      error,
      type = "text",
      maxLength,
      size = "md",
      startContent,
      endContent,
      disabled,
      className,
      inputClassName,
      onKeyDown,
      autoComplete,
    },
    ref
  ) => {
    const id = React.useId();
    const descId = `${id}-desc`;
    const isPassword = type === "password";
    const [passwordVisible, setPasswordVisible] = React.useState(false);

    // 密码类型：实际使用的 type 取决于可见性切换状态
    const actualType = isPassword && passwordVisible ? "text" : type;

    // 密码类型自动追加眼睛按钮，与用户传入的 endContent 共存
    const resolvedEndContent = isPassword ? (
      <div className="flex items-center gap-0.5">
        {endContent}
        <PasswordToggle visible={passwordVisible} onToggle={() => setPasswordVisible(v => !v)} />
      </div>
    ) : (
      endContent
    );

    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        {/* 手动放置 Label，不依赖 HeroUI 的 labelPlacement */}
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-foreground/70">
            {label}
            {isRequired && <span className="text-danger ml-0.5">*</span>}
          </label>
        )}

        <Input
          ref={ref}
          id={id}
          placeholder={placeholder}
          value={value}
          onValueChange={onValueChange}
          isInvalid={!!error}
          type={actualType}
          maxLength={maxLength}
          size={size === "sm" ? "sm" : "md"}
          startContent={startContent}
          endContent={resolvedEndContent}
          isDisabled={disabled}
          onKeyDown={onKeyDown}
          autoComplete={autoComplete ?? (isPassword ? "new-password" : undefined)}
          aria-describedby={description || error ? descId : undefined}
          classNames={{
            inputWrapper: cn(
              "bg-default-100/50 border border-default-200 rounded-xl !shadow-none",
              "data-[hover=true]:border-default-300",
              "group-data-[focus=true]:!bg-white group-data-[focus=true]:dark:!bg-default-50 group-data-[focus=true]:border-primary group-data-[focus=true]:ring-1 group-data-[focus=true]:ring-primary/20",
              size === "sm" ? "h-9 min-h-9" : "h-10 min-h-10",
              "transition-all duration-200",
              error &&
                "border-danger bg-danger-50/50 group-data-[focus=true]:border-danger group-data-[focus=true]:ring-danger/20",
              inputClassName
            ),
            input: "text-sm text-foreground placeholder:text-default-400",
          }}
        />

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
);
FormInput.displayName = "FormInput";

export { FormInput };
