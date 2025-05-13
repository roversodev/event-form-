'use client';

import { User, Menu, X } from "lucide-react";
import ThemeToggleButton from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/providers/SupabaseProvider";
import { useEffect, useState } from "react";
import type { User as SupabaseUser } from '@supabase/supabase-js';
import ProfileUser from "./ProfileUser";
import { toast } from "sonner";

const Navbar = () => {
  const router = useRouter();
  const supabase = useSupabase();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Você saiu da sua conta!');
    router.push('/login');
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Planos', href: '/pricing' },
    { label: 'Novo Evento', href: '/new-event' },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-50 px-6 lg:px-8 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-2 relative z-10"
            >
              <span className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent bg-[length:200%_auto] hover:bg-right transition-all duration-500">
                EventFlow+
              </span>
            </Link>

            {/* Links de Navegação - Desktop */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Ações - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggleButton variant="circle" start="top-left" />

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="relative hover:bg-primary/10 transition-colors"
                    >
                      <User className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <ProfileUser 
                      name={user.user_metadata.name} 
                      role={user.email} 
                      subscription="Free" 
                      actionLogout={handleSignOut} 
                      avatar={user.user_metadata.picture} 
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button variant="ghost" className="hover:bg-primary/10">
                    Entrar
                  </Button>
                </Link>
              )}
            </div>

              {/* Menu Mobile */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[350px] p-0">
                <SheetHeader className="p-6 border-b">
                  <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
                    EventFlow+
                  </SheetTitle>
                  <ThemeToggleButton variant="circle" start="top-left" />
                </SheetHeader>
                <div className="flex flex-col px-6 py-4 space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                    >
                      {item.label}
                    </Link>
                  ))}
                  
                  {!user && (
                    <Link href="/login" className="mt-4">
                      <Button className="w-full" size="lg">
                        Entrar
                      </Button>
                    </Link>
                  )}

                  {user && (
                    <div className="mt-4 pt-4 border-t">
                      <ProfileUser 
                        name={user.user_metadata.name} 
                        role={user.email} 
                        subscription="Free" 
                        actionLogout={handleSignOut} 
                        avatar=""
                      />
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          </div>
        </div>
      </nav>
      <div className="h-[72px]" />
    </>
  );
};

export default Navbar;