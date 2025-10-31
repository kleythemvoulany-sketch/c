"use client";

import Link from "next/link";
import {
  LogIn,
  Menu,
  Moon,
  PlusCircle,
  Sun,
  User,
  UserPlus,
  LogOut
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useUser } from "@/firebase/provider";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const navLinks = [
  { href: "/listings", label: "السيارات" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "تواصل معنا" },
  { href: "/faq", label: "الأسئلة الشائعة" },
];

export function SiteHeader() {
  const { setTheme } = useTheme();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
  };

  const isAuthenticated = !!user;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-primary text-primary-foreground">
      <div className="container flex h-16 items-center sm:h-20">
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-card text-card-foreground p-6">
              <Link href="/" className="flex items-center space-x-2 mb-8">
                 <h1 className="text-2xl font-bold">
                    <span className="text-accent">ال</span>
                    <span className="text-primary">بورصة</span>
                 </h1>
              </Link>
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-2 py-2 text-lg rounded-md hover:bg-accent hover:text-accent-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="mr-4 flex flex-1">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold">
                <span className="text-accent">ال</span>
                <span className="text-primary-foreground">بورصة</span>
            </h1>
          </Link>
        </div>

        <div className="flex flex-none items-center justify-end space-x-2">
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground hidden sm:flex ml-4">
            <Link href="/listings/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              بيع على البورصة
            </Link>
          </Button>
            
          {isUserLoading ? (
            <div className="h-10 w-10 bg-white/20 rounded-full animate-pulse" />
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full text-primary-foreground hover:bg-white/10">
                   <Avatar className="h-9 w-9">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>الملف الشخصي</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>تسجيل الخروج</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="secondary" asChild className="bg-white text-primary hover:bg-white/90 hidden sm:flex">
                <Link href="/signup">
                  <UserPlus className="ml-2 h-4 w-4" />
                  إنشاء حساب
                </Link>
              </Button>
              <Button variant="secondary" asChild className="bg-white text-primary hover:bg-white/90 hidden sm:flex">
                <Link href="/login">
                  تسجيل الدخول
                </Link>
              </Button>
              <Button variant="secondary" size="icon" asChild className="bg-white text-primary hover:bg-white/90 sm:hidden rounded-full">
                <Link href="/login">
                  <User className="h-6 w-6" />
                  <span className="sr-only">تسجيل الدخول</span>
                </Link>
              </Button>
            </>
          )}


          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-primary-foreground hover:bg-white/10 px-2 sm:px-3">
                <Image src="https://flagcdn.com/mr.svg" alt="Mauritania Flag" width={0} height={0} className="w-6 h-auto"/>
                <span className="sm:inline-block mr-2 hidden">العربية</span>
                <span className="sr-only">Change language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <div className="flex items-center gap-2">
                  <Image src="https://flagcdn.com/mr.svg" alt="Mauritania Flag" width={0} height={0} className="w-5 h-auto" />
                  <span>العربية</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex items-center gap-2">
                   <Image src="https://flagcdn.com/gb.svg" alt="Great Britain Flag" width={0} height={0} className="w-5 h-auto"/>
                  <span>English</span>
                </div>
              </DropdownMenuItem>
               <DropdownMenuItem>
                <div className="flex items-center gap-2">
                   <Image src="https://flagcdn.com/fr.svg" alt="France Flag" width={0} height={0} className="w-5 h-auto"/>
                  <span>Français</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </header>
  );
}
