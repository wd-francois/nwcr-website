# Norwest Contracting & Rail — website

Marketing website for **Norwest Contracting & Rail (NWCR)**, a 100% Pilbara Traditional Owner (Ngarluma) Indigenous-owned contracting business.

Built with **Astro 7** (static output), **Tailwind CSS 4** (via `@tailwindcss/vite`) and **TypeScript** (strict). There is no backend: the site builds to plain HTML/CSS in `dist/` and can be hosted anywhere.

- Production URL: https://norwestcontractingandrail.com.au
- Outstanding images: [`IMAGES_TODO.md`](IMAGES_TODO.md)
- Content awaiting client sign-off: [`CONTENT_TODO.md`](CONTENT_TODO.md)

---

## Requirements

- Node.js **22.22 or newer** (Astro 7 requirement)
- npm 9.6+

## Setup and local development

```bash
npm install
cp .env.example .env      # optional — only needed to test the live contact form
npm run dev               # http://localhost:4321
```

## Scripts

| Command             | What it does                                                                      |
| ------------------- | --------------------------------------------------------------------------------- |
| `npm run dev`       | Start the dev server with hot reload                                              |
| `npm run build`     | Build the static site into `dist/`                                                |
| `npm run preview`   | Serve the built `dist/` locally                                                   |
| `npm run check`     | Type-check Astro/TS files (`astro check`)                                         |
| `npm run lint`      | ESLint (incl. `eslint-plugin-astro` + strict `jsx-a11y` rules) and Prettier check |
| `npm run format`    | Auto-format everything with Prettier                                              |
| `npm run linkcheck` | Check every link in `dist/` with linkinator (run after `build`)                   |
| `npm run verify`    | All of the above, in order: check → lint → build → linkcheck                      |

## Project structure

```
public/
  og-image.png, favicon.*, apple-touch-icon.png
scripts/
  build.mjs               ← `npm run build`: builds, checks every page is styled, retries clean if not
  check-build.mjs         ← the stylesheet check used by build.mjs
  capability/             ← regenerates the Capability Statement page from the PDF (see below)
src/
  config/site.ts          ← ALL contact details, ABN, licences, locations, socials, site URL, nav
  content.config.ts       ← Zod schemas for the services and projects collections
  content/
    services/*.md         ← one file per service  → /services/<file-name>/
    projects/*.md         ← one file per project  → /projects/<file-name>/
  data/
    clients.ts            ← client logo strip
    values.ts             ← company values (About page)
    roles.ts              ← current job openings (Careers page)
  assets/
    brand/                ← logo files; brand/artwork/ for the licensed flyer artwork
    clients/              ← client logos
    placeholders/         ← photos to replace (see IMAGES_TODO.md)
  components/             ← reusable UI (see below); components/capability/ for the statement page
  layouts/BaseLayout.astro← <head>, SEO, skip link, header, footer
  pages/                  ← one file per route (+ [slug].astro templates, robots.txt.ts)
  styles/global.css       ← Tailwind import, brand colour tokens, shared component classes
```

### Key components

| Component                           | Purpose                                                                                                                                                                 |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SplitHeading`                      | The flyer's two-weight heading: light first line + extra-bold uppercase second line ("Our / **PROJECTS**"). Auto-sizes long words so nothing overflows on small phones. |
| `TitleBanner`                       | White heading on an organic navy "brush" shape (inner page titles).                                                                                                     |
| `BlobImage`                         | Photo inside a soft organic blob mask (4 variants, optional white ring). AVIF/WebP via `<Picture>`.                                                                     |
| `OvalTrail`, `ConcentricCircles`    | Subtle decorative trails of hand-drawn ovals and outline rings (`aria-hidden`).                                                                                         |
| `ArtworkBand`                       | Shows the licensed flyer artwork above the footer, or a plain gradient until it is supplied.                                                                            |
| `CulturalAdvice`                    | Permanent cultural advice line on About and Indigenous Tribute.                                                                                                         |
| `Header` / `Footer`                 | Sticky header with accessible Services dropdown and mobile slide-out menu; footer with Acknowledgement of Country.                                                      |
| `ContactForm`                       | Provider-agnostic form with honeypot, accessible validation, success and error states.                                                                                  |

### Brand tokens

Defined in `src/styles/global.css` and used as Tailwind classes (`bg-navy`, `text-bush-green`, …):
`navy #184594` (sampled from the logo), `night #0b1e3f`, `bush-green #205d2f` (logo green), `ochre #c8341c`, `burnt-orange #e8681e` (decorative only), `gold #f6b42a`, `sand #f4f1ec`, `ink #2a2a2a`, `muted #55504a`.

---

## How to change contact details

