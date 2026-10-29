// src/seed/seed.ts
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import { connectDB } from '../config/db';

import { User } from '../modules/user/user.model';
import { Pet } from '../modules/pet/pet.model';
import { Service } from '../modules/service/service.model';
import { Booking } from '../modules/booking/booking.model';
import { Review } from '../modules/review/review.model';
import { Blog } from '../modules/blog/blog.model';
import { Faq } from '../modules/faq/faq.model';
import { Contact } from '../modules/contact/contact.model';
import { ChatMessage } from '../modules/ai/chat.model';
import { Category } from '../modules/category/category.model';
import { Product } from '../modules/product/product.model';
import { Coupon } from '../modules/coupon/coupon.model';
import { DeliveryZone } from '../modules/delivery/delivery.model';
import { LostFound } from '../modules/lostFound/lostFound.model';
import { Adoption } from '../modules/adoption/adoption.model';
import { Area } from '../modules/area/area.model';
import { Emergency } from '../modules/emergency/emergency.model';
import { Bundle } from '../modules/bundle/bundle.model';

import {
  serviceSeed,
  blogSeed,
  faqSeed,
  contactSeed,
  dogBreeds,
  catBreeds,
} from './data';

// ─── helpers ──────────────────────────────────────────
const RANDOM = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pick = <T>(arr: readonly T[]): T => arr[RANDOM(0, arr.length - 1)];

const daysAgo = (d: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() - d);
  return dt;
};

const daysFromNow = (d: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + d);
  return dt;
};

const AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
];

const PET_IMAGES: Record<string, string[]> = {
  dog: [
    'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600',
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600',
    'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=600',
  ],
  cat: [
    'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600',
  ],
  bird: ['https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600'],
  rabbit: ['https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600'],
  other: ['https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=600'],
};

// Product images pool — each type has its own distinct set of photos
const PRODUCT_IMAGES: Record<string, string[]> = {
  food: [
    'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800',
    'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=800',
    'https://images.unsplash.com/photo-1585846888147-3fe14c130048?w=800',
    'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800',
    'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=800',
  ],
  treats: [
    'https://images.unsplash.com/photo-1565708097881-bb9f9e2d9c5e?w=800',
    'https://images.unsplash.com/photo-1599443015574-be5fe8a05783?w=800',
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800',
  ],
  litter: [
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800',
    'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800',
    'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=800',
  ],
  toy: [
    'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800',
    'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=800',
    'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=800',
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800',
  ],
  accessory: [
    'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800',
    'https://images.unsplash.com/photo-1606425271394-c3ca9aa1fc06?w=800',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800',
    'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=800',
  ],
};

// ─── wipe ─────────────────────────────────────────────
async function wipeCollections() {
  console.log('🧹 Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Pet.deleteMany({}),
    Service.deleteMany({}),
    Booking.deleteMany({}),
    Review.deleteMany({}),
    Blog.deleteMany({}),
    Faq.deleteMany({}),
    Contact.deleteMany({}),
    ChatMessage.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Coupon.deleteMany({}),
    DeliveryZone.deleteMany({}),
    LostFound.deleteMany({}),
    Adoption.deleteMany({}),
    Area.deleteMany({}),
    Emergency.deleteMany({}),
    Bundle.deleteMany({}),
  ]);
}

// ─── users ────────────────────────────────────────────
async function seedUsers() {
  console.log('👥 Seeding users...');
  const users: any[] = [];

  users.push(
    await User.create({
      name: 'Alex Morgan',
      email: 'admin@petcare.com',
      password: 'admin1234',
      role: 'admin',
      avatar: AVATARS[0],
      phone: '+1-555-0100',
      address: '100 Admin Blvd, Metropolis',
    })
  );

  const managerNames = ['Jamie Rivera', 'Pat Kelly', 'Riley Chen'];
  for (let i = 0; i < 3; i++) {
    users.push(
      await User.create({
        name: managerNames[i],
        email: `manager${i + 1}@petcare.com`,
        password: 'manager1234',
        role: 'manager',
        avatar: AVATARS[i + 1],
        phone: `+1-555-01${10 + i}`,
      })
    );
  }

  users.push(
    await User.create({
      name: 'Demo User',
      email: 'demo@petcare.com',
      password: 'demo1234',
      role: 'user',
      avatar: AVATARS[3],
      phone: '+1-555-0199',
    })
  );

  for (let i = 0; i < 45; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    users.push(
      await User.create({
        name: `${firstName} ${lastName}`,
        email: faker.internet
          .email({ firstName, lastName })
          .toLowerCase(),
        password: 'password123',
        role: 'user',
        avatar: AVATARS[i % AVATARS.length],
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
      })
    );
  }

  return users;
}

