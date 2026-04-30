/** @type {import('next').NextConfig} */

const nextConfig = {
  // ── Image domains ──────────────────────────────────────────
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http',  hostname: 'localhost' },
    ],
  },

  // ── Environment variables ──────────────────────────────────
  env: {
    NEXT_PUBLIC_API_URL:            process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_RAZORPAY_KEY_ID:    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    NEXT_PUBLIC_WHATSAPP_NUMBER:    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  },

  // ── Canonical www redirect ─────────────────────────────────
  // Forces all traffic to www.vastuarya.com — critical for GSC
  // and avoiding duplicate-content penalties.
  async redirects() {
    return [
      {
        source:      '/:path*',
        has:         [{ type: 'host', value: 'vastuarya.com' }],
        destination: 'https://www.vastuarya.com/:path*',
        permanent:   true,   // 301
      },
    ];
  },

  // ── Security + SEO headers ─────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
          { key: 'X-Frame-Options',         value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
        ],
      },
      // Correct content-type for sitemap.xml
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Content-Type', value: 'application/xml; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=43200' },
        ],
      },
      // Correct content-type for robots.txt
      {
        source: '/robots.txt',
        headers: [
          { key: 'Content-Type',  value: 'text/plain' },
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
