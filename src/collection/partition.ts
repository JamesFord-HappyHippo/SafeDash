/**
 * Splits a collection into two arrays: the first containing elements for which
 * the predicate returns truthy, the second containing the rest.
 * Works on both arrays and plain objects (iterating values).
 *
 * @param collection - The array or object to iterate over
 * @param predicate - Function invoked per element, returns truthy/falsy
 * @returns A tuple of [truthy, falsy] arrays
 *
 * @example
 * partition([1, 2, 3, 4, 5], (n) => n % 2 === 0)
 * // [[2, 4], [1, 3, 5]]
 *
 * @example
 * partition(['cat', 'bat', 'cup'], (s) => s.startsWith('c'))
 * // [['cat', 'cup'], ['bat']]
 *
 * @example
 * partition({ a: 1, b: 2, c: 3 }, (v) => v > 1)
 * // [[2, 3], [1]]
 */
export function partition<T>(
  collection: readonly T[] | Record<string, T>,
  predicate: (value: T) => unknown,
): [T[], T[]] {
  const values = toValues(collection);
  const truthy: T[] = [];
  const falsy: T[] = [];

  for (const value of values) {
    if (predicate(value)) {
      truthy.push(value);
    } else {
      falsy.push(value);
    }
  }

  return [truthy, falsy];
}

function toValues<T>(collection: readonly T[] | Record<string, T>): T[] {
  return Array.isArray(collection) ? collection : Object.values(collection);
}
