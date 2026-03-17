/**
 * Security Guards — Prototype Pollution & Injection Prevention
 *
 * SafeDash — Security-Hardened Utility Library
 *
 * These guards are used throughout SafeDash to prevent:
 * - Prototype pollution via __proto__, constructor, prototype
 * - Unbounded recursion via depth limits
 * - Type confusion via strict type checks
 */

/** Keys that must never be written to — the prototype pollution vectors */
const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/** Check if a property key is safe to use */
export function isSafeKey(key: string): boolean {
  return typeof key === 'string' && !FORBIDDEN_KEYS.has(key);
}

/** Check if a value is a plain object (not a class instance, array, or null) */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/** Maximum recursion depth for nested operations */
export const MAX_DEPTH = 64;

/** Assert depth hasn't exceeded limit */
export function assertDepth(depth: number): void {
  if (depth > MAX_DEPTH) {
    throw new RangeError(`SafeDash: Maximum depth (${MAX_DEPTH}) exceeded — possible circular reference`);
  }
}

/** Filter an object's keys to only safe ones */
export function safeKeys(obj: object): string[] {
  return Object.keys(obj).filter(isSafeKey);
}

/** Safely check if an object has a property (no prototype chain walk) */
export function hasOwn(obj: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
