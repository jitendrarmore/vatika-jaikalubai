import type { Plant } from './firebase/plants';

export const mockPlants: Plant[] = [
  {
    id: 'peepal',
    name: 'Peepal Tree',
    marathiName: 'पिंपळ',
    image: '/plants/peepal.jpg',
    benefits: ['Sacred & spiritual', 'Oxygen 24/7', 'Medicinal leaves', 'Long-lived (500+ yrs)'],
    description:
      'The Peepal tree is one of the most sacred trees in Indian culture, worshipped for centuries. It releases oxygen even at night and has deep roots in Ayurvedic medicine.',
    growthTimeline: 'Full grown in 3–5 years',
    cost: 500,
    category: 'Sacred',
  },
  {
    id: 'neem',
    name: 'Neem Tree',
    marathiName: 'कडुलिंब',
    image: '/plants/neem.jpg',
    benefits: ['Purifies air', 'Antibacterial', 'Pest repellent', 'Medicinal bark & leaves'],
    description:
      'Known as the "village pharmacy", every part of the neem tree has medicinal value. It grows quickly and thrives in dry conditions.',
    growthTimeline: 'Fast growing — 3 years to full shade',
    cost: 300,
    category: 'Medicinal',
  },
  {
    id: 'mango',
    name: 'Mango Tree',
    marathiName: 'आंबा',
    image: '/plants/mango.jpg',
    benefits: ['Delicious fruit', 'Dense shade', 'Cultural significance', 'Economic value'],
    description:
      'The king of fruits! A mango tree is a generous gift — it bears fruit for up to 300 years and provides thick, cooling shade.',
    growthTimeline: 'Fruits in 3–5 years',
    cost: 700,
    category: 'Fruit',
  },
  {
    id: 'banyan',
    name: 'Banyan Tree',
    marathiName: 'वड',
    image: '/plants/banyan.jpg',
    benefits: ['Symbol of longevity', 'Carbon absorption', 'Aerial roots habitat', 'Sacred'],
    description:
      'The mighty Banyan is India\'s national tree, symbolizing immortality. Its aerial roots create an entire ecosystem and it can live for thousands of years.',
    growthTimeline: 'Majestic canopy in 5–8 years',
    cost: 600,
    category: 'Sacred',
  },
  {
    id: 'amla',
    name: 'Amla (Indian Gooseberry)',
    marathiName: 'आवळा',
    image: '/plants/amla.jpg',
    benefits: ['Superfood rich in Vit-C', 'Immune booster', 'Ayurvedic medicine', 'Fruits annually'],
    description:
      'Amla is a superfood — one of the richest natural sources of Vitamin C. Sacred in Ayurveda and deeply tied to Indian traditions like Amla Navami.',
    growthTimeline: 'Fruits from year 2 onwards',
    cost: 400,
    category: 'Fruit',
  },
  {
    id: 'tulsi',
    name: 'Tulsi (Holy Basil)',
    marathiName: 'तुळस',
    image: '/plants/tulsi.jpg',
    benefits: ['Sacred in every home', 'Stress reliever', 'Air purifier', 'Immunity booster'],
    description:
      'Tulsi is the holiest plant in Hindu tradition, found in almost every home. Its fragrance purifies the surroundings and it has powerful medicinal properties.',
    growthTimeline: 'Ready in 2–3 months',
    cost: 150,
    category: 'Sacred',
  },
];

export const mockTestimonials = [
  {
    id: 1,
    name: 'Priya Deshmukh',
    location: 'Pune, Maharashtra',
    text: 'I planted a Peepal tree for my daughter\'s birthday. Watching it grow has become a beautiful family ritual. Aai Kalubai cha ashirwaad!',
    avatar: '/avatars/priya.jpg',
    treeType: 'Peepal Tree',
  },
  {
    id: 2,
    name: 'Ramesh Patil',
    location: 'Nashik, Maharashtra',
    text: 'In memory of my mother, I donated a Neem tree. This platform made it so easy and meaningful. Truly a divine initiative.',
    avatar: '/avatars/ramesh.jpg',
    treeType: 'Neem Tree',
  },
  {
    id: 3,
    name: 'Sunita More',
    location: 'Kolhapur, Maharashtra',
    text: 'We planted a Mango tree for our 25th anniversary. The tracking photos every week make us feel connected to nature.',
    avatar: '/avatars/sunita.jpg',
    treeType: 'Mango Tree',
  },
  {
    id: 4,
    name: 'Anil Jadhav',
    location: 'Aurangabad, Maharashtra',
    text: 'The certificate of donation is so beautiful. I framed it and hung it in my living room. An amazing initiative for our environment.',
    avatar: '/avatars/anil.jpg',
    treeType: 'Banyan Tree',
  },
];

export const impactStats = [
  { label: 'Trees Planted', value: 12847, suffix: '+' },
  { label: 'Families Joined', value: 4320, suffix: '+' },
  { label: 'Villages Covered', value: 187, suffix: '' },
  { label: 'Tonnes of CO₂ Offset', value: 642, suffix: 'T' },
];

export const occasions = [
  { id: 'birthday', label: 'Birthday', icon: '🎂', description: 'Celebrate a life with new life' },
  { id: 'anniversary', label: 'Anniversary', icon: '💑', description: 'Mark your love with roots' },
  { id: 'marriage', label: 'Marriage', icon: '💍', description: 'Begin your journey together' },
  { id: 'memorial', label: 'Memorial', icon: '🙏', description: 'Honor a departed soul' },
  { id: 'custom', label: 'Custom', icon: '✨', description: 'Any reason to give back' },
];

export function generateTrackingId(): string {
  const prefix = 'VJK';
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = prefix;
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export const sampleTrees = [
  {
    trackingId: 'VJK8X2KQ4R',
    treeName: 'Shivaji',
    plantName: 'Peepal Tree',
    occasion: 'Birthday',
    status: 'growing' as const,
    plantationDate: '2024-01-15',
    location: { lat: 16.7048, lng: 74.2433, address: 'Kolhapur, Maharashtra' },
    progress: [
      { date: '2024-01-15', status: 'Seed planted in nursery', note: 'Healthy seedling selected' },
      { date: '2024-02-10', status: 'Sapling ready', note: '30cm tall, strong roots' },
      { date: '2024-03-05', status: 'Planted at site', note: 'Planted near village temple' },
      { date: '2024-04-01', status: 'Growing well', note: 'New leaves sprouting, 45cm tall' },
    ],
  },
];
