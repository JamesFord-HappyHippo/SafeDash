/**
 * Flattens an array a single level deep, or to a specified depth.
 *
 * Security: depth is capped at 64 to prevent stack overflow on
 * circular or extremely nested structures.
 *
 * @param array - The array to flatten
 * @param depth - Maximum flatten depth (default: 1, max: 64)
 * @returns The new flattened array
 *
 * @example
 * flatten([1, [2, [3, [4]]]])        // [1, 2, [3, [4]]]
 * flatten([1, [2, [3, [4]]]], 2)     // [1, 2, 3, [4]]
 * flattenDeep([1, [2, [3, [4]]]])    // [1, 2, 3, 4]
 */
import { MAX_DEPTH } from '../_internal/guards.js';

export function flatten<T>(array: readonly unknown[], depth: number = 1): T[] {
  if (!Array.isArray(array)) return [];
  const d = Math.min(Math.max(Math.floor(depth), 0), MAX_DEPTH);
  return _flatten(array, d) as T[];
}

export function flattenDeep<T>(array: readonly unknown[]): T[] {
  return flatten<T>(array, MAX_DEPTH);
}

function _flatten(arr: readonly unknown[], depth: number): unknown[] {
  const result: unknown[] = [];
  for (const item of arr) {
    if (depth > 0 && Array.isArray(item)) {
      result.push(..._flatten(item, depth - 1));
    } else {
      result.push(item);
    }
  }
  return result;
}
