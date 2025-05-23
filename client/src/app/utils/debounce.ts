/**
 * Calls a function only after some time. This makes sure that if there are multiple calls to 
 * the same function in quick succession, only the last call is registered.
 * 
 * @param fn The function that will be invoked
 * @param delay The delay before the function is actually invoked.
 * @returns A debounced version of the same function that is only called after the delay.
 */
export default function debounce<Fn extends (...args: never[]) => unknown>(fn: Fn, delay: number) {
    let timeoutId: NodeJS.Timeout;
    return function (...args: Parameters<Fn>) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}