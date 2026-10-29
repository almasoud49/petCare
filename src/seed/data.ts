// src/seed/data.ts
export const serviceSeed = [
  {
    title: 'Full Grooming & Styling',
    category: 'grooming' as const,
    description:
      'Complete grooming session including bath, blow-dry, nail trim, ear cleaning, and a stylish breed-specific haircut. Perfect for keeping your pet fresh and healthy.',
    price: 65,
    durationMinutes: 90,
    location: 'Downtown Pet Studio',
    image: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1200',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1200',
    ],
    tags: ['bath', 'haircut', 'nails'],
  },
  {
    title: 'Bath & Brush Express',
    category: 'grooming' as const,
    description:
      'Quick 45-minute bath and brush service. Ideal for routine upkeep between full grooming sessions.',
    price: 35,
    durationMinutes: 45,
    location: 'Downtown Pet Studio',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200',
    gallery: ['https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=1200'],
    tags: ['bath', 'brush'],
  },
  {
    title: 'De-shedding Treatment',
    category: 'grooming' as const,
    description:
      'Specialized treatment to reduce shedding by up to 90%. Includes deep conditioning and coat health check.',
    price: 55,
    durationMinutes: 60,
    location: 'Downtown Pet Studio',
    image: 'https://images.unsplash.com/photo-1581888227599-779811939961?w=1200',
    gallery: [],
    tags: ['shedding', 'coat'],
  },
  {
    title: 'Puppy First Grooming',
    category: 'grooming' as const,
    description:
      'Gentle introduction to grooming for puppies under 6 months. Focuses on comfort and positive associations.',
    price: 45,
    durationMinutes: 60,
    location: 'Downtown Pet Studio',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=1200',
    gallery: [],
    tags: ['puppy', 'beginner'],
  },
  {
    title: 'General Wellness Exam',
    category: 'vet' as const,
    description:
      'Comprehensive check-up covering physical examination, weight, dental health, and vaccination status review.',
    price: 80,
    durationMinutes: 30,
    location: 'City Vet Clinic',
    image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=1200',
    gallery: ['https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=1200'],
    tags: ['checkup', 'wellness'],
  },
  {
    title: 'Vaccination Package',
    category: 'vet' as const,
    description:
      'Core vaccinations including rabies, DHPP, and bordetella. Includes post-vaccination monitoring.',
    price: 120,
    durationMinutes: 45,
    location: 'City Vet Clinic',
    image: 'https://images.unsplash.com/photo-1599443015574-be5fe8a05783?w=1200',
    gallery: [],
    tags: ['vaccines', 'prevention'],
  },
  {
    title: 'Dental Cleaning',
    category: 'vet' as const,
    description:
      'Professional dental scaling and polishing under anesthesia. Includes pre-op blood work and monitoring.',
    price: 250,
    durationMinutes: 120,
    location: 'City Vet Clinic',
    image: 'https://images.unsplash.com/photo-1606425271394-c3ca9aa1fc06?w=1200',
    gallery: [],
    tags: ['dental', 'teeth'],
  },
  {
    title: 'Emergency Consultation',
    category: 'vet' as const,
    description:
      '24/7 emergency vet consultation for urgent health concerns. Walk-in or scheduled.',
    price: 150,
    durationMinutes: 30,
    location: 'City Vet Clinic',
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=1200',
    gallery: [],
    tags: ['emergency', 'urgent'],
  },
  {
    title: 'Overnight Boarding',
    category: 'boarding' as const,
    description:
      'Comfortable overnight stay with 24/7 supervision, feeding, exercise, and daily photo updates to you.',
    price: 45,
    durationMinutes: 1440,
    location: 'Happy Paws Resort',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=1200',
      'https://images.unsplash.com/photo-1558929996-da64ba858215?w=1200',
    ],
    tags: ['overnight', 'supervision'],
  },
  {
    title: 'Luxury Suite Boarding',
    category: 'boarding' as const,
    description:
      'Spacious private suite with webcam access, premium bedding, one-on-one playtime, and gourmet meals.',
    price: 95,
    durationMinutes: 1440,
    location: 'Happy Paws Resort',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1200',
    gallery: [],
    tags: ['luxury', 'suite', 'webcam'],
  },
  {
    title: 'Daycare (Full Day)',
    category: 'boarding' as const,
    description:
      'Full-day supervised play and rest. Perfect for busy workdays. Includes 2 meals and 3 play sessions.',
    price: 30,
    durationMinutes: 480,
    location: 'Happy Paws Resort',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200',
    gallery: [],
    tags: ['daycare', 'playtime'],
  },
  {
    title: 'Weekend Boarding',
    category: 'boarding' as const,
    description:
      'Two-night weekend stay with group activities, socialization, and personalized care plans.',
    price: 80,
    durationMinutes: 2880,
    location: 'Happy Paws Resort',
    image: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=1200',
    gallery: [],
    tags: ['weekend', 'socialization'],
  },
  {
    title: 'Basic Obedience Training',
    category: 'training' as const,
    description:
      'Six-week course covering sit, stay, come, heel, and proper socialization. Great for dogs 4+ months.',
    price: 180,
    durationMinutes: 60,
    location: 'K9 Academy',
    image: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=1200',
    gallery: ['https://images.unsplash.com/photo-1591769225440-811ad7d6eab3?w=1200'],
    tags: ['obedience', 'beginner'],
  },
  {
    title: 'Advanced Obedience',
    category: 'training' as const,
    description:
      'Advanced commands, off-leash reliability, and distraction training. Prerequisite: Basic Obedience.',
    price: 220,
    durationMinutes: 60,
    location: 'K9 Academy',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200',
    gallery: [],
    tags: ['advanced', 'off-leash'],
  },
  {
    title: 'Behavioral Correction',
    category: 'training' as const,
    description:
      'Personalized sessions addressing aggression, anxiety, excessive barking, or destructive behavior.',
    price: 250,
    durationMinutes: 90,
    location: 'K9 Academy',
    image: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=1200',
    gallery: [],
    tags: ['behavior', 'correction'],
  },
  {
    title: 'Puppy Socialization Class',
    category: 'training' as const,
    description:
      'Group class for puppies 8-16 weeks to build confidence and prevent future behavioral issues.',
    price: 120,
    durationMinutes: 45,
    location: 'K9 Academy',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=1200',
    gallery: [],
    tags: ['puppy', 'social'],
  },
  {
    title: '30-Minute Dog Walk',
    category: 'walking' as const,
    description:
      'Single 30-minute walk with GPS tracking, photo updates, and detailed walk report.',
    price: 25,
    durationMinutes: 30,
    location: 'Anywhere in City',
    image: 'https://images.unsplash.com/photo-1558929996-da64ba858215?w=1200',
    gallery: [],
    tags: ['walk', 'exercise'],
  },
  {
    title: '1-Hour Adventure Walk',
    category: 'walking' as const,
    description:
      'Extended walk through parks and trails. Perfect for high-energy dogs who need more exercise.',
    price: 40,
    durationMinutes: 60,
    location: 'Anywhere in City',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200',
    gallery: [],
    tags: ['adventure', 'trails'],
  },
  {
    title: 'Weekly Walk Package',
    category: 'walking' as const,
    description:
      'Five 30-minute walks spread across the week. Includes consistent walker and daily reports.',
    price: 100,
    durationMinutes: 30,
    location: 'Anywhere in City',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1200',
    gallery: [],
    tags: ['package', 'weekly'],
  },
  {
    title: 'Puppy Potty Training Walk',
    category: 'walking' as const,
    description:
      'Short, frequent walks designed to reinforce potty training and build good walking habits.',
    price: 20,
    durationMinutes: 20,
    location: 'Anywhere in City',
    image: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=1200',
    gallery: [],
    tags: ['puppy', 'potty'],
  },
];

