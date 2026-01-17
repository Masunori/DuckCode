// const debug: boolean = process.env.NODE_ENV === "development";
const debug: boolean = true;

/**
 * Prints a debug message to the console with a timestamp.
 * @param src - The source of the debug message (e.g., the file or component name).
 * @param message - The debug message to print.
 * @param optionalParams - Optional additional parameters to include in the log.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function printd(src: string, message: string, ...optionalParams: any[]) {
    if (!debug) return;

    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${src}] ${message}`, ...optionalParams);
}