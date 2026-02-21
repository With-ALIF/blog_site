'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();

  return (
    <div className="container py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-lg text-muted-foreground mt-2">Welcome, Admin!</p>
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Site Management</CardTitle>
          <CardDescription>This is a placeholder for your admin tools.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>From here, you would typically manage your blog posts, users, and other site settings.</p>
          <Button onClick={() => router.push('/')} className="mt-6">Go to Homepage</Button>
        </CardContent>
      </Card>
    </div>
  );
}
