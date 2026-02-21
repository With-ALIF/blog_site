'use client';
import { ContactForm } from '@/components/contact/contact-form';
import { useLanguage } from '@/contexts/language-context';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const { language } = useLanguage();

  const content = {
    en: {
      title: 'Get In Touch',
      subtitle: "We'd love to hear from you. Whether you have a question about our posts, feedback, or just want to say hello, feel free to reach out.",
      formTitle: 'Send us a Message',
    },
    bn: {
      title: 'যোগাযোগ করুন',
      subtitle: 'আমরা আপনার কাছ থেকে শুনতে চাই। আমাদের পোস্ট সম্পর্কে আপনার কোন প্রশ্ন, মতামত, বা শুধু হ্যালো বলতে চাইলে, আমাদের সাথে যোগাযোগ করুন।',
      formTitle: 'আমাদের একটি বার্তা পাঠান',
    }
  }

  return (
    <div className="container py-16 md:py-24">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">{content[language].title}</h1>
        <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">{content[language].subtitle}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-16 items-start">
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg font-headline">Email</h3>
              <p className="text-muted-foreground">hello@linguablog.com</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg font-headline">Phone</h3>
              <p className="text-muted-foreground">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg font-headline">Office</h3>
              <p className="text-muted-foreground">123 Language Lane, Dhaka, Bangladesh</p>
            </div>
          </div>
        </div>

        <div className="bg-card p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold font-headline mb-6">{content[language].formTitle}</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
