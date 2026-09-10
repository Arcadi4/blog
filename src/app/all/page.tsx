import type { Metadata } from "next"
import { AllArticlesClient } from "./AllArticlesClient"
import { getArticles } from "@/lib/content"

export const metadata: Metadata = {
  title: "Article archive — @4rcadia",
  description: "Browse every article published on blog.arcadia.moe."
}

export default function AllArticlesPage() {
  return <AllArticlesClient articles={getArticles()} />
}
