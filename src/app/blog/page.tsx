'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PostCard } from '@/components/blog/post-card';
import { Post, Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/language-context';
import { Search, Loader2 } from 'lucide-react';
import { semanticBlogPostSearch, SemanticBlogPostSearchOutput } from '@/ai/flows/semantic-blog-post-search-flow';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

function BlogPageContent() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  
  const firestore = useFirestore();
  const postsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'posts'), where('status', 'in', ['published', 'scheduled'])) : null, [firestore]);
  const { data: posts, isLoading: isLoadingPosts } = useCollection<Post>(postsQuery);

  const categoriesCol = useMemoFirebase(() => firestore ? collection(firestore, 'categories') : null, [firestore]);
  const { data: categories, isLoading: isLoadingCategories } = useCollection<Category>(categoriesCol);

  const activeCategory = searchParams.get('category');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    setIsSearching(true);
    setCurrentPage(1);
    try {
      // NOTE: Semantic search still uses mock data. This should be updated in a real scenario.
      const result: SemanticBlogPostSearchOutput = await semanticBlogPostSearch({ query: searchQuery });
      const foundPosts = result.blogPosts
        .map(bp => posts?.find(p => p.id === bp.id))
        .filter((p): p is Post => {
            if (!p) return false;
            const isVisible = p.status === 'published' || (p.status === 'scheduled' && p.date <= Date.now());
            return Boolean(p) && isVisible;
        });

      setSearchResults(foundPosts);
      if(foundPosts.length === 0) {
        toast({
            title: language === 'en' ? 'No results' : 'কোনো ফলাফল পাওয়া যায়নি',
            description: language === 'en' ? 'No posts matched your search.' : 'আপনার অনুসন্ধানের সাথে কোনো পোস্ট মেলেনি।',
        });
      }
    } catch (error) {
      console.error("Search failed:", error);
      toast({
        variant: "destructive",
        title: language === 'en' ? 'Search Error' : 'অনুসন্ধানে ত্রুটি',
        description: language === 'en' ? 'Something went wrong during the search.' : 'অনুসন্ধানের সময় কিছু ভুল হয়েছে।',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const publishedPosts = useMemo(() => {
    if (!posts) return [];
    const now = Date.now();
    return posts.filter(p => p.status === 'published' || (p.status === 'scheduled' && p.date <= now));
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (searchResults) return searchResults;
    if (activeCategory) {
      return publishedPosts.filter(post => post.category === activeCategory);
    }
    return publishedPosts;
  }, [activeCategory, searchResults, publishedPosts]);

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredPosts, currentPage]);
  
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const pageTitle = language === 'en' ? 'Blog' : 'ব্লগ';
  const allCategories = language === 'en' ? 'All' : 'সব';

  const isLoading = isLoadingPosts || isLoadingCategories;

  return (
    <div className="container py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-bold font-headline text-center mb-4">{pageTitle}</h1>
      <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
        {language === 'en' ? 'Insights on Tech, Education, and Lifestyle.' : 'প্রযুক্তি, শিক্ষা, এবং জীবনধারা নিয়ে অন্তর্দৃষ্টি।'}
      </p>

      <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8 flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder={language === 'en' ? 'Search posts...' : 'পোস্ট খুঁজুন...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={isSearching || isLoading}>
          {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
          {language === 'en' ? 'Search' : 'অনুসন্ধান'}
        </Button>
      </form>

      <div className="flex justify-center flex-wrap gap-2 mb-12">
        <Button asChild variant={!activeCategory ? 'default' : 'outline'}>
          <Link href="/blog">{allCategories}</Link>
        </Button>
        {categories?.map(category => (
          <Button asChild key={category.id} variant={activeCategory === category.name ? 'default' : 'outline'}>
            <Link href={`/blog?category=${category.name}`}>{category.name}</Link>
          </Button>
        ))}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      ) : paginatedPosts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h3 className="text-2xl font-bold font-headline mb-2">{language === 'en' ? 'No Posts Found' : 'কোনো পোস্ট পাওয়া যায়নি'}</h3>
          <p className="text-muted-foreground">{language === 'en' ? 'Try a different search or category.' : 'ভিন্ন অনুসন্ধান বা বিভাগ চেষ্টা করুন।'}</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-12 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <Button 
              key={page} 
              variant={currentPage === page ? 'default' : 'outline'}
              onClick={() => setCurrentPage(page)}
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
    <Suspense fallback={<div className="container text-center py-24"><Loader2 className="h-12 w-12 animate-spin mx-auto" /></div>}>
      <BlogPageContent />
    </Suspense>
  );
}
