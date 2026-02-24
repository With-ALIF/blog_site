'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Post, postStatuses, Category, PostStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Eye, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const formSchema = z.object({
  title_en: z.string().min(2, { message: 'English title must be at least 2 characters.' }),
  title_bn: z.string().min(2, { message: 'Bangla title must be at least 2 characters.' }),
  excerpt_en: z.string().min(10, { message: 'English excerpt must be at least 10 characters.' }),
  excerpt_bn: z.string().min(10, { message: 'Bangla excerpt must be at least 10 characters.' }),
  content_en: z.string().min(20, { message: 'English content must be at least 20 characters.' }),
  content_bn: z.string().min(20, { message: 'Bangla content must be at least 20 characters.' }),
  category: z.string().min(1, { message: 'A category is required.' }),
  author: z.string().min(2, { message: 'Author name must be at least 2 characters.' }),
  status: z.enum(postStatuses),
  date: z.date({ required_error: 'A publication date is required.' }),
  imageUrl: z.string().optional().or(z.literal('')),
  imageHint: z.string().max(40, {message: 'Image hint should be one or two words.'}).optional(),
});

type PostFormValues = z.infer<typeof formSchema>;

interface PostFormProps {
  post?: Post;
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!post;
  
  const firestore = useFirestore();
  const categoriesCol = useMemoFirebase(() => firestore ? collection(firestore, 'categories') : null, [firestore]);
  const { data: categories } = useCollection<Category>(categoriesCol);
  
  const [imagePreview, setImagePreview] = useState<string | null>(post?.imageUrl || null);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title_en: post?.title_en || '',
      title_bn: post?.title_bn || '',
      excerpt_en: post?.excerpt_en || '',
      excerpt_bn: post?.excerpt_bn || '',
      content_en: post?.content_en || '',
      content_bn: post?.content_bn || '',
      category: post?.category || categories?.[0]?.name || '',
      author: post?.author || 'Admin',
      status: post?.status || 'pending',
      date: post ? new Date(post.date) : new Date(),
      imageUrl: post?.imageUrl || '',
      imageHint: post?.imageHint || '',
    },
  });

  const watchedValues = form.watch();

  function onSubmit(values: PostFormValues) {
    if (!firestore) return;
    const slug = values.title_en.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    
    let finalStatus: PostStatus = values.status;
    if (values.status === 'published' && values.date.getTime() > Date.now()) {
      finalStatus = 'scheduled';
      toast({
        title: 'Post Scheduled',
        description: 'This post is scheduled for future publication.',
      });
    }

    const postData = {
        ...values,
        slug,
        date: values.date.getTime(),
        status: finalStatus,
        imageUrl: values.imageUrl || `https://picsum.photos/seed/${Math.random()}/1200/800`,
        imageHint: values.imageHint || 'abstract placeholder',
    };

    if (isEditing && post) {
        const postRef = doc(firestore, 'posts', post.id);
        setDocumentNonBlocking(postRef, postData , { merge: true });
        toast({
            title: 'Post Updated!',
            description: 'Your blog post has been successfully updated.',
        });
    } else {
        const postsCol = collection(firestore, 'posts');
        addDocumentNonBlocking(postsCol, postData);
        toast({
            title: 'Post Created!',
            description: 'Your new blog post has been successfully created.',
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                      {categories?.map(cat => <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>)}
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
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Publication Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP HH:mm")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                            if (!date) return;
                            const newDate = new Date(field.value);
                            date.setHours(newDate.getHours());
                            date.setMinutes(newDate.getMinutes());
                            field.onChange(date);
                        }}
                        initialFocus
                      />
                      <div className="p-3 border-t border-border">
                        <Input 
                            type="time"
                            defaultValue={format(field.value, "HH:mm")}
                            onChange={(e) => {
                                const [hours, minutes] = e.target.value.split(':').map(Number);
                                const newDate = new Date(field.value);
                                newDate.setHours(hours);
                                newDate.setMinutes(minutes);
                                field.onChange(newDate);
                            }}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Set a future date to schedule the post.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 pt-4 border-t">
           <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post Image</FormLabel>
                <Tabs defaultValue={field.value?.startsWith('data:image') ? 'upload' : 'link'} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                    <TabsTrigger value="link">Link</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload" className="pt-2">
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/png, image/jpeg, image/gif, image/webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                              toast({
                                variant: 'destructive',
                                title: 'File too large',
                                description: 'Please upload an image smaller than 2MB.',
                              });
                              e.target.value = '';
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const result = reader.result as string;
                              field.onChange(result);
                              setImagePreview(result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload an image (max 2MB).
                    </FormDescription>
                  </TabsContent>
                  <TabsContent value="link" className="pt-2">
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        value={field.value?.startsWith('http') ? field.value : ''}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setImagePreview(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a direct URL to an image.
                    </FormDescription>
                  </TabsContent>
                </Tabs>
                
                {imagePreview && (
                  <div className="mt-4 relative aspect-video rounded-lg overflow-hidden">
                    <Image src={imagePreview} alt="Image Preview" fill className="object-cover" />
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageHint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image Hint</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 'mountain hike'" {...field} />
                </FormControl>
                <FormDescription>
                  One or two keywords for AI image search if no image is uploaded.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">Cancel</Button>
            
            <Dialog>
                <DialogTrigger asChild>
                    <Button type="button" variant="outline" className="w-full sm:w-auto">
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Post Preview</DialogTitle>
                    </DialogHeader>
                    <div className="flex-grow overflow-y-auto pr-6 -mr-6">
                        <Tabs defaultValue="en_preview" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="en_preview">English</TabsTrigger>
                                <TabsTrigger value="bn_preview">Bangla</TabsTrigger>
                            </TabsList>
                            <TabsContent value="en_preview">
                                <article className="prose dark:prose-invert max-w-none mx-auto py-6">
                                    <h1>{watchedValues.title_en}</h1>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {watchedValues.content_en}
                                    </ReactMarkdown>
                                </article>
                            </TabsContent>
                            <TabsContent value="bn_preview">
                                 <article className="prose dark:prose-invert max-w-none mx-auto py-6">
                                    <h1>{watchedValues.title_bn}</h1>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {watchedValues.content_bn}
                                    </ReactMarkdown>
                                </article>
                            </TabsContent>
                        </Tabs>
                    </div>
                </DialogContent>
            </Dialog>

            <Button type="submit" className="w-full sm:w-auto">{isEditing ? 'Update Post' : 'Create Post'}</Button>
        </div>
      </form>
    </Form>
  );
}
