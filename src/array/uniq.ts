/**
 * Creates a duplicate-free version of an array.
 *
 * @param array - The array to deduplicate
 * @returns The new array with unique values
 *
 * @example
 * uniq([2, 1, 2, 3, 1])  // [2, 1, 3]
 */
export function uniq<T>(array: readonly T[]): T[] {
  if (!Array.isArray(array)) return [];
  return [...new Set(array)];
}

/**
 * Like `uniq`, but accepts an iteratee to compute the uniqueness key.
 *
 * @example
 * uniqBy([{ id: 1 }, { id: 2 }, { id: 1 }], o => o.id)
 * // [{ id: 1 }, { id: 2 }]
 */
export function uniqBy<T>(array: readonly T[], iteratee: (value: T) => unknown): T[] {
  if (!Array.isArray(array)) return [];
  const seen = new Set<unknown>();
  const result: T[] = [];
  for (const item of array) {
    const key = iteratee(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}
