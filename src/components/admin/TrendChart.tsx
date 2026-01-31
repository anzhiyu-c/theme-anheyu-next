"use client";

interface TrendData {
  date: string;
  views: number;
  visitors: number;
}

interface TrendChartProps {
  data: TrendData[];
}

export function TrendChart({ data }: TrendChartProps) {
  const maxViews = Math.max(...data.map((d) => d.views));

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border">
        <p className="text-lg font-semibold">访问趋势</p>
        <p className="text-small text-muted-foreground">最近 7 天的访问数据</p>
      </div>
      <div className="p-4">
        <div className="h-48 flex items-end justify-between gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary/30"
                style={{ height: `${(item.views / maxViews) * 100}%` }}
              >
                <div
                  className="w-full bg-primary rounded-t-lg"
                  style={{ height: `${(item.visitors / item.views) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{item.date}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary/20" />
            <span className="text-muted-foreground">浏览量</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary" />
            <span className="text-muted-foreground">访客</span>
          </div>
        </div>
      </div>
    </div>
  );
}
