import type { CollectionEntry } from 'astro:content';

// ✅ Type principal pour les articles du blog
export type BlogPost = CollectionEntry<'blog'>;

// ✅ Structure d'un élément dans la Table des matières
export interface TOCItem {
  id: string;       // ID généré pour l'ancre
  text: string;     // Texte du titre
  level: number;    // Niveau de titre (# = 1, ## = 2, etc.)
}

// ✅ Props pour la page d'un article
export interface PostPageProps {
  post: BlogPost;
}
