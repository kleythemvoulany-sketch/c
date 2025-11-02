
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
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc, Timestamp } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

// Server-side data fetching function
async function getListingById(id: string): Promise<CarType | null> {
  // Initialize Firebase for server-side operations.
  // This is safe to run on the server multiple times as getApps() prevents re-initialization.
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
  const firestore = getFirestore();

  const carDocRef = doc(firestore, 'listings', id);
  const carSnap = await getDoc(carDocRef);

  if (!carSnap.exists()) {
    return null;
  }
  const carData = carSnap.data();

  // Safely convert Firestore Timestamp to a serializable ISO string
  const postDate = carData.postDate;
  let postDateString: string;
  if (postDate instanceof Timestamp) {
    postDateString = postDate.toDate().toISOString();
  } else if (typeof postDate === 'string') {
    postDateString = postDate;
  } else {
    // Provide a fallback if the date is missing or in an unexpected format
    postDateString = new Date().toISOString();
  }

  // Construct the Car object, ensuring all fields are present
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
    postDate: postDateString, // Ensure this is a serializable string
    isFeatured: carData.isFeatured || false,
  } as CarType;
}


// Correct interface definition for the page's props
interface PageProps {
  params: {
    id: string;
  };
}

// The page is now a pure Server Component
export default async function CarDetailsPage({ params }: PageProps) {
  const car = await getListingById(params.id);

  if (!car) {
    notFound();
  }

  const gallery = [...(car.images || [])];
    while (gallery.length > 0 && gallery.length < 5) {
    gallery.push(
      `https://picsum.photos/seed/${car.id + gallery.length + 1}/600/400`
    );
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
                <span className="text-lg font-semibold">
                  {car.contactNumber}
                </span>
                <div className="flex items-center gap-1.5 rounded-md bg-white/20 px-2 py-1">
                  <Image
                    src="https://flagcdn.com/mr.svg"
                    alt="Mauritania Flag"
                    width={20}
                    height={15}
                  />
                  <span className="text-xs text-white/80">+222</span>
                </div>
              </span>
              <Phone className="mr-3 h-6 w-6" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full text-lg h-14 mt-3"
            >
              تواصل عبر واتساب
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
