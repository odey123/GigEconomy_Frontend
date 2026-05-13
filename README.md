# GigEconomy Nigeria

Micro-employment infrastructure for Nigeria — connecting small businesses with flexible helpers, powered by Squad.

## What it does

GigEconomy Nigeria is a two-sided marketplace that lets small business owners post flexible gigs (sales commission or one-off tasks) and get matched with skilled local helpers. The platform handles matching, contracts, and payments end-to-end.

**Owners** post gigs, review AI-matched applicants, approve helpers, and track earnings.  
**Helpers** browse matched gigs, apply, and get paid securely through Squad.

## Stack

- **React 18** + **TypeScript**
- **Vite** — build tooling
- **Tailwind CSS v4** — styling
- **shadcn/ui** (Radix UI) — component library
- **React Router v7** — client-side routing
- **react-hook-form** — form handling
- **Recharts** — data visualisation
- **Squad** — payment infrastructure

## Getting started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`.

Create a `.env` file to point at your backend:

```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## Project structure

```
src/
├── app/
│   ├── components/
│   │   ├── ui/          # shadcn/ui primitives
│   │   └── figma/       # Figma-exported helpers
│   ├── pages/           # One file per route
│   └── routes.ts        # React Router config
├── lib/
│   └── api.ts           # Typed fetch client + ApiError
├── types/
│   └── index.ts         # Shared TypeScript interfaces
├── styles/              # Global CSS + Tailwind entry
└── main.tsx
```

## Key pages

| Route | Page |
|---|---|
| `/` | Landing |
| `/signup` | Sign up (owner or helper) |
| `/verify-bvn` | BVN identity verification |
| `/dashboard` | Owner dashboard |
| `/helper-dashboard` | Helper matched gigs feed |
| `/post-gig` | Post a new gig |
| `/gig/:id` | Gig detail (helper view) |
| `/gig/:id/applicants` | Applicants list (owner view) |
| `/gig/:id/applicants/:applicantId` | Applicant detail + approve/reject |

## Colour tokens

| Token | Value | Use |
|---|---|---|
| Primary | `#1F5F5B` | CTAs, active states, teal brand |
| Accent | `#F4B942` | Badges, highlights, amber brand |
| Text | `#1a1a1a` | Body text |
| Muted | `#6b7280` | Secondary text |
| Border | `#e5e7eb` | Card borders |
| Background | `#f9fafb` | Page background |
