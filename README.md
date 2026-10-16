# Debre Logistics

Marketing site, booking flow, live tracking and an admin dispatch
dashboard for Debre Logistics, a fictional Ethiopian freight and
courier company based in Adama.

Built with Next.js 14 (App Router), TypeScript, Prisma and SQLite.

## Features

- Editorial design: paper background, serif headlines, mono data,
  printed rate tables
- Dark mode toggle (sun/moon SVG icons) with no flash on load;
  system preference default, choice saved in localStorage
- Booking form with a live price quote that updates as you type
- Tracking page with printable waybill (browser print styles hide
  the site chrome)
- Admin dispatch dashboard at /admin: login, per-status stats,
  live search over shipments, one-click status updates
- Contact form saved to the database
- Security basics: signed HTTP-only session cookie, timing-safe
  password comparison, server-side validation on every route

## Quick start

    npm install
    cp .env.example .env
    npm run db:push
    npm run db:seed
    npm run dev

Then open http://localhost:3000.

## Upgrading an existing project

If your dev.db was created with an older schema, run this once
(it adds missing columns without deleting your data):

    npx prisma db push

## Demo data

The seed script creates five shipments with fixed tracking codes:

    DBR-A1B2C3  delivered
    DBR-D4E5F6  in transit
    DBR-G7H8I9  picked up
    DBR-J0K1L2  pending
    DBR-M3N4O5  at hub

Try any of them on the /track page.

## Admin

Visit /admin and sign in with ADMIN_PASSWORD from .env
(default: debre-admin-2024). Change it in .env before deploying.

## Environment variables

    DATABASE_URL      SQLite file, e.g. "file:./dev.db"
    ADMIN_PASSWORD    password for the /admin dashboard
    SESSION_SECRET    long random string used to sign the session cookie

## Project layout

    app/            pages and API routes
    components/     Header, Footer, ThemeToggle, PrintButton
    lib/            prisma client, auth, shared utils
    prisma/         schema and seed script
