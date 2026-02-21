"use client";

import { BannerCard } from "@/components/common/BannerCard";
import { CommentSection } from "@/components/post/Comment";
import { useSiteConfigStore } from "@/store/site-config-store";
import { MomentsList } from "./MomentsList";
import "../_styles/fcircle.scss";

export function FcirclePageClient() {
  const momentsConfig = useSiteConfigStore(state => state.siteConfig?.moments);

  return (
    <div className="fcircle">
      <BannerCard
        tips={momentsConfig?.tips}
        title={momentsConfig?.title}
        description={momentsConfig?.subtitle}
        backgroundImage={momentsConfig?.top_background}
        buttonText={momentsConfig?.button_text}
        buttonLink={momentsConfig?.button_link}
        height={300}
      />

      <MomentsList />

      <div className="link-comment-section">
        <CommentSection targetTitle="朋友圈" targetPath="/fcircle" />
      </div>
    </div>
  );
}
