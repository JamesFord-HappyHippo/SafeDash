/**
 * Finds the first element in a collection that matches the given predicate.
 * Supports function predicates and object shorthand (matches key-value pairs).
 * Works on both arrays and plain objects (iterating values).
 *
 * @param collection - The array or object to search
 * @param predicate - Function or object shorthand to match against
 * @returns The first matching element, or `undefined` if none found
 *
 * @example
 * find([1, 2, 3, 4], (n) => n > 2)
 * // 3
 *
 * @example
 * const users = [
 *   { name: 'Alice', active: false },
 *   { name: 'Bob', active: true },
 * ];
 * find(users, { active: true })
 * // { name: 'Bob', active: true }
 *
 * @example
 * find({ a: 1, b: 2, c: 3 }, (v) => v === 2)
 * // 2
 */
export function find<T>(
  collection: readonly T[] | Record<string, T>,
  predicate: ((value: T) => unknown) | Partial<T>,
): T | undefined {
  const values = toValues(collection);
  const test = toPredicate(predicate);

  for (const value of values) {
    if (test(value)) return value;
  }

  return undefined;
}

function toValues<T>(collection: readonly T[] | Record<string, T>): T[] {
  return Array.isArray(collection) ? collection : Object.values(collection);
}

function toPredicate<T>(
  predicate: ((value: T) => unknown) | Partial<T>,
): (value: T) => boolean {
  if (typeof predicate === 'function') {
    return predicate as (value: T) => boolean;
  }

  const entries = Object.entries(predicate as Record<string, unknown>);
  return (value: T) => {
    if (value == null || typeof value !== 'object') return false;
    const obj = value as Record<string, unknown>;
    return entries.every(([k, v]) => obj[k] === v);
  };
}
