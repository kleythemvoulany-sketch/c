"use client";

import Link from "next/link";
import {
  Car,
  Globe,
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

const navLinks = [
  { href: "/listings", label: "السيارات" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "تواصل معنا" },
  { href: "/faq", label: "الأسئلة الشائعة" },
];

export function SiteHeader() {
  const { setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-primary text-primary-foreground">
      <div className="container flex h-16 items-center sm:h-20">
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-primary text-primary-foreground p-6">
              <Link href="/" className="flex items-center space-x-2 mb-8">
                <Car className="h-8 w-8 text-accent" />
                <span className="font-bold text-xl text-white">البورصة للسيارات</span>
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
            <Car className="h-8 w-8 text-accent" />
            <span className="font-bold text-xl text-white">البورصة للسيارات</span>
          </Link>
        </div>

        <div className="flex flex-none items-center justify-end space-x-2">
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground hidden sm:flex">
            <Link href="/listings/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              بيع على البورصة
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10">
            <Link href="/profile">
              <User className="h-5 w-5" />
               <span className="sr-only">Profile</span>
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Change language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                العربية
              </DropdownMenuItem>
              <DropdownMenuItem>
                English
              </DropdownMenuItem>
               <DropdownMenuItem>
                Français
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
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
