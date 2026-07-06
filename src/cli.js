import { generatePalette } from './index.js';

const input = process.argv[2];

if (!input) {
  console.log('Usage: hex-palette <hex-color>');
  console.log('Example: hex-palette #3498db');
  process.exit(1);
}

try {
  const palette = generatePalette(input);
  console.log('\n🎨 Color Palette\n');
  for (const [name, color] of Object.entries(palette)) {
    console.log(`  ${name.padEnd(15)} ${color}`);
  }
  console.log();
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}
