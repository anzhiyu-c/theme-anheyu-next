import type { Metadata } from "next";
import { MusicPageClient } from "./_components/MusicPageClient";

export const metadata: Metadata = {
  title: "音乐馆",
  description: "沉浸式音乐体验",
};

export default function MusicPage() {
  return <MusicPageClient />;
}
