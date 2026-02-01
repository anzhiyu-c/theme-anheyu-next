"use client";

import { useMemo } from "react";
import { useSiteConfigStore } from "@/store/siteConfigStore";
import { AuthorInfoCard } from "./AuthorInfoCard";
import { CardWechat } from "./CardWechat";
import { StickyCards } from "./StickyCards";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  const siteConfig = useSiteConfigStore(state => state.siteConfig);

  // 作者信息卡片配置
  const authorInfoConfig = useMemo(() => {
    if (!siteConfig?.sidebar?.author?.enable) return null;
    return {
      description: siteConfig.sidebar.author.description || "",
      statusImg: siteConfig.sidebar.author.statusImg || "",
      skills: siteConfig.sidebar.author.skills || [],
      social: siteConfig.sidebar.author.social || {},
      userAvatar: siteConfig.USER_AVATAR || "",
      ownerName: siteConfig.frontDesk?.siteOwner?.name || "",
      subTitle: siteConfig.SUB_TITLE || "",
    };
  }, [siteConfig]);

  // 微信公众号卡片配置
  const wechatConfig = useMemo(() => {
    if (!siteConfig?.sidebar?.wechat?.enable) return null;
    return {
      face: siteConfig.sidebar.wechat.face || "",
      backFace: siteConfig.sidebar.wechat.backFace || "",
      blurBackground: siteConfig.sidebar.wechat.blurBackground || "",
      link: siteConfig.sidebar.wechat.link,
    };
  }, [siteConfig]);

  return (
    <aside className={styles.asideContent}>
      {authorInfoConfig && <AuthorInfoCard config={authorInfoConfig} />}
      {wechatConfig && <CardWechat config={wechatConfig} />}
      <StickyCards />
    </aside>
  );
}
