const { spawn } = require('child_process');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const viteBin = path.join(projectRoot, 'node_modules', 'vite', 'bin', 'vite.js');

console.log('Starting custom clean Vite dev server...');
console.log('Project root:', projectRoot);
console.log('Vite binary:', viteBin);

// Spawn Vite server with explicit, clean arguments
// Completely ignoring any forwarded CLI arguments like '3000' or '0.0.0.0'
const child = spawn('node', [
  viteBin,
  '--port', '3000',
  '--host', '0.0.0.0'
], {
  cwd: path.join(projectRoot, 'apps/frontend'),
  stdio: 'inherit'
});

child.on('close', (code) => {
  console.log(`Vite server process closed with code ${code}`);
  process.exit(code || 0);
});

child.on('error', (err) => {
  console.error('Failed to start Vite server:', err);
  process.exit(1);
});