export const blogSeed = [
  {
    title: '10 Essential Grooming Tips Every Pet Owner Should Know',
    excerpt:
      'From brushing frequency to the right shampoo — discover the grooming habits that keep your pet healthy and happy.',
    content:
      'Grooming is more than just keeping your pet looking good. Regular grooming prevents matting, reduces shedding, and helps you spot health issues early. Start with a consistent brushing routine — short-haired pets need brushing once a week, while long-haired breeds require daily attention. Bathing should happen every 4-6 weeks with pet-safe shampoo. Don\'t forget nail trims every 3-4 weeks and ear checks weekly. Professional grooming every 6-8 weeks complements your at-home care and keeps your pet comfortable year-round.',
    image: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=1200',
    tags: ['grooming', 'tips', 'care'],
  },
  {
    title: 'When Should You Take Your Pet to the Vet?',
    excerpt:
      'Learn the warning signs that mean it is time for a vet visit — and when it is an emergency.',
    content:
      'Knowing when to visit the vet can be the difference between a minor issue and a serious condition. Book a routine visit if you notice changes in appetite, weight, or behavior lasting more than 48 hours. Seek urgent care for difficulty breathing, persistent vomiting, blood in stool, or sudden collapse. Annual wellness exams are essential even for healthy pets — they help catch issues like dental disease or early kidney problems before symptoms appear.',
    image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=1200',
    tags: ['health', 'vet', 'emergency'],
  },
  {
    title: 'Boarding vs Daycare: Which Is Right for Your Pet?',
    excerpt:
      'Understand the differences between overnight boarding and daycare to choose the best fit.',
    content:
      'Daycare is ideal for social pets who thrive on interaction and need exercise while you are at work. Boarding suits pets who need a safe, supervised place to stay during travel. Both options should include structured play, rest periods, and experienced staff. Consider your pet\'s temperament, energy level, and comfort with new environments. Many facilities offer trial days — always do a trial before a long stay.',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1200',
    tags: ['boarding', 'daycare', 'travel'],
  },
  {
    title: 'Positive Reinforcement: The Science of Training',
    excerpt:
      'Why modern trainers rely on rewards instead of punishment — and how it produces faster results.',
    content:
      'Positive reinforcement training works because it leverages how animals naturally learn. Rewarding desired behaviors increases the likelihood they will repeat. Unlike punishment-based methods, positive training builds trust and reduces anxiety. Start with high-value treats, keep sessions short (5-10 minutes), and always end on a success. Consistency across all family members is key to lasting results.',
    image: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=1200',
    tags: ['training', 'science', 'behavior'],
  },
  {
    title: 'How Much Exercise Does Your Dog Really Need?',
    excerpt:
      'A breed-by-breed breakdown of daily exercise requirements.',
    content:
      'Exercise needs vary dramatically by breed, age, and health. High-energy working breeds like Border Collies need 90+ minutes daily, while brachycephalic breeds like Bulldogs may do best with 30-40 minutes of low-impact activity. Puppies need shorter, more frequent sessions. Senior dogs benefit from gentle walks. Mental exercise — puzzle toys, training — tires dogs as effectively as physical activity, so aim for a balance of both.',
    image: 'https://images.unsplash.com/photo-1558929996-da64ba858215?w=1200',
    tags: ['exercise', 'health', 'breeds'],
  },
  {
    title: 'Understanding Your Cat\'s Body Language',
    excerpt:
      'Decode tail movements, ear positions, and vocalizations to better understand your feline friend.',
    content:
      'Cats communicate constantly through subtle signals. A slow blink expresses trust and affection — try blinking back. A puffed tail indicates fear; an upright, curved tail signals confidence. Ears flat back mean irritation or fear. Purring usually indicates contentment but can also signal pain. Paying attention to these cues deepens your bond and helps you respond to your cat\'s emotional needs.',
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=1200',
    tags: ['cats', 'behavior', 'communication'],
  },
  {
    title: 'First-Time Pet Owner? Start Here.',
    excerpt:
      'A practical checklist for bringing a new pet home.',
    content:
      'Bringing home a pet is exciting, but preparation makes all the difference. Before arrival, gather essentials: food, water bowls, a bed, crate, leash, collar with ID tag, litter box (for cats), and basic first-aid supplies. Pet-proof your home: secure loose wires, hide toxic plants, and lock cleaning supplies. Schedule a vet visit within the first week. Give your new pet a quiet space to adjust for the first few days — patience is essential.',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1200',
    tags: ['new pet', 'checklist', 'guide'],
  },
  {
    title: 'The Complete Guide to Pet Nutrition',
    excerpt:
      'How to choose the right food, portion sizes, and feeding schedule for your pet.',
    content:
      'Good nutrition supports every aspect of your pet\'s health. Choose foods that meet AAFCO guidelines and prioritize protein as the first ingredient. Puppies need puppy-specific formulas; adults thrive on maintenance diets; seniors benefit from lower-calorie, joint-supportive options. Portion by weight and activity level — follow the bag as a starting point and adjust based on body condition. Avoid human foods toxic to pets, including chocolate, grapes, onions, and xylitol.',
    image: 'https://images.unsplash.com/photo-1581888227599-779811939961?w=1200',
    tags: ['nutrition', 'food', 'diet'],
  },
  {
    title: 'Dental Care for Pets: Why It Matters More Than You Think',
    excerpt:
      'Dental disease affects 80% of dogs and cats over 3 — here is how to prevent it.',
    content:
      'Dental disease silently affects most adult pets, leading to pain, tooth loss, and even heart and kidney issues. Brush your pet\'s teeth daily or at least 3x per week with pet-safe toothpaste (never human toothpaste — it contains xylitol). Offer dental chews and toys. Schedule professional cleanings every 1-2 years under veterinary supervision. Watch for signs of trouble: bad breath, drooling, pawing at the mouth, or refusal to eat hard food.',
    image: 'https://images.unsplash.com/photo-1606425271394-c3ca9aa1fc06?w=1200',
    tags: ['dental', 'health', 'prevention'],
  },
  {
    title: 'Traveling With Pets: A Complete Preparation Guide',
    excerpt:
      'Everything you need to know about safe and stress-free travel with your pets.',
    content:
      'Travel with pets requires planning. For car trips, secure pets in a crash-tested crate or harness, take breaks every 2-3 hours, and never leave pets in parked cars. For flights, check airline-specific carrier requirements — most airlines accept pets in-cabin under 20 lbs. Obtain a health certificate within 10 days of travel. Consider pet-friendly hotels or boarding if your pet is anxious. Bring familiar items — their bed, toys, and food — to reduce stress.',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200',
    tags: ['travel', 'safety', 'guide'],
  },
];

