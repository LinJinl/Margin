const { execFileSync } = require('node:child_process');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const sourceApp = path.join(root, 'dist', 'mac-arm64', 'Margin.app');
const applicationsDir = path.join(os.homedir(), 'Applications');
const targetApp = path.join(applicationsDir, 'Margin.app');

const main = async () => {
  await fs.access(sourceApp);
  await fs.mkdir(applicationsDir, { recursive: true });
  await fs.rm(targetApp, { recursive: true, force: true });

  execFileSync('ditto', [sourceApp, targetApp], { stdio: 'inherit' });
  execFileSync('xattr', ['-cr', targetApp], { stdio: 'ignore' });
  execFileSync('codesign', ['--force', '--deep', '--sign', '-', targetApp], { stdio: 'inherit' });

  console.log(`Installed Margin to ${targetApp}`);
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
