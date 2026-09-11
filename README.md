# statnativ-enablesgroup-dashboard

Client-facing project dashboard for the enablesGROUP (enableSME) India entity
establishment engagement. Built per
[`Statnativ_enablesGROUP_Client_Dashboard_Deployment_Guide.md`](../Statnativ.github.io/Statnativ_enablesGROUP_Client_Dashboard_Deployment_Guide.md).

This is a standalone project/repo, deliberately separate from the
`statnativ.github.io` public site repo.

## Stack

- React + Vite
- React Router (client-side routes: `/login`, `/dashboard`, `/dashboard/documents`,
  `/dashboard/actions`, `/dashboard/timeline`, `/dashboard/risks`)
- Supabase (Auth + Postgres + Row Level Security) — see `supabase/schema.sql`

## Local development

```bash
npm install
npm run dev
```

### Demo mode

If `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are not set, the app runs in
**demo mode**: any email/password signs in locally, and all data comes from
`src/data/seedData.js` instead of a live database. This lets the UI be built
and reviewed before a Supabase project exists. A banner is shown whenever demo
mode is active.

### Connecting to real Supabase

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor (tables + Row Level Security).
3. Run `supabase/seed.sql` to load the initial enableSME engagement data
   (regenerate it from `src/data/seedData.js` with
   `node scripts/generate-seed-sql.mjs` if you change the seed).
4. Copy `.env.example` to `.env.local` and fill in the project URL and anon key.
5. Restart `npm run dev`.

The very first admin (`user_client_access` row) for a client must be inserted
from the Supabase SQL editor or with the service-role key — see the note at
the bottom of `supabase/schema.sql`.

### Creating the enableSME users

`scripts/create-users.mjs` creates every dashboard account (1 admin + 6
read-only) and grants each the right role in one run. It needs your
Supabase **service-role key** (Project Settings → API), which must never be
committed or shared — put it in a git-ignored `.env.server.local` (or pass
env vars inline) and run:

```bash
node scripts/create-users.mjs
```

See the comments at the top of that file for the exact env vars and a note
on why a shared password across every read-only account is worth moving off
of once initial access is sorted (per the deployment guide §3/§8, individual
credentials — ideally via Supabase's invite-email flow — are the intended
end state).

## Data model & security notes

- The `documents` table stores **status only** — never upload passports,
  Aadhaar, PAN, bank statements, or signatures into this app.
- Authorization is enforced by Postgres Row Level Security via
  `user_client_access`, not just by hiding UI — see `supabase/schema.sql`.
- Never commit `.env`/`.env.local`, Supabase service-role keys, or production
  secrets.

## Deployment

Target: Cloudflare Pages, custom domain `enablesgroup.statnativ.com`, build
command `npm run build`, output directory `dist`. Full steps in the
deployment guide sections 12–13.
