
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
  MessageCircle,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { type Car as CarType } from '@/lib/data';
import { getFirestore, doc, getDoc, Timestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

interface CarDetailsPageProps {
  params: {
    id: string;
  };
}

async function getListingById(id: string): Promise<CarType | null> {
  // This function runs only on the server
  const { firestore } = initializeFirebase();
  const carDocRef = doc(firestore, 'listings', id);

  try {
    const carSnap = await getDoc(carDocRef);

    if (!carSnap.exists()) {
      return null;
    }
    const carData = carSnap.data();

    // Ensure postDate is a serializable string (ISO format) before returning
    const postDate = carData.postDate;
    let postDateString: string;
    if (postDate instanceof Timestamp) {
      postDateString = postDate.toDate().toISOString();
    } else if (typeof postDate === 'string') {
      postDateString = postDate;
    } else if (postDate instanceof Date) {
      postDateString = postDate.toISOString();
    } else {
      // Provide a fallback if the date is missing or in an unexpected format
      postDateString = new Date().toISOString();
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
  } catch (error) {
    console.error("Error fetching listing:", error);
    return null;
  }
}

export default async function CarDetailsPage({ params }: CarDetailsPageProps) {
  const car = await getListingById(params.id);

  if (!car) {
    notFound();
  }

  // Create a gallery with placeholders if needed
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
              {gallery.slice(1, 5).map((img, i) => (
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
              className="w-full text-lg h-14 bg-accent hover:bg-accent/90 text-accent-foreground"
              asChild
            >
              <a href={`tel:+222${car.contactNumber}`} className="dir-ltr flex items-center justify-center">
                 <Phone className="mr-3 h-6 w-6" />
                <span>{car.contactNumber}</span>
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full text-lg h-14 mt-3"
              asChild
            >
              <a href={`https://wa.me/222${car.contactNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                <MessageCircle className="ml-3 h-6 w-6" />
                تواصل عبر واتساب
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
