/**
 * Site-wide configuration — the ONE place to change business and contact details.
 *
 * Everything that renders a phone number, email, ABN, location, licence,
 * social link or the site URL reads from this file (including JSON-LD,
 * the footer, the contact page and astro.config.mjs).
 */

/** Production domain. Used for canonical URLs, the sitemap, Open Graph and JSON-LD. */
export const siteUrl = 'https://norwestcontractingandrail.com.au';

export interface SocialLink {
  label: string;
  /** Leave empty to hide the link everywhere on the site. */
  url: string;
}

export const site = {
  siteUrl,
  name: 'Norwest Contracting & Rail',
  shortName: 'NWCR',
  tagline: 'Bridging Gaps, Making Tracks',
  headline: '100% Pilbara Traditional Owner Indigenous-owned business',
  description:
    'Norwest Contracting & Rail (NWCR) is a 100% Pilbara Traditional Owner (Ngarluma) Indigenous-owned contracting business delivering rail, civil, electrical, mechanical, modular and contracting services across Western Australia.',
  closingCta: 'NWCR is ready. Will you join us as a pillar for change?',
  founded: 2012,

  phone: {
    display: '0434 444 169',
    /** E.164 format for tel: links and structured data. */
    e164: '+61434444169',
  },
  email: 'admin@nwcr.com.au',
  abn: '63 161 195 777',

  electricalLicence: 'EC 15479',
  pestManagementRegistration: '2704',

  serviceArea: 'Services available for remote projects throughout Western Australia.',

  certifications: [
    { code: 'ISO 9001', label: 'Quality Management' },
    { code: 'ISO 14001', label: 'Environmental Management' },
    { code: 'ISO 45001', label: 'Occupational Health & Safety Management' },
  ],

  /**
   * Capability Statement page and every link/button to it.
   * Set `enabled` to true to publish /capability-statement/ and show the links again.
   */
  capabilityStatement: {
    enabled: false as boolean,
    href: '/capability-statement/',
    label: 'Capability Statement',
  },

  /** Social profiles. TODO: confirm URLs with NWCR — empty values are not rendered. */
  social: [
    { label: 'LinkedIn', url: '' },
    { label: 'Facebook', url: '' },
    { label: 'Instagram', url: '' },
  ] satisfies SocialLink[],
} as const;

export const activeSocialLinks = site.social.filter((s) => s.url.trim() !== '');

export const mailto = (subject?: string) =>
  `mailto:${site.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;

/** Main navigation. Services children are generated from the services collection. */
export const mainNav = [
  { label: 'About', href: '/about/' },
  { label: 'Services', href: '/services/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'Indigenous Tribute', href: '/indigenous-tribute/' },
  { label: 'Careers', href: '/careers/' },
  { label: 'Contact', href: '/contact/' },
] as const;
