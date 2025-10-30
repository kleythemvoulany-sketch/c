"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User, UploadCloud } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

// Mock user data for demonstration
const user = {
  name: "محمد سالم",
  email: "mohamed.salem@example.com",
  phone: "34949470",
  avatar: "https://picsum.photos/seed/t1/100/100",
};

const profileSchema = z
  .object({
    name: z.string().min(3, { message: "الاسم يجب أن يكون 3 أحرف على الأقل." }),
    phone: z.string().min(8, { message: "رقم الهاتف غير صالح." }),
    currentPassword: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل."}).optional().or(z.literal('')),
    newPassword: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل."}).optional().or(z.literal('')),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      message: "الرجاء إدخال كلمة المرور الحالية لتغييرها.",
      path: ["currentPassword"],
    }
  )
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "كلمتا المرور الجديدتان غير متطابقتين.",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: ProfileFormValues) {
    console.log("Profile update data:", data);
    toast({
      title: "تم بنجاح!",
      description: "تم تحديث معلومات ملفك الشخصي.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>معلومات الحساب</CardTitle>
            <CardDescription>
              قم بتحديث معلومات حسابك هنا. سيتم عرض اسمك ورقم هاتفك في
              إعلاناتك.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>
                  <User className="h-10 w-10 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Label htmlFor="picture">الصورة الشخصية</Label>
                <div className="mt-2 flex items-center gap-4">
                  <Button type="button" variant="outline">
                    <UploadCloud className="ml-2 h-4 w-4" /> تغيير الصورة
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG (بحد أقصى 5 ميجابايت)
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم الكامل</FormLabel>
                    <FormControl>
                      <Input placeholder="اسمك الكامل" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهاتف</FormLabel>
                    <FormControl>
                       <div className="flex items-center gap-2">
                            <div className="flex h-10 items-center rounded-md border border-input bg-background px-3">
                                <Image src="https://flagcdn.com/mr.svg" alt="Mauritania Flag" width={20} height={15} />
                                <span className="mr-2 text-sm text-muted-foreground">+222</span>
                            </div>
                            <Input placeholder="رقم هاتفك" {...field} dir="ltr" className="text-left"/>
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="disabled:cursor-not-allowed disabled:opacity-70"
                />
                <p className="text-sm text-muted-foreground">
                  لا يمكن تغيير البريد الإلكتروني.
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium">تغيير كلمة المرور</h3>
              <p className="text-sm text-muted-foreground">
                اترك الحقول فارغة إذا كنت لا ترغب في تغيير كلمة المرور.
              </p>
              <div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>كلمة المرور الحالية</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>كلمة المرور الجديدة</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تأكيد كلمة المرور</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit">حفظ التغييرات</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
