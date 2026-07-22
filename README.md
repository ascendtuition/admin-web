# Ascend Tuition — Admin Portal

A web app for Ascend Tuition staff to manage user accounts, tutors, package pricing, and view
payments/enrollments/referrals across the whole platform. Built with React, TypeScript, and Vite.
Talks to the same backend API as the mobile app (`../server`).

## Getting started

```bash
yarn install
cp .env.example .env   # point VITE_API_URL at your running server (defaults to localhost:8080/api)
yarn dev
```

Sign in with an admin account — the demo seed script (`server/scripts/seedDemoData.ts`) creates one
at `admin@ascendtuition.test` / `Password123!`. There's no self-signup for admin accounts (by
design); create additional ones directly in the database or via a trusted script.

## Production build

```bash
yarn build   # outputs static files to dist/
```

`dist/` is a static site — deploy it to any static host (Render Static Site, Netlify, Vercel, etc.)
pointed at this repo, with `VITE_API_URL` set to your deployed backend's `/api` URL.

## What's here (minimal v1 — no analytics dashboards yet)

- Overview — account/enrollment/revenue counts.
- Users — every account, with deactivate/reactivate.
- Tutors — list + create new tutor accounts (the only way tutor logins get created).
- Students / Parents — read-only directories.
- Packages — pricing and lesson-bundle management (create, edit, retire).
- Enrollments / Payments / Referrals — read-only, platform-wide views.
