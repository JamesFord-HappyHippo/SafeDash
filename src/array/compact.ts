/**
 * Creates an array with all falsy values removed.
 * false, null, 0, "", undefined, and NaN are falsy.
 *
 * @param array - The array to compact
 * @returns The new array of truthy values
 *
 * @example
 * compact([0, 1, false, 2, '', 3, null, undefined, NaN])
 * // [1, 2, 3]
 */
export function compact<T>(array: readonly T[]): NonNullable<T>[] {
  if (!Array.isArray(array)) return [];
  return array.filter(Boolean) as NonNullable<T>[];
}
