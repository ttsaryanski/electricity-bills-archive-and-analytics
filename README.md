# Electricity Bills Archive and Analytics

Full-stack web application for storing electricity bills, managing addresses, and analyzing payment and consumption trends over time.

## Overview

This project is no longer an inventory system. It is now focused on:

- Monthly electricity bill archiving
- Day and night kWh consumption tracking
- Bill amount analysis
- Period-based price comparison
- Multi-address support per user

The application is built with Next.js App Router, Prisma, PostgreSQL, Clerk authentication, and chart-based analytics.

## Core Features

- Secure sign-in and sign-up with Clerk
- Per-user isolated data model
- Address management with a required primary address
- Bill CRUD with validation and duplicate prevention (unique user+address+month+year)
- Paginated bill listing with year filtering
- Dashboard with:
    - Last-month metrics and trend deltas
    - 12-month consumption and bill charts
    - Full-history bill chart
    - Highest and lowest consumption month highlights
    - Price period impact analytics
- PDF extraction scripts for invoice data normalization (BGN and EUR workflows)

## Tech Stack

- Next.js 16.2.6 (App Router)
- React 19.2.4
- TypeScript 5
- Tailwind CSS 4
- Prisma 7.8.0
- PostgreSQL
- Clerk (@clerk/nextjs)
- Recharts
- Zod

## Main Routes

- / : Landing page
- /dashboard : Consolidated analytics dashboard
- /bills : Bills table, search and pagination
- /add-bill : Create new bill for the active primary address
- /address : Manage addresses and set primary address
- /sign-in and /sign-up : Authentication pages

## Data Model (Prisma)

Defined in prisma/schema.prisma.

- User
    - id, email, createdAt
    - relations: bills, addresses
- Address
    - id, address, isPrimary, createdAt, updatedAt, userId
    - unique per user: (userId, address)
- Bill
    - id, month, year, period, total
    - day_consumption_kwh, night_consumption_kwh, total_consumption_kwh
    - addressId, userId, createdAt, updatedAt
    - unique: (userId, addressId, year, month)
- Price
    - id, day_price, night_price, period_start, period_end, createdAt, updatedAt

## Project Structure

```text
nextjs/
├── app/                    # Next.js pages and route segments
├── components/             # Reusable UI components
├── interfaces/             # Shared TypeScript interfaces
├── lib/                    # Analytics and utility modules
│   ├── bill/               # Bill analytics/statistics helpers
│   └── price/              # Price analytics logic
├── repositories/           # Database access layer
├── services/               # Server actions and business logic
├── validators/             # Zod schemas
├── prisma/                 # Prisma schema, migrations, seed
├── pdf_extractor/          # Invoice PDF extraction scripts
└── db-query.sql            # Optional SQL import examples
```

## Getting Started

### 1. Prerequisites

- Node.js 18+
- npm
- PostgreSQL database

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create .env.local in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="YOUR_CLERK_PUBLISHABLE_KEY"
CLERK_SECRET_KEY="YOUR_CLERK_SECRET_KEY"
```

### 4. Apply Migrations

```bash
npx prisma migrate dev
```

### 5. Generate Prisma Client (if needed)

```bash
npx prisma generate
```

### 6. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Development Commands

- npm run dev : Start dev server
- npm run build : Create production build
- npm run start : Start production server
- npm run lint : Run ESLint
- npx prisma studio : Inspect database data
- npx prisma migrate status : Check migration state

## Data Import Workflows

### SQL Batch Import

db-query.sql contains ready-to-adapt SQL inserts for prices and bills.

### PDF Extraction

The project includes two extraction pipelines:

- pdf_extractor/BGN/extract_energo_pro_bgn.py
- pdf_extractor/EURO/extract_energo_pro_euro.py

These scripts:

- parse invoice PDFs
- extract day/night kWh and total amount
- derive normalized monthly period (previous month)
- export summary files (Excel or CSV fallback)

To run a script, place PDFs in the corresponding folder and execute:

```bash
python extract_energo_pro_bgn.py
```

or

```bash
python extract_energo_pro_euro.py
```

## Architecture Notes

- app: Routing and page composition
- services: Server-side orchestration and validation handling
- repositories: Prisma-only database operations
- lib/bill and lib/price: Analytics calculations for dashboard components
- validators: Request validation and error messaging

## Authentication and Access

Protected routes are enforced by Clerk middleware in proxy.ts.

Current protected areas include:

- /dashboard
- /bills
- /add-bill
- /address

## Status

The application is actively oriented around electricity bill history, consumption statistics, and payment analytics.
