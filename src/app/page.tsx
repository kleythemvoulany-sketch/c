import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Car, ChevronsRight } from "lucide-react";
import Link from "next/link";
import { cars, categories, testimonials } from "@/lib/data";
import { CarCard } from "@/components/car-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";


export default function Home() {
  const featuredCars = cars.filter(c => c.featured);
  const latestCars = cars.sort((a, b) => b.id - a.id).slice(0, 6);

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-secondary">
        <div className="absolute inset-0 bg-primary opacity-80 z-0"></div>
        <Image 
          src="https://picsum.photos/seed/hero/1920/1080" 
          alt="Hero background" 
          fill
          className="object-cover z-[-1] opacity-20"
          data-ai-hint="car driving sunset"
        />
        <div className="container relative px-4 md:px-6 text-center z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-white">
              البورصة – سوق السيارات في موريتانيا
            </h1>
            <p className="mt-4 text-lg text-white/80 md:text-xl">
              بيع، اشترِ، وتصفح أحدث السيارات بأسهل تجربة في البلاد
            </p>
          </div>
          <Card className="max-w-5xl mx-auto mt-8 p-4 bg-background/90 backdrop-blur-sm shadow-xl">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:items-end">
              <div className="md:col-span-2">
                <Input type="text" placeholder="ابحث عن سيارة..." className="h-12 text-lg"/>
              </div>
              <Select dir="rtl">
                <SelectTrigger className="h-12 text-lg"><SelectValue placeholder="الماركة" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="toyota">تويوتا</SelectItem>
                  <SelectItem value="hyundai">هيونداي</SelectItem>
                  <SelectItem value="mercedes">مرسيدس</SelectItem>
                </SelectContent>
              </Select>
               <Select dir="rtl">
                <SelectTrigger className="h-12 text-lg"><SelectValue placeholder="السنة" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
              <Button size="lg" className="h-12 text-lg w-full">
                <Car className="ml-2 h-6 w-6" />
                بحث
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-2 text-primary">عروض مميزة</h2>
          <p className="text-center text-muted-foreground mb-8">سيارات مختارة بعناية لك</p>
          <Carousel opts={{ loop: true, direction: 'rtl' }} className="w-full max-w-6xl mx-auto">
            <CarouselContent>
              {featuredCars.map((car) => (
                <CarouselItem key={car.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <CarCard car={car} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute start-0 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute end-0 top-1/2 -translate-y-1/2" />
          </Carousel>
        </div>
      </section>

      <section className="bg-secondary py-12 md:py-20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-8 text-primary">تصفح حسب الفئة</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link href="#" key={category.name}>
                <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="bg-accent/10 p-4 rounded-full mb-3">
                       <category.icon className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="font-semibold text-lg text-primary">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-background">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-primary">أحدث الإعلانات</h2>
              <p className="text-muted-foreground">اكتشف آخر ما تم إضافته لمنصتنا</p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/listings" className="text-accent">
                عرض الكل <ChevronsRight className="mr-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>
      
      <section className="bg-primary text-primary-foreground py-12 md:py-20">
        <div className="container text-center">
          <h2 className="text-3xl font-bold">انضم إلى أكثر من 100,000 مستخدم يثقون في البورصة</h2>
          <p className="mt-4 max-w-3xl mx-auto text-primary-foreground/80">
            المنصة الأولى في موريتانيا لبيع وشراء السيارات بأمان وسهولة.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
              <Link href="/listings/new">
                أعلن عن سيارتك مجاناً
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
              اتصل بنا: 34949470
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-secondary">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-8 text-primary">ماذا يقول عملاؤنا؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <Avatar className="h-12 w-12 ml-4 border-2 border-accent">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-lg">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="flex my-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                    ))}
                  </div>
                  <p className="text-foreground/80">"{testimonial.comment}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
