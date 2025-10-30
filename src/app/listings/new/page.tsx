'use client';
import { AiAdImprover } from '@/components/ai-ad-improver';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
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
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase/provider';

const listingSchema = z.object({
  make: z.string().min(1, 'الرجاء اختيار الماركة'),
  model: z.string().min(1, 'الرجاء إدخال الموديل'),
  year: z.string().min(4, 'الرجاء اختيار سنة الصنع'),
  fuelType: z.string().min(1, 'الرجاء اختيار نوع الوقود'),
  transmission: z.string().min(1, 'الرجاء اختيار ناقل الحركة'),
  mileage: z.coerce.number().min(0, 'الرجاء إدخال الكيلومترات'),
  price: z.coerce.number().min(1, 'الرجاء إدخال السعر'),
  contactNumber: z.string().min(8, 'الرجاء إدخال رقم هاتف صحيح'),
  city: z.string().min(1, 'الرجاء اختيار المدينة'),
  description: z.string().min(10, 'يجب أن يكون الوصف 10 أحرف على الأقل.'),
  color: z.string().min(1, 'الرجاء إدخال اللون'),
});

export default function NewListingPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const router = useRouter();

  const form = useForm<z.infer<typeof listingSchema>>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      make: '',
      model: '',
      year: '',
      fuelType: '',
      transmission: '',
      mileage: 0,
      price: 0,
      contactNumber: '',
      city: '',
      description: '',
      color: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof listingSchema>) => {
    if (!firestore || !user) {
      toast({
        variant: 'destructive',
        title: 'خطأ',
        description: 'يجب عليك تسجيل الدخول أولاً لإضافة إعلان.',
      });
      return;
    }
    try {
      const collectionRef = collection(firestore, 'vehicleListings');
      await addDocumentNonBlocking(collectionRef, {
        ...values,
        userId: user.uid,
        listingDate: serverTimestamp(),
        isFeatured: false,
        viewCount: 0,
        image: 'https://picsum.photos/seed/new/600/400', // Placeholder
        imageUrls: [],
      });

      toast({
        title: 'تم بنجاح!',
        description: 'تم نشر إعلانك بنجاح.',
      });
      router.push('/profile');
    } catch (error) {
      console.error('Error adding document: ', error);
      toast({
        variant: 'destructive',
        title: 'حدث خطأ',
        description: 'فشل في نشر الإعلان. الرجاء المحاولة مرة أخرى.',
      });
    }
  };

  return (
    <div className="container py-12 md:py-20">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">
            أضف إعلان جديد
          </CardTitle>
          <CardDescription>
            أعلن عن سيارتك مجانًا في دقائق! أكثر من 20,000 زائر شهريًا يبحثون
            عن سيارات مثلك.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold font-headline">
                  معلومات السيارة الأساسية
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="make"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الماركة</FormLabel>
                        <Select
                          dir="rtl"
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الماركة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="تويوتا">تويوتا</SelectItem>
                            <SelectItem value="هيونداي">هيونداي</SelectItem>
                            <SelectItem value="مرسيدس-بنز">مرسيدس</SelectItem>
                            <SelectItem value="نيسان">نيسان</SelectItem>
                            <SelectItem value="كيا">كيا</SelectItem>
                             <SelectItem value="رينو">رينو</SelectItem>
                            <SelectItem value="فورد">فورد</SelectItem>
                             <SelectItem value="تسلا">تسلا</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الموديل</FormLabel>
                        <FormControl>
                          <Input placeholder="مثال: كامري، سنتافي" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>سنة الصنع</FormLabel>
                        <Select
                          dir="rtl"
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر السنة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[...Array(35)].map((_, i) => {
                              const year = new Date().getFullYear() - i;
                              return (
                                <SelectItem key={year} value={String(year)}>
                                  {year}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fuelType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نوع الوقود</FormLabel>
                        <Select
                          dir="rtl"
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر نوع الوقود" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="بنزين">بنزين</SelectItem>
                            <SelectItem value="ديزل">ديزل</SelectItem>
                            <SelectItem value="كهرباء">كهرباء</SelectItem>
                            <SelectItem value="هجين">هجين</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="transmission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ناقل الحركة</FormLabel>
                        <Select
                          dir="rtl"
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر ناقل الحركة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="أوتوماتيكي">
                              أوتوماتيكي
                            </SelectItem>
                            <SelectItem value="يدوي">يدوي</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mileage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الكيلومترات</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="كم" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اللون</FormLabel>
                        <FormControl>
                          <Input placeholder="مثال: أبيض، أسود" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold font-headline">
                  السعر وبيانات الاتصال
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>السعر (أوقية جديدة)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="مثال: 320000"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم الهاتف</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2" dir="ltr">
                            <Input
                              type="tel"
                              {...field}
                              placeholder="رقم الهاتف"
                              className="text-left flex-1"
                            />
                             <div className="flex h-10 items-center rounded-md border border-input bg-background px-3 gap-2">
                               <Image src="https://flagcdn.com/mr.svg" alt="Mauritania Flag" width={20} height={15} />
                              <span className="text-sm text-muted-foreground mr-2">+222</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المدينة</FormLabel>
                        <Select
                          dir="rtl"
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر المدينة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="نواكشوط">نواكشوط</SelectItem>
                            <SelectItem value="نواذيبو">نواذيبو</SelectItem>
                            <SelectItem value="كيفه">كيفه</SelectItem>
                            <SelectItem value="أزويرات">أزويرات</SelectItem>
                            <SelectItem value="أطار">أطار</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                 <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                         <AiAdImprover
                          currentDescription={field.value}
                          onDescriptionChange={(newDesc) => field.onChange(newDesc)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold font-headline">الصور</h3>
                <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-12 text-center bg-background hover:bg-muted/50 cursor-pointer">
                  <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">
                    اسحب وأفلت الصور هنا، أو انقر للتصفح
                  </p>
                  <p className="text-xs text-muted-foreground/80 mt-1">
                    يمكنك رفع حتى 15 صورة (PNG, JPG, WEBP)
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'جاري النشر...' : 'نشر الإعلان الآن'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
