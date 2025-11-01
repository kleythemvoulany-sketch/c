'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

const signupSchema = z
  .object({
    accountType: z.enum(['personal', 'dealer']),
    fullName: z.string().optional(),
    dealerName: z.string().optional(),
    ownerName: z.string().optional(),
    phoneNumber: z.string().min(1, 'رقم الهاتف إجباري.'),
    email: z.string().email('بريد إلكتروني غير صالح.').optional().or(z.literal('')),
    password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمتا المرور غير متطابقتين.',
    path: ['confirmPassword'],
  })
  .superRefine((data, ctx) => {
    if (data.accountType === 'personal') {
      if (!data.fullName || data.fullName.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'الاسم الكامل مطلوب للحسابات الشخصية.',
          path: ['fullName'],
        });
      }
    } else if (data.accountType === 'dealer') {
      if (!data.dealerName) {
         ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'اسم البورصة مطلوب.',
          path: ['dealerName'],
        });
      }
      if (!data.ownerName) {
         ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'اسم المالك مطلوب.',
          path: ['ownerName'],
        });
      }
    }

    if (data.password && !data.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'البريد الإلكتروني مطلوب عند إدخال كلمة مرور.',
        path: ['email'],
      });
    }
  });


export default function SignupPage() {
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      accountType: 'personal',
      fullName: '',
      dealerName: '',
      ownerName: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const accountType = form.watch('accountType');

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    if (!auth || !firestore) {
        toast({ variant: 'destructive', title: "خطأ", description: "خدمات Firebase غير متاحة." });
        return;
    }
    if (!values.email) {
      toast({ variant: 'destructive', title: "خطأ", description: "البريد الإلكتروني مطلوب للتسجيل." });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;
      const displayName = values.accountType === 'personal' ? values.fullName : values.ownerName;

      await updateProfile(user, {
        displayName: displayName,
      });

      const userDocRef = doc(firestore, 'users', user.uid);
      const userData = {
        id: user.uid,
        email: values.email,
        phoneNumber: values.phoneNumber,
        firstName: displayName?.split(' ')[0] || '',
        lastName: displayName?.split(' ').slice(1).join(' ') || '',
        registrationDate: new Date().toISOString(),
        accountType: values.accountType,
        ...(values.accountType === 'dealer' && { dealerName: values.dealerName }),
      };
      
      setDocumentNonBlocking(userDocRef, userData, { merge: true });

      toast({
        title: 'تم إنشاء الحساب بنجاح!',
        description: 'مرحبًا بك في البورصة.',
      });

      router.push('/profile');
    } catch (error: any) {
      console.error(error);
      let description = 'حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى.';
      if (error.code === 'auth/email-already-in-use') {
        description = 'هذا البريد الإلكتروني مستخدم بالفعل.';
      }
      toast({
        variant: 'destructive',
        title: 'فشل إنشاء الحساب',
        description,
      });
    }
  };

  return (
    <div className="container flex items-center justify-center py-12 min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">
            إنشاء حساب جديد
          </CardTitle>
          <CardDescription>
            املأ النموذج أدناه لإنشاء حسابك الجديد على البورصة.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="accountType"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>نوع الحساب</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        dir="rtl"
                        className="grid grid-cols-2 gap-4"
                      >
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem
                              value="personal"
                              id="personal"
                              className="peer sr-only"
                            />
                          </FormControl>
                          <Label
                            htmlFor="personal"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            حساب شخصي
                          </Label>
                        </FormItem>
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem
                              value="dealer"
                              id="dealer"
                              className="peer sr-only"
                            />
                          </FormControl>
                          <Label
                            htmlFor="dealer"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            حساب بورصة
                          </Label>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {accountType === 'personal' ? (
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم الكامل</FormLabel>
                      <FormControl>
                        <Input placeholder="محمد سالم" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="dealerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اسم البورصة</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="مثال: بورصة الأمانة"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ownerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم الكامل للمالك</FormLabel>
                        <FormControl>
                          <Input placeholder="محمد سالم" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهاتف</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2" dir="ltr">
                        <Input
                          type="tel"
                          placeholder="رقم الهاتف"
                          required
                          className="text-left flex-1"
                          {...field}
                        />
                         <div className="flex h-10 items-center rounded-md border border-input bg-background px-3 gap-2">
                           <Image src="https://flagcdn.com/mr.svg" alt="Mauritania Flag" width={20} height={15}/>
                          <span className="text-sm text-muted-foreground">+222</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        {...field}
                      />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كلمة المرور</FormLabel>
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
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'جاري الإنشاء...' : 'إنشاء حساب'}
              </Button>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                لديك حساب بالفعل؟{' '}
                <Link href="/login" className="underline">
                  تسجيل الدخول
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
