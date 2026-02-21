export const categories = ['Tech', 'Education', 'Programming', 'Lifestyle'] as const;
export type Category = (typeof categories)[number];

export interface Post {
  id: string;
  slug: string;
  title_en: string;
  title_bn: string;
  excerpt_en: string;
  excerpt_bn: string;
  content_en: string;
  content_bn: string;
  imageUrl: string;
  imageHint: string;
  category: Category;
  author: string;
  date: string; // ISO 8601 format
}
