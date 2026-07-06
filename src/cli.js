import { generatePalette, generateTriadicPalette } from './index.js';

const args = process.argv.slice(2);
const input = args.find((a) => !a.startsWith('-'));
const schemeIdx = args.indexOf('--scheme');
const scheme = schemeIdx !== -1 ? args[schemeIdx + 1] : 'complementary';

if (!input) {
  console.log('Usage: hex-palette <hex-color> [--scheme complementary|triadic]');
  console.log('Example: hex-palette #c06b5e --scheme triadic');
  process.exit(1);
}

try {
  const palette =
    scheme === 'triadic'
      ? generateTriadicPalette(input)
      : generatePalette(input);

  console.log(`\n🎨 Color Palette (${scheme})\n`);
  for (const [name, color] of Object.entries(palette)) {
    console.log(`  ${name.padEnd(15)} ${color}`);
  }
  console.log();
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}
