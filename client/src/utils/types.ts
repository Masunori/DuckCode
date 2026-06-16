/**
 * Mimics the type of the set function in React useState
 */
export type SetState<T> = (arg: T | ((prev: T) => T)) => void;

/**
    The list of all paths in the user object.
    Type 'T' is the type of the object to extract all types.
*/
export type Paths<T, Prev extends string = ""> = {
    [K in keyof T]: T[K] extends object
        ? `${Prev}${Extract<K, string>}` | Paths<T[K], `${Prev}${Extract<K, string>}.`>
        : `${Prev}${Extract<K, string>}`;
}[keyof T];

/**
    The list of all leaf paths in the user object, that is, the value whose key is this path cannot be an object.
    Type 'T' is the type of the object to extract all types.
*/
export type LeafPaths<T, Prev extends string = ""> = {
    [K in keyof T]: T[K] extends object
        ? LeafPaths<T[K], `${Prev}${Extract<K, string>}.`>
        : `${Prev}${Extract<K, string>}`;
}[keyof T];