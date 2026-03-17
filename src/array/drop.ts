/**
 * Drops the first `n` elements from an array.
 *
 * @typeParam T - The type of elements in the array.
 * @param array - The source array.
 * @param n - The number of elements to drop from the start. Defaults to 1.
 * @returns A new array with the first `n` elements removed.
 *
 * @example
 * ```ts
 * import { drop } from './drop';
 *
 * drop([1, 2, 3, 4, 5], 2); // [3, 4, 5]
 * drop([1, 2, 3]);           // [2, 3]
 * drop([1, 2, 3], 5);       // []
 * ```
 */
export function drop<T>(array: readonly T[], n: number = 1): T[] {
  if (n <= 0) return array.slice();
  return array.slice(n);
}

/**
 * Drops the last `n` elements from an array.
 *
 * @typeParam T - The type of elements in the array.
 * @param array - The source array.
 * @param n - The number of elements to drop from the end. Defaults to 1.
 * @returns A new array with the last `n` elements removed.
 *
 * @example
 * ```ts
 * import { dropRight } from './drop';
 *
 * dropRight([1, 2, 3, 4, 5], 2); // [1, 2, 3]
 * dropRight([1, 2, 3]);           // [1, 2]
 * dropRight([1, 2, 3], 5);       // []
 * ```
 */
export function dropRight<T>(array: readonly T[], n: number = 1): T[] {
  if (n <= 0) return array.slice();
  if (n >= array.length) return [];
  return array.slice(0, -n);
}
