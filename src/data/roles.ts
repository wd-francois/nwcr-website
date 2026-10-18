/**
 * Current job openings shown on /careers/.
 * Leave the array empty to show the "no current roles" message.
 *
 * Example:
 * {
 *   title: 'Track Protection Officer',
 *   location: 'Pilbara',
 *   type: 'Full time, FIFO',
 *   summary: 'Short description of the role.',
 * }
 */
export interface Role {
  title: string;
  location: string;
  type: string;
  summary: string;
}

export const roles: Role[] = [];
