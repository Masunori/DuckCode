/**
 * Converts an RGB color to grayscale using the NTSC formula.
 * 
 * @param color The hexstring of the colour: '#RRGGBB'
 * @returns The grayscale value of the color
 */
export function toGrayscale(color: string): number {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * Compute the color value for a button when hovered, given its normal color.
 * @param color The normal color
 * @returns The color when hovered
 */
export function computeHoverColour(color: string): string {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    const brighten = (val: number) => val + Math.max(Math.round(0.4 * (128 - val)), 24);
    const darken = (val: number) => val - Math.max(Math.round(0.4 * (val - 128)), 24);

    const nr = r < 128 ? brighten(r) : darken(r);
    const ng = g < 128 ? brighten(g) : darken(g);
    const nb = b < 128 ? brighten(b) : darken(b);

    const toHex = (val: number) => val.toString(16).padStart(2, '0');
    return `#${toHex(nr)}${toHex(ng)}${toHex(nb)}`;
}