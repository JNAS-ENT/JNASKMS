# AI Knowledge OS - Monorepo Documentation

## Overview
This is an enterprise-grade monorepo containing:
- **`apps/frontend`**: React 19 SPA powered by Vite 6 and Tailwind CSS.
- **`apps/backend`**: NestJS 11 REST API powered by Prisma ORM and PostgreSQL.
- **`packages/types`**: Shared enterprise TypeScript models and type declarations.
- **`packages/utils`**: Reusable validation patterns, date formatters, and helper utilities.
- **`packages/ui`**: High-performance, design-consistent reusable React component library.
- **`packages/shared`**: Re-export engine bundling common types and utilities into a single dependency.

## Monorepo Architecture
All dependencies are handled via **npm workspaces** at the root of the project to enable atomic, zero-overhead packages.
```text
                          ┌───────────────────────────┐
                          │    knowledge-os root      │
                          └─────────────┬─────────────┘
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 ▼                                             ▼
        ┌──────────────────┐                          ┌──────────────────┐
        │  apps/frontend   │                          │   apps/backend   │
        └────────┬─────────┘                          └────────┬─────────┘
                 │                                             │
                 └─────────┬──────────────┬────────────────────┘
                           ▼              ▼
                 ┌─────────────────┐ ┌─────────────────┐
                 │  packages/ui    │ │ packages/shared │
                 └─────────────────┘ └────────┬────────┘
                                              │
                                    ┌─────────┴─────────┐
                                    ▼                   ▼
                           ┌─────────────────┐ ┌─────────────────┐
                           │ packages/types  │ │ packages/utils  │
                           └─────────────────┘ └─────────────────┘
```

## Running the Application
To run the frontend dev environment:
```bash
npm run dev
```

To run the backend NestJS environment:
```bash
npm run dev --workspace=apps/backend
```
