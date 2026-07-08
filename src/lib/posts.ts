import {getContentIndex} from "./content-index";

export interface Post {
  id: string;
  title: string;
  tags: string[];
  publishedAt: Date;
  lastModifiedAt: Date;
  excerpt: string;
  content: string;
  banner?: string;
}

export async function getSortedPostsData(): Promise<Post[]> {
  const index = await getContentIndex();
  return index.articles.map((article) => ({
    id: article.slug,
    title: article.title,
    tags: article.tags,
    publishedAt: article.publishDate,
    lastModifiedAt: article.lastEditedTime,
    excerpt: article.excerpt,
    content: article.content,
    banner: article.banner,
  }));
}

export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  const index = await getContentIndex();
  return index.articles.map((article) => ({ slug: article.slug }));
}

export async function getPostData(slug: string): Promise<Post | null> {
  const index = await getContentIndex();
  const article = index.articles.find((a) => a.slug === slug);

  if (!article) {
    return null;
  }

  return {
    id: article.slug,
    title: article.title,
    tags: article.tags,
    publishedAt: article.publishDate,
    lastModifiedAt: article.lastEditedTime,
    excerpt: article.excerpt,
    content: article.content,
    banner: article.banner,
  };
}
