const fs = require('fs');
const path = require('path');

const ROOT = __dirname ? path.resolve(__dirname, '..') : process.cwd();
const OUT = path.join(ROOT, 'public');

const EXCLUDE = new Set([
  'public',
  '.vercel',
  'node_modules',
  'scripts',
  'package.json',
  'package-lock.json',
  'vercel.json', // keep config at root; not needed inside public
]);

function copyRecursive(srcDir, destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const name = entry.name;
    if (EXCLUDE.has(name)) continue;
    const srcPath = path.join(srcDir, name);
    const destPath = path.join(destDir, name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function main() {
  // Clean output
  if (fs.existsSync(OUT)) {
    fs.rmSync(OUT, { recursive: true, force: true });
  }
  fs.mkdirSync(OUT, { recursive: true });

  // Copy all static site files into public
  copyRecursive(ROOT, OUT);

  // Ensure vercel.json is present in root for headers/redirects
  // No action needed; Vercel reads from project root (working dir)
  console.log(`Built static site to: ${OUT}`);
}

main();