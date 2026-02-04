"use client";

import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";

// 访问来源数据
interface SourceData {
  name: string;
  value: number;
  percentage: number;
}

// 设备数据
interface DeviceData {
  name: string;
  value: number;
  percentage: number;
  icon: string;
}

// 浏览器数据
interface BrowserData {
  name: string;
  value: number;
  percentage: number;
  icon: string;
}

interface SourceChartProps {
  data: SourceData[];
  className?: string;
}

interface DeviceChartProps {
  data: DeviceData[];
  className?: string;
}

interface BrowserChartProps {
  data: BrowserData[];
  className?: string;
}

// 来源颜色
const sourceColors = ["bg-primary", "bg-green-500", "bg-orange-500", "bg-purple-500", "bg-cyan-500", "bg-pink-500"];

const sourceTextColors = [
  "text-primary",
  "text-green-500",
  "text-orange-500",
  "text-purple-500",
  "text-cyan-500",
  "text-pink-500",
];

/**
 * 访问来源饼图
 */
export function SourceChart({ data, className }: SourceChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = 16;
  const innerRadius = 10;
  const cx = 16;
  const cy = 16;

  // 预先计算所有扇形的路径数据
  const arcData = (() => {
    const result: Array<{ name: string; path: string; colorIndex: number }> = [];
    let currentAngle = -Math.PI / 2; // 从顶部开始

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const percent = total > 0 ? item.value / total : 0;
      const angle = percent * Math.PI * 2;
      const startAngle = currentAngle;
      // 处理接近 100% 的情况，避免完整圆形路径问题
      const endAngle = percent > 0.99 ? startAngle + Math.PI * 1.9999 : currentAngle + angle;

      // 计算扇形路径
      const startOuter = { x: cx + radius * Math.cos(startAngle), y: cy + radius * Math.sin(startAngle) };
      const endOuter = { x: cx + radius * Math.cos(endAngle), y: cy + radius * Math.sin(endAngle) };
      const startInner = { x: cx + innerRadius * Math.cos(endAngle), y: cy + innerRadius * Math.sin(endAngle) };
      const endInner = { x: cx + innerRadius * Math.cos(startAngle), y: cy + innerRadius * Math.sin(startAngle) };
      const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

      const path = `M ${startOuter.x} ${startOuter.y} A ${radius} ${radius} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y} L ${startInner.x} ${startInner.y} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${endInner.x} ${endInner.y} Z`;

      result.push({ name: item.name, path, colorIndex: i });
      currentAngle += angle;
    }
    return result;
  })();

  return (
    <div className={cn("bg-card border border-border rounded-xl p-5 flex flex-col min-h-0", className)}>
      <h3 className="text-base font-semibold mb-4 shrink-0">访问来源</h3>

      <div className="flex items-center gap-6 flex-1 min-h-0">
        {/* 饼图 */}
        <div className="relative w-28 h-28 shrink-0">
          <svg viewBox="0 0 32 32" className="w-full h-full">
            {arcData.map(arc => (
              <path
                key={arc.name}
                d={arc.path}
                className={sourceTextColors[arc.colorIndex % sourceTextColors.length]}
                fill="currentColor"
              />
            ))}
          </svg>
          {/* 中心显示总数 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-semibold">{total.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">总访问</p>
            </div>
          </div>
        </div>

        {/* 图例 */}
        <div className="flex-1 space-y-2">
          {data.slice(0, 5).map((item, index) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className={cn("w-2 h-2 rounded-full", sourceColors[index % sourceColors.length])} />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
              <span className="font-medium">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 设备分布图
 */
export function DeviceChart({ data, className }: DeviceChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  // 为不同设备设置不同颜色
  const deviceColors = ["bg-primary", "bg-blue-500", "bg-cyan-500"];

  return (
    <div className={cn("bg-card border border-border rounded-xl p-5", className)}>
      <h3 className="text-base font-semibold mb-4">设备分布</h3>

      <div className="space-y-5">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-3">
            {/* 图标 + 名称：固定宽度 */}
            <div className="flex items-center gap-2 shrink-0 w-24">
              <Icon icon={item.icon} className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm">{item.name}</span>
            </div>
            {/* 进度条：占满中间，与右侧百分比对齐 */}
            <div className="flex-1 min-w-0 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  deviceColors[index % deviceColors.length]
                )}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
            {/* 百分比：固定宽度右对齐 */}
            <span className="text-sm font-medium w-12 text-right shrink-0 tabular-nums">{item.percentage}%</span>
          </div>
        ))}

        {/* 总计 - 与上方百分比列对齐 */}
        <div className="flex items-center gap-3 pt-3 border-t border-border/50 text-sm">
          <span className="text-muted-foreground shrink-0 w-24">总访问</span>
          <div className="flex-1 min-w-0" />
          <span className="font-semibold w-12 text-right shrink-0 tabular-nums">{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * 浏览器分布图
 */
export function BrowserChart({ data, className }: BrowserChartProps) {
  return (
    <div className={cn("bg-card border border-border rounded-xl p-5", className)}>
      <h3 className="text-base font-semibold mb-4">浏览器分布</h3>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-3">
            <Icon icon={item.icon} className="w-5 h-5 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm truncate">{item.name}</span>
                <span className="text-sm text-muted-foreground ml-2">{item.percentage}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    sourceColors[index % sourceColors.length]
                  )}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
