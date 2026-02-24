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
import { MoreHorizontal, PlusCircle, FileText, Clock, CheckCircle, Tags, Loader2, CalendarClock } from 'lucide-react';
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
  const pendingPostsCount = posts?.filter(post => post.status === 'pending').length || 0;
  const scheduledPostsCount = posts?.filter(post => post.status === 'scheduled').length || 0;
  const publishedPostsCount = posts?.filter(post => post.status === 'published').length || 0;

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
            <p className="text-muted-foreground mt-1">An overview of your blog's content.</p>
        </div>
        <Button onClick={handleCreate} className="w-full md:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Post
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingPosts ? <Loader2 className="h-6 w-6 animate-spin" /> : totalPosts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingPosts ? <Loader2 className="h-6 w-6 animate-spin" /> : publishedPostsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Posts</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingPosts ? <Loader2 className="h-6 w-6 animate-spin" /> : scheduledPostsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Posts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingPosts ? <Loader2 className="h-6 w-6 animate-spin" /> : pendingPostsCount}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold font-headline">Manage Posts</h2>
      </div>

      <div className="bg-card rounded-lg shadow-sm overflow-hidden border">
        {isLoadingPosts ? (
            <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts?.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium max-w-xs truncate">{language === 'en' ? post.title_en : post.title_bn}</TableCell>
                <TableCell className="hidden md:table-cell">{post.category}</TableCell>
                 <TableCell className="hidden md:table-cell">
                  <Badge variant={post.status === 'published' ? 'default' : post.status === 'scheduled' ? 'outline' : 'secondary'} className="capitalize">
                    {post.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{new Date(post.date).toLocaleDateString()}</TableCell>
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
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => openDeleteDialog(post)} className="text-red-600 focus:text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </div>

       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the post.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
       </AlertDialog>
    </>
  );
}
