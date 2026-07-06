import { generatePalette, generateAnalogousPalette } from './index.js';

const args = process.argv.slice(2);
const input = args.find((a) => !a.startsWith('-'));
const schemeFlag = args.includes('--scheme')
  ? args[args.indexOf('--scheme') + 1]
  : 'complementary';

if (!input) {
  console.log('Usage: hex-palette <hex-color> [--scheme complementary|analogous]');
  console.log('Example: hex-palette #3498db --scheme analogous');
  process.exit(1);
}

try {
  const palette =
    schemeFlag === 'analogous'
      ? generateAnalogousPalette(input)
      : generatePalette(input);

  console.log(`\n🎨 Color Palette (${schemeFlag})\n`);
  for (const [name, color] of Object.entries(palette)) {
    console.log(`  ${name.padEnd(15)} ${color}`);
  }
  console.log();
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}
