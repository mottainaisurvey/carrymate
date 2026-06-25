# CarryMate — Monorepo

Diaspora Logistics Marketplace. Peer-to-peer parcel delivery via trusted travelers.

## Architecture

```
carrymate/
├── apps/
│   ├── web/          ← Next.js 14 — sender portal + marketing site (Vercel)
│   ├── mobile/       ← Expo (React Native) — traveler + sender iOS/Android app
│   └── admin/        ← Next.js 14 — super admin panel (Vercel, admin.carrymate.io)
├── packages/
│   ├── db/           ← Drizzle ORM schema + Supabase client (PostgreSQL)
│   └── api/          ← Shared tRPC AppRouter type
└── server/           ← Fastify + tRPC API (Railway)
```

## Stack

| Layer | Technology |
|---|---|
| Web frontend | Next.js 14, React 18, Tailwind CSS |
| Mobile | Expo SDK 52, React Native 0.76 |
| Backend API | Fastify 5, tRPC 11, TypeScript |
| Database | Supabase (PostgreSQL), Drizzle ORM |
| Auth | Supabase Auth |
| Cache | Upstash Redis |
| File storage | AWS S3 (af-south-1) |
| Web hosting | Vercel |
| API hosting | Railway |
| Monorepo | pnpm workspaces + Turborepo |

## Environments

| Environment | Web | API | Database |
|---|---|---|---|
| Staging | staging.carrymate.io | api-staging.carrymate.io | Supabase `Carrymate` project |
| Production | carrymate.io | api.carrymate.io | Supabase `Carrymate Production` project |

## Getting Started

### Prerequisites
- Node.js 22+
- pnpm 9+
- Supabase account with `Carrymate` project created

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/mottainaisurvey/carrymate.git
cd carrymate

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL, etc.

# 4. Push schema to Supabase
pnpm --filter @carrymate/db run db:push

# 5. Seed staging data
pnpm --filter @carrymate/db run db:seed

# 6. Start all services
pnpm dev
```

### Individual services

```bash
# API server only (port 4000)
pnpm --filter @carrymate/server run dev

# Web app only (port 3000)
pnpm --filter @carrymate/web run dev

# Admin panel only (port 3001)
pnpm --filter @carrymate/admin run dev

# Mobile app
pnpm --filter @carrymate/mobile run dev
```

## Database

Schema is defined in `packages/db/src/schema/index.ts`.

```bash
# Generate migration SQL after schema changes
pnpm --filter @carrymate/db run db:generate

# Push schema directly to Supabase (staging only)
pnpm --filter @carrymate/db run db:push

# Open Drizzle Studio (visual DB browser)
pnpm --filter @carrymate/db run db:studio

# Seed staging data
pnpm --filter @carrymate/db run db:seed
```

## Deployment

### API → Railway
Railway auto-deploys from the `develop` branch (staging) and `main` branch (production).
Environment variables are set in the Railway dashboard.

### Web + Admin → Vercel
Vercel auto-deploys from the `develop` branch (staging) and `main` branch (production).
Environment variables are set in the Vercel dashboard.

### Mobile → Expo EAS
```bash
# Preview build (internal testing)
pnpm --filter @carrymate/mobile run build:preview

# Production build
pnpm --filter @carrymate/mobile run build:production
```

## Branch Strategy

```
main          ← production, protected, no direct pushes
develop       ← staging, all PRs merge here first
feature/*     ← individual feature branches
```

## Phase Progress

- [x] Phase 1M — Monorepo scaffold, PostgreSQL schema, Supabase migration
- [ ] Phase 2M — Next.js web app (sender portal + marketing)
- [ ] Phase 3M — Fastify API (auth, bookings, matching, escrow)
- [ ] Phase 4M — Expo mobile app (traveler + sender)
- [ ] Phase 5M — Admin panel port
- [ ] Phase 6M — QA, E2E tests, staging deployment
