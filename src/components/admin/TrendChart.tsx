"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import { TrendingUp } from "lucide-react";

interface TrendData {
  date: string;
  views: number;
  visitors: number;
}

interface TrendChartProps {
  data: TrendData[];
}

export function TrendChart({ data }: TrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="bg-card border border-border">
        <CardHeader className="pb-0">
          <h3 className="text-lg font-semibold">访问趋势</h3>
        </CardHeader>
        <CardBody className="flex items-center justify-center py-10">
          <div className="text-center text-muted-foreground">
            <TrendingUp className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>暂无数据</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  // 计算最大值用于归一化
  const maxViews = Math.max(...data.map((d) => d.views), 1);
  const maxVisitors = Math.max(...data.map((d) => d.visitors), 1);

  return (
    <Card className="bg-card border border-border">
      <CardHeader className="flex justify-between items-center pb-0">
        <h3 className="text-lg font-semibold">访问趋势</h3>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-primary" />
            浏览量
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-success" />
            访客数
          </span>
        </div>
      </CardHeader>
      <CardBody className="pt-4">
        {/* 简单的 CSS 柱状图 */}
        <div className="h-48 flex items-end gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end gap-1 h-40">
                {/* 浏览量柱 */}
                <div
                  className="flex-1 bg-primary/80 rounded-t transition-all hover:bg-primary"
                  style={{
                    height: `${(item.views / maxViews) * 100}%`,
                    minHeight: item.views > 0 ? "4px" : "0",
                  }}
                  title={`浏览量: ${item.views}`}
                />
                {/* 访客数柱 */}
                <div
                  className="flex-1 bg-success/80 rounded-t transition-all hover:bg-success"
                  style={{
                    height: `${(item.visitors / maxVisitors) * 100}%`,
                    minHeight: item.visitors > 0 ? "4px" : "0",
                  }}
                  title={`访客数: ${item.visitors}`}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {item.date.slice(5)}
              </span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
