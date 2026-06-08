'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Post, Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, PlusCircle, FileText, CheckCircle, Tags, Loader2, CalendarClock } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';


export default function AdminDashboardPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const firestore = useFirestore();
  const postsCol = useMemoFirebase(() => firestore ? collection(firestore, 'posts') : null, [firestore]);
  const { data: posts, isLoading: isLoadingPosts } = useCollection<Post>(postsCol);
  
  const categoriesCol = useMemoFirebase(() => firestore ? collection(firestore, 'categories') : null, [firestore]);
  const { data: categories, isLoading: isLoadingCategories } = useCollection<Category>(categoriesCol);

  const handleDelete = () => {
    if (!postToDelete || !firestore) return;
    
    deleteDocumentNonBlocking(doc(firestore, 'posts', postToDelete.id));
    
    setIsDeleteDialogOpen(false);
    setPostToDelete(null);
    
    toast({
        title: 'Post Deleted',
        description: 'The blog post has been removed.',
    });
  };
  
  const openDeleteDialog = (post: Post) => {
    setPostToDelete(post);
    setIsDeleteDialogOpen(true);
  };
  
  const handleCreate = () => {
    router.push('/admin/posts/new');
  };

  const handleEdit = (slug: string) => {
    router.push(`/admin/posts/edit/${slug}`);
  };

  const totalPosts = posts?.length || 0;
  const scheduledPostsCount = posts?.filter(post => post.status === 'scheduled').length || 0;
  const publishedPostsCount = posts?.filter(post => post.status === 'published').length || 0;

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-headline">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">An overview of your blog's content.</p>
        </div>
        <Button onClick={handleCreate} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Post
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingPosts ? <Loader2 className="h-6 w-6 animate-spin" /> : totalPosts}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingPosts ? <Loader2 className="h-6 w-6 animate-spin" /> : publishedPostsCount}</div>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2 lg:col-span-1 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <CalendarClock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingPosts ? <Loader2 className="h-6 w-6 animate-spin" /> : scheduledPostsCount}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl font-bold font-headline">Recent Posts</h2>
      </div>

      <div className="bg-card rounded-lg shadow-sm overflow-hidden border">
        {isLoadingPosts ? (
            <div className="flex justify-center items-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[180px]">Title</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    No posts found. Start by creating your first post!
                  </TableCell>
                </TableRow>
              ) : (
                posts?.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium max-w-[180px] sm:max-w-xs truncate">
                      {language === 'en' ? post.title_en : post.title_bn}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{post.category}</TableCell>
                     <TableCell>
                      <Badge variant={post.status === 'published' ? 'default' : 'outline'} className="capitalize text-[10px] md:text-xs">
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground text-xs whitespace-nowrap">
                      {new Date(post.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(post.slug)}>
                            Edit Post
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openDeleteDialog(post)} className="text-red-600 focus:text-red-600">
                            Delete Post
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        )}
      </div>

       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent className="w-[90vw] max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the post.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground w-full sm:w-auto">
                        Delete Post
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
       </AlertDialog>
    </>
  );
}
