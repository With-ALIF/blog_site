'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { useLanguage } from '@/contexts/language-context';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { 
  Clock, 
  User, 
  Facebook, 
  Linkedin, 
  Loader2, 
  AlertTriangle, 
  MessageSquare, 
  Link as LucideLink,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, useUser } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import type { Post, Comment } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { sendTelegramNotification } from '@/ai/flows/send-telegram-notification';


function SocialShare({ title, url }: { title: string, url: string }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "The article link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Please copy the URL from your browser's address bar.",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground hidden sm:inline">Share:</span>
      <Button asChild variant="outline" size="icon" className="h-8 w-8" aria-label="Share on Facebook">
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer">
          <Facebook className="h-4 w-4" />
        </a>
      </Button>
      <Button asChild variant="outline" size="icon" className="h-8 w-8" aria-label="Share on LinkedIn">
        <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`} target="_blank" rel="noopener noreferrer">
          <Linkedin className="h-4 w-4" />
        </a>
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-8 w-8" 
        aria-label="Copy Link"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <LucideLink className="h-4 w-4" />}
      </Button>
    </div>
  );
}

const createCommentSchema = (language: 'en' | 'bn') => z.object({
    authorName: z.string().min(2, { message: language === 'en' ? 'Name must be at least 2 characters.' : 'নাম কমপক্ষে ২ অক্ষরের হতে হবে।' }),
    authorEmail: z.string().email({ message: language === 'en' ? 'Invalid email address.' : 'অবৈধ ইমেল ঠিকানা।' }),
    content: z.string().min(3, { message: language === 'en' ? 'Comment must be at least 3 characters.' : 'মন্তব্য কমপক্ষে ৩ অক্ষরের হতে হবে।' }),
});


function CommentForm({ postId, postTitle, language }: { postId: string; postTitle: string; language: 'en' | 'bn' }) {
    const { toast } = useToast();
    const firestore = useFirestore();
    const commentSchema = createCommentSchema(language);
    
    const form = useForm<z.infer<typeof commentSchema>>({
        resolver: zodResolver(commentSchema),
        defaultValues: { authorName: '', authorEmail: '', content: '' },
    });

    const { isSubmitting } = form.formState;

    async function onSubmit(values: z.infer<typeof commentSchema>) {
        if (!firestore) return;
        const commentsCol = collection(firestore, 'posts', postId, 'comments');
        
        addDocumentNonBlocking(commentsCol, {
            ...values,
            postId,
            postTitle,
            createdAt: Date.now(),
        });

        // Send Telegram notification (Awaited for Serverless reliability)
        await sendTelegramNotification({
            type: 'comment',
            authorName: values.authorName,
            email: values.authorEmail,
            postTitle: postTitle,
            commentContent: values.content,
        });
        
        toast({
            title: language === 'en' ? 'Comment Posted!' : 'মন্তব্য পোস্ট করা হয়েছে!',
            description: language === 'en' ? 'Your comment is now live.' : 'আপনার মন্তব্য এখন লাইভ।',
        });
        form.reset();
    }

    const content = {
        en: {
            title: 'Leave a Comment',
            namePlaceholder: 'Your Name',
            emailPlaceholder: 'Your Email',
            commentPlaceholder: 'Your Comment',
            submit: 'Post Comment',
            submitting: 'Posting...',
        },
        bn: {
            title: 'একটি মন্তব্য করুন',
            namePlaceholder: 'আপনার নাম',
            emailPlaceholder: 'আপনার ইমেল',
            commentPlaceholder: 'আপনার মন্তব্য',
            submit: 'মন্তব্য পোস্ট করুন',
            submitting: 'পোস্ট হচ্ছে...',
        }
    };

    return (
        <div className="mt-16 border-t pt-12">
            <h2 className="font-headline text-2xl font-bold mb-6">{content[language].title}</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="authorName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder={content[language].namePlaceholder} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="authorEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input type="email" placeholder={content[language].emailPlaceholder} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea placeholder={content[language].commentPlaceholder} rows={5} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSubmitting ? content[language].submitting : content[language].submit}
                    </Button>
                </form>
            </Form>
        </div>
    );
}

function CommentList({ postId, language }: { postId: string; language: 'en' | 'bn'}) {
    const firestore = useFirestore();

    const commentsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'posts', postId, 'comments'), orderBy('createdAt', 'desc'));
    }, [firestore, postId]);
    
    const { data: comments, isLoading, error } = useCollection<Comment>(commentsQuery);
    
    const content = {
        en: {
            title: 'Comments',
            noComments: 'No comments yet. Be the first to comment!',
            loading: 'Loading comments...',
            error: 'Could not load comments.',
        },
        bn: {
            title: 'মন্তব্যসমূহ',
            noComments: 'এখনও কোনো মন্তব্য নেই। প্রথম মন্তব্যকারী হন!',
            loading: 'মন্তব্য লোড হচ্ছে...',
            error: 'মন্তব্য লোড করা যায়নি।',
        }
    };
    
    return (
        <div className="mt-12">
            <h2 className="font-headline text-2xl font-bold mb-6 flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-primary" /> {content[language].title} ({comments?.length || 0})
            </h2>
            <div className="space-y-6">
                {isLoading && <p className="text-muted-foreground animate-pulse">{content[language].loading}</p>}
                {error && <p className="text-destructive">{content[language].error}</p>}
                {!isLoading && !error && comments?.length === 0 && <p className="text-muted-foreground italic">{content[language].noComments}</p>}
                {comments?.map(comment => (
                    <div key={comment.id} className="flex gap-4 group">
                        <Avatar className="h-10 w-10 border shadow-sm">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.authorName}`} alt={comment.authorName} />
                            <AvatarFallback className="bg-primary/5">{comment.authorName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 bg-muted/20 p-4 rounded-2xl">
                           <div className="flex justify-between items-start mb-1">
                                <div>
                                    <p className="font-semibold text-sm">{comment.authorName}</p>
                                    <p className="text-[10px] text-muted-foreground">{format(new Date(comment.createdAt), 'MMM d, yyyy HH:mm')}</p>
                                </div>
                           </div>
                           <p className="text-sm text-foreground/90 leading-relaxed">{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

}

export default function PostPage() {
  const params = useParams();
  const slug = (Array.isArray(params.slug) ? params.slug[0] : params.slug) as string;
  const { language } = useLanguage();
  const { user } = useUser();
  
  const firestore = useFirestore();
  const postQuery = useMemoFirebase(() => {
      if (!firestore || !slug) return null;
      return query(collection(firestore, 'posts'), where('slug', '==', slug));
  }, [firestore, slug]);
  
  const { data: posts, isLoading, error } = useCollection<Post>(postQuery);
  const post = posts?.[0];

  const canView = post && (post.status === 'published' || (post.status === 'scheduled' && post.date <= Date.now()) || !!user);

  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
        setCurrentUrl(`${window.location.origin}/blog/${slug}`);
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center py-32">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !post || !canView) {
    if (!isLoading && !post) notFound();
    return (
        <div className="container max-w-4xl py-20">
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Problem Loading Post</AlertTitle>
                <AlertDescription>
                    We encountered an issue. Please check your connection or try again later.
                </AlertDescription>
            </Alert>
        </div>
    );
  }

  const title = language === 'en' ? post.title_en : post.title_bn;
  const content = language === 'en' ? post.content_en : post.content_bn;

  return (
    <div className="container max-w-4xl py-8 md:py-16">
      <article>
        <header className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-muted-foreground text-xs mb-6 border-b pb-4">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {post.author}</div>
                    <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {format(new Date(post.date), 'MMMM d, yyyy')}</div>
                </div>
                <SocialShare title={title} url={currentUrl} />
            </div>
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-none px-4">{post.category}</Badge>
            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8 text-foreground">{title}</h1>
        </header>

        <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden mb-10 shadow-2xl">
          <Image src={post.imageUrl} alt={title} fill className="object-cover transition-transform duration-700 hover:scale-105" priority data-ai-hint={post.imageHint} />
        </div>

        <div className="prose dark:prose-invert prose-slate lg:prose-xl max-w-none mx-auto mb-12 prose-headings:font-headline prose-a:text-primary">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      </article>
      
      <CommentList postId={post.id} language={language} />

      <CommentForm postId={post.id} postTitle={post.title_en} language={language} />

    </div>
  );
}