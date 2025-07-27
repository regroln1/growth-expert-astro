import { getCollection } from 'astro:content';
import type { BlogPost, TOCItem } from '../types';

/**
 * ✅ Récupère tous les articles (hors brouillons) triés par date décroissante
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog', ({ data }) => {
    return import.meta.env.PROD ? !data.draft : true;
  });
  return posts.sort((a: BlogPost, b: BlogPost) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/**
 * ✅ Récupère les X derniers articles
 */
export async function getLatestPosts(count: number = 3): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.slice(0, count);
}

/**
 * ✅ Calcule le temps de lecture estimé en minutes
 */
export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * ✅ Formate une date en français
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * ✅ Récupère toutes les catégories/tags
 */
export function getAllTags(posts: BlogPost[]): string[] {
  const tags = new Set<string>();
  posts.forEach((post: BlogPost) => {
    post.data.tags.forEach((tag: string) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

/**
 * ✅ Filtre les articles par tag
 */
export function filterPostsByTag(posts: BlogPost[], tag: string): BlogPost[] {
  return posts.filter((post: BlogPost) => post.data.tags.includes(tag));
}

/**
 * ✅ Recherche les articles par mot-clé
 */
export function searchPosts(posts: BlogPost[], query: string): BlogPost[] {
  const lowercaseQuery = query.toLowerCase();
  return posts.filter((post: BlogPost) =>
    post.data.title.toLowerCase().includes(lowercaseQuery) ||
    post.data.description.toLowerCase().includes(lowercaseQuery) ||
    post.data.tags.some((tag: string) => tag.toLowerCase().includes(lowercaseQuery))
  );
}

/**
 * ✅ Génère la table des matières à partir du contenu Markdown
 */
export function generateTableOfContents(content: string): TOCItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: TOCItem[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(content)) !== null) {
    const level: number = match[1].length; // # → niveau 1, ## → niveau 2, etc.
    const text: string = match[2].trim();
    const id: string = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    toc.push({ id, text, level });
  }

  return toc;
}
