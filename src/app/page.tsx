import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import Link from "next/link";
import { cars, categories } from "@/lib/data";
import { CarListItem } from "@/components/car-list-item";
import { CarCard } from "@/components/car-card";

export default function Home() {
  const featuredCars = cars.filter((c) => c.featured).slice(0, 4);
  const latestCars = cars.sort((a, b) => b.id - a.id).slice(0, 10);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <section className="w-full bg-white pt-8 pb-8">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center rounded-md border bg-white flex-row-reverse shadow-sm">
                <Button className="flex h-14 items-center px-3 py-3 border-l rounded-none bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Search className="text-white" />
                  <span className="mr-2 hidden md:block">ابحث عن سيارتك</span>
                </Button>
                <Input
                  type="text"
                  placeholder="ابحث عن أي شيء..."
                  className="h-14 flex-grow appearance-none py-2 focus:outline-none pr-2 text-right border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg"
                  dir="rtl"
                />
                 <div className="relative hidden md:block">
                  <Button
                    variant="link"
                    className="flex h-12 items-center justify-between border-l px-4"
                    asChild
                  >
                    <Link href="/listings">
                      <span className="whitespace-nowrap text-sm ml-4 text-primary hover:text-accent">
                        بحث متقدم
                      </span>
                    </Link>
                  </Button>
                </div>
              </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-6 sm:py-8">
        <h2 className="container mx-auto mb-3 max-w-screen-2xl px-4 text-start text-2xl font-bold text-gray-800 sm:mb-6 sm:text-3xl">
          الفئات
        </h2>
        <div className="relative flex items-center justify-center">
          <div className="scrollbar-hide container block max-w-screen-2xl snap-none overflow-y-hidden overflow-x-scroll">
            <div className="flex min-w-max justify-start gap-6 px-6 md:px-4 xl:px-3">
              {categories.map((category) => (
                <Link href="/listings" key={category.name}>
                  <div className="group flex min-w-[52px] cursor-pointer flex-col items-center *:duration-200 hover:scale-105 sm:min-w-[100px]">
                    <div className="relative size-20 rounded-full p-4 transition-transform sm:size-[90px] lg:size-[105px] xl:size-28 bg-accent/10">
                      <div className="relative flex h-full w-full items-center justify-center">
                        <category.icon className="h-full w-full text-accent" />
                      </div>
                    </div>
                    <p className="m-0 mt-2 whitespace-nowrap text-center text-[12px] transition-colors sm:text-sm md:text-base group-hover:text-accent">
                      {category.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <section className="bg-background py-12 md:py-16">
        <div className="container">
           <h2 className="mb-6 text-2xl font-semibold text-gray-800 md:text-3xl">
            عروض مميزة
          </h2>
          <div className="space-y-4">
            {featuredCars.map((car) => (
              <CarListItem key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 md:text-3xl">
              أحدث الإعلانات
            </h2>
            <Button variant="link" asChild>
              <Link href="/listings">
                عرض الكل
              </Link>
            </Button>
          </div>
          <div className="space-y-4">
            {latestCars.map((car) => (
              <CarListItem key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
