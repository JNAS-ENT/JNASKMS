#!/bin/bash
set -e

echo "=== Installing dependencies for all workspaces ==="
npm install

echo "=== Building shared packages ==="
npm run build --workspace=packages/types
npm run build --workspace=packages/utils
npm run build --workspace=packages/ui
npm run build --workspace=packages/shared

echo "=== Building application workspaces ==="
npm run build --workspace=apps/frontend
npm run build --workspace=apps/backend

echo "=== Build finished successfully ==="
