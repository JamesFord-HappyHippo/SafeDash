/**
 * Creates an array of grouped elements from corresponding indices.
 *
 * @example
 * zip(['a', 'b'], [1, 2], [true, false])
 * // [['a', 1, true], ['b', 2, false]]
 */
export function zip<T>(...arrays: readonly (readonly T[])[]): T[][] {
  if (arrays.length === 0) return [];
  const maxLen = Math.max(...arrays.map(a => Array.isArray(a) ? a.length : 0));
  const result: T[][] = [];
  for (let i = 0; i < maxLen; i++) {
    result.push(arrays.map(a => (Array.isArray(a) ? a[i] : undefined) as T));
  }
  return result;
}

/**
 * The inverse of `zip` — unpacks grouped arrays.
 *
 * @example
 * unzip([['a', 1], ['b', 2]])
 * // [['a', 'b'], [1, 2]]
 */
export function unzip<T>(array: readonly (readonly T[])[]): T[][] {
  if (!Array.isArray(array) || array.length === 0) return [];
  const maxLen = Math.max(...array.map(a => Array.isArray(a) ? a.length : 0));
  const result: T[][] = [];
  for (let i = 0; i < maxLen; i++) {
    result.push(array.map(a => (Array.isArray(a) ? a[i] : undefined) as T));
  }
  return result;
}
