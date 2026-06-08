'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PostCard } from '@/components/blog/post-card';
import { Post, Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';
import { Loader2 } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

function BlogPageContent() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  
  const firestore = useFirestore();
  const postsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'posts'), where('status', 'in', ['published', 'scheduled'])) : null, [firestore]);
  const { data: posts, isLoading: isLoadingPosts } = useCollection<Post>(postsQuery);

  const categoriesCol = useMemoFirebase(() => firestore ? collection(firestore, 'categories') : null, [firestore]);
  const { data: categories, isLoading: isLoadingCategories } = useCollection<Category>(categoriesCol);

  const activeCategory = searchParams.get('category');
  
  const publishedPosts = useMemo(() => {
    if (!posts) return [];
    const now = Date.now();
    return posts.filter(p => p.status === 'published' || (p.status === 'scheduled' && p.date <= now));
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (activeCategory) {
      return publishedPosts.filter(post => post.category === activeCategory);
    }
    return publishedPosts;
  }, [activeCategory, publishedPosts]);

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredPosts, currentPage]);
  
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const pageTitle = language === 'en' ? 'Blog' : 'ব্লগ';
  const allCategories = language === 'en' ? 'All' : 'সব';

  const isLoading = isLoadingPosts || isLoadingCategories;

  return (
    <div className="container px-4 py-12 md:py-24">
      <h1 className="text-3xl sm:text-5xl font-bold font-headline text-center mb-8 md:mb-12">{pageTitle}</h1>

      <div className="flex justify-center flex-wrap gap-2 mb-8 md:mb-12">
        <Button asChild variant={!activeCategory ? 'default' : 'outline'} className="rounded-full px-6">
          <Link href="/blog">{allCategories}</Link>
        </Button>
        {categories?.map(category => (
          <Button asChild key={category.id} variant={activeCategory === category.name ? 'default' : 'outline'} className="rounded-full px-6">
            <Link href={`/blog?category=${category.name}`}>{category.name}</Link>
          </Button>
        ))}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : paginatedPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {paginatedPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-muted/20">
          <h3 className="text-xl md:text-2xl font-bold font-headline mb-2">{language === 'en' ? 'No Posts Found' : 'কোনো পোস্ট পাওয়া যায়নি'}</h3>
          <p className="text-muted-foreground">{language === 'en' ? 'Try a different category.' : 'ভিন্ন বিভাগ চেষ্টা করুন।'}</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-12 gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <Button 
              key={page} 
              variant={currentPage === page ? 'default' : 'outline'}
              onClick={() => setCurrentPage(page)}
              className="w-10 h-10 p-0 rounded-full"
            >
              {page}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="container text-center py-24"><Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" /></div>}>
      <BlogPageContent />
    </Suspense>
  );
}
