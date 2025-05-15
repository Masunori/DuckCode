export default function debounce<Fn extends (...args: unknown[]) => unknown>(fn: Fn, delay: number) {
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