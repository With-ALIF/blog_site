import { Post, Category } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  if (!image) return { imageUrl: 'https://picsum.photos/seed/placeholder/1200/800', imageHint: 'placeholder' };
  return { imageUrl: image.imageUrl, imageHint: image.imageHint };
};

export const heroImage = getImage('hero');

export let categories: string[] = [];
export const posts: Post[] = [];
