"use client";

import { Header } from "@/components/frontend/layout/Header";
import { Footer } from "@/components/frontend/layout/Footer";

export function FrontendLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}
