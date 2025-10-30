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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
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
            <Label>نوع الحساب</Label>
            <RadioGroup defaultValue="personal" dir="rtl" className="grid grid-cols-2 gap-4">
              <div>
                <RadioGroupItem value="personal" id="personal" className="peer sr-only" />
                <Label
                  htmlFor="personal"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  حساب شخصي
                </Label>
              </div>
              <div>
                <RadioGroupItem value="dealer" id="dealer" className="peer sr-only" />
                <Label
                  htmlFor="dealer"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  حساب بورصة
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">الاسم الكامل</Label>
            <Input id="name" placeholder="محمد سالم" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">رقم الهاتف</Label>
            <div className="flex items-center gap-2">
                <Input id="phone" type="tel" placeholder="رقم الهاتف" required dir="ltr" className="text-left flex-1"/>
                <div className="flex h-10 items-center rounded-md border border-input bg-background px-3">
                  <Image src="https://flagcdn.com/mr.svg" alt="Mauritania Flag" width={20} height={15} />
                  <span className="mr-2 text-sm text-muted-foreground">+222</span>
                </div>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">البريد الإلكتروني (اختياري)</Label>
            <Input id="email" type="email" placeholder="m@example.com" />
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
