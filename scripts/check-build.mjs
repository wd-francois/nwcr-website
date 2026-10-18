// Post-build guard: every built page must link a stylesheet. Fails the build if CSS went missing.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const pages = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.html')) pages.push(p);
  }
};
walk('dist');

// Redirect stubs from astro.config.mjs have no styles by design.
const missing = pages.filter((p) => {
  const html = readFileSync(p, 'utf8');
  return !html.includes('http-equiv="refresh"') && !html.includes('<link rel="stylesheet"');
});

if (missing.length) {
  console.error(
    `check-build: ${missing.length} page(s) have no stylesheet:\n  ${missing.join('\n  ')}`,
  );
  console.error('Delete the dist/ and .astro/ folders and build again.');
  process.exit(1);
}
console.log(`check-build: all ${pages.length} pages link their stylesheet.`);
