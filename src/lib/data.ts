import { Post, Category } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  if (!image) return { imageUrl: 'https://picsum.photos/seed/placeholder/1200/800', imageHint: 'placeholder' };
  return { imageUrl: image.imageUrl, imageHint: image.imageHint };
};

export const heroImage = getImage('hero');

export let categories: Category[] = ['Tech', 'Education', 'Programming', 'Lifestyle'];

export const posts: Post[] = [
  {
    id: '1',
    slug: 'getting-started-with-nextjs-and-firebase',
    title_en: 'Getting Started with Next.js and Firebase',
    title_bn: 'Next.js এবং Firebase দিয়ে শুরু করুন',
    excerpt_en: 'Learn how to build powerful full-stack applications using Next.js and Firebase.',
    excerpt_bn: 'Next.js এবং Firebase ব্যবহার করে শক্তিশালী ফুল-স্ট্যাক অ্যাপ্লিকেশন তৈরি করতে শিখুন।',
    content_en: 'This is the full content for Getting Started with Next.js and Firebase. It goes into detail about setting up your project, connecting to Firebase services like Auth and Firestore, and deploying your application. We will cover server-side rendering, static site generation, and API routes.',
    content_bn: 'এটি Next.js এবং Firebase দিয়ে শুরু করার জন্য সম্পূর্ণ বিষয়বস্তু। এটি আপনার প্রকল্প সেট আপ করা, Auth এবং Firestore এর মতো Firebase পরিষেবাগুলির সাথে সংযোগ স্থাপন এবং আপনার অ্যাপ্লিকেশন স্থাপন সম্পর্কে বিস্তারিত আলোচনা করে। আমরা সার্ভার-সাইড রেন্ডারিং, স্ট্যাটিক সাইট জেনারেশন এবং এপিআই রুটগুলি কভার করব।',
    ...getImage('post-1'),
    category: 'Programming',
    author: 'Jane Doe',
    date: '2024-07-20T10:00:00Z',
    status: 'published',
  },
  {
    id: '2',
    slug: 'the-future-of-ai-in-education',
    title_en: 'The Future of AI in Education',
    title_bn: 'শিক্ষায় কৃত্রিম বুদ্ধিমত্তার ভবিষ্যৎ',
    excerpt_en: 'Artificial intelligence is poised to revolutionize the education sector.',
    excerpt_bn: 'কৃত্রিম বুদ্ধিমত্তা শিক্ষা খাতে বিপ্লব আনতে প্রস্তুত।',
    content_en: 'Full content about AI in education. Discussing personalized learning paths, automated grading, and virtual tutors. We explore the ethical implications and the potential for AI to bridge educational gaps across the globe.',
    content_bn: 'শিক্ষায় কৃত্রিম বুদ্ধিমত্তা সম্পর্কে সম্পূর্ণ বিষয়বস্তু। ব্যক্তিগতকৃত শিক্ষার পথ, স্বয়ংক্রিয় গ্রেডিং, এবং ভার্চুয়াল টিউটর নিয়ে আলোচনা করা হয়েছে। আমরা নৈতিক প্রভাব এবং বিশ্বজুড়ে শিক্ষাগত ব্যবধান দূর করতে কৃত্রিম বুদ্ধিমত্তার সম্ভাবনা অন্বেষণ করি।',
    ...getImage('post-2'),
    category: 'Education',
    author: 'John Smith',
    date: '2024-07-19T14:30:00Z',
    status: 'published',
  },
  {
    id: '3',
    slug: 'healthy-lifestyle-tips-for-developers',
    title_en: 'Healthy Lifestyle Tips for Developers',
    title_bn: 'ডেভেলপারদের জন্য স্বাস্থ্যকর জীবনযাপনের টিপস',
    excerpt_en: 'Maintaining a healthy work-life balance is crucial for developers.',
    excerpt_bn: 'ডেভেলপারদের জন্য একটি স্বাস্থ্যকর কর্ম-জীবন ভারসাম্য বজায় রাখা অত্যন্ত গুরুত্বপূর্ণ।',
    content_en: 'Full content about healthy lifestyle for developers. This includes ergonomics, exercise routines that can be done at a desk, nutrition tips for sustained energy, and strategies for avoiding burnout and managing stress.',
    content_bn: 'ডেভেলপারদের জন্য স্বাস্থ্যকর জীবনযাপন সম্পর্কে সম্পূর্ণ বিষয়বস্তু। এর মধ্যে রয়েছে আর্গোনোমিক্স, ডেস্কে করা যায় এমন ব্যায়ামের রুটিন, টেকসই শক্তির জন্য পুষ্টি টিপস এবং বার্নআউট এড়ানো এবং স্ট্রেস পরিচালনার জন্য কৌশল।',
    ...getImage('post-3'),
    category: 'Lifestyle',
    author: 'Emily White',
    date: '2024-07-18T09:00:00Z',
    status: 'pending',
  },
  {
    id: '4',
    slug: 'understanding-modern-javascript-frameworks',
    title_en: 'Understanding Modern JavaScript Frameworks',
    title_bn: 'আধুনিক জাভাস্ক্রিপ্ট ফ্রেমওয়ার্ক বোঝা',
    excerpt_en: 'A deep dive into popular JavaScript frameworks like React, Vue, and Angular.',
    excerpt_bn: 'React, Vue, এবং Angular-এর মতো জনপ্রিয় জাভাস্ক্রিপ্ট ফ্রেমওয়ার্কগুলিতে একটি গভীর ডুব।',
    content_en: 'This post compares and contrasts React, Vue, and Angular. We look at their core philosophies, performance characteristics, ecosystem, and learning curves to help you decide which one is right for your next project.',
    content_bn: 'এই পোস্টটি React, Vue, এবং Angular-এর তুলনা এবং বৈসাদৃশ্য তুলে ধরে। আমরা তাদের মূল দর্শন, পারফরম্যান্স বৈশিষ্ট্য, ইকোসিস্টেম এবং শেখার বক্ররেখাগুলি দেখি যাতে আপনি আপনার পরবর্তী প্রকল্পের জন্য কোনটি সঠিক তা সিদ্ধান্ত নিতে পারেন।',
    ...getImage('post-4'),
    category: 'Programming',
    author: 'Chris Green',
    date: '2024-07-17T16:00:00Z',
    status: 'published',
  },
    {
    id: '5',
    slug: 'web-performance-optimization-techniques',
    title_en: 'Web Performance Optimization Techniques',
    title_bn: 'ওয়েব পারফরম্যান্স অপটিমাইজেশন কৌশল',
    excerpt_en: 'Optimize your website for speed and responsiveness.',
    excerpt_bn: 'গতি এবং প্রতিক্রিয়াশীলতার জন্য আপনার ওয়েবসাইট অপটিমাইজ করুন।',
    content_en: 'Full content about web performance. Techniques include image compression, lazy loading, code splitting, caching strategies, and using a Content Delivery Network (CDN). We also look at modern metrics like Core Web Vitals.',
    content_bn: 'ওয়েব পারফরম্যান্স সম্পর্কে সম্পূর্ণ বিষয়বস্তু। কৌশলগুলির মধ্যে রয়েছে চিত্র সংকোচন, অলস লোডিং, কোড বিভাজন, ক্যাশিং কৌশল এবং একটি কন্টেন্ট ডেলিভারি নেটওয়ার্ক (CDN) ব্যবহার করা। আমরা কোর ওয়েব ভাইটালসের মতো আধুনিক মেট্রিকগুলিও দেখি।',
    ...getImage('post-5'),
    category: 'Tech',
    author: 'Jane Doe',
    date: '2024-07-16T11:00:00Z',
    status: 'published',
  },
  {
    id: '6',
    slug: 'introduction-to-machine-learning-concepts',
    title_en: 'Introduction to Machine Learning Concepts',
    title_bn: 'মেশিন লার্নিং ধারণার পরিচিতি',
    excerpt_en: 'A beginner-friendly introduction to machine learning.',
    excerpt_bn: 'মেশিন লার্নিং-এর একটি শিক্ষানবিস-বান্ধব পরিচিতি।',
    content_en: 'This article provides a beginner-friendly introduction to machine learning, covering supervised, unsupervised learning, and popular algorithms like linear regression and k-means clustering. No prior experience needed!',
    content_bn: 'এই নিবন্ধটি মেশিন লার্নিং-এর একটি শিক্ষানবিস-বান্ধব পরিচিতি প্রদান করে, যেখানে তত্ত্বাবধানে থাকা, তত্ত্বাবধানহীন শিক্ষা এবং লিনিয়ার রিগ্রেশন এবং কে-মিনস ক্লাস্টারিং-এর মতো জনপ্রিয় অ্যালগরিদমগুলি কভার করা হয়েছে। কোন পূর্ব অভিজ্ঞতার প্রয়োজন নেই!',
    ...getImage('post-6'),
    category: 'Tech',
    author: 'John Smith',
    date: '2024-07-15T08:00:00Z',
    status: 'published',
  }
];
