"use client";

import Link from "next/link";
import {
  Globe,
  LogIn,
  Menu,
  Moon,
  PlusCircle,
  Sun,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import Image from "next/image";

const navLinks = [
  { href: "/listings", label: "السيارات" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "تواصل معنا" },
  { href: "/faq", label: "الأسئلة الشائعة" },
];

export function SiteHeader() {
  const { setTheme } = useTheme();

  // A simplified check for authentication status
  const isAuthenticated = false;

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
            
          {isAuthenticated ? (
             <Button variant="ghost" size="icon" asChild className="text-primary-foreground hover:bg-white/10">
                <Link href="/profile">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Profile</span>
                </Link>
              </Button>
          ) : (
            <>
              <Button variant="secondary" asChild className="bg-white text-primary hover:bg-white/90 hidden sm:flex">
                <Link href="/login">
                  تسجيل الدخول
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="text-primary-foreground hover:bg-white/10 sm:hidden">
                <Link href="/login">
                  <LogIn className="h-5 w-5" />
                  <span className="sr-only">تسجيل الدخول</span>
                </Link>
              </Button>
            </>
          )}


          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-primary-foreground hover:bg-white/10 px-2 sm:px-3">
                <Image src="https://flagcdn.com/mr.svg" alt="Mauritania Flag" width={24} height={18} className="rounded-sm"/>
                <span className="hidden sm:inline-block mr-2">العربية</span>
                <span className="sr-only">Change language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <div className="flex items-center gap-2">
                  <Image src="https://flagcdn.com/mr.svg" alt="Mauritania Flag" width={20} height={15} />
                  <span>العربية</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex items-center gap-2">
                   <Image src="https://flagcdn.com/gb.svg" alt="Great Britain Flag" width={20} height={15} />
                  <span>English</span>
                </div>
              </DropdownMenuItem>
               <DropdownMenuItem>
                <div className="flex items-center gap-2">
                   <Image src="https://flagcdn.com/fr.svg" alt="France Flag" width={20} height={15} />
                  <span>Français</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
