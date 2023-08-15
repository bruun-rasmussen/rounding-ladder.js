# Rounding Ladder

This package exports a Rounder class that can be used to round numbers to fixed steps on a decadic (or _n_-adic) ladder,
i.e. a ladder of steps that repeat in powers of 10 (or _n_).

For example, given the initial steps 10, 12, 15, 20, 30, 40, 60, 80, 
a decadic ladder would repeat these steps at 100, 120, 150, 200, 300, 400, 600, 800, 
and again at 1000, 1200, 1500, 2000, 3000, 4000, 6000, 8000, and so on.

The Rounder class can be used to round numbers to the nearest step on the ladder,
or to round numbers up or down to the next step on the ladder.

The Rounder offers several [different rounding methods](https://en.wikipedia.org/wiki/Rounding), including round half up, round half down, round half to even.

## Usage

```js
import Rounder from 'rounding-ladder';

const rounder = new Rounder([10, 12, 15, 20, 30, 40, 60, 80]);

rounder.round(13); // 12
rounder.round(17); // 20
rounder.round(2456); // 2000
```