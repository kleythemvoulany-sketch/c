'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CarCard } from '@/components/car-card';
import { ProfileForm } from '@/components/profile-form';
import { Car, User as UserType } from '@/lib/data';
import { Loader, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCollection, useDoc } from '@/firebase';
import { collection, doc, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemoFirebase } from '@/firebase/provider';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  const { data: userProfile, isLoading: isProfileLoading } =
    useDoc<UserType>(userDocRef);

  const userListingsQuery = useMemoFirebase(
    () =>
      firestore && user
        ? collection(firestore, 'users', user.uid, 'listings')
        : null,
    [firestore, user]
  );
  const { data: userListings, isLoading: areListingsLoading } =
    useCollection<Car>(userListingsQuery);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || isProfileLoading || !user || !userProfile) {
    return (
      <div className="container py-12 md:py-20">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-right mb-10">
           <Skeleton className="h-24 w-24 rounded-full" />
           <div className='space-y-2'>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-64" />
           </div>
        </div>
         <Skeleton className="h-10 w-full max-w-md mx-auto mb-6" />
         <Card>
            <CardHeader>
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-5 w-52" />
            </CardHeader>
            <CardContent>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({length: 3}).map((_, i) => (
                        <Skeleton key={i} className="h-96 w-full" />
                    ))}
                 </div>
            </CardContent>
         </Card>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-20">
      <header className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-right mb-10">
        <Avatar className="h-24 w-24 border-4 border-primary shadow-lg">
          <AvatarImage src={userProfile.profilePictureUrl} alt={user.displayName || ''} />
          <AvatarFallback>
            <UserIcon className="h-12 w-12 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">
            مرحباً، {user.displayName}
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
              <CardTitle>
                إعلاناتي المنشورة ({areListingsLoading ? '...' : userListings?.length ?? 0})
              </CardTitle>
              <CardDescription>
                يمكنك تعديل أو حذف إعلاناتك من هنا.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {areListingsLoading ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({length: 3}).map((_, i) => (
                         <Skeleton key={i} className="h-96 w-full" />
                    ))}
                 </div>
              ) : userListings && userListings.length > 0 ? (
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
          <ProfileForm userProfile={userProfile} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
