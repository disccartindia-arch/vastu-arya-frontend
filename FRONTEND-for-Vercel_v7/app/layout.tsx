/**
 * app/layout.tsx  ← REPLACE your existing file with this
 * ──────────────────────────────────────────────────────────────
 * Root layout for Vastu Arya (Next.js 14 App Router).
 *
 * Changes from original:
 *  • Google Search Console verification meta tag added
 *  • Canonical alternate added via `metadataBase`
 *  • Full keywords array
 *  • JSON-LD imported from lib/seo.ts (DRY, easier to maintain)
 *  • Viewport / themeColor moved to `viewport` export (Next 14 best practice)
 * ──────────────────────────────────────────────────────────────
 */
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster }         from 'react-hot-toast';
import LuxuryBackground    from '../components/ui/LuxuryBackground';
import { vastuAryaJsonLd } from '../lib/seo';

// ─── Viewport (separate from Metadata in Next 14) ────────────

export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  themeColor:   '#FF6B00',
};

// ─── Root Metadata ────────────────────────────────────────────

export const metadata: Metadata = {
  // Makes all relative OG/Twitter image URLs absolute automatically
  metadataBase: new URL('https://www.vastuarya.com'),

  title: {
    default:  'Vastu Arya – IVAF Certified Vastu & Astrology Consultancy | Dr. PPS Tomar',
    template: '%s | Vastu Arya',   // page titles render as "Services | Vastu Arya"
  },
  description:
    "India's premier Vastu Shastra, Astrology & Numerology platform by Dr. PPS Tomar — IVAF Certified Expert. 45,000+ happy clients. Book a consultation from just ₹11.",
  keywords: [
    'vastu shastra', 'vastu expert India', 'vastu arya', 'Dr PPS Tomar',
    'IVAF certified vastu consultant', 'astrology consultation', 'numerology expert',
    'online vastu consultation', 'home vastu', 'business vastu', 'vastu for new home',
    'vastu remedies', 'gemstone guidance', 'rudraksha consultation', 'vastu new delhi',
  ],

  // ── Canonical ────────────────────────────────────────────
  alternates: {
    canonical: 'https://www.vastuarya.com/',
  },

  // ── Open Graph ───────────────────────────────────────────
  openGraph: {
    title:       'Vastu Arya – Transform Your Space, Transform Your Life',
    description: "India's premier Vastu & Astrology platform by IVAF Certified Expert Dr. PPS Tomar. 45,000+ Happy Clients.",
    url:         'https://www.vastuarya.com',
    siteName:    'Vastu Arya',
    locale:      'en_IN',
    type:        'website',
    images: [
      {
        url:    '/logo.jpg',
        width:  1200,
        height: 630,
        alt:    'Vastu Arya – Dr. PPS Tomar',
      },
    ],
  },

  // ── Twitter / X ──────────────────────────────────────────
  twitter: {
    card:        'summary_large_image',
    title:       'Vastu Arya – IVAF Certified Vastu & Astrology | Dr. PPS Tomar',
    description: "India's premier Vastu Shastra & Astrology consultancy. Book a session with Dr. PPS Tomar from just ₹11.",
    images:      ['/logo.jpg'],
    creator:     '@VastuArya',
    site:        '@VastuArya',
  },

  // ── Robots ───────────────────────────────────────────────
  robots: {
    index:     true,
    follow:    true,
    googleBot: { index: true, follow: true },
  },

  // ── Icons ────────────────────────────────────────────────
  icons: {
    icon:  '/logo.jpg',
    apple: '/logo.jpg',
  },

  // ── Google Search Console Verification ───────────────────
  // Replace XXXXXX with your actual code from GSC → Settings → Ownership verification
  verification: {
    google: 'XXXXXX',
  },
};

// ─── Root Layout Component ────────────────────────────────────

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* ── JSON-LD Structured Data (LocalBusiness + Person + WebSite) ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(vastuAryaJsonLd) }}
        />
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
            style: {
              background:  '#1A0A00',
              color:       '#FFF8F0',
              fontFamily:  'DM Sans, sans-serif',
              border:      '1px solid rgba(212,160,23,0.2)',
            },
            success: { iconTheme: { primary: '#D4A017', secondary: '#FFF8F0' } },
          }}
        />
      </body>
    </html>
  );
}
