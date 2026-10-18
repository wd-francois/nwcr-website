import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const sectors = ['Rail', 'Civil', 'Modular', 'Fabrication'] as const;
export type Sector = (typeof sectors)[number];

/**
 * One Markdown file per service in src/content/services/.
 * The file name becomes the URL: rail.md → /services/rail/
 */
const services = defineCollection({
  loader: glob({ base: './src/content/services', pattern: '**/[^_]*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Two-weight heading: light first line, extra-bold uppercase second line. */
      heading: z.object({ light: z.string(), bold: z.string() }),
      /** Used for the meta description and service cards (aim for 120–160 characters). */
      summary: z.string().max(170),
      order: z.number().int(),
      image: image(),
      imageAlt: z.string(),
      /** Licence or registration shown as a badge, e.g. "Electrical licence EC 15479". */
      credential: z.string().optional(),
      capabilitiesHeading: z.string().default('Our capabilities include'),
      capabilities: z.array(z.string()).min(1),
      /** Optional second list, e.g. an equipment profile. */
      secondaryList: z.object({ heading: z.string(), items: z.array(z.string()) }).optional(),
      /** Projects with any of these sectors are shown as related work. */
      relatedSectors: z.array(z.enum(sectors)).default([]),
    }),
});

/**
 * One Markdown file per project in src/content/projects/.
 * The file name becomes the URL: leonora-gym.md → /projects/leonora-gym/
 */
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/[^_]*.{md,mdx}' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        /** Two-weight heading: light first line, extra-bold uppercase second line. */
        heading: z.object({ light: z.string(), bold: z.string() }),
        client: z.string().optional(),
        location: z.string().optional(),
        period: z.string().optional(),
        sectors: z.array(z.enum(sectors)).min(1),
        /** One or two sentences for cards and the meta description. */
        summary: z.string().max(170),
        image: image(),
        imageAlt: z.string(),
        highlights: z.array(z.string()).default([]),
        featured: z.boolean().default(false),
        order: z.number().int(),
      })
      .refine((p) => p.client ?? p.location, {
        message: 'A project needs a client or a location.',
      }),
});

export const collections = { services, projects };
