# JSON-LD Schema Deployment Guide
## origintoursandtravels.com · Next.js App Router

---

## 📁 Files in This Package

```
src/
└── components/
│   └── schema/
│       ├── index.ts                  ← barrel export (import from here)
│       ├── LocalBusinessSchema.tsx   ← Schema 1 (site-wide, layout.tsx)
│       ├── WebSiteSchema.tsx         ← Schema 2 (site-wide, layout.tsx)
│       ├── FAQSchema.tsx             ← Schema 3 (homepage only)
│       ├── ReviewSchema.tsx          ← Schema 4 (homepage only)
│       └── BreadcrumbSchema.tsx      ← Schema 5 (every page)
└── app/
    ├── layout.tsx                    ← Add Schema 1 + 2 here
    ├── page.tsx                      ← Add Schema 3 + 4 + 5 here
    └── inner-pages-examples.tsx      ← Reference for all other pages
```

---

## 🚀 Step-by-Step Deployment

### Step 1 — Copy the schema folder
Copy the entire `src/components/schema/` folder into your project's
`src/components/` directory.

---

### Step 2 — Update `src/app/layout.tsx`
Add 2 imports and 2 schema tags to your **existing** root layout:

```tsx
// At the top, add:
import { LocalBusinessSchema, WebSiteSchema } from "@/components/schema";

// Inside <head>, add:
<LocalBusinessSchema />
<WebSiteSchema />
```

---

### Step 3 — Update `src/app/page.tsx` (Homepage)
Add 3 schemas to the top of your homepage return statement:

```tsx
// At the top, add:
import { FAQSchema, ReviewSchema, BreadcrumbSchema, breadcrumbs } from "@/components/schema";

// Inside return(), before first <section>, add:
<FAQSchema />
<ReviewSchema />
<BreadcrumbSchema items={breadcrumbs.home} />
```

---

### Step 4 — Add BreadcrumbSchema to every inner page

#### Static pages:
```tsx
import { BreadcrumbSchema, breadcrumbs } from "@/components/schema";

// In UmrahPage:       <BreadcrumbSchema items={breadcrumbs.umrah} />
// In HajjPage:        <BreadcrumbSchema items={breadcrumbs.hajj} />
// In VisasPage:       <BreadcrumbSchema items={breadcrumbs.visas} />
// In AttestPage:      <BreadcrumbSchema items={breadcrumbs.attestations} />
// In AirTicketPage:   <BreadcrumbSchema items={breadcrumbs.airTicketing} />
// In HotelPage:       <BreadcrumbSchema items={breadcrumbs.hotelBooking} />
// In TransportPage:   <BreadcrumbSchema items={breadcrumbs.transport} />
// In BlogPage:        <BreadcrumbSchema items={breadcrumbs.blog} />
// In AboutPage:       <BreadcrumbSchema items={breadcrumbs.about} />
// In ContactPage:     <BreadcrumbSchema items={breadcrumbs.contact} />
```

#### Dynamic pages (tours, visas, attestations, blog):
```tsx
<BreadcrumbSchema
  items={[
    { name: "Home", url: "/" },
    { name: "Tours", url: "/tours" },
    { name: tourName, url: `/tours/${params.slug}` },
  ]}
/>
```
See `inner-pages-examples.tsx` for complete examples for each route.

---

### Step 5 — ⚠️ Update ReviewSchema with REAL numbers

Open `ReviewSchema.tsx` and update these fields with your actual data:

| Field | What to use |
|-------|-------------|
| `ratingValue` | Your actual avg Google rating (e.g. `"4.9"`) |
| `ratingCount` | Total ratings on Google Business Profile |
| `reviewCount` | Total written reviews on Google |
| `review[]` | Replace with real customer reviews + real dates |

Google **will** suppress star ratings if they detect inflated/fake data.

---

### Step 6 — Validate before going live

1. Deploy to staging / Vercel preview URL
2. Visit: https://search.google.com/test/rich-results
3. Enter your staging URL — test each page type:
   - Homepage → FAQPage + AggregateRating + BreadcrumbList
   - /umrah   → BreadcrumbList
   - /tours/[slug] → BreadcrumbList
4. Fix any errors shown (usually missing required fields)
5. Deploy to production

---

### Step 7 — Monitor in Search Console

After deploying to production:
1. Go to Google Search Console → **Enhancements** (left sidebar)
2. You'll see sections for: FAQs, Breadcrumbs, Sitelinks Searchbox
3. Google typically processes new schema within **1–2 weeks**
4. Check for any manual action warnings under Security & Manual Actions

---

## 🎯 Expected Results After Deployment

| Schema | What You'll See in Google |
|--------|--------------------------|
| LocalBusiness | Business panel on right, appears in Maps local pack |
| WebSite | Sitelinks search box below your listing |
| FAQPage | Expandable Q&A accordion under your homepage result |
| AggregateRating | ⭐⭐⭐⭐⭐ 4.8 (500 reviews) below title |
| BreadcrumbList | `origintoursandtravels.com › Tours › Umrah Package` |

---

## ❓ Need Help?

- Rich Results Test: https://search.google.com/test/rich-results
- Schema validator: https://validator.schema.org/
- Next.js Script docs: https://nextjs.org/docs/app/api-reference/components/script