// ─── services ─────────────────────────────────────────
async function seedServices() {
  console.log('🛠️  Seeding services...');
  return Service.create(serviceSeed);
}

// ─── pets ─────────────────────────────────────────────
async function seedPets(users: any[]) {
  console.log('🐾 Seeding pets...');
  const regularUsers = users.filter((u) => u.role === 'user');
  const pets: any[] = [];

  for (const user of regularUsers) {
    const count = RANDOM(1, 3);
    for (let i = 0; i < count; i++) {
      const species = pick([
        'dog',
        'cat',
        'dog',
        'cat',
        'bird',
        'rabbit',
      ] as const);
      const breeds =
        species === 'dog'
          ? dogBreeds
          : species === 'cat'
          ? catBreeds
          : ['Mixed'];

      pets.push(
        await Pet.create({
          owner: user._id,
          name: faker.animal.dog(),
          species,
          breed: pick(breeds),
          age: RANDOM(1, 12),
          weight: RANDOM(2, 40),
          gender: pick(['male', 'female'] as const),
          image: pick(PET_IMAGES[species] || PET_IMAGES.other),
          notes: faker.helpers.maybe(
            () => 'Friendly, up to date on all vaccinations.',
            { probability: 0.4 }
          ),
        })
      );
    }
  }

  return pets;
}

// ─── bookings ─────────────────────────────────────────
async function seedBookings(
  users: any[],
  services: any[],
  pets: any[]
) {
  console.log('📅 Seeding bookings...');
  const regularUsers = users.filter((u) => u.role === 'user');
  const statuses = ['pending', 'confirmed', 'completed', 'cancelled'] as const;
  const slots = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'];
  const bookings: any[] = [];

  for (let i = 0; i < 100; i++) {
    const user = pick(regularUsers);
    const userPets = pets.filter(
      (p) => p.owner.toString() === user._id.toString()
    );
    if (userPets.length === 0) continue;

    const pet = pick(userPets);
    const service = pick(services);
    const status = pick(statuses);

    const offset = RANDOM(-30, 90);
    const date = offset < 0 ? daysFromNow(-offset) : daysAgo(offset);

    const booking = await Booking.create({
      user: user._id,
      service: service._id,
      pet: pet._id,
      date,
      timeSlot: pick(slots),
      status,
      totalPrice: service.price,
      notes: faker.helpers.maybe(() => faker.lorem.sentence(), {
        probability: 0.2,
      }),
      aiSuggested: faker.datatype.boolean({ probability: 0.15 }),
    });
    bookings.push(booking);
  }

  console.log('   → Backfilling booking timestamps...');
  for (const b of bookings) {
    const bDate: Date = b.date;
    const targetCreatedAt = b.status === 'completed' ? bDate : new Date();
    await Booking.collection.updateOne(
      { _id: b._id },
      { $set: { createdAt: targetCreatedAt } }
    );
  }

  return bookings;
}