Edit **`src/config/site.ts`**. That one file controls the phone number, email, ABN, electrical licence, pest-management registration, office locations, social links, the capability statement link and the site URL. They are used across the header, footer, contact page, careers page, structured data (JSON-LD), `robots.txt`, the sitemap and `astro.config.mjs`.

- **Social links:** fill in `url` for LinkedIn/Facebook/Instagram. Links with an empty URL are not shown.
- **Domain:** change `siteUrl`. `astro.config.mjs` imports it, so canonical URLs, Open Graph tags, the sitemap and JSON-LD all follow.

## How to add or edit a service

1. Copy an existing file in `src/content/services/`, e.g. `rail.md` → `new-service.md`. The file name becomes the URL (`/services/new-service/`).
2. Fill in the frontmatter. The build fails with a clear message if a required field is missing:

```yaml
---
title: New Service # page title, cards, menus
heading: { light: 'New', bold: 'Service' } # two-weight page heading
summary: One sentence, up to 170 characters (used for cards and the meta description).
order: 9 # position in menus and grids
image: ../../assets/placeholders/your-photo.jpg
imageAlt: Describe what the photo shows
credential: Optional licence/registration badge
capabilitiesHeading: Our capabilities include # optional
capabilities:
  - First capability
  - Second capability
secondaryList: # optional second list (e.g. equipment profile)
  heading: Equipment profile
  items: [Item one, Item two]
relatedSectors: [Rail] # optional: shows projects from these sectors
---
Introductory paragraphs in Markdown.
```

The new service automatically appears in the header dropdown, mobile menu, footer, services pages, home page and the contact form's "Service of interest" list.

## How to add or edit a project

1. Add a Markdown file to `src/content/projects/`, e.g. `my-project.md` → `/projects/my-project/`.
2. Put the photo in `src/assets/placeholders/` (or a new `src/assets/projects/` folder) and reference it relative to the Markdown file.

```yaml
---
title: Project Title
heading: { light: 'Project', bold: 'Title' }
client: Client Name # client and/or location is required
location: Site or town
period: 2024–2025 # optional
sectors: [Rail, Civil] # any of: Rail, Civil, Modular, Fabrication
summary: Card and meta description, up to 170 characters.
image: ../../assets/placeholders/your-photo.jpg
imageAlt: Describe what the photo shows
highlights: # optional bullet points on the detail page
  - Key fact
featured: true # show on the home page (the first 3 by order)
order: 8
---
Scope of works in Markdown. Only include confirmed facts.
```

To add a new sector filter, add it to the `sectors` list in `src/content.config.ts`.

## Capability Statement page

`/capability-statement/` is a web version of _NWCR Capability Statement 2026.pdf_.

**Currently turned off.** The page is not published, and there are no Capability Statement links or buttons anywhere on the site. To publish it, set `capabilityStatement.enabled` to `true` in `src/config/site.ts` and rebuild. That one switch generates the page (`src/pages/[capabilityStatement].astro`) and brings back every link: header button, mobile menu, footer, closing banner, contact page and service pages. The home page hero uses the statement's cover artwork whether the page is on or off.

- **Desktop and print:** each page is an exact replica. The page artwork (with the text removed) is a background image, and every line of text is real HTML in Montserrat, placed at the PDF's position, size and weight. The text stays selectable, searchable and readable by screen readers.
- **Phones and tablets:** pages whose text would shrink below 11 px reflow into a readable "mobile edition", with the same text, the page's photos and the artwork strip. The cover always uses the exact layout.
- **Print / save as PDF:** the button on the page, or Ctrl+P, prints the exact layout: the cover and back page on A4 portrait, the spreads on A3 landscape, as in the original. Chrome and Edge honour the page sizes; other browsers may scale to the paper selected.

Files:

| File                                                           | What it is                                                                   |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `src/data/capability-statement.json`                           | Every line of text with its position, size, weight and colour (generated).   |
| `src/data/capabilityStatement.ts`                              | Page artwork, image descriptions and the photos shown in the mobile edition. |
| `src/assets/capability/cover.jpg`, `page-2.jpg` … `page-8.jpg` | Page artwork without the text.                                               |
| `src/components/capability/`                                   | Page and line components, plus the exact-layout CSS.                         |
| `src/styles/capability.css`                                    | Mobile edition and print styles.                                             |

**Small text edits:** edit the `"t"` values in `capability-statement.json`. Keep each line roughly the same length, because line breaks are fixed in the exact layout. Phone, email, website, ABN and locations come from `src/config/site.ts` automatically.

**New version of the statement** (for example, a 2027 PDF):

