"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { cn, formatNumber } from "@/lib/utils";

interface TrendData {
  date: string;
  views: number;
  visitors: number;
}

interface VisitTrendChartProps {
  data: TrendData[];
  className?: string;
}

type TimeRange = "7d" | "30d";

export function VisitTrendChart({ data, className }: VisitTrendChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 根据时间范围筛选数据
  const displayData = timeRange === "7d" ? data.slice(-7) : data;

  const maxValue = Math.max(...displayData.map(d => Math.max(d.views, d.visitors)), 1);

  // 计算总数和平均值
  const totalViews = displayData.reduce((sum, d) => sum + d.views, 0);
  const totalVisitors = displayData.reduce((sum, d) => sum + d.visitors, 0);
  const avgViews = Math.round(totalViews / displayData.length);

  return (
    <div className={cn("bg-card border border-border rounded-xl", className)}>
      {/* 头部 */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold">访问趋势</h3>
            <p className="text-sm text-muted-foreground mt-0.5">网站流量数据统计</p>
          </div>

          {/* 时间范围切换 */}
          <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
            <button
              onClick={() => setTimeRange("7d")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                timeRange === "7d" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              7 天
            </button>
            <button
              onClick={() => setTimeRange("30d")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                timeRange === "30d"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              30 天
            </button>
          </div>
        </div>

        {/* 数据摘要 */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="space-y-1">
            <p className="text-2xl font-semibold">{formatNumber(totalViews)}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary/30" />
              浏览量
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-semibold text-primary">{formatNumber(totalVisitors)}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary" />
              访客数
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-semibold">{formatNumber(avgViews)}</p>
            <p className="text-xs text-muted-foreground">日均浏览</p>
          </div>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="px-5 pb-5">
        {/* 悬停提示 */}
        <div className="h-6 mb-2">
          {hoveredIndex !== null && displayData[hoveredIndex] && (
            <div className="flex items-center gap-4 text-xs">
              <span className="text-muted-foreground">{displayData[hoveredIndex].date}</span>
              <span className="flex items-center gap-1">
                <Icon icon="ri:eye-line" className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-medium">{formatNumber(displayData[hoveredIndex].views)}</span>
              </span>
              <span className="flex items-center gap-1">
                <Icon icon="ri:user-line" className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium text-primary">{formatNumber(displayData[hoveredIndex].visitors)}</span>
              </span>
            </div>
          )}
        </div>

        {/* 柱状图 */}
        <div className="h-44 flex items-end gap-1">
          {displayData.map((item, index) => {
            const viewsHeight = (item.views / maxValue) * 100;
            const visitorsHeight = (item.visitors / maxValue) * 100;

            return (
              <div
                key={index}
                className="flex-1 flex items-end justify-center gap-0.5 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* 浏览量柱 */}
                <div
                  className={cn(
                    "w-full max-w-[12px] rounded-t transition-all duration-150",
                    hoveredIndex === index ? "bg-primary/40" : "bg-primary/20"
                  )}
                  style={{ height: `${Math.max(viewsHeight, 2)}%` }}
                />
                {/* 访客柱 */}
                <div
                  className={cn(
                    "w-full max-w-[12px] rounded-t transition-all duration-150",
                    hoveredIndex === index ? "bg-primary" : "bg-primary/70"
                  )}
                  style={{ height: `${Math.max(visitorsHeight, 2)}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* X 轴标签 */}
        <div className="flex justify-between mt-3 pt-3 border-t border-border/50">
          {displayData.length <= 10
            ? displayData.map((item, index) => (
                <span
                  key={index}
                  className={cn(
                    "text-[10px] text-muted-foreground transition-colors",
                    hoveredIndex === index && "text-foreground font-medium"
                  )}
                >
                  {item.date}
                </span>
              ))
            : // 超过 10 个数据点时只显示首尾和中间的标签
              [0, Math.floor(displayData.length / 2), displayData.length - 1].map(i => (
                <span key={i} className="text-[10px] text-muted-foreground">
                  {displayData[i]?.date}
                </span>
              ))}
        </div>
      </div>
    </div>
  );
}
