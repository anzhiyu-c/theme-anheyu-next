"use client";

import { useRef } from "react";
import { LinkTopBanner } from "./_components/LinkTopBanner";
import { RandomPost } from "./_components/RandomPost";
import { LinkListSection } from "./_components/LinkListSection";
import { ApplyLink } from "./_components/ApplyLink";
import { CommentSection } from "@/components/post/Comment";
import "./_styles/flink.scss";
import "./_styles/post-content.scss";

export default function FriendLinkPage() {
  const applyRef = useRef<HTMLDivElement>(null);

  const handleScrollToApply = () => {
    if (applyRef.current) {
      const offset = 80;
      const top = applyRef.current.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="post-link-page">
      <LinkTopBanner onScrollToApply={handleScrollToApply} />

      <RandomPost />

      <LinkListSection />

      <div ref={applyRef}>
        <ApplyLink />
      </div>

      <div className="link-comment-section" style={{ marginTop: "2rem" }}>
        <CommentSection targetTitle="友情链接" targetPath="/link" />
      </div>
    </div>
  );
}
