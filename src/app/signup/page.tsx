import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="container flex min-h-[calc(100vh-160px)] items-center justify-center py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">إنشاء حساب جديد</CardTitle>
          <CardDescription>
            املأ النموذج أدناه لإنشاء حسابك الجديد على البورصة.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">الاسم الكامل</Label>
            <Input id="name" placeholder="محمد سالم" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input id="password" type="password" required />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
            <Input id="confirm-password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full">إنشاء حساب</Button>
           <p className="mt-4 text-center text-sm text-muted-foreground">
            لديك حساب بالفعل؟{' '}
            <Link href="/login" className="underline">
              تسجيل الدخول
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
