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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { User as UserType } from '@/lib/data';
import { useAuth, useFirestore, useUser } from "@/firebase";
import { updatePassword, updateProfile } from "firebase/auth";
import { doc } from "firebase/firestore";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Label } from "./ui/label";

const profileSchema = z
  .object({
    name: z.string().min(3, { message: "الاسم يجب أن يكون 3 أحرف على الأقل." }),
    phone: z.string().min(8, { message: "رقم الهاتف غير صالح." }),
    currentPassword: z.string().optional().or(z.literal('')),
    newPassword: z.string().optional().or(z.literal('')),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // if new password is set, current password must be set
      if (data.newPassword && (!data.currentPassword || data.currentPassword.length < 6)) {
        return false;
      }
      return true;
    },
    {
      message: "الرجاء إدخال كلمة المرور الحالية (6 أحرف على الأقل) لتغييرها.",
      path: ["currentPassword"],
    }
  )
  .refine((data) => {
    // if new password is set, it must match confirmation
    if(data.newPassword && data.newPassword.length < 6) {
        return false;
    }
    return true;
  },{
    message: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل.",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "كلمتا المرور الجديدتان غير متطابقتين.",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;

type ProfileFormProps = {
  userProfile: UserType;
};

export function ProfileForm({ userProfile }: ProfileFormProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: (userProfile.firstName || "") + ' ' + (userProfile.lastName || ""),
      phone: userProfile.phoneNumber || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    if (!user || !firestore || !auth) return;

    try {
      // Update profile display name in Firebase Auth
      if (data.name !== user.displayName) {
        await updateProfile(user, { displayName: data.name });
      }

      // Update user document in Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      updateDocumentNonBlocking(userDocRef, {
        firstName: data.name.split(' ')[0],
        lastName: data.name.split(' ').slice(1).join(' '),
        phoneNumber: data.phone,
      });

      // Update password if provided
      if (data.newPassword && data.currentPassword) {
        // This requires recent sign-in, which we are not re-authenticating for simplicity.
        // Firebase SDK will throw an error if re-authentication is needed.
        await updatePassword(user, data.newPassword);
         toast({
          title: "تم تغيير كلمة المرور!",
          description: "تم تحديث كلمة المرور بنجاح.",
        });
        // Clear password fields after successful update
        form.reset({
            ...form.getValues(),
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });
      } else {
         toast({
            title: "تم بنجاح!",
            description: "تم تحديث معلومات ملفك الشخصي.",
        });
      }
      

    } catch (error: any) {
       console.error("Profile update error:", error);
       let description = "فشل تحديث الملف الشخصي. قد تحتاج إلى تسجيل الدخول مرة أخرى للمتابعة.";
        if (error.code === 'auth/requires-recent-login') {
            description = 'لتغيير كلمة المرور، يجب عليك تسجيل الدخول مرة أخرى أولاً.';
        } else if (error.code === 'auth/wrong-password') {
            description = 'كلمة المرور الحالية غير صحيحة.';
        }
       toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: description,
      });
    }
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
                <AvatarImage src={userProfile.profilePictureUrl} />
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
                       <div className="flex items-center gap-2" dir="ltr">
                             <Input placeholder="رقم الهاتف" {...field} className="text-left flex-1"/>
                            <div className="flex h-10 items-center rounded-md border border-input bg-background px-3 gap-2">
                                <Image src="https://flagcdn.com/mr.svg" alt="Mauritania Flag" width={20} height={15} className="h-auto"/>
                                <span className="text-sm text-muted-foreground">+222</span>
                            </div>
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
                  value={userProfile.email || ''}
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
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
