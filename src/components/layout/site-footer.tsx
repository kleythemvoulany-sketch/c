import { Car, Facebook, Instagram, Linkedin, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function SiteFooter() {
  return (
    <footer className="bg-primary/5 border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Car className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl font-headline text-primary">
                البورصة للسيارات
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              المنصة الأولى في موريتانيا لبيع وشراء السيارات بأمان وسهولة.
            </p>
            <div className="flex space-x-4 mt-4" dir="ltr">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-6 w-6 text-muted-foreground hover:text-primary" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-6 w-6 text-muted-foreground hover:text-primary" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-6 w-6 text-muted-foreground hover:text-primary" />
              </a>
               <a href="https://wa.me/22234949470" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-6 w-6 text-muted-foreground hover:text-primary" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-headline font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li><Link href="/listings" className="text-sm text-muted-foreground hover:text-primary">السيارات</Link></li>
              <li><Link href="/listings/new" className="text-sm text-muted-foreground hover:text-primary">أضف إعلان</Link></li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">من نحن</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">تواصل معنا</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">سياسة الخصوصية</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-semibold mb-4">بيانات الاتصال</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
                <li>الهاتف: 34949470</li>
                <li>الهاتف 2: 31151507</li>
                <li>البريد: support@alboursa.com</li>
                <li>العنوان: نواكشوط – موريتانيا</li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-semibold mb-4">النشرة الإخبارية</h4>
            <p className="text-sm text-muted-foreground mb-3">اشترك لتصلك آخر العروض.</p>
            <div className="flex w-full max-w-sm items-center space-x-2 space-x-reverse">
              <Input type="email" placeholder="بريدك الإلكتروني" />
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">اشتراك</Button>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} جميع الحقوق محفوظة لموقع البورصة</p>
        </div>
      </div>
    </footer>
  );
}
