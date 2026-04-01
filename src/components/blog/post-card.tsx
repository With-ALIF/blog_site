'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/types';
import { useLanguage } from '@/contexts/language-context';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const { language } = useLanguage();
  const title = language === 'en' ? post.title_en : post.title_bn;
  const excerpt = language === 'en' ? post.excerpt_en : post.excerpt_bn;
  const readMore = language === 'en' ? 'Read More' : 'আরও পড়ুন';

  return (
    <Card className="flex flex-col overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl duration-300">
      <CardHeader className="p-0">
        <Link href={`/blog/${post.slug}`} className="block" aria-label={`Read more about ${title}`}>
          <div className="relative aspect-[16/9]">
            <Image
              src={post.imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={post.imageHint}
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <Badge variant="outline" className="mb-2">{post.category}</Badge>
        <CardTitle className="mb-2 font-headline text-xl leading-tight">
          <Link href={`/blog/${post.slug}`}>{title}</Link>
        </CardTitle>
        <p className="text-muted-foreground line-clamp-3">{excerpt}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          <span className="hidden sm:inline">{post.author} &bull; </span>
          <span>{format(new Date(post.date), 'MMM d, yyyy')}</span>
        </div>
        <Link href={`/blog/${post.slug}`} className="flex items-center text-sm font-semibold text-primary hover:underline">
          {readMore} <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
