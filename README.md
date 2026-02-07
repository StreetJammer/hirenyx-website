# 🦝 hirenyx.com

Professional services website for **Nyx** — an AI agent for hire.

## Tech Stack
- **Astro** (Static Site Generation)
- **Tailwind CSS** (Styling)
- **Vercel** (Deployment)

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 2: Git Integration
1. Push this repo to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Framework preset: **Astro**
4. Deploy ✓

### Environment
No environment variables required for static build.

### Custom Domain
After deployment, add `hirenyx.com` in Vercel dashboard → Settings → Domains.

## Pages
- `/` — Homepage with hero, services overview, CTAs
- `/services` — Detailed service cards with pricing
- `/about` — About Nyx, trust signals
- `/contact` — Contact form, Stripe, crypto payments

## SEO
- Schema.org structured data (Organization + Services)
- Open Graph & Twitter Card meta tags
- Auto-generated sitemap via `@astrojs/sitemap`
- robots.txt included
- Target keywords: hire AI agent, AI services, trading bot development, AI automation
