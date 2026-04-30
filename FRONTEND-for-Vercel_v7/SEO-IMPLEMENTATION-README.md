# Vastu Arya — Complete SEO Implementation Guide
**For vastuarya.com | Next.js 14 App Router | Dr. PPS Tomar**

---

## ⚠️ IMPORTANT: This is Next.js App Router — NOT a CRA/Vite app

Your frontend uses **Next.js 14 with the App Router** (`app/` directory).
`react-helmet-async` is for CRA/Vite SPAs — **do not install it**.
All SEO is handled natively by the Next.js **Metadata API** — zero extra packages needed.
`next-seo` is already in your package.json but is NOT needed either; the native API is better.

---

## File Map — What Goes Where

```
v3/
├── public/
│   ├── robots.txt               ← REPLACE (file provided)
│   └── sitemap.xml              ← REPLACE (file provided)
│
├── lib/
│   └── seo.ts                   ← NEW FILE (create this folder + file)
│
├── next.config.js               ← REPLACE (adds www redirect + headers)
│
└── app/
    ├── layout.tsx               ← REPLACE (adds metadataBase, template, JSON-LD)
    ├── page.tsx                 ← ADD metadata export (see page.seo-snippet.tsx)
    │
    └── (public)/
        ├── services/
        │   └── page.tsx         ← ADD metadata export (see services snippet)
        ├── book-appointment/
        │   ├── page.tsx         ← REPLACE (server wrapper with JSON-LD)
        │   └── BookAppointmentClient.tsx  ← NEW (move 'use client' code here)
        └── [all other pages]    ← ADD metadata exports from snippets file
```

---

## Step-by-Step Implementation

### Step 1 — Copy static files
```
public/robots.txt      → v3/public/robots.txt
public/sitemap.xml     → v3/public/sitemap.xml
```

### Step 2 — Create lib/seo.ts
```
mkdir -p v3/lib
cp lib/seo.ts v3/lib/seo.ts
```

### Step 3 — Replace next.config.js
```
cp next.config.js v3/next.config.js
```

### Step 4 — Replace app/layout.tsx
```
cp app/layout.tsx v3/app/layout.tsx
```

### Step 5 — Add metadata to app/page.tsx (Home)
Open `v3/app/page.tsx` and add at the very top (before 'use client' if present):
```ts
import type { Metadata } from 'next';
import { buildMetadata }  from '../lib/seo';

export const metadata: Metadata = buildMetadata({
  title:       'Vastu Shastra & Astrology Consultancy by Dr. PPS Tomar – IVAF Certified',
  description: "India's most trusted Vastu Shastra & Astrology platform...",
  path:        '/',
});
```
⚠️ Remove `'use client'` from page.tsx if it's there — metadata exports only work in Server Components. Move any client logic to a separate `HomeClient.tsx`.

### Step 6 — Add metadata to /services/page.tsx
Same pattern — see `app/(public)/services/page.seo-snippet.tsx`

### Step 7 — Replace /book-appointment/page.tsx
This page needs a server wrapper + client component split because it uses `useEffect`.
- Replace `page.tsx` with the provided file
- Create `BookAppointmentClient.tsx` with the original component code

### Step 8 — Add metadata to all other pages
Open `ALL-OTHER-PAGES-metadata-snippets.ts` and copy the relevant snippet to each page.

---

## Google Search Console Setup

1. Go to https://search.google.com/search-console
2. Add property: `https://www.vastuarya.com` (URL-prefix type)
3. Choose "HTML tag" verification
4. Copy the content value (looks like: `abc123XYZ...`)
5. Open `v3/lib/seo.ts` — find `verification: { google: 'XXXXXX' }`
6. Replace `XXXXXX` with your actual code
7. Also update `app/layout.tsx` line: `google: 'XXXXXX'`
8. Deploy, then click "Verify" in GSC

After verification:
- Submit sitemap: GSC → Sitemaps → Add `https://www.vastuarya.com/sitemap.xml`
- Request indexing: GSC → URL Inspection → enter `/` → Request Indexing

---

## Why Your Site Isn't Appearing on Google (Root Causes)

### 1. No sitemap.xml / robots.txt
✅ Fixed — files provided

### 2. No canonical URLs
✅ Fixed — `alternates.canonical` added to every page via `buildMetadata()`

### 3. No structured data
✅ Fixed — LocalBusiness + Person + WebSite JSON-LD in layout

### 4. www vs non-www split
✅ Fixed — `next.config.js` 301 redirect forces all traffic to `www.vastuarya.com`

### 5. Pages using 'use client' without metadata exports
✅ Fixed — server wrapper pattern shown for book-appointment

### 6. Never submitted to Google Search Console
⬜ You must do this manually (Step above)

### 7. No `metadataBase` in layout
✅ Fixed — OG images now resolve to absolute URLs correctly

---

## JSON-LD Structured Data Reference

The `vastuAryaJsonLd` in `lib/seo.ts` outputs three schemas:
- **LocalBusiness** — business name, address, phone, hours, rating (45,000 reviews, 4.9★)
- **Person** — Dr. PPS Tomar, IVAF credential, role, expertise
- **WebSite** — with SearchAction for sitelinks search box in Google

The `bookAppointmentJsonLd` outputs a **Service** schema with pricing (₹11 offer).

---

## Ongoing SEO Checklist

- [ ] Update `lastmod` in `sitemap.xml` whenever you add/change pages
- [ ] Add `export const metadata = buildMetadata({...})` to every new page you create
- [ ] Add blog post pages to sitemap dynamically (use `generateSitemap` in Next.js)
- [ ] Set up Google Analytics 4 for traffic tracking
- [ ] Add alt text to all images (`<Image alt="..." />`)
- [ ] Ensure page load speed < 3s (check with PageSpeed Insights)
