"use client";

import { TrendingUp } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: { value: number; isUp: boolean };
  color: "primary" | "success" | "warning" | "danger";
}

const colorClasses: Record<string, string> = {
  primary: "bg-blue-500/10 text-blue-500",
  success: "bg-green-500/10 text-green-500",
  warning: "bg-orange-500/10 text-orange-500",
  danger: "bg-red-500/10 text-red-500",
};

export function StatsCard({ title, value, icon, trend, color }: StatsCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold">{formatNumber(value)}</p>
          {trend && (
            <p
              className={`text-xs mt-1 flex items-center gap-1 ${
                trend.isUp ? "text-green-500" : "text-red-500"
              }`}
            >
              <TrendingUp
                className={`w-3 h-3 ${!trend.isUp && "rotate-180"}`}
              />
              {trend.value}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
