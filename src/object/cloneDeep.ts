/**
 * Creates a deep clone of a value.
 *
 * Security: depth-limited to prevent stack overflow on circular refs.
 * Uses structuredClone when available, falls back to manual clone.
 *
 * @example
 * const obj = { a: { b: [1, 2, 3] } };
 * const clone = cloneDeep(obj);
 * clone.a.b.push(4);
 * obj.a.b  // [1, 2, 3] — original unchanged
 */
import { isPlainObject, assertDepth, isSafeKey } from '../_internal/guards.js';

export function cloneDeep<T>(value: T): T {
  // Use native structuredClone if available (Node 17+, all modern browsers)
  if (typeof globalThis.structuredClone === 'function') {
    try {
      return structuredClone(value);
    } catch {
      // Fall back for non-cloneable values (functions, symbols)
    }
  }

  return _clone(value, 0, new WeakMap()) as T;
}

function _clone(value: unknown, depth: number, seen: WeakMap<object, unknown>): unknown {
  // Primitives
  if (value === null || typeof value !== 'object') return value;
  assertDepth(depth);

  // Circular reference detection
  if (seen.has(value as object)) return seen.get(value as object);

  // Arrays
  if (Array.isArray(value)) {
    const arr: unknown[] = [];
    seen.set(value, arr);
    for (const item of value) {
      arr.push(_clone(item, depth + 1, seen));
    }
    return arr;
  }

  // Date
  if (value instanceof Date) return new Date(value.getTime());

  // RegExp
  if (value instanceof RegExp) return new RegExp(value.source, value.flags);

  // Map
  if (value instanceof Map) {
    const map = new Map();
    seen.set(value, map);
    for (const [k, v] of value) {
      map.set(_clone(k, depth + 1, seen), _clone(v, depth + 1, seen));
    }
    return map;
  }

  // Set
  if (value instanceof Set) {
    const set = new Set();
    seen.set(value, set);
    for (const v of value) {
      set.add(_clone(v, depth + 1, seen));
    }
    return set;
  }

  // Plain objects
  if (isPlainObject(value)) {
    const obj: Record<string, unknown> = {};
    seen.set(value, obj);
    for (const key of Object.keys(value)) {
      if (isSafeKey(key)) {
        obj[key] = _clone((value as Record<string, unknown>)[key], depth + 1, seen);
      }
    }
    return obj;
  }

  // Fallback: return as-is (class instances, buffers, etc.)
  return value;
}
