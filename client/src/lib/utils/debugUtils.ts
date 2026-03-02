// Disable debug messages in production builds
const debug: boolean = process.env.NODE_ENV === "development";

/**
 * Prints a debug message to the console with a timestamp.
 * @param src - The source of the debug message (e.g., the file or component name).
 * @param data - Same as console.log parameters.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function printd(src: string, ...data: any[]) {
    if (!debug) return;

    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${src}]`, ...data);
}