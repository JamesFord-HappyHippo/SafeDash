/**
 * Creates an array of elements split into groups of `size`.
 * If array can't be split evenly, the final chunk contains remaining elements.
 *
 * @param array - The array to process
 * @param size - The length of each chunk (default: 1)
 * @returns The new array of chunks
 *
 * @example
 * chunk([1, 2, 3, 4, 5], 2)  // [[1, 2], [3, 4], [5]]
 * chunk([1, 2, 3, 4], 3)     // [[1, 2, 3], [4]]
 */
export function chunk<T>(array: readonly T[], size: number = 1): T[][] {
  if (!Array.isArray(array) || array.length === 0) return [];
  const s = Math.max(Math.floor(size), 1);
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += s) {
    result.push(array.slice(i, i + s));
  }
  return result;
}
