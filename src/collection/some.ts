/**
 * Checks if the predicate returns truthy for **any** element of a collection.
 * Returns `false` for empty collections.
 * Works on both arrays and plain objects (iterating values).
 *
 * @param collection - The array or object to iterate over
 * @param predicate - Function invoked per element
 * @returns `true` if any element passes the predicate, otherwise `false`
 *
 * @example
 * some([1, 2, 3], (n) => n > 2)
 * // true
 *
 * @example
 * some([1, 2, 3], (n) => n > 5)
 * // false
 *
 * @example
 * some({ a: 'x', b: 'y' }, (v) => v === 'y')
 * // true
 */
export function some<T>(
  collection: readonly T[] | Record<string, T>,
  predicate: (value: T) => unknown,
): boolean {
  const values = toValues(collection);

  for (const value of values) {
    if (predicate(value)) return true;
  }

  return false;
}

function toValues<T>(collection: readonly T[] | Record<string, T>): T[] {
  return Array.isArray(collection) ? collection : Object.values(collection);
}
