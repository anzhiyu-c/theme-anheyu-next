"use client";

import { Card, CardBody } from "@heroui/react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import clsx from "clsx";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color?: "primary" | "success" | "warning" | "danger" | "default";
}

const colorClasses = {
  primary: "text-primary bg-primary/10",
  success: "text-success bg-success/10",
  warning: "text-warning bg-warning/10",
  danger: "text-destructive bg-destructive/10",
  default: "text-muted-foreground bg-muted",
};

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "primary",
}: StatsCardProps) {
  return (
    <Card className="bg-card border border-border">
      <CardBody className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold text-foreground">
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            {trend && (
              <div
                className={clsx(
                  "flex items-center gap-1 mt-2 text-xs",
                  trend.isUp ? "text-success" : "text-destructive"
                )}
              >
                {trend.isUp ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>
                  {trend.isUp ? "+" : ""}
                  {trend.value}% 较昨日
                </span>
              </div>
            )}
          </div>
          <div className={clsx("p-3 rounded-lg", colorClasses[color])}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
