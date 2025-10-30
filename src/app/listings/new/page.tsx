import { AiAdImprover } from "@/components/ai-ad-improver";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud } from "lucide-react";
import Image from "next/image";

export default function NewListingPage() {
  return (
    <div className="container py-12 md:py-20">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">أضف إعلان جديد</CardTitle>
          <CardDescription>
            أعلن عن سيارتك مجانًا في دقائق! أكثر من 20,000 زائر شهريًا يبحثون عن سيارات مثلك.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-xl font-semibold font-headline">معلومات السيارة الأساسية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="make">الماركة</Label>
                        <Select dir="rtl">
                            <SelectTrigger id="make"><SelectValue placeholder="اختر الماركة" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="toyota">تويوتا</SelectItem>
                                <SelectItem value="hyundai">هيونداي</SelectItem>
                                <SelectItem value="mercedes">مرسيدس</SelectItem>
                                <SelectItem value="nissan">نيسان</SelectItem>
                                <SelectItem value="kia">كيا</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="model">الموديل</Label>
                        <Input id="model" placeholder="مثال: كامري، سنتافي" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="year">سنة الصنع</Label>
                        <Select dir="rtl">
                            <SelectTrigger id="year"><SelectValue placeholder="اختر السنة" /></SelectTrigger>
                            <SelectContent>
                                {[...Array(25)].map((_, i) => {
                                    const year = new Date().getFullYear() - i;
                                    return <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fuel">نوع الوقود</Label>
                        <Select dir="rtl">
                            <SelectTrigger id="fuel"><SelectValue placeholder="اختر نوع الوقود" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="gasoline">بنزين</SelectItem>
                                <SelectItem value="diesel">ديزل</SelectItem>
                                <SelectItem value="electric">كهرباء</SelectItem>
                                <SelectItem value="hybrid">هجين</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="transmission">ناقل الحركة</Label>
                        <Select dir="rtl">
                            <SelectTrigger id="transmission"><SelectValue placeholder="اختر ناقل الحركة" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="automatic">أوتوماتيكي</SelectItem>
                                <SelectItem value="manual">يدوي</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mileage">الكيلومترات</Label>
                        <Input id="mileage" type="number" placeholder="كم" />
                    </div>
                </div>
            </div>

             <div className="space-y-4">
                <h3 className="text-xl font-semibold font-headline">السعر وبيانات الاتصال</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="price">السعر (أوقية جديدة)</Label>
                        <Input id="price" type="number" placeholder="مثال: 320000" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">رقم الهاتف</Label>
                        <div className="flex items-center gap-2">
                            <Input id="phone" type="tel" placeholder="رقم الهاتف" dir="ltr" className="text-left flex-1"/>
                             <div className="flex h-10 items-center rounded-md border border-input bg-background px-3">
                                <Image src="https://flagcdn.com/mr.svg" alt="Mauritania Flag" width={20} height={15} />
                                <span className="mr-2 text-sm text-muted-foreground">+222</span>
                            </div>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="city">المدينة</Label>
                         <Select dir="rtl">
                            <SelectTrigger id="city"><SelectValue placeholder="اختر المدينة" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="nkc">نواكشوط</SelectItem>
                                <SelectItem value="ndb">نواذيبو</SelectItem>
                                <SelectItem value="kiffa">كيفه</SelectItem>
                                <SelectItem value="zouerate">أزويرات</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-semibold font-headline">وصف الإعلان</h3>
                <AiAdImprover />
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-semibold font-headline">الصور</h3>
                <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-12 text-center bg-background hover:bg-muted/50 cursor-pointer">
                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">اسحب وأفلت الصور هنا، أو انقر للتصفح</p>
                    <p className="text-xs text-muted-foreground/80 mt-1">يمكنك رفع حتى 15 صورة (PNG, JPG, WEBP)</p>
                </div>
            </div>
            
            <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                نشر الإعلان الآن
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
