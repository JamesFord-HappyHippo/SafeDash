/**
 * Creates an object composed of keys generated from the results of running
 * each element through `iteratee`. If duplicate keys are produced, the first
 * matching element is kept (subsequent duplicates are ignored).
 * Works on both arrays and plain objects (iterating values).
 *
 * @param collection - The array or object to iterate over
 * @param iteratee - Property name or function that returns the key
 * @returns An object keyed by the iteratee result, with element values
 *
 * @example
 * keyBy([{ id: 'a1', name: 'Alice' }, { id: 'b2', name: 'Bob' }], 'id')
 * // { a1: { id: 'a1', name: 'Alice' }, b2: { id: 'b2', name: 'Bob' } }
 *
 * @example
 * keyBy([6.1, 4.2, 6.3], Math.floor)
 * // { '4': 4.2, '6': 6.1 }
 *
 * @example
 * keyBy({ x: { v: 1 }, y: { v: 2 } }, 'v')
 * // { '1': { v: 1 }, '2': { v: 2 } }
 */
export function keyBy<T>(
  collection: readonly T[] | Record<string, T>,
  iteratee: ((value: T) => string | number) | keyof T & string,
): Record<string, T> {
  const values = toValues(collection);
  const getKey = toIteratee(iteratee);
  const result: Record<string, T> = Object.create(null);

  for (const value of values) {
    const key = String(getKey(value));
    if (!(key in result)) {
      result[key] = value;
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
