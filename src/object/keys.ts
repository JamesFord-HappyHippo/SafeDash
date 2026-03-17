/**
 * Object key/value/entry utilities with prototype-safe filtering.
 *
 * @example
 * keys({ a: 1, b: 2 })          // ['a', 'b']
 * values({ a: 1, b: 2 })        // [1, 2]
 * entries({ a: 1, b: 2 })       // [['a', 1], ['b', 2]]
 * mapKeys({ a: 1 }, (v, k) => k.toUpperCase())  // { A: 1 }
 * mapValues({ a: 1, b: 2 }, v => v * 2)         // { a: 2, b: 4 }
 */
import { isSafeKey } from '../_internal/guards.js';

export function keys(obj: object): string[] {
  if (obj == null || typeof obj !== 'object') return [];
  return Object.keys(obj).filter(isSafeKey);
}

export function values<T>(obj: Record<string, T>): T[] {
  if (obj == null || typeof obj !== 'object') return [];
  return keys(obj).map(k => obj[k]);
}

export function entries<T>(obj: Record<string, T>): [string, T][] {
  if (obj == null || typeof obj !== 'object') return [];
  return keys(obj).map(k => [k, obj[k]]);
}

export function mapKeys<T>(
  obj: Record<string, T>,
  iteratee: (value: T, key: string) => string
): Record<string, T> {
  const result: Record<string, T> = {};
  for (const key of keys(obj)) {
    const newKey = iteratee(obj[key], key);
    if (isSafeKey(newKey)) {
      result[newKey] = obj[key];
    }
  }
  return result;
}

export function mapValues<T, U>(
  obj: Record<string, T>,
  iteratee: (value: T, key: string) => U
): Record<string, U> {
  const result: Record<string, U> = {};
  for (const key of keys(obj)) {
    result[key] = iteratee(obj[key], key);
  }
  return result;
}

export function invert(obj: Record<string, string | number>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of keys(obj)) {
    const val = String(obj[key]);
    if (isSafeKey(val)) {
      result[val] = key;
    }
  }
  return result;
}
