"use client";
/* eslint-disable @next/next/no-img-element */

import { useMemo } from "react";
import { Icon } from "@iconify/react";
import type { PublicAlbumItem } from "@/types/album";
import { formatRelativeTime } from "@/utils/date";

interface AlbumWaterfallItemProps {
  item: PublicAlbumItem;
  index: number;
  enableComment?: boolean;
  onPreview: (index: number) => void;
  onComment: () => void;
}

function parseTags(tags?: string): string[] {
  if (!tags) return [];
  return tags
    .split(",")
    .map(tag => tag.trim())
    .filter(Boolean);
}

export function AlbumWaterfallItem({ item, index, enableComment = false, onPreview, onComment }: AlbumWaterfallItemProps) {
  const tags = useMemo(() => parseTags(item.tags), [item.tags]);

  return (
    <div className="album-waterfall-item" onClick={() => onPreview(index)}>
      <div className="waterfall-item-content">
        <img
          className="waterfall-image"
          src={item.thumbParam ? `${item.imageUrl}?${item.thumbParam}` : item.imageUrl}
          alt={item.title || "相册图片"}
          loading="lazy"
        />

        {item.title || item.description ? (
          <div className="image-info">
            {item.title ? <h2>{item.title}</h2> : null}
            {item.description ? <p className="image-desc">{item.description}</p> : null}
          </div>
        ) : null}

        {tags.length > 0 ? (
          <div className="tag-info">
            <span className="tag-categorys">
              {tags.map((tag, tagIndex) => (
                <span key={`${tag}-${tagIndex}`} className="tag">
                  {tag}
                </span>
              ))}
            </span>
          </div>
        ) : null}
      </div>

      <div className="album-item-bottom">
        <div className="album-item-info">
          {item.created_at ? (
            <div className="album-info-time">
              <Icon icon="ri:time-line" />
              <time className="datatime" dateTime={item.created_at}>
                {formatRelativeTime(item.created_at)}
              </time>
            </div>
          ) : null}
          {item.location ? (
            <div className="album-info-location">
              <Icon icon="ri:map-pin-2-line" />
              <span>{item.location}</span>
            </div>
          ) : null}
        </div>

        {enableComment ? (
          <button
            type="button"
            className="album-reply"
            onClick={event => {
              event.stopPropagation();
              onComment();
            }}
          >
            <Icon icon="ri:chat-1-fill" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
