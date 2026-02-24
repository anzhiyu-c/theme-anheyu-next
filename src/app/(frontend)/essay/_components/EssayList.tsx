"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { Spinner } from "@/components/ui";
import { usePublicEssays } from "@/hooks/queries/use-essays";
import type { Essay } from "@/lib/api/essay";
import { useSiteConfigStore } from "@/store/site-config-store";
import { EssayItem } from "./EssayItem";
import { EssayPagination } from "./EssayPagination";

const WATERFALL_GAP = 16;

export function EssayList() {
  const essayConfig = useSiteConfigStore(state => state.siteConfig?.essay);

  const pageSize = useMemo(() => {
    const parsed = Number.parseInt(String(essayConfig?.limit ?? "30"), 10);
    return Number.isNaN(parsed) || parsed <= 0 ? 30 : parsed;
  }, [essayConfig?.limit]);

  const [currentPage, setCurrentPage] = useState(1);
  const [layoutReady, setLayoutReady] = useState(false);
  const [itemPositions, setItemPositions] = useState<Record<number, CSSProperties>>({});
  const [waterfallHeight, setWaterfallHeight] = useState(0);

  const waterfallRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const prevColumnCountRef = useRef(3);
  const resizeTimerRef = useRef<number | null>(null);
  const musicRecalculateTimerRef = useRef<number | null>(null);

  const { data, isPending, isError } = usePublicEssays({
    page: currentPage,
    page_size: pageSize,
  });

  const essays = useMemo(() => data?.list ?? [], [data?.list]);
  const total = data?.total ?? 0;
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  useEffect(() => {
    itemRefs.current = new Array(essays.length).fill(null);
  }, [essays.length]);

  const setItemRef = useCallback((element: HTMLLIElement | null, index: number) => {
    itemRefs.current[index] = element;
  }, []);

  const calculateWaterfallLayout = useCallback((forceReset = false) => {
    const container = waterfallRef.current;
    if (!container || itemRefs.current.length === 0) return;

    const containerWidth = container.offsetWidth;
    if (!containerWidth) return;

    let newColumnCount = 3;
    if (containerWidth >= 1200) {
      newColumnCount = 3;
    } else if (containerWidth >= 768) {
      newColumnCount = 2;
    } else {
      newColumnCount = 1;
    }

    const columnChanged = newColumnCount !== prevColumnCountRef.current;
    if (columnChanged || forceReset) {
      setItemPositions({});
    }
    prevColumnCountRef.current = newColumnCount;

    const itemWidth = (containerWidth - WATERFALL_GAP * (newColumnCount - 1)) / newColumnCount;
    const columnHeights = new Array(newColumnCount).fill(0);
    const nextPositions: Record<number, CSSProperties> = {};

    itemRefs.current.forEach((item, index) => {
      if (!item) return;

      const minHeight = Math.min(...columnHeights);
      const minColumnIndex = columnHeights.indexOf(minHeight);
      const left = minColumnIndex * (itemWidth + WATERFALL_GAP);
      const top = columnHeights[minColumnIndex];
      const itemHeight = item.getBoundingClientRect().height;

      nextPositions[index] = {
        position: "absolute",
        width: `${itemWidth}px`,
        left: `${left}px`,
        top: `${top}px`,
        transition: "left 0.3s ease, top 0.3s ease, width 0.3s ease",
      };

      columnHeights[minColumnIndex] = top + itemHeight + WATERFALL_GAP;
    });

    const usedColumnHeights = columnHeights.filter(height => height > 0);
    const maxHeight = usedColumnHeights.length > 0 ? Math.max(...usedColumnHeights) : 0;

    setItemPositions(nextPositions);
    setWaterfallHeight(maxHeight > 0 ? maxHeight - WATERFALL_GAP : 0);
  }, []);

  const waitForImages = useCallback(async () => {
    const container = waterfallRef.current;
    if (!container) return;

    const images = Array.from(container.querySelectorAll("img"));
    if (images.length === 0) return;

    await Promise.all(
      images.map(
        image =>
          new Promise<void>(resolve => {
            if (image.complete && image.naturalHeight !== 0) {
              resolve();
              return;
            }

            let settled = false;

            const finish = () => {
              if (settled) return;
              settled = true;
              image.removeEventListener("load", onLoad);
              image.removeEventListener("error", onError);
              window.clearTimeout(timeoutId);
              resolve();
            };

            const onLoad = () => finish();
            const onError = () => finish();
            const timeoutId = window.setTimeout(finish, 1000);

            image.addEventListener("load", onLoad, { once: true });
            image.addEventListener("error", onError, { once: true });
          })
      )
    );
  }, []);

  useEffect(() => {
    let cancelled = false;

    const runLayout = async () => {
      if (essays.length === 0) {
        setLayoutReady(true);
        setItemPositions({});
        setWaterfallHeight(0);
        return;
      }

      setLayoutReady(false);
      await new Promise<void>(resolve => window.requestAnimationFrame(() => resolve()));
      await waitForImages();
      if (cancelled) return;

      calculateWaterfallLayout(true);
      await new Promise<void>(resolve => window.requestAnimationFrame(() => resolve()));
      if (cancelled) return;

      calculateWaterfallLayout();
      setLayoutReady(true);

      if (currentPage > 1) {
        waterfallRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    void runLayout();

    return () => {
      cancelled = true;
    };
  }, [calculateWaterfallLayout, currentPage, essays, waitForImages]);

  useEffect(() => {
    const container = waterfallRef.current;
    if (!container) return;

    Fancybox.bind(container, "[data-fancybox]");

    return () => {
      Fancybox.unbind(container);
      Fancybox.close(true);
    };
  }, [essays, currentPage]);

  useEffect(() => {
    const container = waterfallRef.current;
    if (!container) return;

    let lastWidth = container.offsetWidth;

    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (!entry) return;

      const newWidth = entry.contentRect.width;
      if (Math.abs(newWidth - lastWidth) < 1) return;
      lastWidth = newWidth;

      if (resizeTimerRef.current) {
        window.clearTimeout(resizeTimerRef.current);
      }

      resizeTimerRef.current = window.setTimeout(() => {
        if (layoutReady) {
          calculateWaterfallLayout();
        }
      }, 50);
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
      if (resizeTimerRef.current) {
        window.clearTimeout(resizeTimerRef.current);
        resizeTimerRef.current = null;
      }
    };
  }, [calculateWaterfallLayout, essays.length, layoutReady]);

  const isExternalLink = useCallback((url: string): boolean => {
    if (!url) return false;

    if (url.startsWith("http://") || url.startsWith("https://")) {
      try {
        const link = new URL(url);
        return link.host !== window.location.host;
      } catch {
        return true;
      }
    }

    if (url.startsWith("/")) return false;
    return false;
  }, []);

  const handleLinkClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, link: string) => {
      if (!link) return;
      event.preventDefault();

      let finalUrl = link;
      if (!isExternalLink(link) && (link.startsWith("http://") || link.startsWith("https://"))) {
        try {
          const url = new URL(link);
          finalUrl = window.location.origin + url.pathname + url.search + url.hash;
        } catch {
          finalUrl = link;
        }
      } else if (!link.startsWith("http://") && !link.startsWith("https://")) {
        finalUrl = new URL(link, window.location.origin).href;
      }

      window.open(finalUrl, "_blank", "noopener,noreferrer");
    },
    [isExternalLink]
  );

  const handleComment = useCallback((essay: Essay) => {
    const content = document.createElement("div");
    content.innerHTML = essay.content;
    const quoteText = (content.textContent || content.innerText || "").trim().slice(0, 50);

    window.dispatchEvent(
      new CustomEvent("comment-form-set-quote", {
        detail: {
          text: quoteText,
          targetPath: "/essay",
        },
      })
    );

    const commentElement = document.getElementById("post-comment");
    if (commentElement) {
      const top = commentElement.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  const handleMusicLoaded = useCallback(() => {
    if (musicRecalculateTimerRef.current) {
      window.clearTimeout(musicRecalculateTimerRef.current);
    }
    musicRecalculateTimerRef.current = window.setTimeout(() => {
      if (layoutReady) {
        calculateWaterfallLayout();
      }
    }, 50);
  }, [calculateWaterfallLayout, layoutReady]);

  useEffect(() => {
    return () => {
      if (musicRecalculateTimerRef.current) {
        window.clearTimeout(musicRecalculateTimerRef.current);
      }
    };
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page > 0 && page <= totalPages && page !== currentPage) {
        setCurrentPage(page);
      }
    },
    [currentPage, totalPages]
  );

  if (isError) {
    return (
      <div className="essay-list-container">
        <div className="essay-empty">即刻加载失败，请稍后再试。</div>
      </div>
    );
  }

  return (
    <div className="essay-list-container">
      {isPending && essays.length === 0 ? (
        <div className="essay-loading">
          <Spinner />
          <span>加载中...</span>
        </div>
      ) : essays.length === 0 ? (
        <div className="essay-empty">暂无即刻内容</div>
      ) : (
        <div className="essay-content-wrapper">
          {!layoutReady ? (
            <div className="layout-loading-placeholder">
              <div className="loading-content">
                <Spinner />
                <span>加载中...</span>
              </div>
            </div>
          ) : null}

          <section className={`timeline page-${currentPage} ${!layoutReady ? "is-hidden" : ""}`}>
            <ul
              id="waterfall"
              ref={waterfallRef}
              className="list show"
              style={{ position: "relative", height: `${waterfallHeight}px` }}
            >
              {essays.map((essay, index) => (
                <EssayItem
                  key={essay.id}
                  essay={essay}
                  style={itemPositions[index]}
                  setRef={element => setItemRef(element, index)}
                  onComment={handleComment}
                  onMusicLoaded={handleMusicLoaded}
                  onLinkClick={handleLinkClick}
                  isExternalLink={isExternalLink}
                />
              ))}
            </ul>
          </section>
        </div>
      )}

      {layoutReady ? (
        <EssayPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      ) : null}
    </div>
  );
}
