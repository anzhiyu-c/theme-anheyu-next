"use client";

import { BannerCard } from "@/components/common/BannerCard";
import { CommentSection } from "@/components/post/Comment";
import { useSiteConfigStore } from "@/store/site-config-store";
import { EssayList } from "./EssayList";
import "../_styles/essay.scss";

export function EssayPageClient() {
  const essayConfig = useSiteConfigStore(state => state.siteConfig?.essay);

  return (
    <div className="essay">
      <BannerCard
        tips={essayConfig?.tips}
        title={essayConfig?.title}
        description={essayConfig?.subtitle}
        backgroundImage={essayConfig?.top_background}
        buttonText={essayConfig?.button_text}
        buttonLink={essayConfig?.button_link}
        height={300}
      />

      <EssayList />

      <div className="link-comment-section">
        <CommentSection targetTitle="即刻" targetPath="/essay" />
      </div>
    </div>
  );
}
