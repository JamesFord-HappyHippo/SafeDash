/**
 * Creates an object where keys are the result of running each element through
 * `iteratee`, and values are the count of elements that produced that key.
 * Works on both arrays and plain objects (iterating values).
 *
 * @param collection - The array or object to iterate over
 * @param iteratee - Property name or function that returns the grouping key
 * @returns An object mapping each key to its occurrence count
 *
 * @example
 * countBy([6.1, 4.2, 6.3], Math.floor)
 * // { '4': 1, '6': 2 }
 *
 * @example
 * countBy(['one', 'two', 'three'], 'length')
 * // { '3': 2, '5': 1 }
 *
 * @example
 * countBy({ a: 'yes', b: 'no', c: 'yes' }, (v) => v)
 * // { yes: 2, no: 1 }
 */
export function countBy<T>(
  collection: readonly T[] | Record<string, T>,
  iteratee: ((value: T) => string | number) | keyof T & string,
): Record<string, number> {
  const values = toValues(collection);
  const getKey = toIteratee(iteratee);
  const result: Record<string, number> = Object.create(null);

  for (const value of values) {
    const key = String(getKey(value));
    result[key] = (result[key] ?? 0) + 1;
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
