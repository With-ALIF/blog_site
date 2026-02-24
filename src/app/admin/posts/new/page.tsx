import { PostForm } from '@/components/admin/post-form';

export default function NewPostPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold font-headline">Create New Post</h1>
        <p className="text-md text-muted-foreground mt-1">Fill out the form below to add a new blog post.</p>
      </div>
      <div className="bg-card p-6 md:p-8 rounded-lg shadow-sm border">
        <PostForm />
      </div>
    </div>
  );
}
