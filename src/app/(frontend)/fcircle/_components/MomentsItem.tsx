"use client";
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SyntheticEvent } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { friendsApi } from "@/lib/api/friends";
import type { Moment } from "@/types/friends";

const FALLBACK_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=default";

function formatMomentDate(value: string): string {
  if (!value) return "未知";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find(part => part.type === "year")?.value ?? "";
  const month = parts.find(part => part.type === "month")?.value ?? "";
  const day = parts.find(part => part.type === "day")?.value ?? "";

  return `${year}-${month}-${day}`;
}

interface MomentsItemProps {
  moments: Moment[];
}

export function MomentsItem({ moments }: MomentsItemProps) {
  const [cardShow, setCardShow] = useState(false);
  const [selectedLinkMoments, setSelectedLinkMoments] = useState<Moment[]>([]);
  const [selectedLinkInfo, setSelectedLinkInfo] = useState({
    name: "",
    logo: "",
    url: "",
  });
  const [loadingPopup, setLoadingPopup] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const displayedMoments = useMemo(() => selectedLinkMoments.slice(0, 5), [selectedLinkMoments]);

  const openPopup = useCallback(() => {
    if (!popupRef.current || !overlayRef.current) {
      return;
    }

    gsap.set(overlayRef.current, { opacity: 0 });
    gsap.set(popupRef.current, {
      scale: 0.95,
      y: 10,
      opacity: 0,
      force3D: true,
    });

    const timeline = gsap.timeline();
    timeline
      .to(overlayRef.current, {
        opacity: 1,
        duration: 0.2,
        ease: "power2.out",
      })
      .to(
        popupRef.current,
        {
          scale: 1,
          y: 0,
          opacity: 1,
          duration: 0.25,
          ease: "power2.out",
          force3D: true,
        },
        "-=0.1"
      );
  }, []);

  const closePopup = useCallback(() => {
    if (!popupRef.current || !overlayRef.current) {
      setCardShow(false);
      return;
    }

    const timeline = gsap.timeline({
      onComplete: () => {
        setCardShow(false);
      },
    });

    timeline
      .to(popupRef.current, {
        scale: 0.95,
        y: 10,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        force3D: true,
      })
      .to(
        overlayRef.current,
        {
          opacity: 0,
          duration: 0.15,
          ease: "power2.in",
        },
        "-=0.1"
      );
  }, []);

  const showLinkMoments = useCallback(
    async (moment: Moment) => {
      if (loadingPopup) {
        return;
      }

      setLoadingPopup(true);
      try {
        const data = await friendsApi.getLinkMoments(moment.link_id, 1, 10);
        setSelectedLinkMoments(data.list || []);
        setSelectedLinkInfo({
          name: moment.link_name,
          logo: moment.link_logo,
          url: moment.link_url,
        });
        setCardShow(true);

        requestAnimationFrame(() => {
          openPopup();
        });
      } catch {
        setCardShow(false);
      } finally {
        setLoadingPopup(false);
      }
    },
    [loadingPopup, openPopup]
  );

  const handleImageError = useCallback((event: SyntheticEvent<HTMLImageElement>) => {
    const target = event.currentTarget;
    target.src = FALLBACK_AVATAR;
  }, []);

  useEffect(() => {
    if (!cardShow) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePopup();
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("keydown", onEscape);
    };
  }, [cardShow, closePopup]);

  const popupNode =
    cardShow && typeof document !== "undefined"
      ? createPortal(
          <>
            <div ref={overlayRef} className="moment-overlay" onClick={closePopup} />
            <div className="moment-popup">
              <div ref={popupRef} className="popup-content" onClick={event => event.stopPropagation()}>
                <div className="popup-header">
                  <img
                    className="popup-avatar"
                    src={selectedLinkInfo.logo}
                    alt={selectedLinkInfo.name}
                    onError={handleImageError}
                  />
                  <a href={selectedLinkInfo.url} target="_blank" rel="noopener nofollow">
                    {selectedLinkInfo.name}
                  </a>
                </div>

                <div className="popup-body">
                  {displayedMoments.map((item, index) => (
                    <div
                      key={item.id}
                      className={`popup-article-item ${index === displayedMoments.length - 1 ? "is-last" : ""}`}
                    >
                      <a
                        className="popup-article-title"
                        href={item.post_url}
                        target="_blank"
                        rel="noopener nofollow"
                        data-title={item.post_title}
                      >
                        {item.post_title}
                      </a>
                      <div className="popup-article-meta">
                        <i className="anzhiyufont anzhiyu-icon-clock" />
                        <span className="popup-article-time">{formatMomentDate(item.published_at)}</span>
                      </div>
                    </div>
                  ))}

                  {selectedLinkMoments.length === 0 ? (
                    <div className="popup-empty">
                      <i className="far fa-inbox" />
                      <p>暂无更多文章</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </>,
          document.body
        )
      : null;

  return (
    <>
      {moments.map(moment => (
        <div key={moment.id} className="moment-item">
          <div className="moment-card">
            <a
              className="moment-title"
              href={moment.post_url}
              target="_blank"
              rel="noopener nofollow"
              data-title={moment.post_title}
            >
              {moment.post_title}
            </a>

            {moment.post_summary ? <div className="moment-summary">{moment.post_summary}</div> : null}

            <div className="moment-bottom">
              <img
                className="moment-avatar"
                src={moment.link_logo}
                alt={moment.link_name}
                onError={handleImageError}
              />
              <button
                type="button"
                className="moment-author"
                aria-label={`查看 ${moment.link_name} 更多文章`}
                onClick={() => void showLinkMoments(moment)}
              >
                {moment.link_name}
              </button>
              <span className="moment-time">
                <i className="anzhiyufont anzhiyu-icon-clock" />
                {formatMomentDate(moment.published_at)}
              </span>
            </div>
          </div>
        </div>
      ))}

      {popupNode}
    </>
  );
}
