import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import BusinessVastuClient from './BusinessVastuClient';

export const metadata: Metadata = buildMetadata({
  title:       'Business Vastu Consultation – Boost Profits & Attract Clients',
  description: 'Expert Business Vastu consultation by Dr. PPS Tomar. Optimise your office, shop, or factory for maximum prosperity and customer footfall. IVAF Certified.',
  path:        '/services/business-vastu',
});

export default function Page() {
  return (
    <>
      <BusinessVastuClient />
    </>
  );
}
