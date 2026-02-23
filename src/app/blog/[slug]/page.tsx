'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { useLanguage } from '@/contexts/language-context';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Clock, User, Twitter, Facebook, Linkedin, Languages, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { onDemandPostTranslation } from '@/ai/flows/on-demand-post-translation';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Post } from '@/lib/types';

type PostPageProps = {
  params: { slug: string };
};

function SocialShare({ title, url }: { title: string, url: string }) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Share:</span>
      <Button asChild variant="outline" size="icon" aria-label="Share on Twitter">
        <a href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`} target="_blank" rel="noopener noreferrer">
          <Twitter className="h-4 w-4" />
        </a>
      </Button>
      <Button asChild variant="outline" size="icon" aria-label="Share on Facebook">
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer">
          <Facebook className="h-4 w-4" />
        </a>
      </Button>
      <Button asChild variant="outline" size="icon" aria-label="Share on LinkedIn">
        <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`} target="_blank" rel="noopener noreferrer">
          <Linkedin className="h-4 w-4" />
        </a>
      </Button>
    </div>
  );
}

export default function PostPage({ params }: PostPageProps) {
  const { slug } = params;
  const { language, setLanguage } = useLanguage();
  const { toast } = useToast();
  
  const firestore = useFirestore();
  const postQuery = useMemoFirebase(() => {
      if (!firestore || !slug) return null;
      return query(collection(firestore, 'posts'), where('slug', '==', slug));
  }, [firestore, slug]);
  const { data: posts, isLoading } = useCollection<Post>(postQuery);
  const post = posts?.[0];

  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);
  
  useEffect(() => {
    // Reset translation when language is switched manually
    setTranslatedContent(null);
  }, [language]);

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center py-24">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  const handleTranslate = async () => {
    setIsTranslating(true);
    try {
      const targetLanguage = language === 'en' ? 'Bangla' : 'English';
      const contentToTranslate = language === 'en' ? post.content_en : post.content_bn;
      
      const result = await onDemandPostTranslation({
        content: contentToTranslate,
        targetLanguage: targetLanguage,
      });

      setTranslatedContent(result.translatedContent);
      setLanguage(language === 'en' ? 'bn' : 'en');
      toast({
        title: language === 'en' ? 'Translation Successful' : 'অনুবাদ সফল হয়েছে',
        description: language === 'en' ? `Post translated to ${targetLanguage}.` : `পোস্টটি ${targetLanguage}-এ অনুবাদ করা হয়েছে।`,
      });
    } catch (error) {
      console.error("Translation failed:", error);
      toast({
        variant: "destructive",
        title: language === 'en' ? 'Translation Failed' : 'অনুবাদ ব্যর্থ হয়েছে',
        description: language === 'en' ? 'Could not translate the post.' : 'পোস্টটি অনুবাদ করা যায়নি।',
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const title = language === 'en' ? post.title_en : post.title_bn;
  const content = translatedContent ?? (language === 'en' ? post.content_en : post.content_bn);

  return (
    <div className="container max-w-4xl py-12 md:py-20">
      <article>
        <header className="mb-8">
          <Badge variant="secondary" className="mb-4">{post.category}</Badge>
          <h1 className="font-headline text-3xl md:text-5xl font-bold leading-tight mb-4">{title}</h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground text-sm">
            <div className="flex items-center gap-2"><User className="h-4 w-4" /> {post.author}</div>
            <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> {format(new Date(post.date), 'MMMM d, yyyy')}</div>
          </div>
        </header>

        <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-8 shadow-lg">
          <Image src={post.imageUrl} alt={title} fill className="object-cover" priority data-ai-hint={post.imageHint} />
        </div>

        <div className="text-lg/relaxed space-y-6 text-foreground/90 max-w-none mx-auto mb-8">
          <p>{content}</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t pt-8">
          <SocialShare title={title} url={currentUrl} />
          <Button onClick={handleTranslate} disabled={isTranslating}>
            {isTranslating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Languages className="mr-2 h-4 w-4" />}
            {isTranslating ? (language === 'en' ? 'Translating...' : 'অনুবাদ হচ্ছে...') : (language === 'en' ? 'Translate to Bangla' : 'Translate to English')}
          </Button>
        </div>
      </article>

      <div className="mt-16 border-t pt-12">
        <h2 className="font-headline text-2xl font-bold mb-6">{language === 'en' ? 'Leave a Comment' : 'একটি মন্তব্য করুন'}</h2>
        <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder={language === 'en' ? 'Your Name' : 'আপনার নাম'} />
                <Input type="email" placeholder={language === 'en' ? 'Your Email' : 'আপনার ইমেল'} />
            </div>
            <Textarea placeholder={language === 'en' ? 'Your Comment' : 'আপনার মন্তব্য'} rows={5} />
            <Button type="submit">{language === 'en' ? 'Post Comment' : 'মন্তব্য পোস্ট করুন'}</Button>
        </form>
      </div>
    </div>
  );
}
