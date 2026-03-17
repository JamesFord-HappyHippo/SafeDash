/**
 * Performs a deep equality comparison between two values.
 *
 * Handles objects, arrays, `Date`, `RegExp`, `Map`, `Set`, and `NaN`.
 * Depth-limited to prevent stack overflow on deeply nested structures.
 * Circular-reference safe via `WeakSet` tracking.
 *
 * @param a - First value
 * @param b - Second value
 * @returns `true` if values are deeply equal
 *
 * @example
 * ```ts
 * isEqual({ x: 1, y: [2, 3] }, { x: 1, y: [2, 3] }); // true
 * isEqual([1, 2, 3], [1, 2, 3]);                        // true
 * isEqual(new Date('2024-01-01'), new Date('2024-01-01')); // true
 * isEqual(NaN, NaN);                                    // true
 * isEqual({ a: 1 }, { a: 2 });                          // false
 * ```
 *
 * @example
 * ```ts
 * // Circular references are handled safely
 * const a: any = { self: null };
 * a.self = a;
 * const b: any = { self: null };
 * b.self = b;
 * isEqual(a, b); // true
 * ```
 */

import { assertDepth } from '../_internal/guards.js';

export function isEqual(a: unknown, b: unknown): boolean {
  return _isEqual(a, b, 0, new WeakSet());
}

function _isEqual(
  a: unknown,
  b: unknown,
  depth: number,
  seen: WeakSet<object>,
): boolean {
  // Identical references (includes +0 === -0, but that's acceptable)
  if (a === b) return true;

  // NaN === NaN
  if (typeof a === 'number' && typeof b === 'number' && Number.isNaN(a) && Number.isNaN(b)) {
    return true;
  }

  // Both must be non-null objects from here
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }

  assertDepth(depth);

  // Circular reference detection
  if (seen.has(a as object) || seen.has(b as object)) {
    return true; // Treat circular refs as equal if we've already visited
  }

  // Date
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  if (a instanceof Date !== b instanceof Date) return false;

  // RegExp
  if (a instanceof RegExp && b instanceof RegExp) {
    return a.source === b.source && a.flags === b.flags;
  }
  if (a instanceof RegExp !== b instanceof RegExp) return false;

  // Map
  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    seen.add(a);
    seen.add(b);
    for (const [key, val] of a) {
      if (!b.has(key) || !_isEqual(val, b.get(key), depth + 1, seen)) {
        return false;
      }
    }
    return true;
  }
  if (a instanceof Map !== b instanceof Map) return false;

  // Set
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    seen.add(a);
    seen.add(b);
    for (const val of a) {
      if (!b.has(val)) return false;
    }
    return true;
  }
  if (a instanceof Set !== b instanceof Set) return false;

  // Arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    seen.add(a);
    seen.add(b);
    for (let i = 0; i < a.length; i++) {
      if (!_isEqual(a[i], b[i], depth + 1, seen)) return false;
    }
    return true;
  }
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  // Plain objects
  const keysA = Object.keys(a as Record<string, unknown>);
  const keysB = Object.keys(b as Record<string, unknown>);
  if (keysA.length !== keysB.length) return false;

  seen.add(a as object);
  seen.add(b as object);

  for (const key of keysA) {
    if (
      !Object.prototype.hasOwnProperty.call(b, key) ||
      !_isEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key],
        depth + 1,
        seen,
      )
    ) {
      return false;
    }
  }

  return true;
}