export const faqSeed = [
  {
    question: 'How do I book a service?',
    answer:
      'Log in to your account, browse our services page, select the service you need, choose your pet, pick a date and time, then confirm. You will receive a confirmation email instantly.',
    category: 'booking',
  },
  {
    question: 'Can I cancel or reschedule a booking?',
    answer:
      'Yes — bookings can be cancelled or rescheduled up to 24 hours before the scheduled time with no penalty. Later cancellations may incur a 20% fee.',
    category: 'booking',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards, debit cards, PayPal, Apple Pay, and Google Pay. Payment is processed at the time of booking.',
    category: 'payment',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'Full refunds are available for cancellations made 24+ hours in advance. Partial refunds (80%) apply to later cancellations. No-shows are non-refundable.',
    category: 'payment',
  },
  {
    question: 'Are your service providers certified?',
    answer:
      'Yes. All vets are licensed DVMs, groomers are IPG-certified, and trainers hold CPDT-KA or equivalent certifications. Every provider is background-checked.',
    category: 'services',
  },
  {
    question: 'What happens in an emergency?',
    answer:
      'Our partner clinics offer 24/7 emergency care. Book our Emergency Consultation service for immediate triage, or call 911 for pets if you cannot reach us.',
    category: 'emergency',
  },
  {
    question: 'Do you serve my area?',
    answer:
      'We currently serve the entire metro area within a 25-mile radius of downtown. Enter your zip code at checkout to confirm availability.',
    category: 'services',
  },
  {
    question: 'Can I book for multiple pets?',
    answer:
      'Yes — add all your pets to your profile and book each one separately. Multi-pet discounts of 10% apply automatically for bookings on the same day.',
    category: 'booking',
  },
  {
    question: 'How do I add a pet to my account?',
    answer:
      'Go to Dashboard → My Pets → Add Pet. Fill in name, species, breed, age, and upload a photo. You can add unlimited pets.',
    category: 'account',
  },
  {
    question: 'Is my payment information secure?',
    answer:
      'Absolutely. We use PCI-DSS compliant payment processing with end-to-end encryption. We never store raw card numbers on our servers.',
    category: 'payment',
  },
  {
    question: 'Do you offer pet insurance?',
    answer:
      'We partner with leading pet insurance providers. Ask our support team for a referral code to get 15% off your first year.',
    category: 'services',
  },
  {
    question: 'Can I request a specific groomer or trainer?',
    answer:
      'Yes — during booking, select your preferred provider from the dropdown. Availability is shown in real-time based on their calendar.',
    category: 'booking',
  },
  {
    question: 'What if my pet has special needs?',
    answer:
      'Note any medical conditions, allergies, or behavioral needs in your pet\'s profile. Our providers review these before every appointment to ensure proper care.',
    category: 'services',
  },
  {
    question: 'How do I contact support?',
    answer:
      'Email support@petcare.com, use the contact form on our website, or call (555) 123-4567. We respond within 24 hours on business days.',
    category: 'account',
  },
  {
    question: 'Can I delete my account?',
    answer:
      'Yes. Go to Account Settings → Delete Account. Note that this permanently removes your data, and any active bookings will be cancelled with a full refund.',
    category: 'account',
  },
];

