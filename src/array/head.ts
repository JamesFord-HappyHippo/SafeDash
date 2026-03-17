/**
 * Returns the first element of an array, or `undefined` if the array is empty.
 *
 * @typeParam T - The type of elements in the array.
 * @param array - The source array.
 * @returns The first element, or `undefined` if the array is empty.
 *
 * @example
 * ```ts
 * import { head } from './head';
 *
 * head([1, 2, 3]); // 1
 * head([]);         // undefined
 * ```
 */
export function head<T>(array: readonly T[]): T | undefined {
  return array.length > 0 ? array[0] : undefined;
}

/**
 * Alias for {@link head}. Returns the first element of an array.
 *
 * @example
 * ```ts
 * import { first } from './head';
 *
 * first(['a', 'b', 'c']); // 'a'
 * ```
 */
export const first = head;
