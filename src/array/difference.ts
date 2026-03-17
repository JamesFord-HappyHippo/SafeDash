/**
 * Creates an array of values from `array` that are not in `exclude`.
 *
 * @example
 * difference([2, 1, 3], [2, 3])  // [1]
 */
export function difference<T>(array: readonly T[], exclude: readonly T[]): T[] {
  if (!Array.isArray(array)) return [];
  if (!Array.isArray(exclude) || exclude.length === 0) return [...array];
  const set = new Set(exclude);
  return array.filter(item => !set.has(item));
}

/**
 * Creates an array of values present in all given arrays.
 *
 * @example
 * intersection([2, 1, 3], [2, 3, 4])  // [2, 3]
 */
export function intersection<T>(array: readonly T[], other: readonly T[]): T[] {
  if (!Array.isArray(array) || !Array.isArray(other)) return [];
  const set = new Set(other);
  return array.filter(item => set.has(item));
}