// ─── reviews ──────────────────────────────────────────
async function seedReviews(_users: any[], services: any[], bookings: any[]) {
  console.log('⭐ Seeding reviews...');
  const comments = [
    'Excellent service! My dog came back looking and feeling great. Highly recommend.',
    'Very professional and caring staff. They clearly love animals.',
    'Great experience overall. Booking was easy and the service was prompt.',
    'My cat is usually nervous with strangers, but she was totally calm here. Impressive!',
    'Good service, though it took a bit longer than expected. Still happy with the result.',
    'Absolutely fantastic! The team went above and beyond. Will book again.',
    'The pet was well-cared for. Communication was clear throughout.',
    'Solid experience. Fair pricing and quality care. Recommended.',
    'My dog had the best time! The staff really knows what they are doing.',
    'Reliable and trustworthy. This is now our go-to service.',
    'Very satisfied with the attention to detail. Thanks team!',
    'Wonderful service. The photo updates during the session were a nice touch.',
  ];

  const used = new Set<string>();
  const reviewsToCreate: any[] = [];
  const regularUsers = _users.filter((u) => u.role === 'user');

  // Phase 1 — every service gets at least 2 reviews (guaranteed ratings)
  for (const service of services) {
    for (let i = 0; i < 2; i++) {
      const user = pick(regularUsers);
      const key = `${user._id}_${service._id}`;
      if (used.has(key)) continue;
      used.add(key);
      reviewsToCreate.push({
        user: user._id,
        service: service._id,
        rating: RANDOM(3, 5),
        comment: pick(comments),
      });
    }
  }

  // Phase 2 — fill up using completed bookings
  const completedBookings = bookings.filter((b) => b.status === 'completed');
  for (const booking of completedBookings) {
    if (reviewsToCreate.length >= 80) break;
    const key = `${booking.user}_${booking.service}`;
    if (used.has(key)) continue;
    used.add(key);
    reviewsToCreate.push({
      user: booking.user,
      service: booking.service,
      rating: RANDOM(3, 5),
      comment: pick(comments),
    });
  }

  // Phase 3 — extra fillers if still short of 80
  let attempts = 0;
  while (reviewsToCreate.length < 80 && attempts < 200) {
    attempts++;
    const user = pick(regularUsers);
    const service = pick(services);
    const key = `${user._id}_${service._id}`;
    if (used.has(key)) continue;
    used.add(key);
    reviewsToCreate.push({
      user: user._id,
      service: service._id,
      rating: RANDOM(3, 5),
      comment: pick(comments),
    });
  }

  await Review.insertMany(reviewsToCreate, { ordered: false }).catch((err) => {
    console.warn(
      `   ⚠ Some reviews skipped (duplicates): ${err.writeErrors?.length || 0}`
    );
  });
  console.log(`   → ${reviewsToCreate.length} reviews created`);

  // Recalculate every service's rating from actual reviews
  for (const service of services) {
    const stats = await Review.aggregate([
      { $match: { service: service._id } },
      {
        $group: {
          _id: '$service',
          avg: { $avg: '$rating' },
          count: { $sum: 1 },
        },
      },
    ]);
    const rating = stats[0] ? Number(stats[0].avg.toFixed(1)) : 0;
    const reviewCount = stats[0]?.count || 0;
    await Service.findByIdAndUpdate(service._id, { rating, reviewCount });
  }
  console.log('   → Service ratings recalculated');
}

// ─── blogs ────────────────────────────────────────────
async function seedBlogs(users: any[]) {
  console.log('📝 Seeding blogs...');
  const admins = users.filter(
    (u) => u.role === 'admin' || u.role === 'manager'
  );
  const author = admins[0];

  for (const post of blogSeed) {
    await Blog.create({
      ...post,
      slug: post.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      author: author._id,
      published: true,
    });
  }
}

// ─── faqs ─────────────────────────────────────────────
async function seedFaqs() {
  console.log('❓ Seeding FAQs...');
  for (let i = 0; i < faqSeed.length; i++) {
    await Faq.create({ ...faqSeed[i], order: i });
  }
}

// ─── contacts ─────────────────────────────────────────
async function seedContacts() {
  console.log('📬 Seeding contacts...');
  for (const c of contactSeed) {
    await Contact.create(c);
  }
}

// ─── ai chat history ──────────────────────────────────
async function seedChats(users: any[]) {
  console.log('💬 Seeding AI chat history...');
  const demo = users.find((u) => u.email === 'demo@petcare.com');
  const sessionId = 'demo-session-001';
  const conversation = [
    {
      role: 'user',
      content:
        'What grooming services do you offer for a Golden Retriever?',
    },
    {
      role: 'assistant',
      content:
        'We offer full grooming, bath & brush, de-shedding treatment, and puppy grooming. For a Golden Retriever, the De-shedding Treatment is very popular — it reduces shedding by up to 90%.',
    },
    {
      role: 'user',
      content: 'How much does the de-shedding treatment cost?',
    },
    {
      role: 'assistant',
      content:
        'The De-shedding Treatment is $55 and takes about 60 minutes. Would you like to book it?',
    },
    { role: 'user', content: 'Yes, book it for Saturday morning.' },
    {
      role: 'assistant',
      content:
        'Great choice! Head over to the Bookings page, select the De-shedding Treatment, and pick Saturday at 10:30 AM. Your demo pet Max will be pre-selected.',
    },
  ];

  for (const msg of conversation) {
    await ChatMessage.create({
      user: demo._id,
      sessionId,
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    });
  }
}

