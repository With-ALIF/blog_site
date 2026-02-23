'use client';

import { useParams, notFound } from 'next/navigation';
import { PostForm } from '@/components/admin/post-form';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Post } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function EditPostPage({}: {}) {
  const params = useParams();
  const { slug } = params;

  const firestore = useFirestore();
  const postsQuery = useMemoFirebase(() => {
    if (!firestore || !slug) return null;
    const slugValue = Array.isArray(slug) ? slug[0] : slug;
    return query(collection(firestore, 'posts'), where('slug', '==', slugValue));
  }, [firestore, slug]);

  const { data: posts, isLoading } = useCollection<Post>(postsQuery);

  const post = posts?.[0];

  if (isLoading) {
    return (
        <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin" />
        </div>
    );
  }
  
  if (!isLoading && !post) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Edit Post</h1>
        <p className="text-md text-muted-foreground mt-1">Modify the details of your blog post below.</p>
      </div>
      <div className="bg-card p-6 md:p-8 rounded-lg shadow-sm border">
        {post && <PostForm post={post} />}
      </div>
    </div>
  );
}
