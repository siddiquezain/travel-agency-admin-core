# Google Analytics & Search Console Setup

How to connect **Google Analytics 4 (GA4)** and **Google Search Console (GSC)** to
`https://origintoursandtravels.com`.

---

## How it's wired

Two environment variables drive everything. Both are **optional** — the site works
fine with them blank, and the related code simply renders nothing.

| Variable | What it does | Where it's used |
|---|---|---|
| `NEXT_PUBLIC_GA_ID` | Loads the GA4 `gtag.js` tracking script | `src/app/layout.tsx` |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Renders `<meta name="google-site-verification">` | `src/app/layout.tsx` (`metadata.verification`) |

- GA is loaded with `strategy="afterInteractive"` and `anonymize_ip: true` (IP anonymisation on by default).
- If `NEXT_PUBLIC_GA_ID` is blank → no GA scripts are emitted at all.
- If `NEXT_PUBLIC_GSC_VERIFICATION` is blank → no verification meta tag is emitted.

### ⚠️ These are BUILD-TIME variables

Any variable prefixed `NEXT_PUBLIC_` is **baked into the app when `next build` runs** —
it is *not* read at container start-up. Setting it only in Dokploy's runtime
Environment section **will not work**; it must be present during the Docker image
build. See [Step 3](#step-3--wire-the-variables) for the build-arg setup.

---

## Step 1 — Get the GA4 Measurement ID

1. Go to <https://analytics.google.com> → **Admin** (gear icon, bottom-left).
2. **Create Property** → name it `Origin Tours and Travels` → set timezone to
   `(GMT+05:30) India` and currency to `INR`.
3. Under the new property → **Data Streams** → **Add stream** → **Web**.
4. Website URL: `https://origintoursandtravels.com` — Stream name: `Website`.
5. Copy the **Measurement ID** shown at the top right — it looks like:

   ```
   G-XXXXXXXXXX
   ```

That `G-XXXXXXXXXX` value is your `NEXT_PUBLIC_GA_ID`.

---

## Step 2 — Get the Search Console verification token

Use the **HTML tag** method (that is what the code supports).

1. Go to <https://search.google.com/search-console>.
2. **Add property** → choose **URL prefix** (not "Domain") → enter:

   ```
   https://origintoursandtravels.com
   ```

   > URL-prefix is required — the HTML-tag method does not work with "Domain"
   > properties (those need a DNS record instead).
3. In the verification list, expand **HTML tag**. Google shows:

   ```html
   <meta name="google-site-verification" content="AbC123_long_random_token" />
   ```
4. Copy **only the `content` value** — `AbC123_long_random_token` — *not* the whole
   tag. That value is your `NEXT_PUBLIC_GSC_VERIFICATION`.
5. Don't click "Verify" yet — finish Step 3 and deploy first, then come back.

> **Shortcut:** if GA4 (Step 1) is already live on the site, you can instead pick
> the **Google Analytics** verification method in GSC and skip the token entirely —
> as long as you use the same Google account for both.

---

## Step 3 — Wire the variables

> **Already wired for production.** The production GA ID and GSC token are baked
> into `src/app/layout.tsx` as fallback defaults, so a normal build renders both
> tags with no extra configuration. The steps below only matter if you want to
> **override** them (e.g. a separate GA property per environment).

### 3a. Local development

Add to `.env` (already stubbed in `.env.example`):

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GSC_VERIFICATION=AbC123_long_random_token
```

`npm run dev` picks these up automatically.

### 3b. Production override (Docker / Dokploy) — optional

Only needed to override the baked-in defaults. Because these are build-time
variables, the Docker image must receive the values as **build args**. Two
files need a one-time change:

**`Dockerfile`** — in the `builder` stage, add the four lines before `RUN npm run build`:

```dockerfile
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ARG NEXT_PUBLIC_GA_ID
ARG NEXT_PUBLIC_GSC_VERIFICATION
ENV NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID
ENV NEXT_PUBLIC_GSC_VERIFICATION=$NEXT_PUBLIC_GSC_VERIFICATION
RUN npx prisma generate
RUN npm run build
```

**`docker-compose.yml`** — add an `args:` block to the `app` service's `build:`:

```yaml
  app:
    build:
      context: .
      target: runner
      args:
        NEXT_PUBLIC_GA_ID: ${NEXT_PUBLIC_GA_ID:-}
        NEXT_PUBLIC_GSC_VERIFICATION: ${NEXT_PUBLIC_GSC_VERIFICATION:-}
```

**In Dokploy** → your app → **Environment**, add:

```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GSC_VERIFICATION=AbC123_long_random_token
```

Dokploy feeds those into the `${...}` substitutions above, which pass them as build
args, which `next build` bakes into the image.

---

## Step 4 — Deploy and verify

1. **Redeploy** so a fresh build runs with the new args.
2. Check the rendered HTML (view-source, not DevTools — confirms server output):

   ```bash
   # GSC verification meta tag present
   curl -s https://origintoursandtravels.com | grep 'google-site-verification'

   # GA4 script present
   curl -s https://origintoursandtravels.com | grep 'googletagmanager.com/gtag'
   ```

   Both should return a line. If they're empty, the build args didn't reach the
   build — recheck Step 3.
3. **GSC:** go back to Search Console and click **Verify**. It should succeed.
4. **GA4:** open the site in a browser, then in GA4 → **Reports → Realtime** —
   you should appear as an active user within ~30 seconds.

---

## Step 5 — Post-verification in Search Console

Once the property is verified:

1. **Sitemaps** (left menu) → submit:

   ```
   sitemap.xml
   ```

   The site already serves it at `https://origintoursandtravels.com/sitemap.xml`
   (generated by `src/app/sitemap.ts`, includes every active tour/visa/attestation).
2. **URL Inspection** → paste the homepage URL → **Request Indexing**.
3. `robots.txt` is already served at `/robots.txt` (`src/app/robots.ts`) and points
   crawlers at the sitemap — nothing to do there.

---

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `curl` shows no GA/GSC tags after deploy | Build args not passed — recheck `Dockerfile` `ARG`/`ENV` lines and the compose `args:` block; the values must exist in Dokploy *before* the build. |
| GSC "Verification failed" | The property is a **Domain** property (needs DNS) — delete it and re-add as **URL prefix**. Or the token has a typo / extra whitespace. |
| GA4 Realtime shows nothing | Ad-blocker on your browser, or the wrong Measurement ID. Test in an incognito window with extensions disabled. |
| Tags appear locally but not in production | Production image was built before the variables were set — trigger a fresh rebuild. |
| Changed the ID — site still shows the old one | `NEXT_PUBLIC_*` is baked at build time; you must rebuild, not just restart, the container. |

---

## Notes

- IP anonymisation (`anonymize_ip: true`) is already enabled. A full cookie-consent
  banner is **not** included — add one if you need EU/GDPR compliance.
- The same `G-XXXXXXXXXX` ID works for both production and staging; use separate GA4
  properties if you want to keep staging traffic out of production reports.
