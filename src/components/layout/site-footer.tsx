import { Facebook, Instagram, Linkedin, MessageCircle, Twitter } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground border-t">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="font-bold text-xl">
                البورصة للسيارات
              </span>
            </Link>
            <p className="text-primary-foreground/70 text-sm">
              المنصة الأولى في موريتانيا لبيع وشراء السيارات بأمان وسهولة.
            </p>
          </div>
          
          <div className="lg:col-start-3">
            <h4 className="font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/listings" className="text-primary-foreground/70 hover:text-accent">السيارات</Link></li>
              <li><Link href="/listings/new" className="text-primary-foreground/70 hover:text-accent">أضف إعلان</Link></li>
              <li><Link href="#" className="text-primary-foreground/70 hover:text-accent">من نحن</Link></li>
              <li><Link href="#" className="text-primary-foreground/70 hover:text-accent">تواصل معنا</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">تابعنا</h4>
             <div className="flex space-x-4" dir="ltr">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-accent">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-accent">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-accent">
                <Instagram className="h-6 w-6" />
              </a>
               <a href="#" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-accent">
                <MessageCircle className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-primary-foreground/10 pt-8 text-center text-sm text-primary-foreground/60">
          <p>© {new Date().getFullYear()} جميع الحقوق محفوظة لموقع البورصة</p>
        </div>
      </div>
    </footer>
  );
}
