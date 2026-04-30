import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import BookingConfirmClient from './BookingConfirmClient';

export const metadata: Metadata = buildMetadata({
  title:   'Booking Confirm | Vastu Arya',
  path:    '/booking-confirm',
  noIndex: true,
});

export default function Page() {
  return <BookingConfirmClient />;
}
