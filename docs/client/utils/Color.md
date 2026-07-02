# Colors

The color utilities expose two functions related to colors:

- `toGrayScale: (color: string) => number`: converts an RGB color to grayscale using the NTSC formula
- `computeHoverColor: (color: string) => string`: given a color X, compute the color Y, which is the color to display if an element of color X is hovered upon.
  
The idea behind this is that any color can be represented as a 3-dimensional vector. The color space is a cube from (0, 0, 0) to (255, 255, 255), with the center color located at (128, 128, 128). 

Color Y will tend towards the center from color X, with each dimension shifting 40% closer to the center, shifting minimally by 24, even if it will cause an overshoot from the center.

```ts
// app/utils/colors.ts
const brighten = (val: number) => val + Math.max(Math.round(0.4 * (128 - val)), 24);
const darken = (val: number) => val - Math.max(Math.round(0.4 * (val - 128)), 24);
```