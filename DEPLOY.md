# BH DECO AI — Vercel Deployment Guide
# Phase 1.5 · Last verified: Phase 1.5 Final Build ✅

---

## Project Root Confirmation

| Setting             | Value                              |
|---------------------|------------------------------------|
| Root directory      | `/` (repo root — no monorepo)      |
| Framework preset    | **Next.js**                        |
| Build command       | `npm run build`                    |
| Output directory    | `.next` (Next.js default)          |
| Install command     | `npm install`                      |
| Node version        | 20.x (recommended)                 |

---

## Step 1 — Push to GitHub

```bash
# From your local machine (clone or copy this project)
git init
git add .
git commit -m "BH DECO AI — Phase 1.5"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bhdeco-ai.git
git push -u origin main
```

> ⚠️ `.gitignore` already excludes:
> `node_modules/`, `.next/`, `.env*`, `*.tsbuildinfo`
> Do NOT manually add any `.env` file to git.

---

## Step 2 — Import to Vercel

1. Go to **https://vercel.com/new**
2. Click **"Import Git Repository"**
3. Select your `bhdeco-ai` GitHub repo
4. Vercel will auto-detect **Next.js** — confirm these settings:

| Field              | Value            |
|--------------------|------------------|
| Framework Preset   | **Next.js**      |
| Root Directory     | `.` (leave blank / default) |
| Build Command      | `npm run build`  |
| Output Directory   | `.next`          |
| Install Command    | `npm install`    |

---

## Step 3 — Set Environment Variable

In the Vercel project settings **before deploying**, go to:
**Settings → Environment Variables → Add**

| Name                    | Value                                              | Environment        |
|-------------------------|----------------------------------------------------|--------------------|
| `NEXT_PUBLIC_API_URL`   | `https://YOUR-RAILWAY-BACKEND.up.railway.app`      | Production, Preview, Development |

> Replace `YOUR-RAILWAY-BACKEND` with your actual Railway service URL.
> Example: `https://bhdeco-api-production.up.railway.app`

> ⚠️ This variable is the **only** configuration needed.
> It connects the recharge page to your existing FastAPI backend on Railway.
> Do NOT change any API routes or backend logic.

---

## Step 4 — Deploy

Click **Deploy**. Vercel will:
- Install dependencies (`npm install`)
- Run `npm run build` (Next.js static export)
- Serve from Vercel's global CDN

Expected build time: **~60–90 seconds**

---

## Step 5 — Test All Routes After Deploy

Open your Vercel deployment URL (`https://bhdeco-ai.vercel.app`) and verify:

| Route                     | Expected                                          | Status |
|---------------------------|---------------------------------------------------|--------|
| `/`                       | Homepage loads, hero animations, all sections     | ☐      |
| `/pricing`                | 3 plans visible, Business highlighted, Recharge Now → /recharge | ☐ |
| `/recharge`               | Credits display (if logged in), 4 payment methods, How It Works section | ☐ |
| `/privacy`                | Privacy Policy page loads                         | ☐      |
| `/terms`                  | Terms of Service page loads                       | ☐      |
| `/refund`                 | Refund Policy page loads                          | ☐      |
| `/furniture-construction` | Coming Soon page with 5 feature cards             | ☐      |
| `/app`                    | Proxies to existing app (your existing route)     | ☐      |
| `/login`                  | Proxies to existing login (your existing route)   | ☐      |
| `/history`                | Proxies to existing history (your existing route) | ☐      |
| `/anything-invalid`       | Custom 404 page renders                           | ☐      |

> `/app`, `/login`, `/history` are served by your **existing** Next.js app pages —
> they are NOT new routes in this repo and require no action here.

---

## Step 6 — Add Custom Domain

In Vercel: **Project → Settings → Domains → Add Domain**

Add both:
```
bhdeco.ai
www.bhdeco.ai
```

Vercel will show you the required DNS records. Use exactly these:

### DNS Records (set at your domain registrar)

| Type  | Host / Name | Value                  | TTL  |
|-------|-------------|------------------------|------|
| A     | `@`         | `76.76.21.21`          | 3600 |
| CNAME | `www`       | `cname.vercel-dns.com` | 3600 |

> If your registrar doesn't support CNAME flattening, use the A record for `@`
> and the CNAME for `www` exactly as shown above.
>
> DNS propagation: 5 minutes to 48 hours depending on registrar.
> Vercel auto-provisions SSL (HTTPS) once DNS resolves — no action needed.

---

## Environment Variables Reference

| Variable              | Required | Description                                        |
|-----------------------|----------|----------------------------------------------------|
| `NEXT_PUBLIC_API_URL` | **Yes**  | Your Railway FastAPI base URL (no trailing slash)  |

### Usage in code (do not modify)
```
// src/app/recharge/page.tsx
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";
fetch(`${API_BASE}/credits`, { headers: { Authorization: `Bearer ${token}` } })
```

---

## What Was NOT Modified

The following are completely untouched and safe:

| System                    | Status     |
|---------------------------|------------|
| `generate()` function     | ✅ Untouched |
| Auth logic                | ✅ Untouched |
| Credits logic             | ✅ Untouched |
| History logic             | ✅ Untouched |
| Furniture Construction engine | ✅ Untouched |
| Backend (Railway FastAPI) | ✅ Untouched |
| All existing API routes   | ✅ Untouched |
| Payment gateway           | ✅ None added |

---

## Deployment Checklist

### Pre-deploy
- [ ] Replaced `YOUR-RAILWAY-BACKEND` with actual Railway URL in Vercel env vars
- [ ] GitHub repo is pushed and up to date
- [ ] Vercel framework preset is set to **Next.js**
- [ ] No `.env` file committed to git

### Post-deploy
- [ ] `/` homepage loads correctly
- [ ] `/pricing` — all 3 plans visible, Business highlighted
- [ ] `/recharge` — credits display for logged-in users, 4 payment methods, How Recharge Works section
- [ ] `/furniture-construction` — Coming Soon page renders
- [ ] `/privacy`, `/terms`, `/refund` — all load
- [ ] `404` — custom page renders for invalid routes
- [ ] Navbar: **Get Started** → `/app` ✓
- [ ] Navbar: **Recharge** → `/recharge` ✓
- [ ] Footer: **Privacy Policy** → `/privacy` ✓
- [ ] Footer: **Terms of Service** → `/terms` ✓
- [ ] Footer: **Refund Policy** → `/refund` ✓
- [ ] Mobile navbar opens and closes correctly
- [ ] Custom domain `bhdeco.ai` resolves with HTTPS

---

## Troubleshooting

**Credits not showing on /recharge**
→ Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel env vars (no trailing slash).
→ Verify your Railway backend `/credits` endpoint accepts `Authorization: Bearer <token>`.

**Build fails on Vercel**
→ Ensure Node.js version is set to **20.x** in Vercel project settings.
→ Run `npm run build` locally first — it must pass before pushing.

**Domain not resolving**
→ Check DNS records are exactly as listed above.
→ Wait up to 48 hours for propagation. Check with `dig bhdeco.ai` or `https://dnschecker.org`.

**SSL certificate not provisioning**
→ Vercel auto-provisions SSL. If pending after 24h, remove and re-add the domain in Vercel settings.

---

*BH DECO AI — Phase 1.5 · UI only · No backend changes*
