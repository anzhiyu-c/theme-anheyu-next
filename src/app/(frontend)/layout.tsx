import { Header } from "@/components/frontend/layout/header";
import { Footer } from "@/components/frontend/layout/Footer";

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
