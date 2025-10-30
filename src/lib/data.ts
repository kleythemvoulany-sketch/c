import { LucideIcon, ShieldCheck, Palmtree, Castle, Leaf } from 'lucide-react';

export type Car = {
    id: number;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    fuelType: 'بنزين' | 'ديزل' | 'كهرباء';
    transmission: 'أوتوماتيكي' | 'يدوي';
    location: string;
    image: string;
    imageHint: string;
    description: string;
    featured?: boolean;
    color: string;
    contact: string;
};

export type Category = {
    name: string;
    icon: LucideIcon;
    image: string;
};

export const cars: Car[] = [
    {
        id: 1,
        make: 'هيونداي',
        model: 'سنتافي',
        year: 2017,
        price: 320000,
        mileage: 160000,
        fuelType: 'بنزين',
        transmission: 'أوتوماتيكي',
        location: 'نواكشوط',
        image: 'https://picsum.photos/seed/1/600/400',
        imageHint: 'white suv',
        description: 'سيارة نظيفة جدًا، بحالة ممتازة من الداخل والخارج، جاهزة للاستعمال، بدون أي أعطال. تمت الصيانة الكاملة مؤخرًا.',
        featured: true,
        color: 'أسود',
        contact: '34949470'
    },
    {
        id: 2,
        make: 'تويوتا',
        model: 'كامري',
        year: 2020,
        price: 450000,
        mileage: 80000,
        fuelType: 'بنزين',
        transmission: 'أوتوماتيكي',
        location: 'نواذيبو',
        image: 'https://picsum.photos/seed/2/600/400',
        imageHint: 'blue sedan',
        description: 'تويوتا كامري بحالة الوكالة، استخدام شخصي خفيف. أعلى فئة كاملة المواصفات.',
        featured: true,
        color: 'أزرق',
        contact: '31151507'
    },
    {
        id: 3,
        make: 'مرسيدس-بنز',
        model: 'الفئة C',
        year: 2019,
        price: 650000,
        mileage: 95000,
        fuelType: 'بنزين',
        transmission: 'أوتوماتيكي',
        location: 'نواكشوط',
        image: 'https://picsum.photos/seed/3/600/400',
        imageHint: 'silver luxury',
        description: 'مرسيدس الفئة C، فخامة وأداء. صيانة دورية في الشركة.',
        featured: true,
        color: 'فضي',
        contact: '34949470'
    },
    {
        id: 4,
        make: 'نيسان',
        model: 'باترول',
        year: 2022,
        price: 980000,
        mileage: 30000,
        fuelType: 'بنزين',
        transmission: 'أوتوماتيكي',
        location: 'نواكشوط',
        image: 'https://picsum.photos/seed/4/600/400',
        imageHint: 'black large suv',
        description: 'نيسان باترول بلاتينيوم، وحش الطريق بحالة شبه جديدة. للعائلات ومحبي القوة.',
        featured: true,
        color: 'أسود',
        contact: '31151507'
    },
    {
        id: 5,
        make: 'كيا',
        model: 'سبورتاج',
        year: 2018,
        price: 280000,
        mileage: 120000,
        fuelType: 'بنزين',
        transmission: 'أوتوماتيكي',
        location: 'أزويرات',
        image: 'https://picsum.photos/seed/5/600/400',
        imageHint: 'red crossover',
        description: 'كيا سبورتاج عائلية واقتصادية. نظيفة جداً ولا تشتكي من شيء.',
        featured: true,
        color: 'أحمر',
        contact: '34949470'
    },
    {
        id: 6,
        make: 'تويوتا',
        model: 'لاند كروزر',
        year: 2015,
        price: 700000,
        mileage: 210000,
        fuelType: 'ديزل',
        transmission: 'يدوي',
        location: 'نواكشوط',
        image: 'https://picsum.photos/seed/6/600/400',
        imageHint: 'desert offroad',
        description: 'لاند كروزر V8 ديزل، قير عادي. سيارة بر واعتمادية لا مثيل لها.',
        color: 'أبيض',
        contact: '31151507'
    },
    {
        id: 7,
        make: 'تسلا',
        model: 'موديل 3',
        year: 2023,
        price: 800000,
        mileage: 15000,
        fuelType: 'كهرباء',
        transmission: 'أوتوماتيكي',
        location: 'نواكشوط',
        image: 'https://picsum.photos/seed/7/600/400',
        imageHint: 'sleek electric car',
        description: 'تسلا موديل 3، مستقبل القيادة. بطارية طويلة المدى، شبه جديدة.',
        color: 'رمادي',
        contact: '34949470'
    },
    {
        id: 8,
        make: 'رينو',
        model: 'داستر',
        year: 2019,
        price: 230000,
        mileage: 90000,
        fuelType: 'بنزين',
        transmission: 'أوتوماتيكي',
        location: 'كيفه',
        image: 'https://picsum.photos/seed/8/600/400',
        imageHint: 'orange small suv',
        description: 'رينو داستر عملية واقتصادية جداً في استهلاك الوقود. مثالية للمدينة.',
        color: 'برتقالي',
        contact: '31151507'
    },
    {
        id: 9,
        make: 'فورد',
        model: 'F-150',
        year: 2018,
        price: 550000,
        mileage: 140000,
        fuelType: 'بنزين',
        transmission: 'أوتوماتيكي',
        location: 'نواكشوط',
        image: 'https://picsum.photos/seed/9/600/400',
        imageHint: 'powerful pickup truck',
        description: 'فورد F-150، قوة وصلابة. مناسبة للأعمال الشاقة والمغامرات.',
        color: 'أزرق',
        contact: '34949470'
    },
    {
        id: 10,
        make: 'هيونداي',
        model: 'أكسنت',
        year: 2021,
        price: 290000,
        mileage: 60000,
        fuelType: 'بنزين',
        transmission: 'أوتوماتيكي',
        location: 'نواذيبو',
        image: 'https://picsum.photos/seed/10/600/400',
        imageHint: 'compact white sedan',
        description: 'هيونداي أكسنت موديل حديث، سيارة اقتصادية وموثوقة جداً. حالة ممتازة.',
        color: 'أبيض',
        contact: '31151507'
    },
     {
        id: 11,
        make: 'تويوتا',
        model: 'هايلكس',
        year: 2016,
        price: 480000,
        mileage: 190000,
        fuelType: 'ديزل',
        transmission: 'يدوي',
        location: 'أطار',
        image: 'https://picsum.photos/seed/11/600/400',
        imageHint: 'white pickup desert',
        description: 'تويوتا هايلكس دبل كابينة، اعتمادية لا تضاهى. جاهزة للعمل والطرق الوعرة.',
        color: 'أبيض',
        contact: '34949470'
    }
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
