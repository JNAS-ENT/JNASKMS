const { spawn } = require('child_process');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const viteBin = path.join(projectRoot, 'node_modules', 'vite', 'bin', 'vite.js');

console.log('Starting custom clean multi-service dev server...');
console.log('Project root:', projectRoot);
console.log('Vite binary:', viteBin);

// 1. Spawn NestJS Backend on port 3001
console.log('Booting NestJS backend service on port 3001...');
const backend = spawn('npx', [
  'tsx',
  'src/main.ts'
], {
  cwd: path.join(projectRoot, 'apps/backend'),
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: '3001',
    NODE_ENV: 'development',
  }
});

backend.on('error', (err) => {
  console.error('Failed to start NestJS backend:', err);
});

// 2. Spawn Vite Frontend on port 3000
console.log('Booting Vite frontend service on port 3000...');
const frontend = spawn('node', [
  viteBin,
  '--port', '3000',
  '--host', '0.0.0.0'
], {
  cwd: path.join(projectRoot, 'apps/frontend'),
  stdio: 'inherit'
});

frontend.on('close', (code) => {
  console.log(`Vite server process closed with code ${code}`);
  backend.kill();
  process.exit(code || 0);
});

frontend.on('error', (err) => {
  console.error('Failed to start Vite server:', err);
  backend.kill();
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('Shutting down dev services...');
  backend.kill();
  frontend.kill();
  process.exit(0);
});
