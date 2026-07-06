/**
 * hex-palette — Generate color palettes from a hex color.
 */

/**
 * Parse a hex color string into RGB components.
 * @param {string} hex - e.g. "#ff8800" or "ff8800"
 * @returns {{ r: number, g: number, b: number }}
 */
export function hexToRgb(hex) {
  const clean = hex.replace(/^#/, '');
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

/**
 * Convert RGB to a hex string.
 * @param {{ r: number, g: number, b: number }}
 * @returns {string} e.g. "#ff8800"
 */
export function rgbToHex({ r, g, b }) {
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  return '#' + [clamp(r), clamp(g), clamp(b)]
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Generate a complementary color (opposite on the color wheel).
 */
export function complementary(hex) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex({ r: 255 - r, g: 255 - g, b: 255 - b });
}

/**
 * Lighten a color by a factor (0–1).
 */
export function lighten(hex, factor = 0.2) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex({
    r: r + (255 - r) * factor,
    g: g + (255 - g) * factor,
    b: b + (255 - b) * factor,
  });
}

/**
 * Darken a color by a factor (0–1).
 */
export function darken(hex, factor = 0.2) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex({
    r: r * (1 - factor),
    g: g * (1 - factor),
    b: b * (1 - factor),
  });
}

/**
 * Generate a full palette from a base color.
 * @param {string} hex
 * @returns {{ base, light, dark, complementary, accent }}
 */
export function generatePalette(hex) {
  return {
    base: hexToRgb(hex) ? `#${hex.replace(/^#/, '')}` : hex,
    light: lighten(hex, 0.3),
    dark: darken(hex, 0.3),
    complementary: complementary(hex),
    accent: lighten(complementary(hex), 0.2),
  };
}
