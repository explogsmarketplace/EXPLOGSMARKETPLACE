# Explogs Marketplace

Landing page and admin panel for a manual-payment digital account marketplace.

## Stack

- React (Vite) + Tailwind CSS
- Custom shadcn-style UI primitives (Radix UI primitives underneath: Slot, Label, Switch)
- Framer Motion for scroll-reveal and hover animations
- React Router for `/` (public landing) and `/explogs-admin` (admin panel)
- `class-variance-authority`, `clsx`, `tailwind-merge` for the component variant system (standard shadcn/ui tooling)
- `lucide-react` for icons
Java , Spring 

## Setup

```bash
npm install
cp .env.example .env   # fill in real bank details and admin password
npm run dev
```

## Config

All bank details, the WhatsApp number, and admin credentials live in `src/config/site.js`, which
reads from environment variables (`.env`). Nothing is hardcoded in components. Up to two bank
accounts are supported (`VITE_BANK_1_*` / `VITE_BANK_2_*`); the "Pay to Bank" step on the landing
page renders whichever ones are filled in.

## Data

Listings are seeded from `src/data/listings.seed.js` and persisted to `localStorage` via
`src/lib/listingsStore.js`. That module is the only place that touches storage — all reads/writes
are `async` functions (`getListings`, `addListing`, `toggleStock`, `deleteListing`) so it can be
swapped for a Firestore-backed implementation later without touching any components.

## Admin panel

Visit `/explogs-admin` (not linked anywhere publicly). Gated by a simple client-side email/password
check against `VITE_ADMIN_EMAIL` / `VITE_ADMIN_PASSWORD`, session stored in `sessionStorage`. This
is not real backend auth — fine for a single-seller admin at this stage, should be upgraded when a
real backend/auth provider is introduced.

From the dashboard the seller can toggle stock status per listing and add new listings (name,
description, category icon, price for internal reference only, price is never shown publicly).
