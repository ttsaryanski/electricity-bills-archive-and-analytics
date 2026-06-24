# Inventory Management System

A modern, full-stack inventory management application built with Next.js, Prisma, and PostgreSQL. Track products, monitor stock levels, and gain valuable insights through an intuitive dashboard.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Setup](#environment-setup)
    - [Database Setup](#database-setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Development](#development)
- [Contributing](#contributing)
- [Support](#support)

## Features

- **Product Management**: Create, view, and manage inventory products with SKU tracking
- **Real-time Dashboard**: Monitor key metrics including total products, low-stock alerts, and inventory value
- **Analytics**: Track weekly product trends with interactive charts
- **Low-Stock Alerts**: Automatic detection and notification of products running low on inventory
- **Search & Filter**: Paginated product search with case-insensitive filtering
- **User Authentication**: Secure user management with Clerk authentication
- **Responsive Design**: Mobile-friendly interface built with TailwindCSS
- **Multi-user Support**: Each user maintains their own isolated inventory

## Tech Stack

### Frontend

- **Next.js 16.2.6** - React 19 App Router framework
- **TailwindCSS 4** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Recharts** - React charting library for analytics

### Backend

- **Prisma 7.8.0** - ORM for PostgreSQL
- **PostgreSQL** - Relational database (via Neon adapter)
- **Clerk** - Authentication and user management

### Development

- **TypeScript 5** - Type-safe development
- **ESLint 9** - Code linting
- **Next.js 16.2.6** - Built-in development server

## Getting Started

### Prerequisites

- **Node.js** 18+ (with npm or yarn)
- **PostgreSQL** database (local or cloud-hosted)
- **Git** for version control

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd nextjs
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

### Environment Setup

Create a `.env.local` file in the project root with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/inventory_db

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### Database Setup

1. Set up the database schema:

```bash
npm run prisma migrate dev
```

2. (Optional) Seed the database with sample data:

```bash
npm run prisma db seed
```

## Usage

### Starting the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

### Key Features Walkthrough

**Dashboard**

- Access at `/dashboard` to view inventory overview
- See key metrics: total products, low-stock count, inventory value
- Review weekly product trends in the analytics chart

**Product Management**

- Navigate to `/inventory` to browse all products
- Use the search bar to filter products by name
- Add new products at `/add-product` with name, SKU, price, and quantity

**Settings**

- Manage account settings at `/settings`
- View and update user preferences

## Project Structure

```
nextjs/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx            # Root layout with navigation
│   ├── page.tsx              # Home page
│   ├── dashboard/            # Dashboard page
│   ├── inventory/            # Product inventory page
│   ├── add-product/          # Product creation page
│   ├── settings/             # User settings
│   ├── sign-in/              # Authentication page
│   └── sign-up/              # Registration page
├── components/               # Reusable React components
│   ├── products.charts.tsx   # Chart components
│   └── pagination.tsx        # Pagination component
├── lib/                      # Utility functions
│   ├── auth.ts              # Authentication helpers
│   ├── prisma.ts            # Prisma client instance
│   └── product/             # Product-related utilities
├── repositories/             # Data access layer
│   └── product.repository.ts # Product database queries
├── services/                 # Business logic layer
│   └── product.services.ts   # Product service functions
├── prisma/                   # Database schema and migrations
│   ├── schema.prisma        # Data models
│   └── migrations/          # Migration history
├── proxy.ts                  # Route protection with Clerk
└── public/                   # Static assets
```

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint code linting

### Architecture Overview

The project follows a layered architecture:

- **Pages** (`app/`) - User-facing routes and views
- **Services** (`services/`) - Business logic and orchestration
- **Repositories** (`repositories/`) - Direct database access with Prisma
- **Components** (`components/`) - Reusable UI elements
- **Utils** (`lib/`) - Helper functions and configurations

### Database Models

**Product**

```typescript
- id: String (CUID)
- name: String
- sku: String (unique, optional)
- price: Decimal (12,2)
- quantity: Int
- lowStockAt: Int (optional)
- userId: String (foreign key)
- createdAt: DateTime
- updatedAt: DateTime
```

**User**

```typescript
- id: String
- email: String (unique)
- createdAt: DateTime
- products: Product[] (relation)
```

## Contributing

We welcome contributions! To get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please ensure:

- Code follows the existing style and conventions
- All changes are tested
- Commit messages are clear and descriptive
- Pull requests include a description of changes

## Support

For questions, issues, or suggestions:

- **Documentation**: Check existing code comments and TypeScript types
- **Issues**: Open a GitHub issue with detailed information
- **Discussions**: Use GitHub Discussions for questions and ideas

## License

This project is licensed under the MIT License - see the LICENSE file for details.
