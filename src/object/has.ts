/**
 * Checks if `path` is a direct property of `object`.
 *
 * Security: rejects __proto__, constructor, prototype paths.
 *
 * @example
 * has({ a: { b: 1 } }, 'a.b')  // true
 * has({ a: { b: 1 } }, 'a.c')  // false
 */
import { isSafeKey } from '../_internal/guards.js';

export function has(obj: unknown, path: string | readonly string[]): boolean {
  if (obj == null) return false;

  const keys: readonly string[] = Array.isArray(path)
    ? path
    : (path as string).replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean);

  let current: unknown = obj;
  for (const key of keys) {
    if (!isSafeKey(key)) return false;
    if (current == null || typeof current !== 'object') return false;
    if (!Object.prototype.hasOwnProperty.call(current, key)) return false;
    current = (current as Record<string, unknown>)[key];
  }

  return true;
}
