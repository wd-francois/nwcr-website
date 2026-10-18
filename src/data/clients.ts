import type { ImageMetadata } from 'astro';
import bhp from '../assets/clients/bhp.png';
import fortescue from '../assets/clients/fortescue.png';
import royHill from '../assets/clients/roy-hill.png';
import woodside from '../assets/clients/woodside-energy.png';
import rioTinto from '../assets/clients/rio-tinto.png';
import chevron from '../assets/clients/chevron.png';
import ozMinerals from '../assets/clients/oz-minerals.png';
import monadelphous from '../assets/clients/monadelphous.png';
import mainRoads from '../assets/clients/main-roads-wa.png';

/**
 * Client logos. The client name doubles as the logo's alt text.
 * TODO: confirm permission to display each logo (see CONTENT_TODO.md).
 */
/** `large`: square logos that read too small at the standard height. */
export const clients: { name: string; logo: ImageMetadata; large?: boolean }[] = [
  { name: 'BHP', logo: bhp },
  { name: 'Fortescue', logo: fortescue },
  { name: 'Roy Hill', logo: royHill, large: true },
  { name: 'Woodside Energy', logo: woodside, large: true },
  { name: 'Rio Tinto', logo: rioTinto },
  { name: 'Chevron', logo: chevron },
  { name: 'OZ Minerals', logo: ozMinerals },
  { name: 'Monadelphous', logo: monadelphous },
  { name: 'Main Roads WA', logo: mainRoads },
];
