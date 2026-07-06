# hex-palette

Generate beautiful color palettes from a hex color.

## Usage

```bash
node src/cli.js #3498db
```

## API

```js
import { generatePalette, lighten, darken, complementary } from './src/index.js';

const palette = generatePalette('#3498db');
// { base, light, dark, complementary, accent }
```

## Test

```bash
node --test src/**/*.test.js
```
