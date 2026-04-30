import type { Metadata } from 'next';
import { buildMetadata, bookAppointmentJsonLd } from '@/lib/seo';
import BookAppointmentClient from './BookAppointmentClient';

export const metadata: Metadata = buildMetadata({
  title:       'Book a Vastu Consultation – Dr. PPS Tomar | From ₹11',
  description: 'Book a Vastu Shastra, Astrology, or Numerology consultation with IVAF Certified Expert Dr. PPS Tomar. Online and in-person sessions. Starting from just ₹11. 45,000+ satisfied clients.',
  path:        '/services/book-appointment',
});

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookAppointmentJsonLd) }}
      />
      <BookAppointmentClient />
    </>
  );
}
