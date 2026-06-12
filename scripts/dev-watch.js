const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const electronBin = path.join(root, 'node_modules', '.bin', 'electron');
const watchedFiles = ['main.js', 'preload.js', 'index.html'].map((file) => path.join(root, file));

let child;
let restartTimer;
let shuttingDown = false;

const start = () => {
  child = spawn(electronBin, ['.'], {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...process.env,
      MARGIN_DEV: '1',
    },
  });

  child.on('exit', (code, signal) => {
    if (!shuttingDown && code !== 0 && signal !== 'SIGTERM') {
      console.log(`[margin-dev] Electron exited with code ${code || signal}`);
    }
  });
};

const stop = () => {
  if (child && !child.killed) {
    child.kill('SIGTERM');
  }
};

const restart = (filePath) => {
  clearTimeout(restartTimer);
  restartTimer = setTimeout(() => {
    console.log(`[margin-dev] Restarting after ${path.basename(filePath)} changed`);
    stop();
    setTimeout(start, 250);
  }, 120);
};

for (const filePath of watchedFiles) {
  fs.watch(filePath, { persistent: true }, () => restart(filePath));
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    shuttingDown = true;
    stop();
    process.exit(0);
  });
}

console.log('[margin-dev] Watching main.js, preload.js, and index.html');
start();
