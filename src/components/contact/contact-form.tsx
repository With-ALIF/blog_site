'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLanguage, Language } from '@/contexts/language-context';

const createFormSchema = (language: Language) => z.object({
  name: z.string().min(2, { message: language === 'en' ? 'Name must be at least 2 characters.' : 'নাম কমপক্ষে ২ অক্ষরের হতে হবে।' }),
  email: z.string().email({ message: language === 'en' ? 'Invalid email address.' : 'অবৈধ ইমেল ঠিকানা।' }),
  message: z.string().min(10, { message: language === 'en' ? 'Message must be at least 10 characters.' : 'বার্তা কমপক্ষে ১০ অক্ষরের হতে হবে।' }),
});


export function ContactForm() {
  const { toast } = useToast();
  const { language } = useLanguage();
  
  const formContent = {
    en: {
      name: 'Name',
      namePlaceholder: 'Your Name',
      email: 'Email',
      emailPlaceholder: 'your@email.com',
      message: 'Message',
      messagePlaceholder: 'Your message...',
      submit: 'Send Message',
      successTitle: 'Message Sent!',
      successDescription: 'Thank you for contacting us. We will get back to you shortly.',
    },
    bn: {
      name: 'নাম',
      namePlaceholder: 'আপনার নাম',
      email: 'ইমেল',
      emailPlaceholder: 'your@email.com',
      message: 'বার্তা',
      messagePlaceholder: 'আপনার বার্তা...',
      submit: 'বার্তা পাঠান',
      successTitle: 'বার্তা পাঠানো হয়েছে!',
      successDescription: 'আমাদের সাথে যোগাযোগ করার জন্য ধন্যবাদ। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।',
    }
  };

  const formSchema = createFormSchema(language);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', message: '' },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values); // In a real app, this would send data to a server.
    toast({
      title: formContent[language].successTitle,
      description: formContent[language].successDescription,
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{formContent[language].name}</FormLabel>
              <FormControl>
                <Input placeholder={formContent[language].namePlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{formContent[language].email}</FormLabel>
              <FormControl>
                <Input placeholder={formContent[language].emailPlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{formContent[language].message}</FormLabel>
              <FormControl>
                <Textarea placeholder={formContent[language].messagePlaceholder} className="min-h-[150px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{formContent[language].submit}</Button>
      </form>
    </Form>
  );
}
