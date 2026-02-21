'use client';
import { useLanguage } from '@/contexts/language-context';
import Image from 'next/image';

export default function AboutPage() {
  const { language } = useLanguage();
  
  const content = {
    en: {
      title: 'About Lingua Blog',
      p1: 'Lingua Blog is a creative space dedicated to bridging cultures and knowledge through language. We believe in the power of words to connect people, and our mission is to provide high-quality content in both English and Bangla.',
      p2: 'Our articles span across Technology, Education, Programming, and Lifestyle, offering fresh perspectives and valuable insights. We are a team of passionate writers, developers, and language enthusiasts committed to creating a seamless and enriching bilingual experience for our readers.',
      p3: 'Thank you for joining us on this journey. We hope you find our content inspiring and informative.'
    },
    bn: {
      title: 'লিঙ্গুয়া ব্লগ সম্পর্কে',
      p1: 'লিঙ্গুয়া ব্লগ হল ভাষার মাধ্যমে সংস্কৃতি এবং জ্ঞানকে সংযুক্ত করার জন্য নিবেদিত একটি সৃজনশীল স্থান। আমরা মানুষকে সংযুক্ত করার জন্য শব্দের শক্তিতে বিশ্বাস করি, এবং আমাদের লক্ষ্য হল ইংরেজি এবং বাংলা উভয় ভাষায় উচ্চ-মানের সামগ্রী সরবরাহ করা।',
      p2: 'আমাদের নিবন্ধগুলি প্রযুক্তি, শিক্ষা, প্রোগ্রামিং এবং জীবনধারা জুড়ে বিস্তৃত, যা নতুন দৃষ্টিকোণ এবং মূল্যবান অন্তর্দৃষ্টি প্রদান করে। আমরা আমাদের পাঠকদের জন্য একটি নির্বিঘ্ন এবং সমৃদ্ধ দ্বিভাষিক অভিজ্ঞতা তৈরি করতে প্রতিশ্রুতিবদ্ধ উত্সাহী লেখক, বিকাশকারী এবং ভাষা উত্সাহীদের একটি দল।',
      p3: 'এই যাত্রায় আমাদের সাথে যোগ দেওয়ার জন্য আপনাকে ধন্যবাদ। আমরা আশা করি আপনি আমাদের সামগ্রী অনুপ্রেরণামূলক এবং তথ্যপূর্ণ পাবেন।'
    }
  };
  
  return (
    <div className="container max-w-4xl py-16 md:py-24">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">{content[language].title}</h1>
      </div>
      <div className="relative aspect-video rounded-lg overflow-hidden my-12 shadow-lg">
        <Image src="https://picsum.photos/seed/about/1200/675" alt="Team working together" fill className="object-cover" data-ai-hint="team collaboration" />
      </div>
      <div className="text-lg/relaxed space-y-6 text-foreground/90 max-w-none mx-auto">
        <p>{content[language].p1}</p>
        <p>{content[language].p2}</p>
        <p>{content[language].p3}</p>
      </div>
    </div>
  );
}
