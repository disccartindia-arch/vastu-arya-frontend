/**
 * app/(public)/book-appointment/page.tsx  ← REPLACE your existing file
 * ──────────────────────────────────────────────────────────────
 * This is a FULL REPLACEMENT for the existing book-appointment page.
 *
 * Key changes:
 *  • metadata export added (server component wrapper)
 *  • BookAppointmentClient holds all 'use client' logic (unchanged)
 *  • bookAppointmentJsonLd structured data added for rich results
 * ──────────────────────────────────────────────────────────────
 */

import type { Metadata } from 'next';
import { buildMetadata, bookAppointmentJsonLd } from '../../../../lib/seo';
import BookAppointmentClient from './BookAppointmentClient';

// ─── Page Metadata ────────────────────────────────────────────

export const metadata: Metadata = buildMetadata({
  title:       'Book a Vastu Consultation – Dr. PPS Tomar | From ₹11',
  description:
    'Book a Vastu Shastra, Astrology, or Numerology consultation with IVAF Certified Expert Dr. PPS Tomar. Online and in-person sessions. Starting from just ₹11. 45,000+ satisfied clients.',
  path:        '/services/book-appointment',
  keywords: [
    'book vastu consultation',
    'book astrology appointment online',
    'vastu expert appointment India',
    'Dr PPS Tomar booking',
    'online vastu booking',
    'vastu appointment new delhi',
    'vastu shastra consultation fee',
    'book vastu expert',
    'IVAF certified vastu booking',
    'vastu arya appointment',
  ],
});

// ─── Server Component Wrapper ─────────────────────────────────

export default function BookAppointmentPage() {
  return (
    <>
      {/* JSON-LD for Service rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookAppointmentJsonLd) }}
      />
      <BookAppointmentClient />
    </>
  );
}


// ─────────────────────────────────────────────────────────────
// Create a new file: app/(public)/book-appointment/BookAppointmentClient.tsx
// Move your existing component code into this file and add 'use client' at top.
//
// BookAppointmentClient.tsx content:
// ─────────────────────────────────────────────────────────────
//
// 'use client';
// import { useEffect } from 'react';
// import { useUIStore } from '../../../store/uiStore';
// import Navbar from '../../../components/layout/Navbar';
// import Footer from '../../../components/layout/Footer';
// import AppointmentPopup from '../../../components/common/AppointmentPopup';
// import WhatsAppButton from '../../../components/common/WhatsAppButton';
//
// export default function BookAppointmentClient() {
//   const { setShowAppointmentPopup } = useUIStore();
//   useEffect(() => { setShowAppointmentPopup(true); }, []);
//   return (
//     <>
//       <Navbar />
//       <main className="min-h-screen bg-cream flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-5xl mb-3">🕉️</div>
//           <p className="text-text-light">Opening booking form...</p>
//         </div>
//       </main>
//       <Footer />
//       <AppointmentPopup />
//       <WhatsAppButton />
//     </>
//   );
// }
