import { Header, KeyboardShortcutsProvider } from "@/components/layout";
import { ScrollInitializer } from "@/providers/scroll-initializer";

export default function MusicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="music-layout" className="music-layout">
      <ScrollInitializer />
      <KeyboardShortcutsProvider />
      <Header />
      {children}
    </div>
  );
}
