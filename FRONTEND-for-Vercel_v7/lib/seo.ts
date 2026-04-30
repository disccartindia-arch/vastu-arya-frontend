/**
 * lib/seo.ts
 * ──────────────────────────────────────────────────────────────
 * Central SEO helpers for Vastu Arya (Next.js 14 App Router).
 *
 * Usage:
 *   1. Import `buildMetadata()` in any page.tsx / layout.tsx
 *   2. Export the result as `export const metadata = buildMetadata({...})`
 *   3. Import `VastuAryaJsonLd` and render it in layout.tsx (already done)
 *   4. Import `BookingPageJsonLd` for /services/book-appointment
 *
 * NOTE: This project uses Next.js 14 App Router.
 * react-helmet-async is for CRA/Vite SPAs — it is NOT needed here.
 * All <head> tags are handled by Next.js Metadata API automatically.
 * ──────────────────────────────────────────────────────────────
 */

import type { Metadata } from 'next';

// ─── Site-wide defaults ───────────────────────────────────────

const SITE_URL   = 'https://www.vastuarya.com';
const SITE_NAME  = 'Vastu Arya';
const LOGO_URL   = `${SITE_URL}/logo.jpg`;
const TWITTER_HANDLE = '@VastuArya';

const DEFAULT_TITLE       = 'Vastu Arya – IVAF Certified Vastu & Astrology Consultancy | Dr. PPS Tomar';
const DEFAULT_DESCRIPTION = "India's premier Vastu Shastra, Astrology & Numerology platform by Dr. PPS Tomar — IVAF Certified Expert. 45,000+ happy clients. Book a consultation from just ₹11.";
const DEFAULT_KEYWORDS    = [
  'vastu shastra',
  'vastu expert India',
  'vastu arya',
  'Dr PPS Tomar',
  'IVAF certified vastu consultant',
  'astrology consultation',
  'numerology expert',
  'online vastu consultation',
  'home vastu',
  'business vastu',
  'vastu for new home',
  'vastu remedies',
  'gemstone guidance',
  'rudraksha consultation',
  'vastu new delhi',
];

// ─── buildMetadata() — use in every page.tsx ─────────────────

export interface PageSeoProps {
  title?:       string;   // page-specific title (appended with " | Vastu Arya")
  description?: string;
  path?:        string;   // e.g. "/services/business-vastu"
  imageUrl?:    string;   // absolute URL — falls back to logo
  keywords?:    string[];
  noIndex?:     boolean;  // true for /login, /admin, etc.
}

export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path        = '/',
  imageUrl    = LOGO_URL,
  keywords    = DEFAULT_KEYWORDS,
  noIndex     = false,
}: PageSeoProps = {}): Metadata {

  const fullTitle    = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const canonicalUrl = `${SITE_URL}${path}`;

  return {
    // ── Title ──────────────────────────────────────────────────
    title:       fullTitle,
    description,
    keywords:    keywords.join(', '),

    // ── Canonical ─────────────────────────────────────────────
    alternates: {
      canonical: canonicalUrl,
    },

    // ── Open Graph ────────────────────────────────────────────
    openGraph: {
      title:       fullTitle,
      description,
      url:         canonicalUrl,
      siteName:    SITE_NAME,
      locale:      'en_IN',
      type:        'website',
      images: [
        {
          url:    imageUrl,
          width:  1200,
          height: 630,
          alt:    fullTitle,
        },
      ],
    },

    // ── Twitter / X Card ──────────────────────────────────────
    twitter: {
      card:        'summary_large_image',
      title:       fullTitle,
      description,
      images:      [imageUrl],
      creator:     TWITTER_HANDLE,
      site:        TWITTER_HANDLE,
    },

    // ── Robots ────────────────────────────────────────────────
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true,  follow: true,  googleBot: { index: true, follow: true } },

    // ── Verification (replace XXXXXX after GSC setup) ─────────
    verification: {
      google: 'XXXXXX',   // ← paste your GSC verification code here
    },
  };
}


// ─── JSON-LD Helpers ─────────────────────────────────────────
//
// Render these as <script> tags inside page components or layout.tsx.
// Example usage in layout.tsx — already shown in Section 6 below.
// ─────────────────────────────────────────────────────────────

