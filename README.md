# Ascend Tuition — Admin Portal

A web app for Ascend Tuition staff to manage user accounts, tutors, package pricing, and view
payments/enrollments/referrals across the whole platform. Built with React, TypeScript, and Vite.
Talks to the same backend API as the mobile app (`../server`).

## Getting started

```bash
yarn install
cp .env.example .env   # defaults to https://ascend-tuition-server.onrender.com/api
yarn dev
```

Sign in with an existing admin account. There's no self-signup for admin accounts by design;
provision the first account through a trusted production setup script or directly in the database.

## Production build

```bash
yarn build   # outputs static files to dist/
```

`dist/` is a static site — deploy it to any static host (Render Static Site, Netlify, Vercel, etc.)
pointed at this repo. `VITE_API_URL` defaults to `https://ascend-tuition-server.onrender.com/api`.

## What's here (minimal v1 — no analytics dashboards yet)

- Overview — account/enrollment/revenue counts.
- Users — every account, with deactivate/reactivate.
- Tutors — list + create new tutor accounts (the only way tutor logins get created).
- Students / Parents — read-only directories.
- Packages — pricing and lesson-bundle management (create, edit, retire).
- Enrollments / Payments / Referrals — read-only, platform-wide views.
