import Image from "next/image";
import Link from "next/link";
import { Car as CarType } from "@/lib/data";
import { Badge } from "./ui/badge";
import {
  Calendar,
  Fuel,
  Gauge,
  Gem,
  MapPin,
  Phone,
  Wrench,
} from "lucide-react";

type CarListItemProps = {
  car: CarType;
};

export function CarListItem({ car }: CarListItemProps) {
  return (
    <div className="bg-card border rounded-lg overflow-hidden flex flex-col sm:flex-row transition-all hover:shadow-lg hover:border-accent/50">
      <Link href={`/listings/${car.id}`} className="block relative sm:w-1/4">
        <div className="relative h-48 sm:h-full w-full">
          <Image
            src={car.image}
            alt={`${car.make} ${car.model}`}
            fill
            className="object-cover"
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
      </Link>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/listings/${car.id}`} className="block">
            <h3 className="text-lg font-bold text-primary truncate">
              {car.make} {car.model}
            </h3>
            <p className="text-2xl font-bold text-accent mt-1 mb-3">
              {new Intl.NumberFormat("ar-MR", { style: 'currency', currency: 'MRU', minimumFractionDigits: 0 }).format(car.price)}
            </p>
          </Link>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary/70" />
              <span>{car.year}</span>
            </div>
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
          </div>
        </div>
        <div className="flex justify-between items-center mt-auto pt-2 border-t sm:border-0 sm:pt-0">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary/70" />
            <span>{car.location}</span>
          </div>
          <Link href={`/listings/${car.id}`} className="text-sm font-semibold text-accent hover:underline">
             عرض التفاصيل
          </Link>
        </div>
      </div>
    </div>
  );
}
