'use client';

import { useState } from 'react';
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Trash2, Users, Loader2, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import type { Subscriber } from '@/lib/types';
import { format } from 'date-fns';

export default function SubscribersPage() {
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState<Subscriber | null>(null);
  
  const firestore = useFirestore();
  const subscribersCol = useMemoFirebase(() => firestore ? collection(firestore, 'subscribers') : null, [firestore]);
  const { data: subscribers, isLoading: isLoadingSubscribers } = useCollection<Subscriber>(subscribersCol);

  const handleDelete = () => {
    if (!subscriberToDelete || !firestore) return;
    
    deleteDocumentNonBlocking(doc(firestore, 'subscribers', subscriberToDelete.id));
    
    setIsDeleteDialogOpen(false);
    setSubscriberToDelete(null);
    
    toast({
        title: 'Subscriber Deleted',
        description: 'The subscriber has been removed from the mailing list.',
    });
  };
  
  const openDeleteDialog = (subscriber: Subscriber) => {
    setSubscriberToDelete(subscriber);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
              <h1 className="text-3xl sm:text-4xl font-bold font-headline">Newsletter Subscribers</h1>
              <p className="text-md text-muted-foreground mt-1">Manage your mailing list.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoadingSubscribers ? <Loader2 className="h-6 w-6 animate-spin" /> : subscribers?.length || 0}</div>
              </CardContent>
            </Card>
        </div>


        <Card className="shadow-sm border">
            <h2 className="text-2xl font-bold font-headline p-6">Subscriber List</h2>
            <div className="overflow-hidden">
                {isLoadingSubscribers ? (
                    <div className="flex justify-center items-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Email Address</TableHead>
                        <TableHead>Subscription Date</TableHead>
                        <TableHead className="text-right w-[100px]">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {subscribers?.map((subscriber) => (
                        <TableRow key={subscriber.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {subscriber.email}
                        </TableCell>
                        <TableCell>
                           {format(new Date(subscriber.subscribedAt), 'MMMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(subscriber)}>
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
                        This action cannot be undone. This will permanently remove the subscriber from your mailing list.
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
