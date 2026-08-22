# Electricity Bills Archive and Analytics

Live app: https://powertrack.duckdns.org

Full-stack web application for storing electricity bills, managing addresses, and analyzing payment and consumption trends over time.

## Overview

This project is focused on:

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
- In-app bill data extraction from uploaded PDF files (auto-fill day/night consumption and total amount)
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

## Screenshots

### Home

![Home page](screenshots/home.jpg)

### Dashboard

![Dashboard page](screenshots/dashboard.jpg)

### Bills

![Bills page](screenshots/bills.jpg)

### Add Bill

![Add bill page](screenshots/add-bill.jpg)

### Add Bill from file

![Add bill page](screenshots/add-bill-from-file.jpg)

### Address

![Address page](screenshots/address.jpg)

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

## In-App PDF Bill Extraction

The Add Bill form supports direct PDF upload and attempts to auto-populate:
(only for ENERGO PRO Bulgaria customers for now)

- Day consumption (kWh)
- Night consumption (kWh)
- Total amount

Current extraction behavior:

- Uses pdfjs-dist in the client to read invoice text
- Includes handling for common Cyrillic mojibake (cp1251 decoding issues)
- Supports grouped tariff rows and split row segments
- Tries to parse multi-section invoices (including double tariff groups)
- Applies reliability checks to reduce wrong auto-imported values

If the parser cannot extract reliable values, the form keeps manual input as fallback.

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

---

# Deployment and Infrastructure

All deployment and infrastructure code lives in the `infra/` directory. The live environment runs on a single Azure Linux VM with Nginx, PostgreSQL (external), and observability stack on the same host.

## Context and Evolution

This is an educational project, so the infrastructure intentionally uses the cheapest viable Azure VM size (`Standard_B2ats_v2` by default in Terraform). That kept costs low while learning provisioning, configuration management, and release automation.

The first deployment model built the application directly on the VM:

- Git checkout on the server
- `npm ci`, Prisma generate/migrate, and `npm run build` on the VM
- PM2 process manager for the Next.js app

That workflow is preserved in `infra/ansible/playbooks/site.yml` and the `app` role for historical reference.

After adding Prometheus and Grafana for metrics, the VM hit a critical resource limit. RAM became insufficient for Node.js build, the app, Nginx, Prometheus, and Grafana at the same time. Swap helped only partially, and redeploy time grew to about **1.5 hours** per release.

The current model moves build work off the VM:

- GitHub Actions builds Docker images in CI (app + migrator)
- Images are pushed to GitHub Container Registry (GHCR)
- The VM only pulls pre-built images and runs containers

Ansible deploys via `infra/ansible/playbooks/site-docker.yml` and the `docker_app` role. The legacy Node/PM2 path remains in the repo so the infrastructure evolution can be traced over time.

## High-Level Architecture

```text
GitHub Actions (build + push image)
        |
        v
   GHCR (app + migrator images)
        |
        v
Azure VM (Ubuntu 24.04)
  ├── Nginx (reverse proxy, TLS, /healthz, /metrics)
  ├── Docker: blue/green app slots (ports 3001 / 3002)
  ├── Prometheus (dedicated Azure data disk)
  ├── Grafana (localhost only)
  └── node_exporter (host metrics)
        |
        v
External PostgreSQL database
```

## `infra/` Layout

```text
infra/
├── terraform/                 # Azure resource provisioning
│   ├── main.tf                # RG, VNet, NSG, VM, public IP, Prometheus disk
│   ├── variables.tf
│   ├── outputs.tf
│   └── terraform.tfvars.example
└── ansible/                   # Server configuration and deployment
    ├── playbooks/
    │   ├── site-docker.yml    # Current Docker-based blue/green deploy
    │   └── site.yml           # Legacy Node.js + PM2 deploy (historical)
    ├── group_vars/all/        # Shared variables and encrypted secrets (vault)
    ├── inventory.ini
    └── roles/
        ├── common             # Base packages, swap, Nginx/Certbot prerequisites
        ├── docker             # Docker engine setup
        ├── docker_app         # Pull image, run migrations, start container slot
        ├── app                # Legacy git checkout + npm build + PM2 (historical)
        ├── node               # Legacy Node.js + PM2 setup (historical)
        ├── nginx              # Reverse proxy, TLS, active slot routing
        ├── prometheus         # Prometheus install + persistent TSDB disk mount
        ├── grafana            # Grafana install + datasource/dashboard provisioning
        └── node_exporter      # Host-level metrics exporter
```

