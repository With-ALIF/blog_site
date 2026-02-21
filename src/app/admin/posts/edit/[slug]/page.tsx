'use client';

import { useParams, notFound } from 'next/navigation';
import { PostForm } from '@/components/admin/post-form';
import { posts } from '@/lib/data';

export default function EditPostPage() {
  const params = useParams();
  const { slug } = params;
  
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container py-16 md:py-24">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Edit Post</h1>
        <p className="text-lg text-muted-foreground mt-2">Modify the details of your blog post below.</p>
      </div>
      <div className="bg-card p-8 rounded-lg shadow-lg">
        <PostForm post={post} />
      </div>
    </div>
  );
}
