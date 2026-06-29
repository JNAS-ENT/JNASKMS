# Multistage Build for Monorepo
FROM node:22-alpine AS base

WORKDIR /app

# Copy root configurations and workspace settings
COPY package.json package-lock.json ./
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/

# Install dependencies for all workspaces
RUN npm ci

# Copy source files
COPY . .

# Build all packages and applications
RUN npm run build

# --- Frontend Serve stage ---
FROM nginx:alpine AS frontend-serve
COPY --from=base /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# --- Backend Run stage ---
FROM node:22-alpine AS backend-run
WORKDIR /app
COPY --from=base /app /app
EXPOSE 3000
CMD ["npm", "run", "start", "--workspace=apps/backend"]