```bash
pip install pymupdf pillow
python scripts/capability/generate.py "path/to/new statement.pdf"
npm run build && npm run preview                      # keep running
npm install --no-save puppeteer-core
node scripts/capability/calibrate.mjs                 # matches line widths to the PDF
npm run build
```

Then check every page against the PDF. The generator assumes the same layout conventions as the 2026 statement: Montserrat text, Wingdings bullets, and photos of people on page 2. Review `PEOPLE_PHOTOS`, `FIXES` and the page-8 shadow layers at the top of `generate.py`.

## Careers

Add openings to `src/data/roles.ts`. When the list is empty, the Careers page shows a "no advertised roles" message with an email call to action.

## Contact form

The form posts to the URL in the **`PUBLIC_FORM_ENDPOINT`** environment variable, so you can use any form service:

| Provider             | `PUBLIC_FORM_ENDPOINT`             | Extra                                                           |
| -------------------- | ---------------------------------- | --------------------------------------------------------------- |
| Formspree            | `https://formspree.io/f/<form-id>` | Honeypot field `_gotcha` and `_subject` are supported natively. |
| Web3Forms            | `https://api.web3forms.com/submit` | Also set `PUBLIC_FORM_ACCESS_KEY`.                              |
| Basin, Getform, etc. | Their form endpoint URL            | —                                                               |

- With JavaScript, the form validates accessibly (error summary, inline messages, `aria-invalid`), submits with `fetch` and shows a success or error message. Without JavaScript it posts normally to the provider.
- If `PUBLIC_FORM_ENDPOINT` is **not set**, the page shows the email address instead of a form that can't send.
- Links like `/contact/?service=rail` pre-select the service (used by the "Enquire about…" buttons).
- Environment variables are read at **build time**, so set them in your host's build settings and rebuild.

---

## Deployment

Build command `npm run build`, output directory `dist`, Node 22.22+. Set `PUBLIC_FORM_ENDPOINT` (and `PUBLIC_FORM_ACCESS_KEY` if needed) as build environment variables.

### Netlify

New site from Git → build command `npm run build`, publish directory `dist`. Add `NODE_VERSION=22` under environment variables.

### Vercel

Import the repo; Vercel detects Astro automatically (output `dist`). Set the Node.js version to 22.x in Project Settings.

### Cloudflare Pages

Framework preset **Astro**, build command `npm run build`, output directory `dist`, environment variable `NODE_VERSION=22`.

### Redirects from the old WordPress site

Defined in `redirects` in `astro.config.mjs`:

| Old URL                                                    | New URL                            |
| ---------------------------------------------------------- | ---------------------------------- |
| `/about-us/`                                               | `/about/`                          |
| `/rail/`                                                   | `/services/rail/`                  |
| `/rail-labour-equipment-hire/`, `/general-equipment-hire/` | `/services/labour-equipment-hire/` |
| `/contracting/`                                            | `/services/contracting/`           |
| `/contact-us/`                                             | `/contact/`                        |
| `/employee-portal-login/`                                  | `/`                                |

`/indigenous-tribute/` and `/careers/` keep their original paths, so they need no redirect.

In a static build these are HTML redirect pages (meta refresh plus a canonical link), which work on every host. For true HTTP **301** responses (slightly better for SEO), add the same rules to your host's redirect configuration, e.g. a `public/_redirects` file on Netlify or Cloudflare Pages:

```
/about-us/                     /about/                           301!
/rail/                         /services/rail/                   301!
/rail-labour-equipment-hire/   /services/labour-equipment-hire/  301!
/general-equipment-hire/       /services/labour-equipment-hire/  301!
/contracting/                  /services/contracting/            301!
/contact-us/                   /contact/                         301!
/employee-portal-login/        /                                 301!
```

(`301!` forces the redirect on Netlify even though the HTML redirect page exists; on Cloudflare Pages use `301`.)

---

## Cultural and content rules

- The flyer's dot-painting artwork is Aboriginal art. **Only** use the supplied, licensed file (`src/assets/brand/artwork/`). Never generate, trace or imitate Aboriginal dot art with code, SVG or AI.
- Don't add photos or details of Melanie Tavo without the family's approval.
- Don't invent facts, quotes or statistics. Use Australian English.

## Quality checks

Before publishing changes, run `npm run verify`.

**Build safety net:** `npm run build` runs `scripts/build.mjs`, which builds the site and then checks that every page links its stylesheet (`scripts/check-build.mjs`). On this Windows/OneDrive machine, a build run soon after editing files (while `npm run dev` was running) occasionally produced pages without their stylesheet. When that happens, the script clears every Astro cache and builds again automatically (up to twice). If it is still broken, the build fails, so an unstyled site can't be deployed. Stopping `npm run dev` before building avoids it. Hosting providers build on clean machines and are not expected to hit this.