// ─── categories & products ────────────────────────────
async function seedCategoriesAndProducts() {
  console.log('📂 Seeding categories & products...');

  const categories = await Category.create([
    { name: 'Dog Food', order: 1 },
    { name: 'Cat Food', order: 2 },
    { name: 'Cat Litter', order: 3 },
    { name: 'Toys', order: 4 },
    { name: 'Accessories', order: 5 },
    { name: 'Health & Grooming', order: 6 },
  ]);

  const brands = [
    'SmartHeart',
    'Whiskas',
    'Pedigree',
    'Reflex Plus',
    'Bonacibo',
    'NEKKO',
    'Paws',
  ];
  const productTypes = [
    'food',
    'treats',
    'litter',
    'toy',
    'accessory',
  ] as const;

  for (let i = 0; i < 40; i++) {
    const cat = categories[i % categories.length];
    const type = productTypes[i % productTypes.length];

    const ageGroup =
      type === 'food'
        ? ['puppy', 'adult', 'senior']
        : type === 'litter'
        ? ['kitten', 'adult', 'senior']
        : ['all'];

    const size =
      type === 'accessory' || type === 'toy'
        ? ['small', 'medium', 'large']
        : ['all'];

    // Rotate through the type's image pool so each product looks unique
    const pool = PRODUCT_IMAGES[type] || PRODUCT_IMAGES.food;
    const img1 = pool[i % pool.length];
    const img2 = pool[(i + 1) % pool.length];

    await Product.create({
      name: `${pick(brands)} ${
        type === 'food' ? 'Premium' : 'Deluxe'
      } ${
        type === 'litter'
          ? 'Cat Litter'
          : type === 'food'
          ? 'Pet Food'
          : 'Product'
      } #${i + 1}`,
      brand: pick(brands),
      category: cat._id,
      type,
      species:
        type === 'litter'
          ? ['cat']
          : pick([['dog'], ['cat'], ['dog', 'cat']]),
      ageGroup,
      size,
      description:
        "High-quality, vet-recommended product designed for your pet's health and happiness. Imported and 100% authentic.",
      shortDescription:
        'Premium pet product. Fast delivery across Bangladesh.',
      images: [img1, img2],
      variants: [
        {
          name: '500g',
          sku: `SKU-${i}-A`,
          price: RANDOM(200, 500),
          stock: RANDOM(10, 100),
        },
        {
          name: '2kg',
          sku: `SKU-${i}-B`,
          price: RANDOM(800, 2000),
          stock: RANDOM(5, 50),
          comparePrice: 2500,
        },
      ],
      tags: [type, cat.slug, 'bestseller'],
      isFeatured: i < 8,
      sold: RANDOM(10, 500),
    });
  }

  console.log('   → 40 products created with unique images per type');
}

// ─── coupons ──────────────────────────────────────────
async function seedCoupons() {
  console.log('🎟️  Seeding coupons...');
  await Coupon.create([
    {
      code: 'WELCOME10',
      type: 'percent',
      value: 10,
      minOrderValue: 500,
      expiresAt: new Date('2027-01-01'),
      description: '10% off your first order',
    },
    {
      code: 'PETLOVE500',
      type: 'flat',
      value: 500,
      minOrderValue: 3000,
      expiresAt: new Date('2027-01-01'),
      usageLimit: 100,
    },
    {
      code: 'FLASH20',
      type: 'percent',
      value: 20,
      minOrderValue: 1000,
      maxDiscount: 800,
      expiresAt: new Date('2026-12-31'),
    },
  ]);
}

// ─── delivery zones ───────────────────────────────────
async function seedDeliveryZones() {
  console.log('🚚 Seeding delivery zones...');
  await DeliveryZone.create([
    {
      name: 'Dhaka City',
      cities: ['Dhaka'],
      shippingFee: 60,
      freeAbove: 1000,
      estimatedDays: 1,
    },
    {
      name: 'Dhaka Suburbs',
      cities: ['Gazipur', 'Narayanganj', 'Savar'],
      shippingFee: 100,
      freeAbove: 1500,
      estimatedDays: 2,
    },
    {
      name: 'Chittagong',
      cities: ['Chittagong', "Cox's Bazar"],
      shippingFee: 120,
      freeAbove: 2000,
      estimatedDays: 3,
    },
    {
      name: 'Nationwide',
      cities: ['Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur'],
      shippingFee: 150,
      freeAbove: 2500,
      estimatedDays: 4,
    },
  ]);
}

