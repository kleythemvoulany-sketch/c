import { CarListItem } from "@/components/car-list-item";
import { Button } from "@/components/ui/button";
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
import { Filter, List, LayoutGrid, View } from "lucide-react";

export default function ListingsPage() {
  return (
    <div className="bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <aside className="col-span-1 lg:sticky top-24 h-fit">
            <div className="bg-secondary rounded-lg p-6">
              <h3 className="text-xl font-headline font-semibold mb-6 flex items-center gap-2 text-primary">
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
                        return (
                          <SelectItem key={year} value={String(year)}>
                            {year}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">المدينة</Label>
                  <Select dir="rtl">
                    <SelectTrigger id="city">
                      <SelectValue placeholder="كل المدن" />
                    </SelectTrigger>
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
                <Button
                  type="submit"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  تطبيق التصفية
                </Button>
              </form>
            </div>
          </aside>

          <main className="col-span-1 lg:col-span-3">
            <div className="bg-secondary rounded-lg px-6 py-4 flex flex-wrap justify-between items-center gap-4 mb-8">
              <p className="text-muted-foreground flex items-center gap-2">
                <List className="w-5 h-5 text-primary" />
                <span>
                  تم العثور على{" "}
                  <span className="font-bold text-primary">{cars.length}</span>{" "}
                  سيارة
                </span>
              </p>
              <div className="flex items-center gap-2">
                <Label htmlFor="sort" className="hidden sm:block">
                  ترتيب حسب:
                </Label>
                <Select dir="rtl">
                  <SelectTrigger
                    id="sort"
                    className="w-full sm:w-[180px] bg-background"
                  >
                    <SelectValue placeholder="الأحدث أولاً" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">الأحدث أولاً</SelectItem>
                    <SelectItem value="price-asc">
                      السعر: من الأقل للأعلى
                    </SelectItem>
                    <SelectItem value="price-desc">
                      السعر: من الأعلى للأقل
                    </SelectItem>
                    <SelectItem value="year-desc">
                      السنة: من الأحدث للأقدم
                    </SelectItem>
                  </SelectContent>
                </Select>
                 <Button variant="outline" size="icon" className="bg-background">
                    <LayoutGrid className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              {cars.map((car) => (
                <CarListItem key={car.id} car={car} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
