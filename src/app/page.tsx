'use client';

import { useMemo } from 'react';
import { PostCard } from '@/components/blog/post-card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';
import { heroImage } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { Post } from '@/lib/types';


export default function Home() {
  const { language } = useLanguage();
  
  const firestore = useFirestore();

  const publicPostsQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'posts'), where('status', 'in', ['published', 'scheduled'])) : null, 
  [firestore]);

  const { data: publicPosts, isLoading } = useCollection<Post>(publicPostsQuery);

  const visiblePosts = useMemo(() => {
    if (!publicPosts) return [];
    const now = Date.now();
    return publicPosts.filter(p => p.status === 'published' || (p.status === 'scheduled' && p.date <= now));
  }, [publicPosts]);

  const featuredPosts = visiblePosts.slice(0, 2);
  const latestPosts = visiblePosts.slice(0, 6);

  const heroContent = {
    en: {
      headline: 'Explore Worlds, One Word at a Time.',
      subheadline: 'Your bilingual portal to insightful articles on technology, education, and lifestyle. Switch between English and Bangla seamlessly.',
      cta: 'Explore Blog',
    },
    bn: {
      headline: 'পৃথিবী ঘুরে দেখুন, একবারে একটি শব্দ।',
      subheadline: 'প্রযুক্তি, শিক্ষা এবং জীবনধারা সম্পর্কিত অন্তর্দৃষ্টিপূর্ণ নিবন্ধগুলির জন্য আপনার দ্বিভাষিক পোর্টাল। ইংরেজি এবং বাংলার মধ্যে নির্বিঘ্নে পরিবর্তন করুন।',
      cta: 'ব্লগ দেখুন',
    },
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center text-center text-white">
        <Image 
          src={heroImage.imageUrl} 
          alt="Abstract background with language characters" 
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-3xl px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-headline mb-4 leading-tight shadow-lg">
            {heroContent[language].headline}
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
            {heroContent[language].subheadline}
          </p>
          <Button asChild size="lg" className="font-bold">
            <Link href="/blog">{heroContent[language].cta} <ArrowRight className="ml-2" /></Link>
          </Button>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl sm:text-4xl font-bold font-headline text-center mb-12">
            {language === 'en' ? 'Featured Posts' : 'বৈশিষ্ট্যযুক্ত পোস্ট'}
          </h2>
          {isLoading ? (
            <div className="flex justify-center"><Loader2 className="h-10 w-10 animate-spin" /></div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest Posts */}
      <section className="py-16 md:py-24 bg-card/50">
        <div className="container">
          <h2 className="text-3xl sm:text-4xl font-bold font-headline text-center mb-12">
            {language === 'en' ? 'Latest Posts' : 'সর্বশেষ পোস্ট'}
          </h2>
           {isLoading ? (
            <div className="flex justify-center"><Loader2 className="h-10 w-10 animate-spin" /></div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/blog">{language === 'en' ? 'View All Posts' : 'সমস্ত পোস্ট দেখুন'}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
