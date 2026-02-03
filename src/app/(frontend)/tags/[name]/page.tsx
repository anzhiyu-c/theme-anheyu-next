import type { Metadata } from "next";
import { TagDetailPageContent } from "@/components/tags";

interface TagPageParams {
  name: string;
}

export async function generateMetadata({ params }: { params: Promise<TagPageParams> }): Promise<Metadata> {
  const resolvedParams = await params;
  const name = decodeURIComponent(resolvedParams.name);
  return {
    title: `标签 - ${name}`,
  };
}

export default async function TagDetailPage({ params }: { params: Promise<TagPageParams> }) {
  const resolvedParams = await params;
  const name = decodeURIComponent(resolvedParams.name);
  return <TagDetailPageContent tagName={name} />;
}
