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
 * Convert RGB to HSL.
 * @param {{ r: number, g: number, b: number }} rgb (0–255)
 * @returns {{ h: number, s: number, l: number }} h in degrees (0–360), s/l in 0–1
 */
export function rgbToHsl({ r, g, b }) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return { h: h * 360, s, l };
}

/**
 * Convert HSL to RGB.
 * @param {{ h: number, s: number, l: number }}
 * @returns {{ r: number, g: number, b: number }}
 */
export function hslToRgb({ h, s, l }) {
  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hn = ((h % 360) + 360) % 360 / 360;
  return {
    r: Math.round(hue2rgb(p, q, hn + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hn) * 255),
    b: Math.round(hue2rgb(p, q, hn - 1 / 3) * 255),
  };
}

/**
 * Rotate the hue of a hex color by a given number of degrees.
 * @param {string} hex
 * @param {number} degrees
 * @returns {string}
 */
export function rotateHue(hex, degrees) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb);
  hsl.h = (hsl.h + degrees + 360) % 360;
  return rgbToHex(hslToRgb(hsl));
}

/**
 * Generate a full complementary palette from a base color.
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

/**
 * Generate a triadic palette — three colors evenly spaced 120° apart on the color wheel.
 * @param {string} hex - base color
 * @returns {{ primary, secondary, tertiary, light, dark }}
 */
export function generateTriadicPalette(hex) {
  const primary = `#${hex.replace(/^#/, '')}`;
  return {
    primary,
    secondary: rotateHue(hex, 120),
    tertiary: rotateHue(hex, 240),
    light: lighten(hex, 0.3),
    dark: darken(hex, 0.3),
  };
}
