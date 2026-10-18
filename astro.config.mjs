// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { siteUrl } from './src/config/site.ts';

// Production builds keep their own cache folders, separate from a running `npm run dev`.
// (scripts/build.mjs also checks every page has its stylesheet — see README.)
const isBuild = process.argv.includes('build');

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // https://norwestcontractingandrail.com.au — defined once in src/config/site.ts
  site: siteUrl,
  trailingSlash: 'always',
  // Collapse whitespace without stripping the spaces between inline elements.
  compressHTML: true,
  ...(isBuild && { cacheDir: './node_modules/.astro-build' }),
  integrations: [sitemap()],
  // Old WordPress URLs → new pages. /indigenous-tribute/ and /careers/ keep their
  // original paths, so they need no redirect.
  redirects: {
    '/about-us': '/about/',
    '/rail': '/services/rail/',
    '/rail-labour-equipment-hire': '/services/labour-equipment-hire/',
    '/general-equipment-hire': '/services/labour-equipment-hire/',
    '/contracting': '/services/contracting/',
    '/contact-us': '/contact/',
    '/employee-portal-login': '/',
  },
  vite: {
    plugins: [tailwindcss()],
    ...(isBuild && { cacheDir: 'node_modules/.vite-build' }),
  },
});
