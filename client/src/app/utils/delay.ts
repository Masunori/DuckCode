/**
 * Simulates a delay. Because this function returns a Promise, to actually block, call this with `await`.
 * 
 * @param ms The delay duration in milliseconds
 * @returns A Promise that will resolve after 'ms' milliseconds
 */

export default function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}