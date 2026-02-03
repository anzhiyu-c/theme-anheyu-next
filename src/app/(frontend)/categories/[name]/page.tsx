import type { Metadata } from "next";
import { CategoryDetailPageContent } from "@/components/categories";

interface CategoryPageParams {
  name: string;
}

export async function generateMetadata({ params }: { params: Promise<CategoryPageParams> }): Promise<Metadata> {
  const resolvedParams = await params;
  const name = decodeURIComponent(resolvedParams.name);
  return {
    title: `分类 - ${name}`,
  };
}

export default async function CategoryDetailPage({ params }: { params: Promise<CategoryPageParams> }) {
  const resolvedParams = await params;
  const name = decodeURIComponent(resolvedParams.name);
  return <CategoryDetailPageContent categoryName={name} />;
}
