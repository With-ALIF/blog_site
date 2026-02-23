'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { categories } from '@/lib/data';
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
import { Trash2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

export default function CategoriesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState('');

  const handleDelete = () => {
    if (!categoryToDelete) return;
    
    const categoryIndex = categories.findIndex(c => c === categoryToDelete);
    if (categoryIndex > -1) {
      categories.splice(categoryIndex, 1);
    }
    
    setIsDeleteDialogOpen(false);
    setCategoryToDelete(null);
    
    toast({
        title: 'Category Deleted',
        description: 'The category has been removed (this is a simulation).',
    });
    
    router.refresh();
  };
  
  const openDeleteDialog = (category: string) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };
  
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCategory = newCategory.trim();
    if (!trimmedCategory) return;

    if (categories.find(c => c.toLowerCase() === trimmedCategory.toLowerCase())) {
        toast({
            variant: 'destructive',
            title: 'Category exists',
            description: 'This category already exists.',
        });
        return;
    }

    categories.push(trimmedCategory);
    setNewCategory('');

    toast({
        title: 'Category Created',
        description: `The category "${trimmedCategory}" has been added.`,
    });
    router.refresh();
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
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className="text-right w-[100px]">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category}>
                            <TableCell className="font-medium">{category}</TableCell>
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
                </div>
            </Card>
        </div>
      </div>

       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will remove the category for the current session.
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
