/**
 * Sorts a collection by multiple iteratees, each with its own sort direction.
 * Returns a new array — never mutates the original.
 * Works on both arrays and plain objects (iterating values).
 *
 * @param collection - The array or object to iterate over
 * @param iteratees - Array of property names or functions to sort by
 * @param orders - Array of sort directions ('asc' or 'desc') corresponding to each iteratee. Defaults to 'asc' for all.
 * @returns A new sorted array
 *
 * @example
 * const users = [
 *   { name: 'Alice', age: 30 },
 *   { name: 'Bob', age: 25 },
 *   { name: 'Alice', age: 25 },
 * ];
 * orderBy(users, ['name', 'age'], ['asc', 'desc'])
 * // [{ name: 'Alice', age: 30 }, { name: 'Alice', age: 25 }, { name: 'Bob', age: 25 }]
 *
 * @example
 * orderBy([3, 1, 2], [(n) => n], ['desc'])
 * // [3, 2, 1]
 *
 * @example
 * orderBy({ a: 3, b: 1, c: 2 }, [(v) => v], ['asc'])
 * // [1, 2, 3]
 */
export function orderBy<T>(
  collection: readonly T[] | Record<string, T>,
  iteratees: (((value: T) => unknown) | keyof T & string)[],
  orders?: ('asc' | 'desc')[],
): T[] {
  const values = toValues(collection);
  const getters = iteratees.map(toIteratee);
  const dirs = orders ?? [];

  return [...values].sort((a, b) => {
    for (let i = 0; i < getters.length; i++) {
      const ka = getters[i](a);
      const kb = getters[i](b);
      if ((ka as any) < (kb as any)) return dirs[i] === 'desc' ? 1 : -1;
      if ((ka as any) > (kb as any)) return dirs[i] === 'desc' ? -1 : 1;
    }
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
