/**
 * Deeply merges source objects into a NEW target object.
 * NEVER mutates the target. This is the function that caused
 * most lodash CVEs — SafeDash makes it safe.
 *
 * Security:
 * - Rejects __proto__, constructor, prototype keys
 * - Caps recursion at 64 levels
 * - Returns new objects (never mutates input)
 * - Only merges plain objects (no class instances)
 *
 * @example
 * merge({ a: 1, b: { c: 2 } }, { b: { d: 3 }, e: 4 })
 * // { a: 1, b: { c: 2, d: 3 }, e: 4 }
 */
import { isSafeKey, isPlainObject, assertDepth } from '../_internal/guards.js';

export function merge<T extends Record<string, unknown>>(
  target: T,
  ...sources: readonly Record<string, unknown>[]
): T {
  let result = isPlainObject(target) ? { ...target } : {} as Record<string, unknown>;

  for (const source of sources) {
    if (!isPlainObject(source)) continue;
    result = _deepMerge(result, source, 0) as Record<string, unknown>;
  }

  return result as T;
}

function _deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
  depth: number
): Record<string, unknown> {
  assertDepth(depth);

  const result = { ...target };

  for (const key of Object.keys(source)) {
    if (!isSafeKey(key)) continue; // Skip dangerous keys silently

    const sourceVal = source[key];
    const targetVal = result[key];

    if (isPlainObject(sourceVal) && isPlainObject(targetVal)) {
      result[key] = _deepMerge(
        targetVal as Record<string, unknown>,
        sourceVal as Record<string, unknown>,
        depth + 1
      );
    } else if (Array.isArray(sourceVal)) {
      result[key] = [...sourceVal]; // Clone arrays, don't merge them
    } else {
      result[key] = sourceVal;
    }
  }

  return result;
}
