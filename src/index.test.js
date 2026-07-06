import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { hexToRgb, rgbToHex, complementary, lighten, darken, generatePalette } from './index.js';

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
