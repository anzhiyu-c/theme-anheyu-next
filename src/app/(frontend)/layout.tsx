import { Header, Footer, OneImageBanner } from "@/components/layout";
import { ScrollInitializer } from "@/providers/scroll-initializer";

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="frontend-layout" className="frontend-layout">
      <ScrollInitializer />
      <Header />
      <OneImageBanner />
      <main id="frontend-main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
