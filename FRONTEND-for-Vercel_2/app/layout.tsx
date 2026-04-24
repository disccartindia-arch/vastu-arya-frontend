import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import LuxuryBackground from '../components/ui/LuxuryBackground';

export const metadata: Metadata = {
  title: 'Vastu Arya - Premium Vastu & Astrology Consultancy | IVAF Certified',
  description: "India's premier Vastu Shastra, Astrology, Numerology consultation platform by Dr. PPS - IVAF Certified Expert. 45,000+ Happy Clients. Book at just ₹11.",
  keywords: 'vastu shastra, vastu expert, vastu arya, astrology, numerology, Dr PPS, IVAF certified, vastu consultation India',
  openGraph: {
    title: 'Vastu Arya - Transform Your Space, Transform Your Life',
    description: "India's premier Vastu & Astrology platform by IVAF Certified Expert Dr. PPS. 45,000+ Happy Clients.",
    type: 'website',
    siteName: 'Vastu Arya',
    locale: 'en_IN',
    images: [{ url: '/logo.jpg', width: 744, height: 744, alt: 'Vastu Arya' }],
  },
  robots: { index: true, follow: true },
  icons: { icon: '/logo.jpg', apple: '/logo.jpg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FF6B00" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Vastu Arya",
          "description": "India's premier Vastu Shastra & Astrology platform by Dr. PPS",
          "url": "https://vastuarya.com",
          "telephone": "+91-9999999999",
          "address": { "@type": "PostalAddress", "addressLocality": "New Delhi", "addressCountry": "IN" },
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "45000" }
        })}} />
      </head>
      <body className="font-body bg-cream">
        <LuxuryBackground />
        <div className="relative z-10">
          {children}
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: { background: '#1A0A00', color: '#FFF8F0', fontFamily: 'DM Sans, sans-serif', border: '1px solid rgba(212,160,23,0.2)' },
            success: { iconTheme: { primary: '#D4A017', secondary: '#FFF8F0' } },
          }}
        />
      </body>
    </html>
  );
}
