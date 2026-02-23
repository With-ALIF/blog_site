'use client';
import { useLanguage } from '@/contexts/language-context';
import Image from 'next/image';

export default function AboutPage() {
  const { language } = useLanguage();
  
  const content = {
    en: {
      title: 'About ALIF BLOG',
      p1: 'I am Alif, an engineering student and a passionate coder who loves building things with code. Programming and web development are my primary areas of focus, and I continuously strive to improve my skills by learning new technologies, solving real-world problems, and working on practical projects.',
      p2: 'This blog is fully dedicated to coding, programming tutorials, web development, and problem-solving content.',
      p3: 'My goal is to simplify complex concepts and share knowledge in a clear and beginner-friendly way, helping others confidently start and grow in their programming journey.'
    },
    bn: {
      title: 'আলিফ ব্লগ সম্পর্কে',
      p1: 'আমি আলিফ, একজন ইঞ্জিনিয়ারিং স্টুডেন্ট এবং প্যাশনেট কোডার। প্রোগ্রামিং ও ওয়েব ডেভেলপমেন্ট আমার শেখার এবং কাজের প্রধান ক্ষেত্র। নতুন প্রযুক্তি শেখা, সমস্যা সমাধান করা এবং বাস্তব প্রজেক্ট তৈরি করার মাধ্যমে প্রতিদিন নিজেকে উন্নত করার চেষ্টা করি।',
      p2: 'এই ব্লগটি সম্পূর্ণভাবে কোডিং, প্রোগ্রামিং টিউটোরিয়াল, ওয়েব ডেভেলপমেন্ট এবং সমস্যা সমাধানভিত্তিক কনটেন্ট নিয়ে তৈরি।',
      p3: 'আমার লক্ষ্য হলো বাংলা ভাষায় সহজ ও পরিষ্কারভাবে কোডিং শেখানো, যাতে নতুন শিক্ষার্থীরা আত্মবিশ্বাসের সাথে তাদের প্রোগ্রামিং যাত্রা শুরু করতে পারে।'
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
