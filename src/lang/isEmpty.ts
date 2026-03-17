/**
 * Checks if a value is empty.
 *
 * A value is considered empty if it is:
 * - `null` or `undefined`
 * - An empty string `''`
 * - An empty array `[]`
 * - An empty plain object `{}`
 * - A `Map` or `Set` with size 0
 *
 * Numbers and booleans are always considered non-empty.
 *
 * @param value - The value to check
 * @returns `true` if the value is empty
 *
 * @example
 * ```ts
 * isEmpty(null);          // true
 * isEmpty(undefined);     // true
 * isEmpty('');            // true
 * isEmpty([]);            // true
 * isEmpty({});            // true
 * isEmpty(new Map());     // true
 * isEmpty(new Set());     // true
 *
 * isEmpty('hello');       // false
 * isEmpty([1, 2]);        // false
 * isEmpty({ a: 1 });      // false
 * isEmpty(0);             // false
 * isEmpty(false);         // false
 * ```
 */
export function isEmpty(value: unknown): boolean {
  if (value == null) return true;

  if (typeof value === 'string') return value.length === 0;

  if (Array.isArray(value)) return value.length === 0;

  if (value instanceof Map || value instanceof Set) return value.size === 0;

  if (typeof value === 'object') {
    return Object.keys(value as object).length === 0;
  }

  return false;
}
