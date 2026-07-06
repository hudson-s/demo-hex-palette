import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  hexToRgb, rgbToHex, complementary, lighten, darken,
  generatePalette, rgbToHsl, hslToRgb, rotateHue, generateAnalogousPalette,
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
    const result = lighten('#000000', 0.5);
    assert.strictEqual(result, '#808080');
  });
  it('darken moves toward black', () => {
    const result = darken('#ffffff', 0.5);
    assert.strictEqual(result, '#808080');
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
    const rgb = { r: 255, g: 0, b: 0 };
    const hsl = rgbToHsl(rgb);
    assert.ok(Math.abs(hsl.h - 0) < 1 || Math.abs(hsl.h - 360) < 1);
    assert.ok(Math.abs(hsl.s - 1) < 0.01);
    assert.ok(Math.abs(hsl.l - 0.5) < 0.01);
    const back = hslToRgb(hsl);
    assert.strictEqual(back.r, 255);
    assert.strictEqual(back.g, 0);
    assert.strictEqual(back.b, 0);
  });

  it('roundtrips gray (achromatic)', () => {
    const rgb = { r: 128, g: 128, b: 128 };
    const hsl = rgbToHsl(rgb);
    assert.strictEqual(hsl.s, 0);
    const back = hslToRgb(hsl);
    assert.strictEqual(back.r, 128);
    assert.strictEqual(back.g, 128);
    assert.strictEqual(back.b, 128);
  });

  it('roundtrips #3498db', () => {
    const rgb = hexToRgb('#3498db');
    const hsl = rgbToHsl(rgb);
    assert.ok(hsl.h > 190 && hsl.h < 210, `hue should be ~204, got ${hsl.h}`);
    const back = hslToRgb(hsl);
    assert.strictEqual(back.r, 52);
    assert.strictEqual(back.g, 152);
    assert.strictEqual(back.b, 219);
  });
});

describe('rotateHue', () => {
  it('rotates by 0 returns same color', () => {
    assert.strictEqual(rotateHue('#ff0000', 0), '#ff0000');
  });

  it('rotates by 180 returns complementary', () => {
    const result = rotateHue('#ff0000', 180);
    assert.strictEqual(result, '#00ffff');
  });

  it('wraps around 360', () => {
    const result = rotateHue('#ff0000', 360);
    assert.strictEqual(result, '#ff0000');
  });

  it('handles negative rotation', () => {
    const result = rotateHue('#ff0000', -30);
    assert.ok(result.startsWith('#'));
    assert.strictEqual(result.length, 7);
  });
});

describe('generateAnalogousPalette', () => {
  it('returns 5 keys', () => {
    const p = generateAnalogousPalette('#3498db');
    assert.strictEqual(Object.keys(p).length, 5);
    assert.ok(p.base);
    assert.ok(p.warm);
    assert.ok(p.cool);
    assert.ok(p.light);
    assert.ok(p.dark);
  });

  it('warm and cool differ from base', () => {
    const p = generateAnalogousPalette('#3498db');
    assert.notStrictEqual(p.warm, p.base);
    assert.notStrictEqual(p.cool, p.base);
    assert.notStrictEqual(p.warm, p.cool);
  });

  it('accepts custom angle', () => {
    const p30 = generateAnalogousPalette('#3498db', 30);
    const p45 = generateAnalogousPalette('#3498db', 45);
    assert.notStrictEqual(p30.warm, p45.warm);
  });

  it('works with black', () => {
    const p = generateAnalogousPalette('#000000');
    assert.strictEqual(p.base, '#000000');
    assert.ok(p.warm.startsWith('#'));
    assert.ok(p.cool.startsWith('#'));
  });

  it('works with white', () => {
    const p = generateAnalogousPalette('#ffffff');
    assert.strictEqual(p.base, '#ffffff');
    assert.ok(p.warm.startsWith('#'));
  });
});
