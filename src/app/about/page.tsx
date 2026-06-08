'use client';
import { useLanguage } from '@/contexts/language-context';
import Image from 'next/image';

export default function AboutPage() {
  const { language } = useLanguage();
  
  const content = {
    en: {
      title: 'About ALIF Blog',
      paragraphs: [
        "Welcome to ALIF Blog, a trusted destination for knowledge, ideas, and inspiration. In a world where information is abundant but quality content is often difficult to find, our mission is to provide clear, authentic, and meaningful articles that add real value to our readers' lives.",
        "At ALIF Blog, we believe that learning is a lifelong journey. Whether you are a student seeking educational resources, a technology enthusiast exploring the latest innovations, a professional looking to enhance your skills, or simply a curious reader searching for fresh perspectives, our content is designed to inform, educate, and inspire.",
        "Our platform covers a wide range of topics, including Technology, Web Development, Programming, Education, Productivity, Personal Growth, Digital Trends, and Everyday Insights. Every article is created with a focus on accuracy, clarity, and practical value, ensuring that readers gain useful knowledge they can apply in their daily lives.",
        "We are committed to promoting continuous learning and encouraging thoughtful discussions. Through well-researched content, step-by-step guides, expert insights, and personal experiences, we strive to make complex topics easier to understand and accessible to everyone.",
        "At the heart of ALIF Blog lies a simple vision: to empower individuals through knowledge. We believe that sharing ideas can spark innovation, build confidence, and create opportunities for growth. Our goal is not only to deliver information but also to inspire readers to think critically, develop new skills, and explore new possibilities.",
        "Thank you for being part of our journey. We invite you to explore our articles, engage with our content, and join a growing community of learners, creators, and thinkers. Together, let's discover, learn, and grow—one article at a time.",
        "ALIF Blog — Where Knowledge Meets Inspiration."
      ]
    },
    bn: {
      title: 'আলিফ ব্লগ সম্পর্কে',
      paragraphs: [
        "আলিফ ব্লগে আপনাকে স্বাগতম, জ্ঞান, ধারণা এবং অনুপ্রেরণার একটি বিশ্বস্ত ঠিকানা। এমন এক বিশ্বে যেখানে তথ্যের অভাব নেই কিন্তু মানসম্মত বিষয়বস্তু খুঁজে পাওয়া প্রায়ই কঠিন, আমাদের লক্ষ্য হলো স্পষ্ট, নির্ভরযোগ্য এবং অর্থপূর্ণ নিবন্ধ প্রদান করা যা আমাদের পাঠকদের জীবনে প্রকৃত মূল্য যোগ করে।",
        "আলিফ ব্লগে আমরা বিশ্বাস করি যে শেখা একটি আজীবন যাত্রা। আপনি শিক্ষামূলক সংস্থান খুঁজছেন এমন একজন শিক্ষার্থী হোন, সর্বশেষ উদ্ভাবন নিয়ে কাজ করা একজন প্রযুক্তি প্রেমী হোন, আপনার দক্ষতা বাড়াতে চাওয়া একজন পেশাদার হোন অথবা স্রেফ নতুন দৃষ্টিভঙ্গি খুঁজছেন এমন একজন কৌতূহলী পাঠক হোন—আমাদের বিষয়বস্তু আপনাকে তথ্য দিতে, শিক্ষিত করতে এবং অনুপ্রাণিত করার জন্য ডিজাইন করা হয়েছে।",
        "আমাদের প্ল্যাটফর্মে প্রযুক্তি, ওয়েব ডেভেলপমেন্ট, প্রোগ্রামিং, শিক্ষা, উৎপাদনশীলতা, ব্যক্তিগত উন্নয়ন, ডিজিটাল ট্রেন্ড এবং দৈনন্দিন জীবনের নানা বিষয় নিয়ে আলোচনা করা হয়। প্রতিটি নিবন্ধ নির্ভুলতা, স্বচ্ছতা এবং ব্যবহারিক মূল্যের ওপর গুরুত্ব দিয়ে তৈরি করা হয়, যাতে পাঠকরা এমন দরকারী জ্ঞান অর্জন করতে পারেন যা তারা তাদের দৈনন্দিন জীবনে প্রয়োগ করতে সক্ষম হন।",
        "আমরা ক্রমাগত শেখার সুযোগ তৈরি করতে এবং গঠনমূলক আলোচনায় উৎসাহিত করতে অঙ্গীকারবদ্ধ। সুগবেষিত বিষয়বস্তু, ধাপে ধাপে নির্দেশিকা, বিশেষজ্ঞের মতামত এবং ব্যক্তিগত অভিজ্ঞতার মাধ্যমে আমরা জটিল বিষয়গুলোকে সবার জন্য সহজবোধ্য এবং গ্রহণযোগ্য করে তোলার চেষ্টা করি।",
        "আলিফ ব্লগের মূল লক্ষ্য হলো জ্ঞানের মাধ্যমে মানুষকে ক্ষমতায়ন করা। আমরা বিশ্বাস করি যে ধারণাগুলো শেয়ার করার মাধ্যমে উদ্ভাবন সম্ভব, আত্মবিশ্বাস তৈরি হয় এবং উন্নতির সুযোগ সৃষ্টি হয়। আমাদের লক্ষ্য কেবল তথ্য সরবরাহ করা নয় বরং পাঠকদের গঠনমূলক চিন্তাভাবনা করতে, নতুন দক্ষতা অর্জন করতে এবং নতুন সম্ভাবনাগুলো অন্বেষণ করতে অনুপ্রাণিত করা।",
        "আমাদের যাত্রার অংশ হওয়ার জন্য আপনাকে ধন্যবাদ। আমরা আপনাকে আমাদের নিবন্ধগুলো অন্বেষণ করতে, আমাদের বিষয়বস্তুর সাথে যুক্ত হতে এবং শিক্ষার্থী, নির্মাতা ও চিন্তাবিদদের একটি ক্রমবর্ধমান সম্প্রদায়ে যোগ দেওয়ার জন্য আমন্ত্রণ জানাচ্ছি। আসুন আমরা একসাথে শিখি এবং এগিয়ে যাই—প্রতিটি নিবন্ধের মাধ্যমে।",
        "আলিফ ব্লগ — যেখানে জ্ঞান আর অনুপ্রেরণা এক হয়।"
      ]
    }
  };
  
  return (
    <div className="container max-w-4xl py-16 md:py-24">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold font-headline mb-4">{content[language].title}</h1>
      </div>
      <div className="relative aspect-video rounded-lg overflow-hidden my-12 shadow-lg">
        <Image 
          src="https://i.postimg.cc/HsHjYB8V/about.png" 
          alt="ALIF Blog mission" 
          fill 
          className="object-cover" 
          data-ai-hint="blog mission" 
        />
      </div>
      <div className="text-lg/relaxed space-y-6 text-foreground/90 max-w-none mx-auto">
        {content[language].paragraphs.map((p, index) => (
          <p key={index}>{p}</p>
        ))}
      </div>
    </div>
  );
}
