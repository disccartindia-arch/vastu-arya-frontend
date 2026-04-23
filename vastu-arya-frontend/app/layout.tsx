import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Vastu Arya - Premium Vastu & Astrology Consultancy | IVAF Certified',
  description: "India's premier Vastu Shastra, Astrology, Numerology consultation platform by Dr. PPS - IVAF Certified Expert. Book appointment at just ₹11.",
  keywords: 'vastu shastra, vastu expert, vastu arya, astrology, numerology, gemology, Dr PPS, IVAF certified, vastu consultation',
  openGraph: {
    title: 'Vastu Arya - Transform Your Space, Transform Your Life',
    description: "India's premier Vastu & Astrology platform by IVAF Certified Expert Dr. PPS",
    type: 'website',
    siteName: 'Vastu Arya',
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FF6B00" />
      </head>
      <body className="font-body bg-cream">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { background: '#1A0A00', color: '#FFF8F0', fontFamily: 'DM Sans, sans-serif' },
            success: { iconTheme: { primary: '#FF6B00', secondary: '#FFF8F0' } },
          }}
        />
      </body>
    </html>
  );
}
