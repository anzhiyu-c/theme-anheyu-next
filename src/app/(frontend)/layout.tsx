import { Header, Footer, OneImageBanner, KeyboardShortcutsProvider } from "@/components/layout";
import { ScrollInitializer } from "@/providers/scroll-initializer";
import { ExternalLinkInterceptor } from "@/providers/external-link-interceptor";
import { MusicPlayer } from "@/components/MusicPlayer";
import { RightMenu } from "@/components/RightMenu";

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="frontend-layout" className="frontend-layout">
      <ScrollInitializer />
      <ExternalLinkInterceptor />
      <KeyboardShortcutsProvider />
      <Header />
      <OneImageBanner />
      <main id="frontend-main" className="flex-1">
        {children}
      </main>
      <Footer />
      <MusicPlayer />
      <RightMenu />
    </div>
  );
}
