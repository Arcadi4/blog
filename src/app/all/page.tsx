import type { Metadata } from "next"
import { AllArticlesClient } from "./AllArticlesClient"
import { getPublicArticles } from "@/lib/content-index"

export const metadata: Metadata = {
  title: "Article archive — @4rcadia",
  description: "Browse every article published on blog.arcadia.moe."
}

export default async function AllArticlesPage() {
  const articles = await getPublicArticles()

  return <AllArticlesClient articles={articles} />
}
