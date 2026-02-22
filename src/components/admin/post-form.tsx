'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Post, categories, postStatuses } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { posts } from '@/lib/data';

const formSchema = z.object({
  title_en: z.string().min(2, { message: 'English title must be at least 2 characters.' }),
  title_bn: z.string().min(2, { message: 'Bangla title must be at least 2 characters.' }),
  excerpt_en: z.string().min(10, { message: 'English excerpt must be at least 10 characters.' }),
  excerpt_bn: z.string().min(10, { message: 'Bangla excerpt must be at least 10 characters.' }),
  content_en: z.string().min(20, { message: 'English content must be at least 20 characters.' }),
  content_bn: z.string().min(20, { message: 'Bangla content must be at least 20 characters.' }),
  category: z.enum(categories),
  author: z.string().min(2, { message: 'Author name must be at least 2 characters.' }),
  status: z.enum(postStatuses),
});

type PostFormValues = z.infer<typeof formSchema>;

interface PostFormProps {
  post?: Post;
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!post;

  const form = useForm<PostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title_en: post?.title_en || '',
      title_bn: post?.title_bn || '',
      excerpt_en: post?.excerpt_en || '',
      excerpt_bn: post?.excerpt_bn || '',
      content_en: post?.content_en || '',
      content_bn: post?.content_bn || '',
      category: post?.category || 'Tech',
      author: post?.author || 'Admin',
      status: post?.status || 'pending',
    },
  });

  function onSubmit(values: PostFormValues) {
    // This is a mock submission that mutates the in-memory array.
    if (isEditing && post) {
        const postIndex = posts.findIndex(p => p.id === post.id);
        if (postIndex !== -1) {
            const updatedPost: Post = {
                ...posts[postIndex],
                ...values,
                slug: values.title_en.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
            };
            posts[postIndex] = updatedPost;
        }
        toast({
            title: 'Post Updated!',
            description: 'Your blog post has been successfully updated (simulation).',
        });
    } else {
        const newPost: Post = {
            id: String(Date.now()),
            slug: values.title_en.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
            ...values,
            date: new Date().toISOString(),
            imageUrl: `https://picsum.photos/seed/${Math.random()}/1200/800`,
            imageHint: 'abstract placeholder'
        };
        posts.unshift(newPost);
        toast({
            title: 'Post Created!',
            description: 'Your new blog post has been successfully created (simulation).',
        });
    }
    
    router.push('/admin/dashboard');
    router.refresh(); 
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center md:text-left">English</h3>
                <FormField
                  control={form.control}
                  name="title_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="English Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="excerpt_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Short summary in English..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Full blog post content in English..." className="min-h-[200px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center md:text-left">Bangla</h3>
                <FormField
                  control={form.control}
                  name="title_bn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>শিরোনাম</FormLabel>
                      <FormControl>
                        <Input placeholder="বাংলা শিরোনাম" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="excerpt_bn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>সারসংক্ষেপ</FormLabel>
                      <FormControl>
                        <Textarea placeholder="সংক্ষিপ্ত সারসংক্ষেপ বাংলায়..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content_bn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>বিষয়বস্তু</FormLabel>
                      <FormControl>
                        <Textarea placeholder="সম্পূর্ণ ব্লগ পোস্ট বাংলায়..." className="min-h-[200px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input placeholder="Author's name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {postStatuses.map(status => <SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        
        <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit">{isEditing ? 'Update Post' : 'Create Post'}</Button>
        </div>
      </form>
    </Form>
  );
}
