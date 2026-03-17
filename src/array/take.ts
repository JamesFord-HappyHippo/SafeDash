/**
 * Takes the first `n` elements from an array.
 *
 * @typeParam T - The type of elements in the array.
 * @param array - The source array.
 * @param n - The number of elements to take. Defaults to 1.
 * @returns A new array with up to `n` elements from the start.
 *
 * @example
 * ```ts
 * import { take } from './take';
 *
 * take([1, 2, 3, 4, 5], 3); // [1, 2, 3]
 * take([1, 2, 3], 5);       // [1, 2, 3]
 * take([1, 2, 3]);           // [1]
 * ```
 */
export function take<T>(array: readonly T[], n: number = 1): T[] {
  if (n <= 0) return [];
  return array.slice(0, n);
}

/**
 * Takes the last `n` elements from an array.
 *
 * @typeParam T - The type of elements in the array.
 * @param array - The source array.
 * @param n - The number of elements to take from the end. Defaults to 1.
 * @returns A new array with up to `n` elements from the end.
 *
 * @example
 * ```ts
 * import { takeRight } from './take';
 *
 * takeRight([1, 2, 3, 4, 5], 3); // [3, 4, 5]
 * takeRight([1, 2, 3], 5);       // [1, 2, 3]
 * takeRight([1, 2, 3]);           // [3]
 * ```
 */
export function takeRight<T>(array: readonly T[], n: number = 1): T[] {
  if (n <= 0) return [];
  if (n >= array.length) return array.slice();
  return array.slice(-n);
}
