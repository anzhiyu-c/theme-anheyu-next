/**
 * 日期格式化工具函数
 */
import { format, isValid, parseISO, formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

/**
 * 安全格式化日期为中文格式
 * @param dateValue - 日期值，支持字符串、Date 对象、undefined 或 null
 * @param formatStr - 格式化字符串，默认 "yyyy年MM月dd日"
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  dateValue: string | Date | undefined | null,
  formatStr: string = "yyyy年MM月dd日"
): string {
  if (!dateValue) return "未知日期";

  try {
    const date = typeof dateValue === "string" ? parseISO(dateValue) : dateValue;

    if (!isValid(date)) {
      return "未知日期";
    }

    return format(date, formatStr, { locale: zhCN });
  } catch {
    return "未知日期";
  }
}

/**
 * 格式化日期为简短格式 (M/d)
 * @param dateValue - 日期值
 * @returns 格式化后的日期字符串
 */
export function formatDateShort(dateValue: string | Date | undefined | null): string {
  if (!dateValue) return "";

  try {
    const date = typeof dateValue === "string" ? parseISO(dateValue) : dateValue;

    if (!isValid(date)) {
      return "";
    }

    return format(date, "M/d", { locale: zhCN });
  } catch {
    return "";
  }
}

/**
 * 格式化日期为相对时间 (如 "3天前")
 * @param dateValue - 日期值
 * @returns 相对时间字符串
 */
export function formatRelativeTime(dateValue: string | Date | undefined | null): string {
  if (!dateValue) return "";

  try {
    const date = typeof dateValue === "string" ? parseISO(dateValue) : dateValue;

    if (!isValid(date)) {
      return "";
    }

    return formatDistanceToNow(date, { addSuffix: true, locale: zhCN });
  } catch {
    return "";
  }
}

/**
 * 格式化日期为本地化短格式
 * @param dateString - ISO 日期字符串
 * @returns 格式化后的日期字符串
 */
export function formatDateLocale(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}
