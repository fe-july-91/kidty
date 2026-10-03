# Kidty

A web app for parents to track a child's height, weight, foot size, eyesight
and vaccinations, with charts built on D3.

## Structure

```
apps/web   – React 19 + Vite + Tailwind 4 + HeroUI frontend
apps/api   – Node + TypeScript backend, PostgreSQL via Prisma
```

## Getting started

Requirements: Node 22+, Docker.

```bash
npm install                      # installs all workspaces, generates Prisma client

cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env

npm run db:up                    # start PostgreSQL in Docker (localhost:5434)
npm run db:migrate               # apply migrations
npm run db:seed                  # create a demo account (see apps/api/.env)

npm run dev:api                  # http://localhost:8088/api
npm run dev:web                  # http://localhost:3000
```

Other useful commands:

- `npm run db:studio` – browse the database in Prisma Studio
- `npm run db:down` – stop the database (data is kept in a Docker volume)
- `npm run build` – build all apps
- `npm test -w @kidty/api` – API tests (use a separate `kidty_test` database)
- `EMAIL=… PASSWORD=… node scripts/smoke-auth.mjs` – login/logout smoke test in headless Chrome
- `scripts/screenshots` – regenerate the home page mockups (see its README)
