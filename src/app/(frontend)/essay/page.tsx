import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { EssayPageClient } from "./_components/EssayPageClient";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "即刻",
    description: "记录日常碎片与灵感瞬间的即刻时间线。",
    path: "/essay",
  });
}

export default function EssayPage() {
  return <EssayPageClient />;
}
