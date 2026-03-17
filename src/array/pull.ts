/**
 * Returns a new array with all occurrences of the specified values removed.
 * Uses strict equality (`===`) for comparisons. Never mutates the input array.
 *
 * @typeParam T - The type of elements in the array.
 * @param array - The source array.
 * @param values - The values to remove.
 * @returns A new array with the specified values removed.
 *
 * @example
 * ```ts
 * import { pull } from './pull';
 *
 * pull([1, 2, 3, 2, 4], 2, 4); // [1, 3]
 * pull(['a', 'b', 'a'], 'a');   // ['b']
 * ```
 */
export function pull<T>(array: readonly T[], ...values: T[]): T[] {
  const excludeSet = new Set(values);
  return array.filter((item) => !excludeSet.has(item));
}

/**
 * Returns a new array with all occurrences of the values in `values` removed.
 * Uses strict equality (`===`) for comparisons. Never mutates the input array.
 *
 * @typeParam T - The type of elements in the array.
 * @param array - The source array.
 * @param values - An array of values to remove.
 * @returns A new array with the specified values removed.
 *
 * @example
 * ```ts
 * import { pullAll } from './pull';
 *
 * pullAll([1, 2, 3, 2, 4], [2, 4]); // [1, 3]
 * pullAll(['a', 'b', 'c'], ['a', 'c']); // ['b']
 * ```
 */
export function pullAll<T>(array: readonly T[], values: readonly T[]): T[] {
  const excludeSet = new Set(values);
  return array.filter((item) => !excludeSet.has(item));
}
