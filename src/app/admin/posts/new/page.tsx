import { PostForm } from '@/components/admin/post-form';

export default function NewPostPage() {
  return (
    <div className="container py-16 md:py-24">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Create New Post</h1>
        <p className="text-lg text-muted-foreground mt-2">Fill out the form below to add a new blog post.</p>
      </div>
      <div className="bg-card p-8 rounded-lg shadow-lg">
        <PostForm />
      </div>
    </div>
  );
}
