// Production build with a safety net.
//
// On this Windows/OneDrive machine, a build run soon after source edits (while
// `npm run dev` is running) occasionally produced pages without their stylesheet
// link. This runs `astro build`, checks every page (scripts/check-build.mjs), and if
// any page is unstyled it clears every cache and builds again (up to twice). If it
// is still broken, it fails so an unstyled site is never deployed.
import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const astro = fileURLToPath(new URL('../node_modules/astro/bin/astro.mjs', import.meta.url));
const check = fileURLToPath(new URL('./check-build.mjs', import.meta.url));
const run = (args) => spawnSync(process.execPath, args, { stdio: 'inherit' }).status ?? 1;

const build = () => run([astro, 'build']) === 0 && run([check]) === 0;

if (build()) process.exit(0);

// A fully clean build has always fixed it, so clear every Astro/Vite cache and retry (up to twice).
const caches = [
  'node_modules/.astro-build',
  'node_modules/.vite-build',
  'node_modules/.astro',
  'node_modules/.vite',
  '.astro',
  'dist',
];
for (let attempt = 1; attempt <= 2; attempt++) {
  console.warn(
    `\nbuild: some pages were unstyled — clearing all caches and building again (${attempt}/2)…\n`,
  );
  for (const dir of caches) rmSync(dir, { recursive: true, force: true });
  if (build()) process.exit(0);
}
console.error(
  '\nbuild: still unstyled after a clean build. Stop any running `npm run dev` and try again.',
);
process.exit(1);
