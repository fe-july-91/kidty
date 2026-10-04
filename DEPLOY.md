# Deploying Kidty

- **Website**: GitHub Pages at https://kidty.com.ua (branch `gh-pages`).
- **API**: Render (free web service) at https://api.kidty.com.ua.
- **Database**: Neon (free Postgres).

The site and the API share the `kidty.com.ua` domain, which the login
cookie needs (`SameSite=Lax`).

## 1. Database (Neon)

1. Create a project at https://neon.tech, region **Europe (Frankfurt)**.
2. Copy the connection string (**Direct connection**, not pooled). It looks
   like `postgresql://user:password@ep-….eu-central-1.aws.neon.tech/neondb?sslmode=require`.

## 2. API (Render)

1. At https://render.com choose **New → Blueprint** and connect this
   GitHub repository. Render reads `render.yaml`.
2. When asked, fill in:
   - `DATABASE_URL` — the Neon connection string;
   - `SUPPORT_EMAIL` — the inbox for support messages;
   - `SMTP_URL` — leave empty for now (emails are then only logged).
3. Deploy. Migrations run automatically on start. Check
   `https://<service>.onrender.com/api/health` → `{"status":"ok"}`.

The free plan sleeps after 15 minutes without requests; the first request
after that takes about a minute.

## 3. Domain

1. In Render: service → **Settings → Custom Domains → Add**
   `api.kidty.com.ua`.
2. DNS for `kidty.com.ua` is managed in the **HOSTiQ** client panel
   (Мои домены → kidty.com.ua → Управление DNS; HOSTiQ serves it through
   Cloudflare name servers, but there is no separate Cloudflare account).
   Records: four `A` records for GitHub Pages (`185.199.108–111.153`),
   `CNAME www → fe-july-91.github.io` and `CNAME api → kidty-api.onrender.com`.
3. Wait until Render shows the certificate as issued.

## 4. Website (GitHub Pages)

```bash
cd apps/web
npm run deploy     # builds with .env.production and pushes to gh-pages
```

`public/CNAME` keeps the custom domain on every deploy.

## Email (Resend)

Render's free plan blocks outgoing SMTP, so the API sends email through
Resend's HTTPS API.

1. At https://resend.com add the domain `kidty.com.ua` and copy the DNS
   records it shows (DKIM `TXT resend._domainkey`, and for the `send`
   subdomain an `MX` and an SPF `TXT`) into HOSTiQ → Управление DNS.
2. Wait until Resend shows the domain as **Verified**.
3. Create an API key with **Sending access** and set it as
   `RESEND_API_KEY` in Render → kidty-api → Environment.

`MAIL_FROM` is `Kidty <no-reply@kidty.com.ua>` (set in `render.yaml`).