## Azure Infrastructure (Terraform)

Terraform provisions:

- Resource group, virtual network, subnet, and network security group
- Public IP with DuckDNS-friendly domain label (`powertrack.duckdns.org`)
- Single Linux VM (Ubuntu 24.04 LTS, SSH key auth)
- Dedicated managed disk for Prometheus TSDB data (mounted at `/var/lib/prometheus`)

NSG inbound rules allow SSH (restricted to a configured IP), HTTP, and HTTPS.

Example bootstrap:

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars
# edit terraform.tfvars with your Azure values
terraform init
terraform apply
```

## Ansible Deployment

The active playbook is `site-docker.yml`. It performs a blue/green rollout:

1. Deploy the new app version to the inactive slot (blue on port 3001 or green on port 3002)
2. Run Prisma migrations via a dedicated migrator image
3. Smoke-test the inactive slot locally
4. Switch Nginx traffic to the new slot
5. Roll back automatically if health checks fail

Shared deployment settings are in `infra/ansible/group_vars/all/all.yml` (domain, ports, image repository, Prometheus/Grafana paths). Sensitive values are stored in Ansible Vault (`vault.yml`).

Manual deploy example:

```bash
cd infra/ansible
ansible-playbook -i inventory.ini playbooks/site-docker.yml \
  --vault-password-file ~/.ansible_vault_pass \
  --extra-vars "image_tag=latest forced_target_color=auto"
```

## CI/CD

Production deploys are automated by `.github/workflows/build_and_deploy.yml`:

1. On push to `main` (or manual workflow dispatch), build and push:
    - `ghcr.io/<repo>:<sha>` and `:latest` (application image)
    - `ghcr.io/<repo>:migrator-<sha>` (migration runner image)
2. Run Ansible `site-docker.yml` against the Azure VM over SSH

This keeps heavy build steps (`npm ci`, Prisma generate, Next.js build) in GitHub runners instead of on the small VM.

## Metrics and Observability

Observability was added after the initial deployment and became the main driver for moving to Docker.

### Prometheus

- Installed on the VM via Ansible
- Stores metrics on a dedicated Azure managed disk (default 64 GB, 15-day retention)
- Scrapes:
    - itself (`127.0.0.1:9090`)
    - the PowerTrack app through Nginx at `/metrics` (localhost-only access enforced by Nginx)
    - `node_exporter` for host CPU, memory, disk, and network metrics

### Application Metrics

The app exposes Prometheus metrics at `/metrics` (`app/metrics/route.ts`, `lib/observability/metrics.ts`) using `prom-client`:

- Default Node.js process metrics
- Request counters, duration histograms, in-flight gauge, and error counters
- Business counters for bills and addresses (create/delete/validation)
- Registered users gauge

### Grafana

- Installed on the VM and bound to `127.0.0.1:3003` (not exposed publicly)
- Prometheus datasource and dashboards are provisioned automatically from Ansible
- Predefined dashboards in `infra/ansible/roles/grafana/files/dashboards/`:
    - `powertrack-app.json` — application health and request metrics
    - `powertrack-business.json` — bill/address activity and user counts
    - `powertrack-infra.json` — VM and host resource usage

Access Grafana locally via SSH tunnel:

```bash
ssh -L 3003:127.0.0.1:3003 <user>@<vm-public-ip>
```

Then open http://localhost:3003

### node_exporter

Host metrics are collected by `prometheus-node-exporter`, listening on `127.0.0.1:9100` and scraped by Prometheus.

---

### Screenshots

#### Azure

![Azure resource group overview](screenshots/infra/azure-resource-group.jpg)

#### Grafana Dashboards

![Grafana app dashboard](screenshots/infra/grafana-app-dashboard.jpg)

![Grafana business dashboard](screenshots/infra/grafana-business-dashboard.jpg)

![Grafana infrastructure dashboard](screenshots/infra/grafana-infra-dashboard.jpg)

## Status

The application is actively oriented around electricity bill history, consumption statistics, and payment analytics.
