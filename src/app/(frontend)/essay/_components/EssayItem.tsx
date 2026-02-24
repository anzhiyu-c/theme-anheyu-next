"use client";

import type { CSSProperties, MouseEvent } from "react";
import { Icon } from "@iconify/react";
import { formatRelativeTime } from "@/utils/date";
import type { Essay } from "@/lib/api/essay";
import { EssayMusicPlayer } from "./EssayMusicPlayer";

interface EssayItemProps {
  essay: Essay;
  style?: CSSProperties;
  setRef?: (element: HTMLLIElement | null) => void;
  onComment: (essay: Essay) => void;
  onMusicLoaded: () => void;
  onLinkClick: (event: MouseEvent<HTMLAnchorElement>, link: string) => void;
  isExternalLink: (url: string) => boolean;
}

export function EssayItem({
  essay,
  style,
  setRef,
  onComment,
  onMusicLoaded,
  onLinkClick,
  isExternalLink,
}: EssayItemProps) {
  return (
    <li ref={setRef} className="bber-item" style={style}>
      <div className="bber-content">
        <div className="datacont" dangerouslySetInnerHTML={{ __html: essay.content }} />

        {essay.image && essay.image.length > 0 ? (
          <div className="bber-container-img">
            {essay.image.map((img, imgIndex) => (
              <a
                key={`${essay.id}-${imgIndex}`}
                className="bber-content-img"
                href={img}
                data-fancybox={`essay-${essay.id}`}
                rel="external nofollow noreferrer"
                target="_blank"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`图片 ${imgIndex + 1}`} loading="lazy" />
              </a>
            ))}
            {Array.from({ length: Math.max(0, 3 - essay.image.length) }).map((_, index) => (
              <div key={`noimg-${essay.id}-${index}`} className="bber-content-noimg" />
            ))}
          </div>
        ) : null}

        {essay.aplayer?.id ? <EssayMusicPlayer musicId={essay.aplayer.id} onLoaded={onMusicLoaded} /> : null}
      </div>

      <hr />

      <div className="bber-bottom">
        <div className="bber-info">
          <div className="bber-info-time">
            <Icon icon="fa6-solid:clock" width={14} height={14} />
            <time className="datatime" dateTime={essay.created_at} style={{ display: "inline" }}>
              {formatRelativeTime(essay.created_at)}
            </time>
          </div>

          {essay.link ? (
            <a
              className="bber-content-link"
              title="在新窗口打开链接"
              href={essay.link}
              rel={isExternalLink(essay.link) ? "external nofollow" : undefined}
              target="_blank"
              onClick={event => onLinkClick(event, essay.link!)}
            >
              <Icon icon="fa6-solid:link" width={14} height={14} />
              链接
            </a>
          ) : null}

          {essay.from ? (
            <div className="bber-info-from">
              <Icon icon="fa6-solid:fire" width={14} height={14} />
              <span>{essay.from}</span>
            </div>
          ) : null}

          {essay.address ? (
            <div className="bber-info-from">
              <Icon icon="fa6-solid:location-dot" width={14} height={14} />
              <span>{essay.address}</span>
            </div>
          ) : null}
        </div>

        <div className="bber-reply" onClick={() => onComment(essay)}>
          <Icon icon="ri:chat-1-fill" className="w-6 h-6" />
        </div>
      </div>
    </li>
  );
}
