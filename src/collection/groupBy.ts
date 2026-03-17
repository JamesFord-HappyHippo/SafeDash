/**
 * Groups elements of a collection by a key derived from each element.
 * Accepts a property name string or a function that returns the grouping key.
 * Works on both arrays and plain objects (iterating values).
 *
 * @param collection - The array or object to iterate over
 * @param iteratee - Property name or function that returns the group key
 * @returns An object mapping group keys to arrays of matching elements
 *
 * @example
 * groupBy([6.1, 4.2, 6.3], Math.floor)
 * // { '4': [4.2], '6': [6.1, 6.3] }
 *
 * @example
 * groupBy(['one', 'two', 'three'], 'length')
 * // { '3': ['one', 'two'], '5': ['three'] }
 *
 * @example
 * groupBy({ a: 1, b: 2, c: 1 }, (v) => v)
 * // { '1': [1, 1], '2': [2] }
 */
export function groupBy<T>(
  collection: readonly T[] | Record<string, T>,
  iteratee: ((value: T) => string | number) | keyof T & string,
): Record<string, T[]> {
  const values = toValues(collection);
  const getKey = toIteratee(iteratee);
  const result: Record<string, T[]> = Object.create(null);

  for (const value of values) {
    const key = String(getKey(value));
    if (key in result) {
      result[key].push(value);
    } else {
      result[key] = [value];
    }
  }

  return result;
}

function toValues<T>(collection: readonly T[] | Record<string, T>): T[] {
  return Array.isArray(collection) ? collection : Object.values(collection);
}

function toIteratee<T>(
  iteratee: ((value: T) => string | number) | string,
): (value: T) => string | number {
  if (typeof iteratee === 'function') return iteratee;
  return (value: T) => {
    if (value != null && typeof value === 'object') {
      return (value as Record<string, unknown>)[iteratee] as string | number;
    }
    return String(value);
  };
}
