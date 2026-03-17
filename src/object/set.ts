/**
 * Sets the value at `path` of `object`. Creates intermediate objects/arrays
 * as needed. Returns a NEW object — never mutates the input.
 *
 * Security: rejects paths containing __proto__, constructor, prototype.
 * Always returns a new object (immutable by default).
 *
 * @example
 * set({}, 'a.b.c', 1)        // { a: { b: { c: 1 } } }
 * set({ a: 1 }, 'b', 2)      // { a: 1, b: 2 }
 * set({}, 'a[0].b', 'hi')    // { a: [{ b: 'hi' }] }
 */
import { isSafeKey, isPlainObject } from '../_internal/guards.js';

export function set<T extends Record<string, unknown>>(
  obj: T,
  path: string | readonly string[],
  value: unknown
): T {
  if (obj == null || typeof obj !== 'object') return obj;

  const keys: readonly string[] = Array.isArray(path)
    ? path
    : (path as string).replace(/\[(\d+)\]/g, '.$1').replace(/\[["']([^"']+)["']\]/g, '.$1').split('.').filter(Boolean);

  // Validate all keys are safe
  for (const key of keys) {
    if (!isSafeKey(key)) {
      throw new TypeError(`SafeDash: Unsafe path key "${key}" — prototype pollution blocked`);
    }
  }

  return _setImmutable(obj, keys, 0, value) as T;
}

function _setImmutable(obj: unknown, keys: readonly string[], index: number, value: unknown): unknown {
  if (index >= keys.length) return value;

  const key = keys[index]!;
  const isArrayIndex = /^\d+$/.test(key);

  // Clone current level
  let clone: Record<string, unknown> | unknown[];
  if (isArrayIndex) {
    clone = Array.isArray(obj) ? [...obj] : [];
  } else {
    clone = isPlainObject(obj) ? { ...obj as Record<string, unknown> } : {};
  }

  const nextValue = _setImmutable(
    (clone as Record<string, unknown>)[key],
    keys,
    index + 1,
    value
  );

  (clone as Record<string, unknown>)[key] = nextValue;
  return clone;
}