// ─── areas + emergency + bundles ──────────────────────
async function seedAreasAndExtras() {
  console.log('📍 Seeding areas...');

  const areas = [
    { name: 'Gulshan', city: 'Dhaka', deliveryFee: 60, avgRating: 4.8 },
    { name: 'Banani', city: 'Dhaka', deliveryFee: 60, avgRating: 4.7 },
    { name: 'Dhanmondi', city: 'Dhaka', deliveryFee: 60, avgRating: 4.9 },
    { name: 'Uttara', city: 'Dhaka', deliveryFee: 80, avgRating: 4.6 },
    { name: 'Mirpur', city: 'Dhaka', deliveryFee: 70, avgRating: 4.5 },
    {
      name: 'Mohammadpur',
      city: 'Dhaka',
      deliveryFee: 70,
      avgRating: 4.7,
    },
    { name: 'Bashundhara', city: 'Dhaka', deliveryFee: 80, avgRating: 4.6 },
    { name: 'Badda', city: 'Dhaka', deliveryFee: 70, avgRating: 4.4 },
  ];

  for (const a of areas) {
    await Area.create({
      ...a,
      description: `Premium pet care services in ${a.name}, Dhaka. Fast delivery and trusted providers.`,
      heroImage:
        'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1200',
      availableServices: [
        'grooming',
        'vet',
        'boarding',
        'training',
        'walking',
      ],
    });
  }

  console.log('🚨 Seeding emergency vets...');
  for (const a of areas.slice(0, 5)) {
    await Emergency.create({
      name: `${a.name} 24/7 Pet Emergency`,
      phone:
        '+880-1712-' + Math.floor(100000 + Math.random() * 900000),
      area: a.name,
      city: 'Dhaka',
      address: `${a.name}, Dhaka`,
      is24_7: true,
    });
  }

  console.log('🎁 Seeding bundles...');
  const products = await Product.find({ isActive: true }).limit(20);
  if (products.length >= 3) {
    await Bundle.create({
      name: 'Complete Cat Care Bundle',
      description: 'Everything your cat needs for a month',
      image:
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800',
      products: [
        {
          product: products[0]._id,
          variantSku: products[0].variants[0].sku,
          quantity: 1,
        },
        {
          product: products[1]._id,
          variantSku: products[1].variants[0].sku,
          quantity: 1,
        },
        {
          product: products[2]._id,
          variantSku: products[2].variants[0].sku,
          quantity: 1,
        },
      ],
      bundlePrice: 1500,
      comparePrice: 2000,
    });
  }
}

// ─── main ─────────────────────────────────────────────
async function seed() {
  try {
    await connectDB();
    await wipeCollections();

    const users = await seedUsers();
    const services = await seedServices();
    const pets = await seedPets(users);
    const bookings = await seedBookings(users, services, pets);
    await seedReviews(users, services, bookings);
    await seedBlogs(users);
    await seedFaqs();
    await seedContacts();
    await seedChats(users);

    await seedCategoriesAndProducts();
    await seedCoupons();
    await seedDeliveryZones();
    await seedAreasAndExtras();

    console.log('\n✅ Seed complete!\n');
    console.log('─'.repeat(50));
    console.log('🔑 Login credentials:');
    console.log('  Admin:   admin@petcare.com    / admin1234');
    console.log('  Manager: manager1@petcare.com / manager1234');
    console.log('  User:    demo@petcare.com     / demo1234');
    console.log('─'.repeat(50));
    console.log('📊 Data counts:');
    console.log(`  Users:      ${users.length}`);
    console.log(`  Services:   ${services.length}`);
    console.log(`  Pets:       ${pets.length}`);
    console.log(`  Bookings:   ${bookings.length}`);
    console.log(`  Blogs:      ${blogSeed.length}`);
    console.log(`  FAQs:       ${faqSeed.length}`);
    console.log(`  Contacts:   ${contactSeed.length}`);
    console.log(`  Categories: 6`);
    console.log(`  Products:   40`);
    console.log(`  Coupons:    3`);
    console.log(`  Zones:      4`);
    console.log(`  Areas:      8`);
    console.log(`  Emergency:  5`);
    console.log(`  Bundles:    1`);
    console.log('─'.repeat(50));

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();