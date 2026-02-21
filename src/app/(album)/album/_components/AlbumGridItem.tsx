"use client";
/* eslint-disable @next/next/no-img-element */

import { useMemo } from "react";
import type { PublicAlbumItem } from "@/types/album";

interface AlbumGridItemProps {
  item: PublicAlbumItem;
  index: number;
  onPreview: (index: number) => void;
}

function parseTags(tags?: string): string[] {
  if (!tags) return [];
  return tags
    .split(",")
    .map(tag => tag.trim())
    .filter(Boolean);
}

export function AlbumGridItem({ item, index, onPreview }: AlbumGridItemProps) {
  const tags = useMemo(() => parseTags(item.tags), [item.tags]);

  return (
    <div className="album-grid-item" style={{ ["--item-index" as string]: index }} onClick={() => onPreview(index)}>
      <img
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
  );
}
