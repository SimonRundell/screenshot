/**
 * Formats a date string into a locale date/time label.
 * @param {string|number|Date} value
 * @returns {string}
 */
export default function formatDate(value) {
  if (!value) return 'Unknown date';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Invalid date';
  return date.toLocaleString();
}
