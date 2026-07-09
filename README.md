# Enterprise AI Knowledge Operating System (Knowledge OS) - Monorepo

Welcome to the **Enterprise AI Knowledge OS** monorepo workspace. The codebase has been refactored from a mixed monolithic structure into a robust, scalable, enterprise-grade workspace leveraging **npm workspaces** and **TypeScript paths** for seamless code reuse.

---

## 📂 Target Monorepo Folder Structure

```text
knowledge-os/                          # Workspace Root
│
├── apps/
│   ├── frontend/                     # React Single Page Application (SPA)
│   │   ├── public/                   # Static public assets
│   │   ├── src/                      # React source files (App, features, etc.)
│   │   ├── package.json              # Frontend workspace manifest
│   │   ├── vite.config.ts            # Vite 6 + Tailwind CSS configurations
│   │   └── tsconfig.json             # Frontend TypeScript compilation rules
│   │
│   └── backend/                      # NestJS REST API
│       ├── src/                      # NestJS source (modules, controllers, guards)
│       ├── prisma/                   # Prisma ORM schema and migrations
│       ├── package.json              # Backend workspace manifest
│       └── tsconfig.json             # Backend TypeScript compilation rules
│
├── packages/                         # Shared Local Packages (Atomic Reuse)
│   ├── types/                        # Core Data Models and Type Interfaces
│   ├── utils/                        # Shared Helper/Utility Functions
│   ├── ui/                           # Design System / Consistent UI Component Library
│   └── shared/                       # Combined entrypoint re-exporting types & utils
│
├── docs/                             # Architecture and API documentation
├── docker/                           # Dockerfiles and orchestration files
├── scripts/                          # Build/Automation shell scripts
├── .github/                          # CI/CD Workflows (GitHub Actions)
├── package.json                      # Workspace Root package.json
└── tsconfig.json                     # Workspace Root tsconfig.json (paths resolution)
```

---

## 📦 Workspace Package Configurations

### Root Workspace Manifest (`/package.json`)
```json
{
  "name": "knowledge-os",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "npm run dev --workspace=apps/frontend",
    "build": "npm run build --workspace=apps/frontend",
    "preview": "npm run preview --workspace=apps/frontend",
    "clean": "rm -rf dist apps/frontend/dist apps/backend/dist packages/*/dist",
    "lint": "tsc --noEmit"
  }
}
```

### Frontend Manifest (`/apps/frontend/package.json`)
```json
{
  "name": "frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "tsc --noEmit"
  }
}
```

### Backend Manifest (`/apps/backend/package.json`)
```json
{
  "name": "backend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "tsx src/main.ts",
    "build": "tsc --build",
    "start": "node dist/src/main.js"
  }
}
```

---

## 🛠️ Step-by-Step Migration and File Actions

1. **Relocated backend codebase:**
   - Moved `/backend` to `/apps/backend` (NestJS REST API framework).
   - Relocated `/backend/prisma` and `/backend/src`.
   - Updated `/apps/backend/tsconfig.json` to compile into local `./dist`.
   
2. **Relocated frontend codebase:**
   - Moved `/src` to `/apps/frontend/src`.
   - Moved `/index.html` to `/apps/frontend/index.html`.
   - Moved `/vite.config.ts` to `/apps/frontend/vite.config.ts`.
   
3. **Structured shared packages:**
   - Designed `/packages/types` to host common models matching `apps/frontend/src/types/index.ts`.
   - Designed `/packages/utils` to provide utility methods (`formatDate`, `truncateText`, `capitalize`).
   - Designed `/packages/ui` to house standardized, design-consistent React UI components (`Button`, `Card`).
   - Designed `/packages/shared` as a bundle to easily aggregate types and utils.
   
4. **Altered configurations for 100% platform compatibility:**
   - Updated `/apps/frontend/vite.config.ts` to output compile builds to `path.resolve(__dirname, '../../dist')` ensuring the server serves static SPA code flawlessly.
   - Set up root level dev command to map directly to `npm run dev --workspace=apps/frontend` which runs on port `3000`.

---

## 🚀 Deployment Instructions

### Frontend (Netlify)
- **Build Command:** `npm run build --workspace=apps/frontend`
- **Publish Directory:** `dist`

### Backend (Render)
- **Build Command:** `npm install && npm run build --workspace=apps/backend`
- **Start Command:** `npm run start --workspace=apps/backend`

### Database (Neon PostgreSQL)
Configure `DATABASE_URL` in environment variables:
`DATABASE_URL="postgresql://user:pass@ep-host.neon.tech/db?sslmode=require"`
