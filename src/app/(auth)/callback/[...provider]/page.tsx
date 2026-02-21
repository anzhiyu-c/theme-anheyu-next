import type { Metadata } from "next";
import { OAuthCallbackPageClient } from "./_components/OAuthCallbackPageClient";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "登录回调",
    description: "第三方登录授权回调处理中。",
    path: "/callback",
    noindex: true,
  });
}

export default function OAuthCallbackPage() {
  return <OAuthCallbackPageClient />;
}
