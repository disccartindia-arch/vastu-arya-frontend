import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import CategoryClient from './CategoryClient';

const CATEGORY_META: Record<string, { title: string; description: string }> = {
  'rudraksha': {
    title:       'Buy Authentic Rudraksha Online – 1 to 21 Mukhi | Vastu Arya',
    description: 'Buy authentic certified Rudraksha beads online. All mukhis from 1 to 21, personally selected by Dr. PPS Tomar for maximum spiritual benefit. Pan-India delivery.',
  },
  'gemstones': {
    title:       'Certified Natural Gemstones Online – Ruby, Emerald, Sapphire and More',
    description: 'Buy certified natural gemstones online — Ruby, Emerald, Yellow Sapphire, Blue Sapphire, Pearl and more. Lab-certified, astrology-grade stones curated by Dr. PPS Tomar.',
  },
  'yantras': {
    title:       'Buy Vastu Yantras Online – Shree Yantra, Vastu Dosh Nivaran and More',
    description: 'Energised Vastu yantras for home and office — Shree Yantra, Vastu Dosh Nivaran Yantra, Kubera Yantra and more. Blessed and authenticated by Dr. PPS Tomar.',
  },
  'sacred-mala': {
    title:       'Sacred Malas – Rudraksha Mala, Tulsi Mala and Japa Malas Online',
    description: 'Shop handcrafted sacred malas for meditation — Rudraksha mala, Tulsi mala, Crystal mala and more. Energised and curated by Dr. PPS Tomar.',
  },
  'divine-frames': {
    title:       'Divine Vastu Frames – Vastu Purush and Deity Frames for Home and Office',
    description: 'Vastu-correct divine frames for your home and office. Vastu Purush mandala, deity portraits and sacred art to harmonise your space energy.',
  },
};

export async function generateMetadata(
  { params }: { params: { category: string } }
): Promise<Metadata> {
  const meta = CATEGORY_META[params.category];
  if (!meta) {
    return buildMetadata({
      title:       'Vastu Store – Sacred Products | Vastu Arya',
      description: 'Shop authentic Vastu and spiritual products curated by Dr. PPS Tomar.',
      path:        `/vastu-store/${params.category}`,
    });
  }
  return buildMetadata({ ...meta, path: `/vastu-store/${params.category}` });
}

export default function Page() {
  return <CategoryClient />;
}
