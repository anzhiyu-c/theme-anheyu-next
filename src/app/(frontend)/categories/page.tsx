import type { Metadata } from "next";
import { CategoryPageContent } from "@/components/categories";

export const metadata: Metadata = {
  title: "分类",
};

export default function CategoriesPage() {
  return <CategoryPageContent />;
}
