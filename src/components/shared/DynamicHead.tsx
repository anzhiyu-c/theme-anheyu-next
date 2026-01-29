"use client";

import { useEffect } from "react";
import { useSiteConfigStore } from "@/store/siteConfigStore";

/**
 * 动态 Head 组件
 * 根据站点配置动态更新 favicon、标题和 SEO meta 标签
 * 参考 anheyu-pro 实现
 */
export function DynamicHead() {
  const { siteConfig, isLoaded } = useSiteConfigStore();

  useEffect(() => {
    if (!isLoaded) return;

    // 更新页面标题（参考 anheyu-pro 实现）
    const appName = siteConfig.APP_NAME;
    const subTitle = siteConfig.SUB_TITLE;
    if (appName) {
      // 组合标题：站点名称 - 副标题
      document.title = subTitle ? `${appName} - ${subTitle}` : appName;
    }

    // 更新 meta description
    if (subTitle) {
      let descMeta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;

      if (!descMeta) {
        descMeta = document.createElement("meta");
        descMeta.name = "description";
        document.head.appendChild(descMeta);
      }
      descMeta.content = subTitle;

      // 同时更新 OG description
      let ogDescMeta = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;

      if (!ogDescMeta) {
        ogDescMeta = document.createElement("meta");
        ogDescMeta.setAttribute("property", "og:description");
        document.head.appendChild(ogDescMeta);
      }
      ogDescMeta.content = subTitle;
    }

    // 更新 OG title
    if (appName) {
      let ogTitleMeta = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;

      if (!ogTitleMeta) {
        ogTitleMeta = document.createElement("meta");
        ogTitleMeta.setAttribute("property", "og:title");
        document.head.appendChild(ogTitleMeta);
      }
      ogTitleMeta.content = subTitle ? `${appName} - ${subTitle}` : appName;
    }

    // 更新 Favicon（使用配置中的 ICON_URL，如果没有则使用默认值）
    const iconUrl = siteConfig.ICON_URL || "/favicon.ico";
    if (iconUrl) {
      // 判断图标类型（注意：本项目的 .ico 文件实际是 PNG 格式）
      const isSvg = iconUrl.endsWith(".svg");
      // 由于 .ico 文件实际是 PNG，统一使用 image/png 保证兼容性
      const iconType = isSvg ? "image/svg+xml" : "image/png";

      // 更新主 favicon（删除旧的，创建新的以确保更新）
      const existingFavicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
      existingFavicons.forEach(el => el.remove());

      // 创建新的 favicon link（添加时间戳避免缓存问题）
      const cacheBuster = `?v=${Date.now()}`;
      const faviconLink = document.createElement("link");
      faviconLink.rel = "icon";
      faviconLink.type = iconType;
      faviconLink.href = iconUrl + cacheBuster;
      document.head.appendChild(faviconLink);

      // 创建 shortcut icon（兼容旧浏览器）
      const shortcutIcon = document.createElement("link");
      shortcutIcon.rel = "shortcut icon";
      shortcutIcon.type = iconType;
      shortcutIcon.href = iconUrl + cacheBuster;
      document.head.appendChild(shortcutIcon);
    }

    // 更新 Apple Touch Icon
    const logoUrl = siteConfig.LOGO_URL_192x192 || siteConfig.LOGO_URL;
    if (logoUrl) {
      let appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement | null;

      if (!appleTouchIcon) {
        appleTouchIcon = document.createElement("link");
        appleTouchIcon.rel = "apple-touch-icon";
        document.head.appendChild(appleTouchIcon);
      }
      appleTouchIcon.href = logoUrl;
    }

    // 更新 Windows Tile Logo
    const tileLogoUrl = siteConfig.LOGO_URL || siteConfig.LOGO_URL_192x192;
    if (tileLogoUrl) {
      let msTileImageMeta = document.querySelector('meta[name="msapplication-TileImage"]') as HTMLMetaElement | null;

      if (!msTileImageMeta) {
        msTileImageMeta = document.createElement("meta");
        msTileImageMeta.name = "msapplication-TileImage";
        document.head.appendChild(msTileImageMeta);
      }
      msTileImageMeta.content = tileLogoUrl;
    }

    // 更新 OG Image（社交分享图片）
    const ogImageUrl = siteConfig.LOGO_URL_512x512 || siteConfig.LOGO_URL;
    if (ogImageUrl) {
      let ogImageMeta = document.querySelector('meta[property="og:image"]') as HTMLMetaElement | null;

      if (!ogImageMeta) {
        ogImageMeta = document.createElement("meta");
        ogImageMeta.setAttribute("property", "og:image");
        document.head.appendChild(ogImageMeta);
      }
      ogImageMeta.content = ogImageUrl;
    }

    // 更新站点名称相关 meta
    const siteName = siteConfig.APP_NAME;
    if (siteName) {
      // OG Site Name
      let ogSiteNameMeta = document.querySelector('meta[property="og:site_name"]') as HTMLMetaElement | null;

      if (!ogSiteNameMeta) {
        ogSiteNameMeta = document.createElement("meta");
        ogSiteNameMeta.setAttribute("property", "og:site_name");
        document.head.appendChild(ogSiteNameMeta);
      }
      ogSiteNameMeta.content = siteName;
    }

    // 更新站点 URL
    const siteUrl = siteConfig.SITE_URL;
    if (siteUrl) {
      // OG URL
      let ogUrlMeta = document.querySelector('meta[property="og:url"]') as HTMLMetaElement | null;

      if (!ogUrlMeta) {
        ogUrlMeta = document.createElement("meta");
        ogUrlMeta.setAttribute("property", "og:url");
        document.head.appendChild(ogUrlMeta);
      }
      ogUrlMeta.content = siteUrl;

      // Canonical URL
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;

      if (!canonicalLink) {
        canonicalLink = document.createElement("link");
        canonicalLink.rel = "canonical";
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.href = siteUrl;
    }
  }, [siteConfig, isLoaded]);

  // 此组件不渲染任何 UI
  return null;
}
