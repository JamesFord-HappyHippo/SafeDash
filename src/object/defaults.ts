/**
 * Assigns default values for undefined properties.
 * Unlike lodash defaultsDeep, this is NOT recursive by default
 * to avoid prototype pollution. Use `defaultsDeep` for nested defaults
 * with security guards.
 *
 * @example
 * defaults({ a: 1 }, { a: 2, b: 3 })  // { a: 1, b: 3 }
 */
import { isSafeKey, isPlainObject, assertDepth, hasOwn } from '../_internal/guards.js';

export function defaults<T extends Record<string, unknown>>(
  obj: T,
  ...sources: readonly Record<string, unknown>[]
): T {
  const result = { ...obj } as Record<string, unknown>;
  for (const source of sources) {
    if (!isPlainObject(source)) continue;
    for (const key of Object.keys(source)) {
      if (isSafeKey(key) && (result[key] === undefined || !hasOwn(result, key))) {
        result[key] = source[key];
      }
    }
  }
  return result as T;
}

/**
 * Deep version of `defaults`. Recursively assigns default values
 * for nested objects.
 *
 * Security: depth-limited, prototype-key-filtered.
 */
export function defaultsDeep<T extends Record<string, unknown>>(
  obj: T,
  ...sources: readonly Record<string, unknown>[]
): T {
  let result = isPlainObject(obj) ? { ...obj } : {} as Record<string, unknown>;
  for (const source of sources) {
    if (!isPlainObject(source)) continue;
    result = _defaultsDeep(result, source, 0);
  }
  return result as T;
}

function _defaultsDeep(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
  depth: number
): Record<string, unknown> {
  assertDepth(depth);
  const result = { ...target };

  for (const key of Object.keys(source)) {
    if (!isSafeKey(key)) continue;

    if (isPlainObject(source[key]) && isPlainObject(result[key])) {
      result[key] = _defaultsDeep(
        result[key] as Record<string, unknown>,
        source[key] as Record<string, unknown>,
        depth + 1
      );
    } else if (result[key] === undefined) {
      result[key] = source[key];
    }
  }

  return result;
}
