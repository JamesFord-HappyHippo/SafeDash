/**
 * Returns a new array excluding all specified values.
 * Uses strict equality (`===`) for comparisons.
 *
 * @typeParam T - The type of elements in the array.
 * @param array - The source array.
 * @param values - The values to exclude.
 * @returns A new array with the specified values removed.
 *
 * @example
 * ```ts
 * import { without } from './without';
 *
 * without([1, 2, 3, 2, 4], 2, 4);   // [1, 3]
 * without(['a', 'b', 'c'], 'b');     // ['a', 'c']
 * without([1, 2, 3]);                // [1, 2, 3]
 * ```
 */
export function without<T>(array: readonly T[], ...values: T[]): T[] {
  const excludeSet = new Set(values);
  return array.filter((item) => !excludeSet.has(item));
}
