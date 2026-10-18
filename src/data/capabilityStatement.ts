/**
 * Capability statement — web edition.
 *
 * Text layout comes from `capability-statement.json`, generated from
 * "NWCR Capability Statement 2026.pdf" (see README → "Capability Statement page").
 * Coordinates are percentages of the page width, so the page scales exactly.
 * Page artwork (with the text removed) lives in src/assets/capability/.
 */
import type { ImageMetadata } from 'astro';
import layout from './capability-statement.json';

import page1 from '../assets/capability/cover.jpg';
import page2 from '../assets/capability/page-2.jpg';
import page3 from '../assets/capability/page-3.jpg';
import page4 from '../assets/capability/page-4.jpg';
import page5 from '../assets/capability/page-5.jpg';
import page6 from '../assets/capability/page-6.jpg';
import page7 from '../assets/capability/page-7.jpg';
import page8 from '../assets/capability/page-8.jpg';

import riverAerial from '../assets/placeholders/landscape-river-aerial.jpg';
import coastAerial from '../assets/placeholders/landscape-coast-aerial.jpg';
import gorgeReflection from '../assets/placeholders/landscape-gorge-reflection.jpg';
import creek from '../assets/placeholders/landscape-creek.jpg';
import accessRoad from '../assets/placeholders/service-contracting.jpg';
import kite from '../assets/placeholders/landscape-kite.jpg';
import heritageBuilding from '../assets/placeholders/service-civil.jpg';
import railTrack from '../assets/placeholders/service-rail.jpg';
import redHills from '../assets/placeholders/service-vegetation.jpg';
import railBridge from '../assets/placeholders/project-rail-bridge-upgrades.jpg';
import rowRemediation from '../assets/placeholders/project-row-remediation.jpg';
import walkway from '../assets/placeholders/project-pedestrian-walkway.jpg';
import oasis from '../assets/placeholders/project-oasis-units.jpg';
import gym from '../assets/placeholders/project-leonora-gym.jpg';
import feedmill from '../assets/placeholders/project-feedmill.jpg';
import karratha from '../assets/placeholders/project-karratha-port.jpg';

export interface CsSpan {
  /** text */
  t: string;
  /** font weight */
  w: number;
  /** italic */
  i?: boolean;
}

export interface CsLine {
  /** left edge, baseline and font size — all as % of page width */
  x: number;
  y: number;
  fs: number;
  /** width of the line in the PDF (% of page width) */
  pw: number;
  /** letter-spacing correction (em) so the line matches the PDF width — set by calibration */
  ls?: number;
  /** horizontal centre for centred lines (% of page width) */
  cx?: number;
  /** text colour */
  c: string;
  s: CsSpan[];
  /** replaced at build time with details from src/config/site.ts */
  token?: 'phone' | 'email' | 'website' | 'abn';
  /** what joins this line to the next when the text reflows ("" after a hyphen) */
  sep: string;
}

export type CsUnit =
  | {
      tag: 'h1' | 'h2' | 'h3' | 'h4' | 'p';
      cls: string;
      lines: CsLine[];
      /** Kept for screen readers and search engines, but not shown. */
      hidden?: boolean;
    }
  | { tag: 'ul'; items: CsLine[][] }
  | {
      tag: 'iso';
      items: { x: number; y: number; fs: number; label: string; code: string }[];
    };

interface CsLayoutPage {
  n: number;
  w: number;
  h: number;
  spread: boolean;
  minFs: number;
  units: CsUnit[];
}

export interface CsPhoto {
  src: ImageMetadata;
  alt: string;
}

export interface CsPage extends CsLayoutPage {
  bg: ImageMetadata;
  /** Describes the photos/logos in the page artwork (shown when the exact layout is used). */
  bgAlt: string;
  /** Photos shown when the page reflows on small screens. */
  photos: CsPhoto[];
  /** Container width (px) from which the exact layout is used — keeps text at ≥ 11 px. */
  replicaFrom: 0 | 660 | 1100 | 1320;
}

const backgrounds = [page1, page2, page3, page4, page5, page6, page7, page8];

const bgAlts = [
  'Cover: a night sky above a Pilbara sunset and Aboriginal dot-painting artwork.',
  'Aerial photos of a Pilbara river and coastline, two photo placeholders, and the Norwest Contracting and Rail logo.',
  'Photos of a Pilbara gorge, a rocky creek, an access road beside a rail line and a wedge-tailed eagle over red earth.',
  'Photos of a restored heritage building, a heritage archway, rail track between handrails, rock pools and rocky country from the air.',
  'Photos of a Pilbara waterhole and red spinifex hills under a cloudy sky.',
  'Photos of the rail bridge, a grader on the right of way, the new pedestrian walkway, the Oasis units and the gym interior.',
  'Photos of the feedmill plant under construction and installed waler beams, and Certified System marks for ISO 9001, ISO 14001 and ISO 45001.',
  'Norwest Contracting and Rail logo, and client logos: BHP, Fortescue, Roy Hill, Woodside Energy, Rio Tinto, Chevron, OZ Minerals, Monadelphous and Main Roads WA.',
];

const photos: Record<number, CsPhoto[]> = {
  2: [
    { src: riverAerial, alt: 'Aerial view of a river winding through green Pilbara country' },
    { src: coastAerial, alt: 'Aerial view of turquoise water meeting a rocky Pilbara coastline' },
  ],
  3: [
    { src: gorgeReflection, alt: 'Trees and red cliffs reflected in a Pilbara waterhole' },
    { src: accessRoad, alt: 'A sealed access road beside a rail line' },
    { src: kite, alt: 'A wedge-tailed eagle in flight over red earth' },
    { src: creek, alt: 'A red boulder beside a rocky creek' },
  ],
  4: [
    { src: heritageBuilding, alt: 'Aerial view of a restored heritage brick building' },
    { src: railTrack, alt: 'Rail track between yellow safety handrails' },
  ],
  5: [{ src: redHills, alt: 'Red spinifex hills under a cloudy sky' }],
  6: [
    { src: railBridge, alt: 'Ballasted rail track across a bridge' },
    { src: walkway, alt: 'A new concrete pedestrian walkway crossing ballast' },
    { src: rowRemediation, alt: 'A grader on a cleared red-earth right of way' },
    { src: oasis, alt: 'Newly built single-storey holiday cabins' },
    { src: gym, alt: 'Interior of the newly built gym' },
  ],
  7: [
    { src: feedmill, alt: 'Feedmill plant under construction with a crane' },
    { src: karratha, alt: 'Installed steel waler beams along a concrete wall' },
  ],
};

const MIN_TEXT_PX = 11;
/** Narrowest screen we design for (360 px phone minus page gutters). */
const NARROWEST = 320;
const buckets = [660, 1100, 1320] as const;

export const capabilityPages: CsPage[] = (layout as unknown as CsLayoutPage[]).map((p) => {
  const needed = (MIN_TEXT_PX * 100) / ((p.minFs / p.w) * 100);
  const replicaFrom = needed <= NARROWEST ? 0 : (buckets.find((b) => b >= needed) ?? 1320);
  return {
    ...p,
    bg: backgrounds[p.n - 1] ?? page1,
    bgAlt: bgAlts[p.n - 1] ?? '',
    photos: photos[p.n] ?? [],
    replicaFrom,
  };
});
