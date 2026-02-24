export const postStatuses = ['published', 'pending', 'scheduled'] as const;
export type PostStatus = (typeof postStatuses)[number];

export interface Category {
  id: string;
  name: string;
}

export interface Post {
  id:string;
  slug: string;
  title_en: string;
  title_bn: string;
  excerpt_en: string;
  excerpt_bn: string;
  content_en: string;
  content_bn: string;
  imageUrl: string;
  imageHint: string;
  category: string;
  author: string;
  date: number; // Unix timestamp in ms
  status: PostStatus;
}

export interface Comment {
  id: string;
  postId: string;
  postTitle: string;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: number; // Unix timestamp in ms
}
