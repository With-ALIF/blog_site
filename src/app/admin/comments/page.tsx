'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { Trash2, MessageSquare, Loader2, Mail, AlertTriangle, Calendar, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collectionGroup, query, doc } from 'firebase/firestore';
import type { Comment } from '@/lib/types';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AdminCommentsPage() {
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);
  
  const firestore = useFirestore();
  
  const commentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // Basic collection group query. Note: Requires a composite index if filtered or ordered globally.
    // For simplicity in MVP, we fetch and sort on client.
    return query(collectionGroup(firestore, 'comments'));
  }, [firestore]);

  const { data: rawComments, isLoading: isLoadingComments, error } = useCollection<Comment>(commentsQuery);

  const comments = rawComments ? [...rawComments].sort((a, b) => b.createdAt - a.createdAt) : null;

  const handleDelete = () => {
    if (!commentToDelete || !firestore) return;
    const commentRef = doc(firestore, 'posts', commentToDelete.postId, 'comments', commentToDelete.id);
    deleteDocumentNonBlocking(commentRef);
    
    toast({
        title: 'Comment Deleted',
        description: 'The comment has been removed.',
    });
    
    setIsDeleteDialogOpen(false);
    setCommentToDelete(null);
  };
  
  const openDeleteDialog = (comment: Comment) => {
    setCommentToDelete(comment);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <div>
            <h1 className="text-2xl sm:text-4xl font-bold font-headline">Article Feedback</h1>
            <p className="text-sm text-muted-foreground mt-1">Review and manage comments from your readers.</p>
        </div>
        
        {error && (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>
                    {(error as any).message || "You don't have permission to list comments globally."}
                </AlertDescription>
            </Alert>
        )}

        {isLoadingComments ? (
            <div className="flex justify-center items-center p-24">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        ) : comments && comments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {comments.map((comment) => (
                    <Card key={comment.id} className="flex flex-col shadow-sm hover:shadow-md transition-all border-primary/10 bg-card/50">
                        <CardHeader className="flex flex-row items-center gap-4 pb-4">
                            <Avatar className="h-10 w-10 border shadow-sm">
                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.authorName}`} alt={comment.authorName} />
                                <AvatarFallback>{comment.authorName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col overflow-hidden">
                                <CardTitle className="text-base truncate">{comment.authorName}</CardTitle>
                                <p className="text-xs text-muted-foreground truncate">{comment.authorEmail}</p>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                            <div className="bg-muted/40 rounded-xl p-4 text-sm italic text-foreground/90 relative">
                                <span className="absolute -top-3 left-2 text-3xl text-primary/20">"</span>
                                <p className="line-clamp-4 relative z-10">{comment.content}</p>
                            </div>
                            
                            <div className="space-y-1.5 pt-2">
                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                    <FileText className="h-3 w-3" />
                                    <span className="font-semibold uppercase tracking-wider">Post:</span>
                                    <span className="truncate">{comment.postTitle}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    <span className="font-semibold uppercase tracking-wider">Date:</span>
                                    <span>{format(new Date(comment.createdAt), 'MMM d, yyyy HH:mm')}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t pt-4 grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm" className="w-full text-xs h-8" asChild>
                                <a href={`mailto:${comment.authorEmail}?subject=Reply: ${comment.postTitle}`}>
                                    <Mail className="h-3 w-3 mr-2" /> Reply
                                </a>
                            </Button>
                            <Button variant="ghost" size="sm" className="w-full text-xs h-8 text-destructive hover:bg-destructive/10" onClick={() => openDeleteDialog(comment)}>
                                <Trash2 className="h-3 w-3 mr-2" /> Delete
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        ) : !isLoadingComments && (
            <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-muted/20">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-bold">No comments yet</h3>
                <p className="text-muted-foreground text-sm">When readers interact with your posts, their feedback will appear here.</p>
            </div>
        )}
      </div>

       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete this comment?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will remove the reader's feedback permanently. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    <AlertDialogCancel className="w-full sm:w-auto">Keep Comment</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground w-full sm:w-auto">
                        Delete Forever
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
       </AlertDialog>
    </>
  );
}
