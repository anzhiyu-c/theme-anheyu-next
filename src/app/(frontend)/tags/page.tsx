import type { Metadata } from "next";
import { TagPageContent } from "@/components/tags";

export const metadata: Metadata = {
  title: "标签",
};

export default function TagsPage() {
  return <TagPageContent />;
}