/** Full LocalBusiness + Person schema for the Homepage */
export const vastuAryaJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':       ['LocalBusiness', 'ProfessionalService'],
      '@id':         'https://www.vastuarya.com/#business',
      name:          'Vastu Arya',
      alternateName: 'VastuArya',
      description:   "India's premier Vastu Shastra & Astrology consultancy by IVAF Certified Expert Dr. PPS Tomar. Trusted by 45,000+ clients across India.",
      url:           'https://www.vastuarya.com',
      logo:          'https://www.vastuarya.com/logo.jpg',
      image:         'https://www.vastuarya.com/logo.jpg',
      telephone:     '+91-7000343804',
      email:         'info@vastuarya.com',
      priceRange:    '₹₹',
      currenciesAccepted: 'INR',
      paymentAccepted:    'Cash, Credit Card, UPI, Net Banking',
      address: {
        '@type':           'PostalAddress',
        streetAddress:     'New Delhi',
        addressLocality:   'New Delhi',
        addressRegion:     'Delhi',
        postalCode:        '110001',
        addressCountry:    'IN',
      },
      geo: {
        '@type':    'GeoCoordinates',
        latitude:   28.6139,
        longitude:  77.2090,
      },
      openingHoursSpecification: [
        {
          '@type':    'OpeningHoursSpecification',
          dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
          opens:     '09:00',
          closes:    '20:00',
        },
        {
          '@type':    'OpeningHoursSpecification',
          dayOfWeek: ['Sunday'],
          opens:     '10:00',
          closes:    '17:00',
        },
      ],
      aggregateRating: {
        '@type':       'AggregateRating',
        ratingValue:   '4.9',
        bestRating:    '5',
        worstRating:   '1',
        reviewCount:   '45000',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name:    'Vastu & Astrology Services',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Vastu Shastra Consultancy' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Home Energy Analysis' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Business Vastu Consultation' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Mobile Numerology' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Gemstone Guidance' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Vastu Check' } },
        ],
      },
      sameAs: [
        'https://www.facebook.com/vastuarya',
        'https://www.instagram.com/vastuarya',
        'https://www.youtube.com/@vastuarya',
        'https://twitter.com/VastuArya',
      ],
    },
    {
      '@type':       'Person',
      '@id':         'https://www.vastuarya.com/#drppstomar',
      name:          'Dr. PPS Tomar',
      honorificPrefix: 'Dr.',
      jobTitle:      'IVAF Certified Vastu Shastra Expert & Astrologer',
      description:   'Dr. PPS Tomar is an IVAF Certified Vastu Shastra Expert with over 20 years of experience helping 45,000+ clients across India with Vastu, Astrology, and Numerology consultations.',
      url:           'https://www.vastuarya.com/about',
      image:         'https://www.vastuarya.com/logo.jpg',
      telephone:     '+91-7000343804',
      worksFor: {
        '@id': 'https://www.vastuarya.com/#business',
      },
      address: {
        '@type':         'PostalAddress',
        addressLocality: 'New Delhi',
        addressCountry:  'IN',
      },
      knowsAbout: [
        'Vastu Shastra',
        'Astrology',
        'Numerology',
        'Gemstone Therapy',
        'Rudraksha',
        'Business Vastu',
        'Home Vastu',
      ],
      hasCredential: {
        '@type':          'EducationalOccupationalCredential',
        credentialCategory: 'Professional Certification',
        recognizedBy: {
          '@type': 'Organization',
          name:    'Indian Vastu Architects Federation (IVAF)',
        },
      },
    },
    {
      '@type':    'WebSite',
      '@id':      'https://www.vastuarya.com/#website',
      url:        'https://www.vastuarya.com',
      name:       'Vastu Arya',
      description: DEFAULT_DESCRIPTION,
      publisher: {
        '@id': 'https://www.vastuarya.com/#business',
      },
      potentialAction: {
        '@type':       'SearchAction',
        target: {
          '@type':       'EntryPoint',
          urlTemplate:   'https://www.vastuarya.com/blog?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

/** Compact schema for the Book Appointment page */
export const bookAppointmentJsonLd = {
  '@context': 'https://schema.org',
  '@type':    'Service',
  name:       'Book Vastu Consultation with Dr. PPS Tomar',
  description: 'Book a Vastu Shastra, Astrology, or Numerology consultation with IVAF Certified Expert Dr. PPS Tomar. Online and in-person sessions available from ₹11.',
  url:        'https://www.vastuarya.com/services/book-appointment',
  provider: {
    '@id': 'https://www.vastuarya.com/#business',
  },
  areaServed: {
    '@type': 'Country',
    name:    'India',
  },
  offers: {
    '@type':         'Offer',
    price:           '11',
    priceCurrency:   'INR',
    availability:    'https://schema.org/InStock',
    validFrom:       '2024-01-01',
    url:             'https://www.vastuarya.com/services/book-appointment',
  },
};
