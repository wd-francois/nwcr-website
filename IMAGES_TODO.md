# Images to replace

Every raster image on the site goes through `astro:assets`, so replacements are automatically resized and converted to AVIF/WebP. To replace an image, **overwrite the file with the same name** (any reasonable size; landscape photos at least 1600 px wide are ideal). If you change the file name, update the import or the `image:` field listed below.

## Placeholders that are not real photos (must be replaced)

| File                                                            | Used on                                           | What is needed                                                                                                                                                      |
| --------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/assets/placeholders/melanie-tavo-placeholder.jpg`          | About → "Melanie's Vision"                        | **TODO: confirm with family.** An approved photo of Melanie Tavo. When added, change `alt=""` in `src/pages/about.astro` to descriptive alt text that names her.    |
| `src/assets/placeholders/historic-rail-gang-placeholder.jpg`    | Indigenous Tribute → "The 1968 rail gang"         | A licensed historic photograph of the 1968 Torres Strait Islander rail gang, with permission and attribution. Add alt text in `src/pages/indigenous-tribute.astro`. |
| `src/assets/placeholders/port-hedland-monument-placeholder.jpg` | Indigenous Tribute → "Remembered in Port Hedland" | A photograph of the Port Hedland monument (and/or the 2018 50th-anniversary gathering, with consent of those pictured). Add alt text.                               |
| _(no file yet)_ `src/assets/brand/artwork/`                     | Band above the footer on every page               | The licensed flyer artwork file. See `src/assets/brand/artwork/README.md`.                                                                                          |

## Staff photos (Contact page)

| File                                                                   | Source                                                                                                     |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `src/assets/team/fiona.jpg`, `stevie.jpg`, `jordan.jpg`, `suzanne.jpg` | Copied from the old WordPress contact page (400 × 400 px). Higher-resolution originals would look sharper. |
| `src/assets/team/zoe-garland.jpg`                                      | Cropped from the supplied event photo of Zoe at the NWCR stand.                                            |

## Photos taken from the 2026 capability statement PDF

These were extracted from the capability statement as stand-ins. They are low resolution (mostly 450–1,500 px wide) and their **web-use rights need to be confirmed**. Replace them with the high-resolution originals. Photos showing people, and the artwork, were deliberately **not** used.

| File                                                       | Used on                                                                                                    |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `src/assets/placeholders/project-rail-bridge-upgrades.jpg` | Project: Rail Bridge Upgrades (home, projects, Rail Services)                                              |
| `src/assets/placeholders/project-pedestrian-walkway.jpg`   | Project: Pedestrian Walkway Upgrades; Projects page hero                                                   |
| `src/assets/placeholders/project-row-remediation.jpg`      | Project: R.O.W. Remediation; Labour & Equipment Hire service                                               |
| `src/assets/placeholders/project-oasis-units.jpg`          | Project: The Oasis 12 Units; Modular Infrastructure service                                                |
| `src/assets/placeholders/project-leonora-gym.jpg`          | Project: 600 m² Gym Facility                                                                               |
| `src/assets/placeholders/project-feedmill.jpg`             | Project: Western Animal Nutrition Feedmill Plant                                                           |
| `src/assets/placeholders/project-karratha-port.jpg`        | Project: Karratha Port Waler Beams & Anchor Heads                                                          |
| `src/assets/placeholders/service-rail.jpg`                 | Rail Services; home Indigenous Tribute teaser                                                              |
| `src/assets/placeholders/service-civil.jpg`                | Civil & Construction                                                                                       |
| `src/assets/placeholders/service-contracting.jpg`          | Contracting Services                                                                                       |
| `src/assets/placeholders/service-vegetation.jpg`           | Vegetation & Pest Management                                                                               |
| `src/assets/placeholders/landscape-gorge.jpg`              | Electrical Services; Indigenous Tribute hero (an electrical work photo would suit the service page better) |
| `src/assets/placeholders/landscape-creek.jpg`              | Mechanical & Engineering (a workshop / conveyor photo would suit better)                                   |
| `src/assets/placeholders/landscape-gorge-reflection.jpg`   | Services overview hero                                                                                     |
| `src/assets/placeholders/landscape-river-aerial.jpg`       | Home "Who we are"                                                                                          |
| `src/assets/placeholders/landscape-coast-aerial.jpg`       | About hero                                                                                                 |
| `src/assets/placeholders/landscape-river-gums.jpg`         | About → Certified Systems                                                                                  |
| `src/assets/placeholders/landscape-kite.jpg`               | Careers hero (a photo of NWCR crews would suit better, with consent)                                       |

## Brand files (generated from the PDF; replace with originals if available)

| File                                                                                         | Notes                                                                                                                                                                                        |
| -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/assets/brand/logo.png`, `logo-mark.png`, `logo-wordmark.png`, `logo-wordmark-white.png` | Rendered from the vector logo in the capability statement at high resolution. Swap in the original logo files (SVG preferred) if NWCR has them.                                              |
| `public/favicon.png`, `public/favicon.ico`, `public/apple-touch-icon.png`                    | Made from the logo map mark.                                                                                                                                                                 |
| `public/og-image.png`                                                                        | 1200 × 630 social share image (logo + tagline on the sunset gradient).                                                                                                                       |
| `src/assets/clients/*.png`                                                                   | Client logos extracted from the capability statement (low resolution; the Fortescue logo is the older "FMG" version). Replace with current official logo files once permission is confirmed. |

## Capability Statement page artwork

`src/assets/capability/cover.jpg`, `page-2.jpg` … `page-8.jpg` are the pages of the 2026 capability statement with the text removed. They are generated by `scripts/capability/generate.py` (see README).

- On page 2, the **three photos of people** (two people in hi-vis, a woman with two boys, and a person at a Rio Tinto "50 Years" display) are replaced with placeholders until the family approves their use. To restore them once approved, remove their sizes from `PEOPLE_PHOTOS` in `generate.py` and regenerate.
- These images contain the **Aboriginal artwork** from the flyer (see CONTENT_TODO.md).
- `src/assets/capability/artwork-strip.jpg` is the artwork band from the cover, used at the bottom of each page in the mobile edition.