export const contactSeed = [
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    subject: 'Question about grooming appointment',
    message:
      'Hi, I have a 3-year-old Golden Retriever who gets very anxious during grooming. Do you offer any calming options or one-on-one sessions?',
    status: 'replied' as const,
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    subject: 'Boarding availability',
    message:
      'We need boarding for 2 cats for 10 days next month. Do you offer multi-cat discounts, and what does daily care include?',
    status: 'read' as const,
  },
  {
    name: 'Emma Williams',
    email: 'emma.williams@example.com',
    subject: 'Puppy training schedule',
    message:
      'I just adopted an 8-week-old Labrador puppy. When should we start training classes, and how many sessions do you recommend?',
    status: 'new' as const,
  },
  {
    name: 'David Rodriguez',
    email: 'david.rodriguez@example.com',
    subject: 'Emergency vet — feedback',
    message:
      'I want to thank your team for the incredible emergency care last Tuesday night. My dog Max is doing well now. Outstanding service.',
    status: 'replied' as const,
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    subject: 'Billing question',
    message:
      'I was charged twice for my grooming appointment last week. Could you check and issue a refund for one of the charges?',
    status: 'read' as const,
  },
  {
    name: 'James Thompson',
    email: 'james.thompson@example.com',
    subject: 'Service area',
    message:
      'Do you cover the Riverside area? Your website shows a 25-mile radius, and I am about 20 miles from downtown.',
    status: 'new' as const,
  },
  {
    name: 'Olivia Martinez',
    email: 'olivia.martinez@example.com',
    subject: 'Senior dog care',
    message:
      'My 12-year-old Beagle has arthritis. Do you offer gentle grooming and low-impact walking services for senior dogs?',
    status: 'new' as const,
  },
  {
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@example.com',
    subject: 'Group booking',
    message:
      'I run a dog rescue and would like to book grooming for 8 dogs. Do you offer rescue organization discounts?',
    status: 'read' as const,
  },
  {
    name: 'Laura Kim',
    email: 'laura.kim@example.com',
    subject: 'Trainer recommendation',
    message:
      'Looking for a trainer experienced with reactive dogs. Who would you recommend on your team?',
    status: 'replied' as const,
  },
  {
    name: 'Robert Brown',
    email: 'robert.brown@example.com',
    subject: 'Weekend availability',
    message:
      'Do you have weekend availability for boarding drop-offs? I usually work weekdays and can only drop off Saturday mornings.',
    status: 'new' as const,
  },
];

export const serviceCategories = ['grooming', 'vet', 'boarding', 'training', 'walking'] as const;
export const petSpecies = ['dog', 'cat', 'bird', 'rabbit', 'other'] as const;

export const dogBreeds = [
  'Labrador Retriever', 'Golden Retriever', 'German Shepherd', 'Bulldog',
  'Poodle', 'Beagle', 'Rottweiler', 'Yorkshire Terrier', 'Dachshund',
  'Siberian Husky', 'Border Collie', 'Shih Tzu', 'Chihuahua', 'Pomeranian',
];

export const catBreeds = [
  'Persian', 'Siamese', 'Maine Coon', 'Bengal', 'Ragdoll',
  'British Shorthair', 'Abyssinian', 'Scottish Fold', 'Sphynx', 'Russian Blue',
];

