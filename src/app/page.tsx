'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { categories } from '@/lib/data';
import { CarCard } from '@/components/car-card';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where, limit, orderBy } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { Car } from '@/lib/data';
import { useMemoFirebase } from '@/firebase/provider';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const firestore = useFirestore();
  const { isUserLoading } = useUser();

  const featuredQuery = useMemoFirebase(
    () =>
      firestore && !isUserLoading
        ? query(collection(firestore, 'listings'), where('isFeatured', '==', true), limit(4))
        : null,
    [firestore, isUserLoading]
  );
  const { data: featuredCars, isLoading: isFeaturedLoading } = useCollection<Car>(featuredQuery);

  const latestQuery = useMemoFirebase(
    () =>
      firestore && !isUserLoading
        ? query(collection(firestore, 'listings'), orderBy('postDate', 'desc'), limit(8))
        : null,
    [firestore, isUserLoading]
  );
  const { data: latestCars, isLoading: isLatestLoading } = useCollection<Car>(latestQuery);

  const showFeaturedSkeletons = isUserLoading || isFeaturedLoading;
  const showLatestSkeletons = isUserLoading || isLatestLoading;


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
                  className="flex h-12 items-center justify-between border-l px-4 bg-accent text-accent-foreground hover:bg-accent/90 rounded-none"
                  asChild
                >
                  <Link href="/listings">
                    <SlidersHorizontal className="w-4 h-4 ml-2" />
                    <span className="whitespace-nowrap text-sm">
                      بحث متقدم
                    </span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary/10 py-8 sm:py-12">
        <div className="container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 md:text-3xl">
              البورصة الموثوقة
            </h2>
            <Button variant="link" asChild>
              <Link href="/dealers">عرض الكل</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                href="#"
                key={category.name}
                className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-background transition-colors group"
              >
                <div className="relative h-24 w-24">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover rounded-full border-4 border-white shadow-md group-hover:scale-105 transition-transform"
                    sizes="96px"
                  />
                </div>
                <h3 className="font-semibold text-center">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-12 md:py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 md:text-3xl">
              عروض مميزة
            </h2>
            <Button variant="link" asChild>
              <Link href="/listings">عرض الكل</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {showFeaturedSkeletons
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="h-56 w-full" />
                    <CardContent className="p-4 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-8 w-1/2" />
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              : featuredCars?.map((car) => <CarCard key={car.id} car={car} />)}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 md:text  -3xl">
              أحدث الإعلانات
            </h2>
            <Button variant="link" asChild>
              <Link href="/listings">عرض الكل</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {showLatestSkeletons
              ? Array.from({ length: 8 }).map((_, i) => (
                   <Card key={i}>
                    <Skeleton className="h-56 w-full" />
                    <CardContent className="p-4 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-8 w-1/2" />
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              : latestCars?.map((car) => <CarCard key={car.id} car={car} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
