import {getPublicArticles} from "@/lib/content-index";
import {HomePageClient} from "./HomePageClient";

export default async function Home() {
  const articles = await getPublicArticles();

  return <HomePageClient articles={articles} />;
}
