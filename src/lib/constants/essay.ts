/**
 * 即刻(说说)状态常量
 * 集中定义，避免在多个组件中重复
 */

/** 状态值枚举 */
export const ESSAY_STATUS = {
  PUBLISHED: 1,
  DRAFT: 2,
  HIDDEN: 3,
} as const;

export type EssayStatusValue = (typeof ESSAY_STATUS)[keyof typeof ESSAY_STATUS];

/** 状态配置 - 含标签、颜色样式 */
export const ESSAY_STATUS_CONFIG: Record<number, { label: string; className: string }> = {
  [ESSAY_STATUS.PUBLISHED]: {
    label: "已发布",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  [ESSAY_STATUS.DRAFT]: {
    label: "草稿",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  },
  [ESSAY_STATUS.HIDDEN]: {
    label: "隐藏",
    className: "bg-zinc-100 text-zinc-600 dark:bg-zinc-500/15 dark:text-zinc-400",
  },
};

/** 状态选项 - 用于 Select/下拉筛选 */
export const ESSAY_STATUS_OPTIONS = [
  { key: String(ESSAY_STATUS.PUBLISHED), label: "已发布" },
  { key: String(ESSAY_STATUS.DRAFT), label: "草稿" },
  { key: String(ESSAY_STATUS.HIDDEN), label: "隐藏" },
];

/** 获取状态标签 */
export function getEssayStatusLabel(status: number): string {
  return ESSAY_STATUS_CONFIG[status]?.label ?? "未知";
}

/** 获取状态样式 */
export function getEssayStatusClassName(status: number): string {
  return ESSAY_STATUS_CONFIG[status]?.className ?? "bg-zinc-100 text-zinc-600";
}
