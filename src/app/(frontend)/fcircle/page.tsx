import type { Metadata } from "next";
import { FcirclePageClient } from "./_components/FcirclePageClient";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "朋友圈",
    description: "订阅友链最新文章，查看站点朋友圈动态。",
    path: "/fcircle",
  });
}

export default function FcirclePage() {
  return <FcirclePageClient />;
}
