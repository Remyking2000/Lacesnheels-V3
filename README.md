# Laces & Heels V2

React 18 + TypeScript storefront for Laces & Heels, built with Vite, Tailwind CSS, shadcn/ui-style primitives, Zustand, TanStack Query, Drizzle, and Neon-ready PostgreSQL migrations.

## Project Structure

- `frontend/` - Vite, React, TypeScript, Tailwind, routes, UI components, stores, and tests.
- `backend/` - Drizzle schema, SQL migrations, and Neon seed script.
- Root config - shared package scripts, lockfile, ESLint, and TypeScript project references.

## Stack

- React 18, React DOM, TypeScript, Vite, `@vitejs/plugin-react-swc`
- `react-router-dom` for routes
- Zustand for cart and wishlist state
- TanStack Query for server-state wiring
- Tailwind CSS, `tailwind-merge`, `tailwindcss-animate`, `@tailwindcss/typography`, CVA
- Radix UI primitives, lucide-react, sonner, cmdk, vaul, embla-carousel-react, Recharts
- React Hook Form, Zod, `@hookform/resolvers`
- Drizzle ORM, drizzle-kit, Neon serverless driver, SQL migrations
- Vitest, Testing Library, jsdom, ESLint

## Run Locally

```bash
npm install
npm run dev
```

Then open the Vite URL printed in the terminal.

## Build

```bash
npm run build
```

## Database

Create `.env` from `.env.example`, set `DATABASE_URL`, then run:

```bash
npm run db:migrate
npm run db:seed
```

Raw SQL migrations live in `backend/db/migrations`.

## Before Launch

- Replace `VITE_WHATSAPP_NUMBER` with the real WhatsApp number.
- Replace placeholder product data, prices, colours, stock details, and proof content.
- Move external image URLs to owned assets or a managed CDN for production reliability.
