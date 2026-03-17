/**
 * Checks if the predicate returns truthy for **all** elements of a collection.
 * Returns `true` for empty collections (vacuous truth).
 * Works on both arrays and plain objects (iterating values).
 *
 * @param collection - The array or object to iterate over
 * @param predicate - Function invoked per element
 * @returns `true` if all elements pass the predicate, otherwise `false`
 *
 * @example
 * every([2, 4, 6], (n) => n % 2 === 0)
 * // true
 *
 * @example
 * every([2, 3, 6], (n) => n % 2 === 0)
 * // false
 *
 * @example
 * every({ a: 1, b: 2, c: 3 }, (v) => typeof v === 'number')
 * // true
 */
export function every<T>(
  collection: readonly T[] | Record<string, T>,
  predicate: (value: T) => unknown,
): boolean {
  const values = toValues(collection);

  for (const value of values) {
    if (!predicate(value)) return false;
  }

  return true;
}

function toValues<T>(collection: readonly T[] | Record<string, T>): T[] {
  return Array.isArray(collection) ? collection : Object.values(collection);
}
