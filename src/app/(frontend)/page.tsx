import { Hero, Stats, ArticleList } from "@/components/home";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <ArticleList articles={[]} />
    </>
  );
}
