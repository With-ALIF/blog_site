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
import { collection, query, where } from 'firebase/firestore';
import { Post } from '@/lib/types';
import { SubscriptionForm } from '@/components/home/subscription-form';


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
      subheadline: 'Your bilingual portal to insightful articles on technology, education, and lifestyle.',
      cta: 'Explore Blog',
    },
    bn: {
      headline: 'পৃথিবী ঘুরে দেখুন, একবারে একটি শব্দ।',
      subheadline: 'প্রযুক্তি, শিক্ষা এবং জীবনধারা সম্পর্কিত অন্তর্দৃষ্টিপূর্ণ নিবন্ধগুলির জন্য আপনার দ্বিভাষিক পোর্টাল।',
      cta: 'ব্লগ দেখুন',
    },
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white overflow-hidden py-12">
        <Image 
          src={heroImage.imageUrl} 
          alt="Abstract background with language characters" 
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-4xl px-4 sm:px-6">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold font-headline mb-4 md:mb-6 leading-tight drop-shadow-2xl">
            {heroContent[language].headline}
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-slate-200 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
            {heroContent[language].subheadline}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="font-bold h-12 px-8 w-full sm:w-auto">
              <Link href="/blog">{heroContent[language].cta} <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-12 md:py-24">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <h2 className="text-xl sm:text-4xl font-bold font-headline">
              {language === 'en' ? 'Featured Posts' : 'বৈশিষ্ট্যযুক্ত পোস্ট'}
            </h2>
            <div className="h-1 flex-1 mx-4 bg-primary/10 hidden sm:block rounded-full"></div>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              {featuredPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest Posts */}
      <section className="py-12 md:py-24 bg-muted/30">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <h2 className="text-xl sm:text-4xl font-bold font-headline">
              {language === 'en' ? 'Latest Updates' : 'সর্বশেষ আপডেট'}
            </h2>
             <Button asChild variant="ghost" className="hidden md:flex gap-2">
              <Link href="/blog">{language === 'en' ? 'Browse All' : 'সব দেখুন'} <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
           {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {latestPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
          <div className="text-center mt-10 md:hidden">
            <Button asChild variant="outline" className="w-full">
              <Link href="/blog">{language === 'en' ? 'View All Posts' : 'সমস্ত পোস্ট দেখুন'}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Subscription Section */}
      <SubscriptionForm />
    </>
  );
}
