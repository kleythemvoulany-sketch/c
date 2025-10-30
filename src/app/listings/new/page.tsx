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
import { UploadCloud, X } from 'lucide-react';
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
import React, { useState } from 'react';
import { uploadImages } from '@/firebase/storage';
import { Progress } from '@/components/ui/progress';

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

const carModelsByMake: Record<string, string[]> = {
  تويوتا: ['كامري', 'كورولا', 'لاند كروزر', 'هيلوكس', 'راف فور', 'ياريس'],
  هيونداي: ['إلنترا', 'سوناتا', 'سنتافي', 'أكسنت', 'توسان', 'كونا'],
  'مرسيدس-بنز': ['C-Class', 'E-Class', 'S-Class', 'GLE', 'GLC'],
  نيسان: ['صني', 'سنترا', 'باترول', 'ألتيما', 'إكس-تريل'],
  كيا: ['سيراتو', 'أوبتيما', 'سبورتاج', 'سورينتو', 'ريو'],
  رينو: ['ميجان', 'كليو', 'داستر', 'كابتشر'],
  فورد: ['فوكس', 'فيوجن', 'إكسبلورر', 'إدج', 'رينجر'],
  تسلا: ['Model S', 'Model 3', 'Model X', 'Model Y'],
};

const carColors = [
  'أبيض',
  'أسود',
  'فضي',
  'رمادي',
  'أحمر',
  'أزرق',
  'بني',
  'أخضر',
  'بيج',
  'ذهبي',
  'برتقالي',
  'أصفر',
];

export default function NewListingPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const router = useRouter();

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

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

  const selectedMake = form.watch('make');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const currentImageCount = imageFiles.length;
      const remainingSlots = 15 - currentImageCount;

      if (files.length > remainingSlots) {
        toast({
          variant: 'destructive',
          title: 'الحد الأقصى للصور',
          description: `يمكنك رفع ${remainingSlots} صور إضافية فقط.`,
        });
        return;
      }
      
      const newFiles = [...imageFiles, ...files];
      setImageFiles(newFiles);

      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index]);
      return newPreviews;
    });
  };

  const onSubmit = async (values: z.infer<typeof listingSchema>) => {
    if (!firestore || !user) {
      toast({
        variant: 'destructive',
        title: 'خطأ',
        description: 'يجب عليك تسجيل الدخول أولاً لإضافة إعلان.',
      });
      return;
    }
    if (imageFiles.length === 0) {
      toast({
        variant: 'destructive',
        title: 'خطأ',
        description: 'يجب رفع صورة واحدة على الأقل.',
      });
      return;
    }

    try {
      setUploadProgress(0);
      const imageUrls = await uploadImages(imageFiles, (progress) => setUploadProgress(progress));
      setUploadProgress(100);

      const collectionRef = collection(firestore, 'vehicleListings');
      await addDocumentNonBlocking(collectionRef, {
        ...values,
        userId: user.uid,
        listingDate: serverTimestamp(),
        isFeatured: false,
        viewCount: 0,
        image: imageUrls[0], // Main image
        imageUrls: imageUrls,
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
      setUploadProgress(null);
    }
  };

  const isSubmitting = form.formState.isSubmitting || uploadProgress !== null;

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
                          onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue('model', ''); // Reset model on make change
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الماركة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.keys(carModelsByMake).map((make) => (
                              <SelectItem key={make} value={make}>{make}</SelectItem>
                            ))}
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
                        <Select
                          dir="rtl"
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!selectedMake}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={!selectedMake ? 'اختر الماركة أولاً' : 'اختر الموديل'} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {selectedMake && carModelsByMake[selectedMake]?.map((model) => (
                               <SelectItem key={model} value={model}>
                                {model}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                        <Select
                          dir="rtl"
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر اللون" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {carColors.map((color) => (
                              <SelectItem key={color} value={color}>
                                {color}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                <Label
                  htmlFor="image-upload"
                  className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-12 text-center bg-background hover:bg-muted/50 cursor-pointer block"
                >
                  <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">
                    اسحب وأفلت الصور هنا، أو انقر للتصفح
                  </p>
                  <p className="text-xs text-muted-foreground/80 mt-1">
                    يمكنك رفع حتى 15 صورة (PNG, JPG, WEBP)
                  </p>
                </Label>
                <Input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                />
                 {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mt-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative aspect-square">
                        <Image
                          src={preview}
                          alt={`معاينة الصورة ${index + 1}`}
                          fill
                          className="object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={() => removeImage(index)}
                          disabled={isSubmitting}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {uploadProgress !== null && (
                <div className="space-y-2">
                  <Label>
                    {uploadProgress < 100
                      ? `جاري رفع الصور... ${Math.round(uploadProgress)}%`
                      : 'اكتمل رفع الصور!'}
                  </Label>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'جاري النشر...' : 'نشر الإعلان الآن'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
