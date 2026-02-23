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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Edit Post</h1>
        <p className="text-md text-muted-foreground mt-1">Modify the details of your blog post below.</p>
      </div>
      <div className="bg-card p-6 md:p-8 rounded-lg shadow-sm border">
        <PostForm post={post} />
      </div>
    </div>
  );
}
