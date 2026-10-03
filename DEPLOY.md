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
2. At the DNS provider of `kidty.com.ua` add the record Render shows
   (a `CNAME` from `api` to `<service>.onrender.com`).
3. Wait until Render shows the certificate as issued.

## 4. Website (GitHub Pages)

```bash
cd apps/web
npm run deploy     # builds with .env.production and pushes to gh-pages
```

`public/CNAME` keeps the custom domain on every deploy.

## Email (later)

Set `SMTP_URL` on Render to an SMTP provider (e.g. Resend, Brevo or Postmark;
the sending domain has to be verified with DNS records) and `MAIL_FROM` to
an address on that domain. Until then password reset emails are not sent.
