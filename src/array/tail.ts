/**
 * Returns all elements of an array except the first.
 *
 * @typeParam T - The type of elements in the array.
 * @param array - The source array.
 * @returns A new array containing all elements except the first.
 *
 * @example
 * ```ts
 * import { tail } from './tail';
 *
 * tail([1, 2, 3]); // [2, 3]
 * tail([1]);        // []
 * tail([]);         // []
 * ```
 */
export function tail<T>(array: readonly T[]): T[] {
  return array.slice(1);
}

/**
 * Returns all elements of an array except the last.
 *
 * @typeParam T - The type of elements in the array.
 * @param array - The source array.
 * @returns A new array containing all elements except the last.
 *
 * @example
 * ```ts
 * import { initial } from './tail';
 *
 * initial([1, 2, 3]); // [1, 2]
 * initial([1]);        // []
 * initial([]);         // []
 * ```
 */
export function initial<T>(array: readonly T[]): T[] {
  return array.length > 0 ? array.slice(0, -1) : [];
}
