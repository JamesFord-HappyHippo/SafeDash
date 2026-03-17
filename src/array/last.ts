/**
 * Returns the last element of an array, or `undefined` if the array is empty.
 *
 * @typeParam T - The type of elements in the array.
 * @param array - The source array.
 * @returns The last element, or `undefined` if the array is empty.
 *
 * @example
 * ```ts
 * import { last } from './last';
 *
 * last([1, 2, 3]); // 3
 * last([]);         // undefined
 * ```
 */
export function last<T>(array: readonly T[]): T | undefined {
  return array.length > 0 ? array[array.length - 1] : undefined;
}
