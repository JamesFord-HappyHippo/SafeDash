/**
 * Gets the value at `path` of `object`. Returns `defaultValue` if
 * the resolved value is `undefined`.
 *
 * Security: rejects paths containing __proto__, constructor, prototype.
 *
 * @example
 * get({ a: { b: { c: 3 } } }, 'a.b.c')      // 3
 * get({ a: { b: { c: 3 } } }, 'a.b.d', 0)   // 0
 * get({ a: [{ b: 1 }] }, 'a[0].b')           // 1
 */
import { isSafeKey } from '../_internal/guards.js';

export function get(obj: unknown, path: string | readonly string[], defaultValue?: unknown): unknown {
  if (obj == null) return defaultValue;

  const keys: readonly string[] = Array.isArray(path) ? path : parsePath(path as string);

  let current: unknown = obj;
  for (const key of keys) {
    if (!isSafeKey(key)) return defaultValue; // Block prototype pollution paths
    if (current == null || typeof current !== 'object') return defaultValue;
    current = (current as Record<string, unknown>)[key];
  }

  return current === undefined ? defaultValue : current;
}

/**
 * Parse a dot-notation path into segments.
 * Supports: 'a.b.c', 'a[0].b', 'a["b"].c'
 */
function parsePath(path: string): string[] {
  if (!path) return [];
  const result: string[] = [];
  const segments = path.replace(/\[(\d+)\]/g, '.$1').replace(/\[["']([^"']+)["']\]/g, '.$1').split('.');
  for (const seg of segments) {
    if (seg !== '') result.push(seg);
  }
  return result;
}
