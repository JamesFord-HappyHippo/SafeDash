/**
 * Safe Object.assign — filters prototype pollution keys.
 *
 * Unlike native Object.assign, this:
 * 1. Returns a NEW object (never mutates target)
 * 2. Filters __proto__, constructor, prototype keys
 *
 * @example
 * assign({ a: 1 }, { b: 2 }, { c: 3 })  // { a: 1, b: 2, c: 3 }
 */
import { isSafeKey, isPlainObject } from '../_internal/guards.js';

export function assign<T extends Record<string, unknown>>(
  target: T,
  ...sources: readonly Record<string, unknown>[]
): T {
  const result = isPlainObject(target) ? { ...target } : {} as Record<string, unknown>;

  for (const source of sources) {
    if (source == null || typeof source !== 'object') continue;
    for (const key of Object.keys(source)) {
      if (isSafeKey(key)) {
        result[key] = source[key];
      }
    }
  }

  return result as T;
}
