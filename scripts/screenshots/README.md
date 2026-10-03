# Home page screenshots

Regenerates the device mockups used on the home page
(`apps/web/src/assets/images/{laptop,phone,weight-card,vaccination-card}.webp`).

Requirements: the API and web dev servers running, Google Chrome installed,
Python 3 with Pillow (`pip install pillow`).

```bash
npm run db:seed:showcase -w @kidty/api      # English demo account (Emma & Leo)

# capture (uses SEED_USER_PASSWORD from apps/api/.env)
set -a; . apps/api/.env; set +a
SHOWCASE_EMAIL=showcase@kidty.local SHOWCASE_PASSWORD="$SEED_USER_PASSWORD" \
  node scripts/screenshots/capture.mjs

# frame and export into the web app's assets
python3 scripts/screenshots/compose.py
```
