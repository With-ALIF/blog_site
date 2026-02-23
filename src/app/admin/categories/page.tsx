'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Trash2, PlusCircle, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc, query, where } from 'firebase/firestore';
import type { Category, Post } from '@/lib/types';

export default function CategoriesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState('');
  
  const firestore = useFirestore();
  const categoriesCol = useMemoFirebase(() => firestore ? collection(firestore, 'categories') : null, [firestore]);
  const { data: categories, isLoading: isLoadingCategories } = useCollection<Category>(categoriesCol);

  const postsCol = useMemoFirebase(() => firestore ? collection(firestore, 'posts') : null, [firestore]);
  const { data: posts } = useCollection<Post>(postsCol);

  const categoryPostCounts = useMemoFirebase(() => {
    if (!categories || !posts) return {};
    return categories.reduce((acc, category) => {
        acc[category.name] = posts.filter(p => p.category === category.name).length;
        return acc;
    }, {} as Record<string, number>);
  }, [categories, posts]);

  const handleDelete = () => {
    if (!categoryToDelete || !firestore) return;
    
    if ((categoryPostCounts as Record<string, number>)[categoryToDelete.name] > 0) {
      toast({
        variant: 'destructive',
        title: 'Category in Use',
        description: 'You cannot delete a category with associated posts.',
      });
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
      return;
    }
    
    deleteDocumentNonBlocking(doc(firestore, 'categories', categoryToDelete.id));
    
    setIsDeleteDialogOpen(false);
    setCategoryToDelete(null);
    
    toast({
        title: 'Category Deleted',
        description: 'The category has been removed.',
    });
  };
  
  const openDeleteDialog = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };
  
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoriesCol) return;
    const trimmedCategory = newCategory.trim();
    if (!trimmedCategory) return;

    if (categories?.find(c => c.name.toLowerCase() === trimmedCategory.toLowerCase())) {
        toast({
            variant: 'destructive',
            title: 'Category exists',
            description: 'This category already exists.',
        });
        return;
    }

    addDocumentNonBlocking(categoriesCol, { name: trimmedCategory });
    setNewCategory('');

    toast({
        title: 'Category Created',
        description: `The category "${trimmedCategory}" has been added.`,
    });
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
              <h1 className="text-3xl md:text-4xl font-bold font-headline">Manage Categories</h1>
              <p className="text-md text-muted-foreground mt-1">Add or remove blog categories.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
            <Card className="p-6 shadow-sm border">
                <h2 className="text-2xl font-bold font-headline mb-4">Add New Category</h2>
                <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-2">
                    <Input 
                        placeholder="New category name..."
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="flex-grow"
                    />
                    <Button type="submit" className="w-full sm:w-auto">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add
                    </Button>
                </form>
            </Card>

            <Card className="shadow-sm border">
                <h2 className="text-2xl font-bold font-headline p-6">Existing Categories</h2>
                <div className="overflow-hidden">
                    {isLoadingCategories ? (
                        <div className="flex justify-center items-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className="w-[100px] text-center">Posts</TableHead>
                            <TableHead className="text-right w-[100px]">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {categories?.map((category) => (
                            <TableRow key={category.id}>
                            <TableCell className="font-medium">{category.name}</TableCell>
                            <TableCell className="text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground"/>
                                    {(categoryPostCounts as Record<string, number>)[category.name] || 0}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(category)}>
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                    <span className="sr-only">Delete</span>
                                </Button>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    )}
                </div>
            </Card>
        </div>
      </div>

       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. You can only delete categories that have no posts associated with them.
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
