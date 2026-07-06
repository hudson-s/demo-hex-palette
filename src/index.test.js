import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  hexToRgb, rgbToHex, complementary, lighten, darken,
  generatePalette, rgbToHsl, hslToRgb, rotateHue, generateTriadicPalette,
} from './index.js';

describe('hexToRgb', () => {
  it('parses #ff8800', () => {
    assert.deepStrictEqual(hexToRgb('#ff8800'), { r: 255, g: 136, b: 0 });
  });
  it('parses without hash', () => {
    assert.deepStrictEqual(hexToRgb('3498db'), { r: 52, g: 152, b: 219 });
  });
  it('throws on invalid input', () => {
    assert.throws(() => hexToRgb('xyz'));
  });
});

describe('rgbToHex', () => {
  it('converts back', () => {
    assert.strictEqual(rgbToHex({ r: 255, g: 136, b: 0 }), '#ff8800');
  });
});

describe('complementary', () => {
  it('returns inverse', () => {
    assert.strictEqual(complementary('#000000'), '#ffffff');
    assert.strictEqual(complementary('#ffffff'), '#000000');
  });
});

describe('lighten / darken', () => {
  it('lighten moves toward white', () => {
    assert.strictEqual(lighten('#000000', 0.5), '#808080');
  });
  it('darken moves toward black', () => {
    assert.strictEqual(darken('#ffffff', 0.5), '#808080');
  });
});

describe('generatePalette', () => {
  it('returns 5 keys', () => {
    const p = generatePalette('#3498db');
    assert.strictEqual(Object.keys(p).length, 5);
    assert.ok(p.base);
    assert.ok(p.light);
    assert.ok(p.dark);
    assert.ok(p.complementary);
    assert.ok(p.accent);
  });
});

describe('rgbToHsl / hslToRgb roundtrip', () => {
  it('roundtrips pure red', () => {
    const hsl = rgbToHsl({ r: 255, g: 0, b: 0 });
    assert.ok(Math.abs(hsl.h - 0) < 1 || Math.abs(hsl.h - 360) < 1);
    assert.ok(Math.abs(hsl.s - 1) < 0.01);
    assert.ok(Math.abs(hsl.l - 0.5) < 0.01);
    const back = hslToRgb(hsl);
    assert.strictEqual(back.r, 255);
    assert.strictEqual(back.g, 0);
    assert.strictEqual(back.b, 0);
  });

  it('roundtrips gray', () => {
    const hsl = rgbToHsl({ r: 128, g: 128, b: 128 });
    assert.strictEqual(hsl.s, 0);
    assert.strictEqual(hslToRgb(hsl).r, 128);
  });
});

describe('rotateHue', () => {
  it('rotate 0 returns same color', () => {
    assert.strictEqual(rotateHue('#ff0000', 0), '#ff0000');
  });
  it('rotate 180 returns complementary', () => {
    assert.strictEqual(rotateHue('#ff0000', 180), '#00ffff');
  });
  it('wraps around 360', () => {
    assert.strictEqual(rotateHue('#ff0000', 360), '#ff0000');
  });
});

describe('generateTriadicPalette', () => {
  it('returns 5 keys', () => {
    const p = generateTriadicPalette('#c06b5e');
    assert.strictEqual(Object.keys(p).length, 5);
    assert.ok(p.primary);
    assert.ok(p.secondary);
    assert.ok(p.tertiary);
    assert.ok(p.light);
    assert.ok(p.dark);
  });

  it('primary matches input', () => {
    const p = generateTriadicPalette('#c06b5e');
    assert.strictEqual(p.primary, '#c06b5e');
  });

  it('three colors are all different', () => {
    const p = generateTriadicPalette('#c06b5e');
    assert.notStrictEqual(p.primary, p.secondary);
    assert.notStrictEqual(p.secondary, p.tertiary);
    assert.notStrictEqual(p.primary, p.tertiary);
  });

  it('secondary is 120° from primary', () => {
    const p = generateTriadicPalette('#ff0000');
    assert.strictEqual(p.secondary, '#00ff00');
  });

  it('tertiary is 240° from primary', () => {
    const p = generateTriadicPalette('#ff0000');
    assert.strictEqual(p.tertiary, '#0000ff');
  });

  it('works with black', () => {
    const p = generateTriadicPalette('#000000');
    assert.strictEqual(p.primary, '#000000');
  });

  it('works with white', () => {
    const p = generateTriadicPalette('#ffffff');
    assert.strictEqual(p.primary, '#ffffff');
  });
});
