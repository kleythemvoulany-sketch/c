import Image from "next/image";
import Link from "next/link";
import { Car as CarType } from "@/lib/data";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import {
  Fuel,
  Gauge,
  Gem,
  MapPin,
  Pencil,
  Phone,
  Trash2,
  Wrench,
} from "lucide-react";

type CarCardProps = {
  car: CarType;
  isOwnerView?: boolean;
};

export function CarCard({ car, isOwnerView = false }: CarCardProps) {
  return (
    <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full bg-card">
      <div className="flex-grow">
        <Link href={`/listings/${car.id}`} className="block">
          <CardHeader className="p-0">
            <div className="relative h-56 w-full">
              <Image
                src={car.image}
                alt={`${car.make} ${car.model}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={car.imageHint}
              />
              {car.featured && (
                <Badge
                  variant="default"
                  className="absolute top-3 right-3 bg-accent text-accent-foreground border-2 border-white/50"
                >
                  <Gem className="ml-1 h-3 w-3" />
                  مميزة
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            <h3 className="text-lg font-bold font-headline text-primary truncate">
              {car.make} {car.model} - {car.year}
            </h3>
            <p className="text-2xl font-bold text-accent">
              {new Intl.NumberFormat("ar-MR", { style: 'currency', currency: 'MRU', minimumFractionDigits: 0 }).format(car.price)}
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-primary/70" />
                <span>{new Intl.NumberFormat().format(car.mileage)} كم</span>
              </div>
              <div className="flex items-center gap-2">
                <Fuel className="w-4 h-4 text-primary/70" />
                <span>{car.fuelType}</span>
              </div>
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-primary/70" />
                <span>{car.transmission}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary/70" />
                <span>{car.location}</span>
              </div>
            </div>
          </CardContent>
        </Link>
      </div>
      <CardFooter className="p-2 bg-secondary mt-auto">
        {isOwnerView ? (
          <div className="w-full flex gap-2">
            <Button asChild variant="outline" className="w-full bg-background">
              {/* In a real app, this would link to an edit page e.g. /listings/edit/${car.id} */}
              <Link href="#">
                <Pencil className="ml-2 h-4 w-4" />
                تعديل
              </Link>
            </Button>
            <Button variant="destructive" className="w-full">
              <Trash2 className="ml-2 h-4 w-4" />
              حذف
            </Button>
          </div>
        ) : (
          <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href={`/listings/${car.id}`}>
              <Phone className="ml-2 h-4 w-4" />
              عرض التفاصيل والاتصال
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
