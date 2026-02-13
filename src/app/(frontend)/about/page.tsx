import type { Metadata } from "next";
import { AboutPageContent } from "./_components/AboutPageContent";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8091";

/**
 * 从后端获取关于页面配置（用于 SEO）
 */
async function getAboutConfig() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/public/site-config`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const result = await res.json();
    const config = result.data || result;
    const about = config?.about?.page;
    return { about, appName: config?.APP_NAME || "AnHeYu" };
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getAboutConfig();
  const name = data?.about?.name || "";
  const description = data?.about?.description || "关于本站";
  const appName = data?.appName || "AnHeYu";

  return {
    title: "关于",
    description: name ? `关于 ${name} - ${description}` : description,
    openGraph: {
      title: `关于 | ${appName}`,
      description: name ? `关于 ${name} - ${description}` : description,
      type: "profile",
      ...(data?.about?.avatar_img && { images: [data.about.avatar_img] }),
    },
  };
}

export default function AboutPage() {
  return <AboutPageContent />;
}
