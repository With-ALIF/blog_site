'use client';

import { useState } from 'react';
import Link from 'next/link';
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
import { MoreHorizontal, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collectionGroup, doc, query, orderBy } from 'firebase/firestore';
import type { Comment } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function CommentsPage() {
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);

  const firestore = useFirestore();
  const commentsQuery = useMemoFirebase(
    () => firestore ? query(collectionGroup(firestore, 'comments'), orderBy('createdAt', 'desc')) : null,
    [firestore]
  );
  
  const { data: comments, isLoading } = useCollection<Comment>(commentsQuery);

  const handleDelete = () => {
    if (!commentToDelete || !firestore) return;

    // Need to construct the doc ref with the postId
    const commentRef = doc(firestore, 'posts', commentToDelete.postId, 'comments', commentToDelete.id);
    deleteDocumentNonBlocking(commentRef);
    
    setIsDeleteDialogOpen(false);
    setCommentToDelete(null);
    
    toast({
        title: 'Comment Deleted',
        description: 'The comment has been successfully removed.',
    });
  };
  
  const openDeleteDialog = (comment: Comment) => {
    setCommentToDelete(comment);
    setIsDeleteDialogOpen(true);
  };
  
  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
              <h1 className="text-3xl md:text-4xl font-bold font-headline">Manage Comments</h1>
              <p className="text-md text-muted-foreground mt-1">View and moderate user comments.</p>
          </div>
        </div>

        <Card className="shadow-sm border">
            <div className="overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center items-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Comment</TableHead>
                        <TableHead className="hidden md:table-cell">Author</TableHead>
                        <TableHead className="hidden lg:table-cell">Post</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead className="text-right w-[100px]">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {comments?.map((comment) => (
                        <TableRow key={comment.id}>
                        <TableCell className="font-medium max-w-sm">
                            <p className="truncate">{comment.content}</p>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                            <div>{comment.authorName}</div>
                            <div className="text-xs text-muted-foreground">{comment.authorEmail}</div>
                        </TableCell>
                         <TableCell className="hidden lg:table-cell max-w-xs">
                             <p className="truncate">{comment.postTitle}</p>
                         </TableCell>
                        <TableCell className="hidden md:table-cell">{format(new Date(comment.createdAt), 'MMM d, yyyy')}</TableCell>
                        <TableCell className="text-right">
                             <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(comment)}>
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

       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the comment.
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
