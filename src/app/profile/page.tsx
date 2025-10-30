import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CarCard } from "@/components/car-card";
import { ProfileForm } from "@/components/profile-form";
import { cars } from "@/lib/data";
import { User as UserIcon } from "lucide-react";
import Link from "next/link";

// Mock user data for demonstration
const user = {
  name: "محمد سالم",
  email: "mohamed.salem@example.com",
  phone: "34949470",
  avatar: "https://picsum.photos/seed/t1/100/100",
};

// Mock user listings, filtering cars to simulate those posted by the user
const userListings = cars.filter((c) => [1, 3, 5, 8].includes(c.id));

export default function ProfilePage() {
  return (
    <div className="container py-12 md:py-20">
      <header className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-right mb-10">
        <Avatar className="h-24 w-24 border-4 border-primary shadow-lg">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>
            <UserIcon className="h-12 w-12 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">
            مرحباً، {user.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            هنا يمكنك إدارة حسابك وإعلاناتك بكل سهولة.
          </p>
        </div>
      </header>

      <Tabs defaultValue="listings" className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-2 mx-auto max-w-md bg-muted p-1">
          <TabsTrigger value="listings">إعلاناتي</TabsTrigger>
          <TabsTrigger value="profile">ملفي الشخصي</TabsTrigger>
        </TabsList>
        <TabsContent value="listings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>إعلاناتي المنشورة ({userListings.length})</CardTitle>
              <CardDescription>
                يمكنك تعديل أو حذف إعلاناتك من هنا.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userListings.map((car) => (
                    <CarCard key={car.id} car={car} isOwnerView={true} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 py-16 text-center text-muted-foreground">
                  <p className="text-lg">ليس لديك أي إعلانات منشورة حاليًا.</p>
                  <Button asChild>
                    <Link href="/listings/new">أضف إعلان جديد</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="profile" className="mt-6">
          <ProfileForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
