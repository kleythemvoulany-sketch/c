import { CarCard } from "@/components/car-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cars } from "@/lib/data";
import { Filter } from "lucide-react";

export default function ListingsPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold font-headline text-primary">
          تصفح جميع السيارات
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          ابحث عن سيارتك المثالية ضمن مجموعتنا الواسعة من الإعلانات.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <aside className="col-span-1 md:sticky top-24 h-fit">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-headline font-semibold mb-6 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                تصفية النتائج
              </h3>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="search">بحث بالاسم</Label>
                  <Input id="search" placeholder="مثال: كامري، باترول..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="make">الماركة</Label>
                  <Select dir="rtl">
                    <SelectTrigger id="make">
                      <SelectValue placeholder="كل الماركات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">كل الماركات</SelectItem>
                      <SelectItem value="toyota">تويوتا</SelectItem>
                      <SelectItem value="hyundai">هيونداي</SelectItem>
                      <SelectItem value="mercedes">مرسيدس</SelectItem>
                      <SelectItem value="nissan">نيسان</SelectItem>
                      <SelectItem value="kia">كيا</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">سنة الصنع</Label>
                  <Select dir="rtl">
                    <SelectTrigger id="year">
                      <SelectValue placeholder="كل السنوات" />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="all">كل السنوات</SelectItem>
                       {[...Array(25)].map((_, i) => {
                          const year = new Date().getFullYear() - i;
                          return <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                       })}
                    </SelectContent>
                  </Select>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="city">المدينة</Label>
                   <Select dir="rtl">
                      <SelectTrigger id="city"><SelectValue placeholder="كل المدن" /></SelectTrigger>
                      <SelectContent>
                           <SelectItem value="all">كل المدن</SelectItem>
                          <SelectItem value="nkc">نواكشوط</SelectItem>
                          <SelectItem value="ndb">نواذيبو</SelectItem>
                          <SelectItem value="kiffa">كيفه</SelectItem>
                          <SelectItem value="zouerate">أزويرات</SelectItem>
                      </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>السعر (أوقية جديدة)</Label>
                  <div className="flex gap-2">
                    <Input type="number" placeholder="من" />
                    <Input type="number" placeholder="إلى" />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  تطبيق التصفية
                </Button>
              </form>
            </CardContent>
          </Card>
        </aside>

        <main className="col-span-1 md:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">
              تم العثور على {cars.length} سيارة
            </p>
            <Select dir="rtl">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="ترتيب حسب..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">الأحدث أولاً</SelectItem>
                <SelectItem value="price-asc">السعر: من الأقل للأعلى</SelectItem>
                <SelectItem value="price-desc">السعر: من الأعلى للأقل</SelectItem>
                <SelectItem value="year-desc">السنة: من الأحدث للأقدم</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
