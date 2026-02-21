import type { Metadata } from "next";
import type { SiteConfigData } from "@/types/site-config";

const DEFAULT_SITE_NAME = "AnHeYu";
const DEFAULT_SITE_DESCRIPTION = "生活明朗，万物可爱";
const DEFAULT_ICON_URL = "/favicon.ico";
const DEFAULT_LOGO_URL = "/static/img/logo-192x192.png";
const DEV_SITE_URL = "http://localhost:3000";

export interface SeoSiteInfo {
  siteName: string;
  description: string;
  siteUrl?: string;
  iconUrl: string;
  logoUrl: string;
}

export interface BuildPageMetadataOptions {
  title: string;
  description?: string;
  path: string;
  includeCanonical?: boolean;
  type?: "website" | "article" | "profile";
  image?: string;
  keywords?: Metadata["keywords"];
  noindex?: boolean;
  absoluteTitle?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  siteConfig?: SiteConfigData | null;
}

function ensureProtocol(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function stripTrailingSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function normalizeSiteUrl(rawUrl?: string): string | undefined {
  if (!rawUrl) return undefined;
  const value = rawUrl.trim();
  if (!value) return undefined;

  try {
    const normalized = new URL(ensureProtocol(value));
    return stripTrailingSlash(normalized.toString());
  } catch {
    return undefined;
  }
}

export function normalizePath(path: string): string {
  const value = path.trim();
  if (!value) return "/";

  if (/^https?:\/\//i.test(value)) {
    try {
      const parsed = new URL(value);
      const pathname = parsed.pathname || "/";
      return pathname === "/" ? "/" : pathname.replace(/\/$/, "");
    } catch {
      return "/";
    }
  }

  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  if (withLeadingSlash === "/") return withLeadingSlash;
  return withLeadingSlash.replace(/\/$/, "");
}

export function getSeoBackendUrl(): string {
  return process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8091";
}

export async function fetchSiteConfigForSeo(revalidateSeconds = 60): Promise<SiteConfigData | null> {
  try {
    const response = await fetch(`${getSeoBackendUrl()}/api/public/site-config`, {
      next: { revalidate: revalidateSeconds },
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return (result?.data || result) as SiteConfigData;
  } catch {
    return null;
  }
}

export function resolveSeoSiteInfo(siteConfig?: SiteConfigData | null): SeoSiteInfo {
  const siteName = siteConfig?.APP_NAME || DEFAULT_SITE_NAME;
  const description = siteConfig?.SUB_TITLE || DEFAULT_SITE_DESCRIPTION;
  const siteUrl = normalizeSiteUrl(siteConfig?.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL);

  return {
    siteName,
    description,
    siteUrl,
    iconUrl: siteConfig?.ICON_URL || DEFAULT_ICON_URL,
    logoUrl: siteConfig?.LOGO_URL || siteConfig?.LOGO_URL_192x192 || DEFAULT_LOGO_URL,
  };
}

export function resolveMetadataBase(siteUrl?: string): URL | undefined {
  const normalized = normalizeSiteUrl(siteUrl);
  if (normalized) {
    return new URL(normalized);
  }

  if (process.env.NODE_ENV === "development") {
    return new URL(DEV_SITE_URL);
  }

  return undefined;
}

export function createRobotsMetadata(index = true): NonNullable<Metadata["robots"]> {
  if (index) {
    return {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    };
  }

  return {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-image-preview": "none",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

export async function buildPageMetadata(options: BuildPageMetadataOptions): Promise<Metadata> {
  const siteConfig = options.siteConfig ?? (await fetchSiteConfigForSeo());
  const site = resolveSeoSiteInfo(siteConfig);
  const canonicalPath = normalizePath(options.path);
  const description = options.description || site.description;
  const image = options.image || site.logoUrl;
  const noindex = Boolean(options.noindex);
  const shouldEmitCanonical = options.includeCanonical ?? !noindex;

  return {
    title: options.absoluteTitle ? { absolute: options.title } : options.title,
    description,
    ...(options.keywords ? { keywords: options.keywords } : {}),
    ...(shouldEmitCanonical
      ? {
          alternates: {
            canonical: canonicalPath,
          },
        }
      : {}),
    robots: createRobotsMetadata(!noindex),
    openGraph: {
      type: options.type || "website",
      locale: "zh_CN",
      siteName: site.siteName,
      title: options.title,
      description,
      url: canonicalPath,
      images: image ? [image] : undefined,
      ...(options.type === "article"
        ? {
            publishedTime: options.publishedTime,
            modifiedTime: options.modifiedTime,
            authors: options.authors,
          }
        : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: options.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
