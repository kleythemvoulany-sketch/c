import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Car,
  Fuel,
  Gauge,
  Gem,
  MapPin,
  Palette,
  Phone,
  Wrench,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { type Car as CarType } from '@/lib/data';
import { doc, getDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

// This is a server-side utility function to fetch data
async function getListingById(id: string): Promise<CarType | null> {
    // We need to initialize firebase services here because this is a server component
    const { firestore } = initializeFirebase();
    const carDocRef = doc(firestore, 'listings', id);
    const carSnap = await getDoc(carDocRef);

    if (!carSnap.exists()) {
        return null;
    }
    const carData = carSnap.data();

    // Convert Firestore Timestamp to string safely
    let postDateString: string;
    const postDate = carData.postDate;
    if (postDate && typeof postDate.toDate === 'function') {
      postDateString = postDate.toDate().toISOString();
    } else if (postDate instanceof Date) {
      postDateString = postDate.toISOString();
    } else if (typeof postDate === 'string') {
      postDateString = postDate;
    } else {
      postDateString = new Date().toISOString(); // Fallback
    }


    return { 
        id: carSnap.id,
        userId: carData.userId || '',
        brand: carData.brand || '',
        model: carData.model || '',
        year: carData.year || 0,
        price: carData.price || 0,
        mileage: carData.mileage || 0,
        fuelType: carData.fuelType || 'بنزين',
        transmissionType: carData.transmissionType || 'أوتوماتيكي',
        city: carData.city || '',
        images: carData.images || [],
        description: carData.description || '',
        color: carData.color || '',
        contactNumber: carData.contactNumber || '',
        postDate: postDateString,
        isFeatured: carData.isFeatured || false,
    } as CarType;
}

interface PageProps {
  params: { id: string };
}

export default async function CarDetailsPage({ params }: PageProps) {
  const car = await getListingById(params.id);

  if (!car) {
    notFound();
  }

  const gallery = [
    ...(car.images || []),
  ];
  while (gallery.length > 0 && gallery.length < 5) {
     gallery.push(`https://picsum.photos/seed/${car.id + gallery.length + 1}/600/400`);
  }
  if (gallery.length === 0) {
      gallery.push(`https://picsum.photos/seed/${car.id}/600/400`);
  }


  const techDetails = [
    { label: 'الماركة', value: car.brand, icon: Car },
    { label: 'الطراز', value: car.model, icon: Car },
    { label: 'سنة الصنع', value: car.year, icon: Calendar },
    { label: 'ناقل الحركة', value: car.transmissionType, icon: Wrench },
    { label: 'الوقود', value: car.fuelType, icon: Fuel },
    {
      label: 'الكيلومترات',
      value: `${new Intl.NumberFormat('en-US').format(car.mileage)} كم`,
      icon: Gauge,
    },
    { label: 'اللون', value: car.color, icon: Palette },
    { label: 'البلد', value: 'موريتانيا', icon: MapPin },
    { label: 'المدينة', value: car.city, icon: MapPin },
  ];

  return (
    <div className="container py-12 md:py-20 bg-background">
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="md:col-span-2">
          {/* Gallery */}
          <div className="mb-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-4 shadow-lg">
              <Image
                src={gallery[0]}
                alt={`${car.brand} ${car.model}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
              {car.isFeatured && (
                <Badge
                  variant="default"
                  className="absolute top-4 right-4 bg-yellow-400 text-black border-2 border-white/50"
                >
                  <Gem className="ml-1 h-3 w-3" />
                  مميزة
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {gallery.slice(1).map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-video w-full overflow-hidden rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={img}
                    alt={`Gallery image ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 16vw"
                  />
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">
                وصف الإعلان
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 whitespace-pre-line">
                {car.description}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
          <h1 className="text-3xl font-bold font-headline text-primary">
            {car.brand} {car.model}
          </h1>
          <div className="text-4xl font-bold text-accent">
            {new Intl.NumberFormat('en-US').format(car.price)}
            <span className="text-base font-medium text-primary mr-2">
              أوقية جديدة
            </span>
          </div>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">
                التفاصيل الفنية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {techDetails.map((detail) => (
                <div
                  key={detail.label}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-muted-foreground flex items-center gap-2">
                    <detail.icon className="w-4 h-4" />
                    {detail.label}
                  </span>
                  <span className="font-semibold">{detail.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="sticky top-24">
            <Button
              size="lg"
              className="w-full text-lg h-14 bg-accent hover:bg-accent/90 text-accent-foreground dir-ltr items-center justify-center"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg font-semibold">{car.contactNumber}</span>
                <div className="flex items-center gap-1.5 rounded-md bg-white/20 px-2 py-1">
                  <Image
                    src="https://flagcdn.com/mr.svg"
                    alt="Mauritania Flag"
                    width={0}
                    height={0}
                    className="w-4 h-auto"
                  />
                  <span className="text-xs text-white/80">+222</span>
                </div>
              </span>
              <Phone className="mr-3 h-6 w-6" />
            </Button>
            <Button size="lg" variant="outline" className="w-full text-lg h-14 mt-3">
              <svg
                className="ml-3 h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M16.75 13.96c.25.13.41.2.5.28.09.08.16.18.2.28.04.1.06.2.06.28.01.23-.14.48-.4.73-.25.25-.5.48-.75.73-.25.24-.5.48-.73.72-.24.24-.48.45-.73.66-.25.21-.5.4-.75.56-.25.16-.5.3-.75.42s-.5.2-.75.25c-.25.04-.5.06-.75.06s-.5-.02-.75-.06a7.6 7.6 0 0 1-2.94-1.18c-.5-.28-.96-.6-1.4-1-.4-.4-.78-.8-1.1-1.28-.35-.48-.63-.9-.86-1.3-.23-.4-.4-.78-.5-1.15s-.14-.75-.14-1.12.03-.7.1-1.04.16-.65.28-.95c.12-.3.26-.58.42-.83s.34-.48.5-.68c.18-.2.34-.38.48-.5.15-.13.28-.2.38-.2s.18-.02.25-.02.13.01.2.04.13.06.2.12c.04.03.1.1.18.2.08.1.15.2.2.3.1.18.18.35.25.5.07.16.1.3.1.4s-.01.28-.04.4c-.03.13-.08.25-.15.38s-.16.25-.25.38c-.09.12-.2.23-.3.3-.1.08-.2.15-.28.2-.08.05-.14.1-.2.13-.03.02-.05.03-.06.03a.2.2 0 0 0-.08.06c-.03.03-.04.06-.04.08s0 .05.01.08a.6.6 0 0 0 .08.18c.05.1.1.18.15.25.2.3.4.6.63.9.23.3.48.6.73.88.25.3.5.58.78.85.28.27.55.52.83.75.28.23.55.45.83.65.28.2.55.4.8.58.08.04.15.08.2.1.08.03.14.05.2.06.03,0,.05,0,.06-.01s.03-.02.04-.03a.24.24 0 0 0 .1-.15.2.2 0 0 0 .01-.13v-.02c-.01-.08-.03-.15-.06-.2s-.08-.14-.13-.2c-.1-.18-.15-.35-.18-.5-.03-.15-.03-.28-.03-.4s.03-.25.08-.35c.05-.1.1-.2.18-.28.15-.15.3-.28.48-.38.18-.1.35-.2.5-.25.15-.06.3-.1.4-.1s.2,0,.3.02Z" />
              </svg>
              تواصل عبر واتساب
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
