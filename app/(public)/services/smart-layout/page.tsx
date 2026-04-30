import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import SmartLayoutClient from './SmartLayoutClient';

export const metadata: Metadata = buildMetadata({
  title:       'Smart Layout – Vastu Floor Plan Analysis | Vastu Arya',
  description: 'Get your home or office floor plan analysed for Vastu compliance by Dr. PPS Tomar. Optimise room placement, directions and energy flow.',
  path:        '/services/smart-layout',
});

export default function Page() {
  return (
    <>
      <SmartLayoutClient />
    </>
  );
}
