import { getContentIndex } from './content-index';

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  content?: string;
}

export async function getSortedPostsData(): Promise<Post[]> {
  const index = await getContentIndex();
  return index.articles.map(article => ({
    slug: article.slug,
    title: article.title,
    date: article.publishDate.toISOString(),
    excerpt: article.excerpt,
  }));
}

export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  const index = await getContentIndex();
  return index.articles.map(article => ({ slug: article.slug }));
}

export async function getPostData(slug: string): Promise<Post | null> {
  const index = await getContentIndex();
  const article = index.articles.find(a => a.slug === slug);
  
  if (!article) {
    return null;
  }

  return {
    slug: article.slug,
    title: article.title,
    date: article.publishDate.toISOString(),
    excerpt: article.excerpt,
    content: article.content,
  };
}
