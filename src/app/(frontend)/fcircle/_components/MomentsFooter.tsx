"use client";

import { Switch } from "@heroui/react";
import type { MomentsSortType, MomentsStatistics } from "@/types/friends";

interface MomentsFooterProps {
  statistics: MomentsStatistics;
  sortType: MomentsSortType;
  onChangeSort: (sortType: MomentsSortType) => void;
}

export function MomentsFooter({ statistics, sortType, onChangeSort }: MomentsFooterProps) {
  const isPublishedSort = sortType === "published_at";

  return (
    <div className="moments-footer">
      <div className="footer-content">
        <div className="footer-info">
          <div className="info-item">
            <span className="label">订阅</span>
            <span className="value">{statistics.total_links}</span>
          </div>
          <div className="info-item">
            <span className="label">活跃</span>
            <span className="value">{statistics.active_links}</span>
          </div>
          <div className="info-item">
            <span className="label">日志</span>
            <span className="value">{statistics.total_moments}</span>
          </div>
        </div>

        <div className="footer-setting">
          <span className="update-time">更新于：{statistics.last_updated_time || "-"}</span>
        </div>

        <div className="footer-sort">
          <div className="moments-switch-wrap">
            <Switch
              aria-label="朋友圈排序切换"
              isSelected={isPublishedSort}
              size="sm"
              classNames={{
                base: "moments-sort-switch",
                wrapper: "moments-sort-switch-wrapper",
                thumb: "moments-sort-switch-thumb",
              }}
              onValueChange={checked => onChangeSort(checked ? "published_at" : "fetched_at")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
