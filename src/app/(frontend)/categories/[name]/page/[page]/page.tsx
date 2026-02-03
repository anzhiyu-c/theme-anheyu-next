import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryDetailPageContent } from "@/components/categories";

interface CategoryPageParams {
  name: string;
  page: string;
}

function parsePage(value: string) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return null;
  return Math.floor(num);
}

export async function generateMetadata({ params }: { params: Promise<CategoryPageParams> }): Promise<Metadata> {
  const resolvedParams = await params;
  const name = decodeURIComponent(resolvedParams.name);
  return {
    title: `分类 - ${name}`,
  };
}

export default async function CategoryDetailPageWithPagination({ params }: { params: Promise<CategoryPageParams> }) {
  const resolvedParams = await params;
  const name = decodeURIComponent(resolvedParams.name);
  const page = parsePage(resolvedParams.page);
  if (!page) {
    notFound();
  }
  return <CategoryDetailPageContent categoryName={name} page={page} />;
}
