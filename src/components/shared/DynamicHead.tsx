"use client";

import { useEffect, useRef } from "react";
import { useSiteConfigStore } from "@/store/siteConfigStore";

/**
 * 动态 Head 组件
 * 根据站点配置动态更新 favicon、标题和 SEO meta 标签
 * 使用 MutationObserver 确保标题不被 Next.js metadata 覆盖
 */
export function DynamicHead() {
  const { siteConfig, isLoaded } = useSiteConfigStore();
  const targetTitleRef = useRef<string | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  // 计算配置值
  const appName = siteConfig.APP_NAME;
  const subTitle = siteConfig.SUB_TITLE;
  const targetTitle = appName ? (subTitle ? `${appName} - ${subTitle}` : appName) : null;

  // 更新标题并监听变化
  useEffect(() => {
    if (!isLoaded || !targetTitle) return;

    // 保存目标标题
    targetTitleRef.current = targetTitle;

    // 设置标题的函数
    const setTitle = () => {
      if (targetTitleRef.current && document.title !== targetTitleRef.current) {
        document.title = targetTitleRef.current;
      }
    };

    // 立即设置标题
    setTitle();

    // 使用 MutationObserver 监听 head 变化（包括 title 元素被替换的情况）
    if (!observerRef.current) {
      observerRef.current = new MutationObserver(mutations => {
        // 检查是否有 title 相关的变化
        const hasTitleChange = mutations.some(
          m =>
            m.target.nodeName === "TITLE" ||
            m.target === document.head ||
            Array.from(m.addedNodes).some(n => (n as Element).nodeName === "TITLE") ||
            Array.from(m.removedNodes).some(n => (n as Element).nodeName === "TITLE")
        );
        if (hasTitleChange) {
          // 使用 requestAnimationFrame 确保在 DOM 更新后设置标题
          requestAnimationFrame(() => {
            setTitle();
          });
        }
      });

      // 监听 head 元素的子节点变化
      observerRef.current.observe(document.head, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    // 清理函数
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [isLoaded, targetTitle]);

  // 更新其他 meta 标签
  useEffect(() => {
    if (!isLoaded) return;

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
    if (targetTitle) {
      let ogTitleMeta = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
      if (!ogTitleMeta) {
        ogTitleMeta = document.createElement("meta");
        ogTitleMeta.setAttribute("property", "og:title");
        document.head.appendChild(ogTitleMeta);
      }
      ogTitleMeta.content = targetTitle;
    }

    // 注意：Favicon 由 layout.tsx 的 generateMetadata 在服务端设置
    // 客户端不再重复设置，避免闪烁

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

    // 更新 OG Image
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

    // 更新 OG Site Name
    if (appName) {
      let ogSiteNameMeta = document.querySelector('meta[property="og:site_name"]') as HTMLMetaElement | null;
      if (!ogSiteNameMeta) {
        ogSiteNameMeta = document.createElement("meta");
        ogSiteNameMeta.setAttribute("property", "og:site_name");
        document.head.appendChild(ogSiteNameMeta);
      }
      ogSiteNameMeta.content = appName;
    }

    // 更新站点 URL
    const siteUrl = siteConfig.SITE_URL;
    if (siteUrl) {
      let ogUrlMeta = document.querySelector('meta[property="og:url"]') as HTMLMetaElement | null;
      if (!ogUrlMeta) {
        ogUrlMeta = document.createElement("meta");
        ogUrlMeta.setAttribute("property", "og:url");
        document.head.appendChild(ogUrlMeta);
      }
      ogUrlMeta.content = siteUrl;

      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonicalLink) {
        canonicalLink = document.createElement("link");
        canonicalLink.rel = "canonical";
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.href = siteUrl;
    }
  }, [siteConfig, isLoaded, appName, subTitle, targetTitle]);

  return null;
}
