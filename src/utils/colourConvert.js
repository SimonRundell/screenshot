/**
 * Normalizes and validates a 6-digit hex colour string.
 * @param {string} hex - e.g. "#a3c2f0" or "a3c2f0"
 * @returns {string}
 */
function normalizeHex(hex) {
  const value = String(hex || '').trim().toLowerCase().replace(/^#/, '');
  if (!/^[0-9a-f]{6}$/.test(value)) {
    throw new Error('Invalid hex colour');
  }
  return `#${value}`;
}

/**
 * Converts a 6-digit hex string to an RGB object.
 * @param {string} hex - e.g. "#a3c2f0" or "a3c2f0"
 * @returns {{ r: number, g: number, b: number }}
 */
export function hexToRgb(hex) {
  const normalized = normalizeHex(hex).slice(1);
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16)
  };
}

/**
 * Converts RGB values to an HSL object.
 * @param {number} r - 0-255
 * @param {number} g - 0-255
 * @param {number} b - 0-255
 * @returns {{ h: number, s: number, l: number }} h: 0-360, s/l: 0-100
 */
export function rgbToHsl(r, g, b) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rn) {
      h = ((gn - bn) / delta) % 6;
    } else if (max === gn) {
      h = (bn - rn) / delta + 2;
    } else {
      h = (rn - gn) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return {
    h,
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Converts RGB to a 6-digit lowercase hex string with leading #.
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {string}
 */
export function rgbToHex(r, g, b) {
  const toHex = (value) => Math.max(0, Math.min(255, value)).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Builds a full colour object from a hex string.
 * @param {string} hex
 * @returns {{ hex: string, rgb_r: number, rgb_g: number, rgb_b: number, hsl_h: number, hsl_s: number, hsl_l: number }}
 */
export function hexToColourObject(hex) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return {
    hex: rgbToHex(rgb.r, rgb.g, rgb.b),
    rgb_r: rgb.r,
    rgb_g: rgb.g,
    rgb_b: rgb.b,
    hsl_h: hsl.h,
    hsl_s: hsl.s,
    hsl_l: hsl.l
  };
}
