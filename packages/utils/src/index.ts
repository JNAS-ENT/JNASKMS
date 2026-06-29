/**
 * Shared utility helpers
 */

/**
 * Formats a ISO date string or Date object into a readable date string
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Truncates text with trailing ellipsis if it exceeds limit
 */
export function truncateText(text: string, limit: number): string {
  if (text.length <= limit) return text;
  return text.slice(0, limit) + '...';
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
