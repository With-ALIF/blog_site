'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { LayoutDashboard, Tags, PlusCircle, Home, LogOut, Loader2, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AlifLogo } from '@/components/common/logo';
import { useUser, useAuth } from '@/firebase';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  useEffect(() => {
    if (!isUserLoading && !user && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [isUserLoading, user, pathname, router]);

  // Hide layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isUserLoading || !user) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin" />
        </div>
    );
  }

  const handleLogout = () => {
    if (auth) {
      auth.signOut();
    }
    router.push('/admin/login');
  };

  // Check if a menu item is active
  const isActive = (path: string) => {
    // Make dashboard active for posts list and edit pages too
    if (path === '/admin/dashboard') {
        return pathname === '/admin/dashboard' || pathname.startsWith('/admin/posts/edit');
    }
     if (path === '/admin/posts/new') {
        return pathname === '/admin/posts/new';
    }
    return pathname === path;
  }

  return (
    <div className="min-h-screen w-full bg-muted/30">
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <Link href="/admin/dashboard" className="block p-2">
              <AlifLogo className="h-10 w-28" />
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/admin/dashboard')}>
                  <Link href="/admin/dashboard">
                    <LayoutDashboard />
                    Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/admin/categories')}>
                  <Link href="/admin/categories">
                    <Tags />
                    Categories
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/admin/comments')}>
                  <Link href="/admin/comments">
                    <MessageSquare />
                    Comments
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/admin/posts/new')}>
                  <Link href="/admin/posts/new">
                    <PlusCircle />
                    New Post
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                <SidebarMenuButton asChild>
                    <Link href="/">
                        <Home />
                        Back to Site
                    </Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                    <LogOut />
                    Logout
                </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset>
            <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 sticky top-0 z-40">
                <SidebarTrigger />
                <div className="w-full flex-1">
                    {/* Can be used for search or breadcrumbs later */}
                </div>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                {children}
            </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
