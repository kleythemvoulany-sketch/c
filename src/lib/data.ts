import { LucideIcon, ShieldCheck, Palmtree, Castle, Leaf } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

export type User = {
    id: string;
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
    registrationDate: string;
    preferredLanguage?: string;
    accountType: 'personal' | 'dealer';
    dealerName?: string;
}

export type Car = {
    id: string;
    userId: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    fuelType: 'بنزين' | 'ديزل' | 'كهرباء' | 'هجين';
    transmissionType: 'أوتوماتيكي' | 'يدوي';
    city: string;
    images: string[];
    imageHint?: string;
    description: string;
    isFeatured?: boolean;
    color: string;
    contactNumber: string;
    postDate: Timestamp | Date | string;
    viewCount?: number;
};

export type Category = {
    name: string;
    icon: LucideIcon;
    image: string;
};

// This mock data is for reference and will be replaced by Firestore data.
// A minor change to trigger a backend rule update.
export const cars: Car[] = [
    {
        id: '1',
        userId: 'mock-user-1',
        brand: 'هيونداي',
        model: 'سنتافي',
        year: 2017,
        price: 320000,
        mileage: 160000,
        fuelType: 'بنزين',
        transmissionType: 'أوتوماتيكي',
        city: 'نواكشوط',
        images: ['https://picsum.photos/seed/1/600/400'],
        imageHint: 'white suv',
        description: 'سيارة نظيفة جدًا، بحالة ممتازة من الداخل والخارج، جاهزة للاستعمال، بدون أي أعطال. تمت الصيانة الكاملة مؤخرًا.',
        isFeatured: true,
        color: 'أسود',
        contactNumber: '34949470',
        postDate: new Date().toISOString(),
    },
];

export const categories: Category[] = [
    { name: 'بورصة النخيل', icon: Palmtree, image: 'https://picsum.photos/seed/c1/300/300' },
    { name: 'بورصة الأندلس', icon: Castle, image: 'https://picsum.photos/seed/c2/300/300' },
    { name: 'بورصة الأمانة', icon: ShieldCheck, image: 'https://picsum.photos/seed/c3/300/300' },
    { name: 'بورصة الواحة', icon: Leaf, image: 'https://picsum.photos/seed/c4/300/300' },
];

export const testimonials = [
    {
        name: 'محمد سالم',
        location: 'نواكشوط',
        comment: 'تجربة رائعة! بعت سيارتي في أقل من أسبوع عبر البورصة. منصة سهلة وموثوقة.',
        rating: 5,
        avatar: 'https://picsum.photos/seed/t1/100/100'
    },
    {
        name: 'فاطمة بنت أحمد',
        location: 'نواذيبو',
        comment: 'وجدت سيارة أحلامي بسعر ممتاز. الفلاتر المتقدمة ساعدتني كثيرًا في البحث.',
        rating: 5,
        avatar: 'https://picsum.photos/seed/t2/100/100'
    },
    {
        name: 'Alioune Diallo',
        location: 'نواكشوط',
        comment: 'The best platform for cars in Mauritania. Very professional and easy to use. Highly recommended!',
        rating: 4,
        avatar: 'https://picsum.photos/seed/t3/100/100'
    }
];
