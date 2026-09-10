import { getArticles } from "@/lib/content"
import { HomePageClient } from "./HomePageClient"

export default function Home() {
  return <HomePageClient articles={getArticles()} />
}
