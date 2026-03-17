/**
 * Creates a new array sorted in ascending order by the result of running
 * each element through the given iteratee. Never mutates the original array.
 * Works on both arrays and plain objects (iterating values).
 *
 * @param collection - The array or object to iterate over
 * @param iteratee - Property name or function that returns the sort value
 * @returns A new sorted array
 *
 * @example
 * sortBy([3, 1, 2], (n) => n)
 * // [1, 2, 3]
 *
 * @example
 * sortBy([{ name: 'Zoe', age: 25 }, { name: 'Ada', age: 30 }], 'name')
 * // [{ name: 'Ada', age: 30 }, { name: 'Zoe', age: 25 }]
 *
 * @example
 * sortBy({ a: 3, b: 1, c: 2 }, (v) => v)
 * // [1, 2, 3]
 */
export function sortBy<T>(
  collection: readonly T[] | Record<string, T>,
  iteratee: ((value: T) => unknown) | keyof T & string,
): T[] {
  const values = toValues(collection);
  const getKey = toIteratee(iteratee);

  return [...values].sort((a, b) => {
    const ka = getKey(a);
    const kb = getKey(b);
    if ((ka as any) < (kb as any)) return -1;
    if ((ka as any) > (kb as any)) return 1;
    return 0;
  });
}

function toValues<T>(collection: readonly T[] | Record<string, T>): T[] {
  return Array.isArray(collection) ? collection : Object.values(collection);
}

function toIteratee<T>(
  iteratee: ((value: T) => unknown) | string,
): (value: T) => unknown {
  if (typeof iteratee === 'function') return iteratee;
  return (value: T) => {
    if (value != null && typeof value === 'object') {
      return (value as Record<string, unknown>)[iteratee];
    }
    return value;
  };
}
