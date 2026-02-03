import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TagDetailPageContent } from "@/components/tags";

interface TagPageParams {
  name: string;
  page: string;
}

function parsePage(value: string) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return null;
  return Math.floor(num);
}

export async function generateMetadata({ params }: { params: Promise<TagPageParams> }): Promise<Metadata> {
  const resolvedParams = await params;
  const name = decodeURIComponent(resolvedParams.name);
  return {
    title: `标签 - ${name}`,
  };
}

export default async function TagDetailPageWithPagination({ params }: { params: Promise<TagPageParams> }) {
  const resolvedParams = await params;
  const name = decodeURIComponent(resolvedParams.name);
  const page = parsePage(resolvedParams.page);
  if (!page) {
    notFound();
  }
  return <TagDetailPageContent tagName={name} page={page} />;
}
