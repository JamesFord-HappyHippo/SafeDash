/**
 * Returns the index of the first element in the array that satisfies the
 * provided predicate. Returns `-1` if no element matches.
 *
 * @typeParam T - The type of elements in the array.
 * @param array - The source array.
 * @param predicate - A function invoked for each element. Receives the element,
 *   its index, and the full array.
 * @param fromIndex - The index to start searching from. Defaults to 0.
 * @returns The index of the first matching element, or `-1`.
 *
 * @example
 * ```ts
 * import { findIndex } from './findIndex';
 *
 * findIndex([1, 2, 3, 4], (n) => n > 2);    // 2
 * findIndex([1, 2, 3, 4], (n) => n > 2, 3); // 3
 * findIndex([1, 2, 3], (n) => n > 5);       // -1
 * ```
 */
export function findIndex<T>(
  array: readonly T[],
  predicate: (value: T, index: number, array: readonly T[]) => boolean,
  fromIndex: number = 0,
): number {
  const start = Math.max(fromIndex, 0);
  for (let i = start; i < array.length; i++) {
    if (predicate(array[i], i, array)) {
      return i;
    }
  }
  return -1;
}

/**
 * Returns the index of the last element in the array that satisfies the
 * provided predicate, searching from right to left. Returns `-1` if no
 * element matches.
 *
 * @typeParam T - The type of elements in the array.
 * @param array - The source array.
 * @param predicate - A function invoked for each element. Receives the element,
 *   its index, and the full array.
 * @param fromIndex - The index to start searching backwards from.
 *   Defaults to `array.length - 1`.
 * @returns The index of the last matching element, or `-1`.
 *
 * @example
 * ```ts
 * import { findLastIndex } from './findIndex';
 *
 * findLastIndex([1, 2, 3, 4, 3], (n) => n === 3);    // 4
 * findLastIndex([1, 2, 3, 4, 3], (n) => n === 3, 3); // 2
 * findLastIndex([1, 2, 3], (n) => n > 5);             // -1
 * ```
 */
export function findLastIndex<T>(
  array: readonly T[],
  predicate: (value: T, index: number, array: readonly T[]) => boolean,
  fromIndex?: number,
): number {
  const start = fromIndex !== undefined
    ? Math.min(fromIndex, array.length - 1)
    : array.length - 1;
  for (let i = start; i >= 0; i--) {
    if (predicate(array[i], i, array)) {
      return i;
    }
  }
  return -1;
}
