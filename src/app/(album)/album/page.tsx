import type { Metadata } from "next";
import { AlbumPageClient } from "./_components/AlbumPageClient";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "相册",
    description: "安和鱼相册页面，浏览公开图片与摄影记录。",
    path: "/album",
  });
}

export default function AlbumPage() {
  return <AlbumPageClient />;
}
