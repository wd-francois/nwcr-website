/**
 * Staff shown on the Contact page, in display order.
 * Photos live in src/assets/team/. Leave `email` or `phone` out to hide them.
 *
 * Fiona and Stevie are carried over from the old WordPress contact page.
 * TODO: confirm everyone is still current and happy to be listed (see CONTENT_TODO.md).
 */
import type { ImageMetadata } from 'astro';
import fiona from '../assets/team/fiona.jpg';
import stevie from '../assets/team/stevie.jpg';
import zoe from '../assets/team/zoe-garland.jpg';

export interface TeamMember {
  name: string;
  role: string;
  photo: ImageMetadata;
  email?: string;
  phone?: { display: string; e164: string };
}

export const leadership: TeamMember[] = [
  { name: 'Fiona', role: 'Director', photo: fiona, email: 'fiona@nwcr.com.au' },
  {
    name: 'Stevie',
    role: 'Operations Superintendent',
    photo: stevie,
    email: 'stevie@nwcr.com.au',
  },
  {
    name: 'Zoe Garland',
    role: 'Administration & Accounts Manager',
    photo: zoe,
    email: 'zoe@nwcr.com.au',
  },
];
