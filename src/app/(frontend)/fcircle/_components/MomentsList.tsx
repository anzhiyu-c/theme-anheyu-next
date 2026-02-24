"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { friendsApi } from "@/lib/api/friends";
import { useSiteConfigStore } from "@/store/site-config-store";
import type { Moment, MomentsSortType, MomentsStatistics } from "@/types/friends";
import { MomentsFooter } from "./MomentsFooter";
import { MomentsItem } from "./MomentsItem";
import { RandomPost } from "./RandomPost";

const EMPTY_STATISTICS: MomentsStatistics = {
  total_links: 0,
  active_links: 0,
  total_moments: 0,
  last_updated_time: "",
};

export function MomentsList() {
  const displayLimit = useSiteConfigStore(state => state.siteConfig?.moments?.display_limit);
  const pageSize = useMemo(() => {
    if (typeof displayLimit === "number" && displayLimit > 0) {
      return displayLimit;
    }
    return 24;
  }, [displayLimit]);

  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortType, setSortType] = useState<MomentsSortType>("published_at");
  const [statistics, setStatistics] = useState<MomentsStatistics>(EMPTY_STATISTICS);

  const isEnded = moments.length >= total && total > 0;
  const currentMomentNum = currentPage * pageSize;

  const fetchMomentsList = useCallback(
    async (page: number, nextSortType: MomentsSortType) => {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const data = await friendsApi.getMomentsList(page, pageSize, nextSortType);

        setMoments(prev => (page === 1 ? data.list || [] : [...prev, ...(data.list || [])]));
        setTotal(data.total || 0);
        setStatistics(data.statistics || EMPTY_STATISTICS);
        setCurrentPage(page);
      } catch {
        if (page === 1) {
          setMoments([]);
          setTotal(0);
          setStatistics(EMPTY_STATISTICS);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [pageSize]
  );

  useEffect(() => {
    void fetchMomentsList(1, sortType);
  }, [fetchMomentsList, sortType]);

  const loadMore = useCallback(() => {
    if (!isEnded && !loading && !loadingMore) {
      void fetchMomentsList(currentPage + 1, sortType);
    }
  }, [currentPage, fetchMomentsList, isEnded, loading, loadingMore, sortType]);

  const changeSort = useCallback(
    (nextSortType: MomentsSortType) => {
      if (nextSortType === sortType) {
        return;
      }
      setCurrentPage(1);
      setSortType(nextSortType);
    },
    [sortType]
  );

  return (
    <div className="moments-list">
      <RandomPost />

      <div className="title-section">
        <div className="title-left">
          <h2>🐟 朋友圈</h2>
        </div>
      </div>

      <div className="moments-grid">
        {!loading && moments.length > 0 ? (
          <>
            <MomentsItem moments={moments.slice(0, currentMomentNum)} />

            <div className="moments-more-container">
              {!isEnded && !loadingMore ? (
                <div className="moments-more-btn" onClick={loadMore}>
                  <Icon icon="fa6-solid:angles-down" width={18} height={18} />
                </div>
              ) : null}

              {loadingMore ? (
                <div className="moments-more-btn loading">
                  <Icon icon="fa6-solid:spinner" className="loading-icon" width={18} height={18} />
                </div>
              ) : null}

              {isEnded && !loadingMore ? <div className="moments-empty">------- 没有更多了喔 -------</div> : null}
            </div>

            <MomentsFooter statistics={statistics} sortType={sortType} onChangeSort={changeSort} />
          </>
        ) : null}

        {loading ? (
          <div className="loading-container">
            <Icon icon="fa6-solid:spinner" className="loading-icon" width={32} height={32} />
            <p>加载中...</p>
          </div>
        ) : null}

        {!loading && moments.length === 0 ? <div className="empty-data">暂无朋友圈内容</div> : null}
      </div>
    </div>
  );
}
