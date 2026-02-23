'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlifLogo } from '@/components/common/logo';
import { Loader2 } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@alif.com');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/admin/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsLoading(true);

    try {
      // First, try to sign in
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle redirect on success.
    } catch (signInError: any) {
      // If user does not exist or password is wrong, try creating the user.
      // Firebase returns 'auth/invalid-credential' for both cases now.
      if (signInError.code === 'auth/invalid-credential') {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          // onAuthStateChanged will handle redirect on success.
          toast({
            title: 'Admin Account Created',
            description: 'Your admin account has been successfully created and logged in.',
          });
        } catch (signUpError: any) {
          // This error is likely for a weak password or if the email is already in use by another method.
          toast({
            variant: 'destructive',
            title: 'Sign Up Failed',
            description: signUpError.message || 'Could not create an account.',
          });
          setIsLoading(false);
        }
      } else {
        // For other sign-in errors (network, etc.), display them
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: signInError.message,
        });
        setIsLoading(false);
      }
    }
  };

  if (isUserLoading || user) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin" />
        </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <AlifLogo className="h-16 w-32 mx-auto" />
          <CardTitle className="text-2xl font-bold font-headline">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@alif.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="animate-spin" />}
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
