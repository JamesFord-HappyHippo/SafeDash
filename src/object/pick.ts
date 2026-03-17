/**
 * Creates an object with only the picked keys.
 *
 * @example
 * pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])  // { a: 1, c: 3 }
 */
import { isSafeKey, hasOwn } from '../_internal/guards.js';

export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Pick<T, K> {
  if (obj == null || typeof obj !== 'object') return {} as Pick<T, K>;
  const result = {} as Record<string, unknown>;
  for (const key of keys) {
    const k = String(key);
    if (isSafeKey(k) && hasOwn(obj, k)) {
      result[k] = obj[k];
    }
  }
  return result as Pick<T, K>;
}

/**
 * Creates an object without the omitted keys.
 *
 * @example
 * omit({ a: 1, b: 2, c: 3 }, ['b'])  // { a: 1, c: 3 }
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Omit<T, K> {
  if (obj == null || typeof obj !== 'object') return {} as Omit<T, K>;
  const exclude = new Set(keys.map(String));
  const result = {} as Record<string, unknown>;
  for (const key of Object.keys(obj)) {
    if (!exclude.has(key) && isSafeKey(key)) {
      result[key] = obj[key];
    }
  }
  return result as Omit<T, K>;
}
