'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useLanguage, Language } from '@/contexts/language-context';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

const createFormSchema = (language: Language) => z.object({
  email: z.string().email({ message: language === 'en' ? 'Invalid email address.' : 'অবৈধ ইমেল ঠিকানা।' }),
});

export function SubscriptionForm() {
  const { toast } = useToast();
  const { language } = useLanguage();
  const firestore = useFirestore();

  const formContent = {
    en: {
      title: 'Subscribe to Our Newsletter',
      subtitle: 'Get the latest posts delivered right to your inbox.',
      emailPlaceholder: 'your@email.com',
      submit: 'Subscribe',
      submitting: 'Subscribing...',
      successTitle: 'Subscription Successful!',
      successDescription: 'Thank you for subscribing. You are now on our mailing list.',
      errorTitle: 'Subscription Failed',
      errorGeneral: 'Could not process your subscription. Please try again later.',
    },
    bn: {
      title: 'আমাদের নিউজলেটারে সাবস্ক্রাইব করুন',
      subtitle: 'সর্বশেষ পোস্টগুলি সরাসরি আপনার ইনবক্সে পান।',
      emailPlaceholder: 'your@email.com',
      submit: 'সাবস্ক্রাইব',
      submitting: 'সাবস্ক্রাইব করা হচ্ছে...',
      successTitle: 'সাবস্ক্রিপশন সফল!',
      successDescription: 'সাবস্ক্রাইব করার জন্য ধন্যবাদ। আপনি এখন আমাদের মেইলিং তালিকায় আছেন।',
      errorTitle: 'সাবস্ক্রিপশন ব্যর্থ হয়েছে',
      errorGeneral: 'আপনার সাবস্ক্রিপশন প্রক্রিয়া করা যায়নি। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।',
    }
  };

  const formSchema = createFormSchema(language);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });
  
  const { isSubmitting } = form.formState;

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) {
        toast({
            variant: 'destructive',
            title: formContent[language].errorTitle,
            description: formContent[language].errorGeneral,
        });
        return;
    };
    
    const subscribersCol = collection(firestore, 'subscribers');

    // addDocumentNonBlocking handles its own errors via the error-emitter
    addDocumentNonBlocking(subscribersCol, {
        email: values.email,
        subscribedAt: Date.now(),
    });

    toast({
        title: formContent[language].successTitle,
        description: formContent[language].successDescription,
    });
    form.reset();
  }

  return (
    <div className="bg-background py-16 md:py-24 border-t">
        <div className="container text-center max-w-2xl">
            <h2 className="text-3xl font-bold font-headline mb-2">{formContent[language].title}</h2>
            <p className="text-muted-foreground mb-8">{formContent[language].subtitle}</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="flex-grow">
                        <FormControl>
                            <Input 
                                type="email" 
                                placeholder={formContent[language].emailPlaceholder} 
                                {...field} 
                                className="text-center sm:text-left"
                            />
                        </FormControl>
                        <FormMessage className="text-left" />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSubmitting ? formContent[language].submitting : formContent[language].submit}
                    </Button>
                </form>
            </Form>
        </div>
    </div>
  );
}
