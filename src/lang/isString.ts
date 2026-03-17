/**
 * Type-checking utilities for common JavaScript types.
 *
 * Each function narrows the type via TypeScript type predicates.
 *
 * @example
 * ```ts
 * isString('hello');           // true
 * isNumber(42);                // true
 * isBoolean(false);            // true
 * isFunction(() => {});        // true
 * isArray([1, 2]);             // true
 * isObject({});                // true
 * isPlainObject({});           // true
 * isPlainObject(new Date());   // false
 * isDate(new Date());          // true
 * isRegExp(/abc/);             // true
 * isSymbol(Symbol('x'));       // true
 * isMap(new Map());            // true
 * isSet(new Set());            // true
 * ```
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Checks if a value is a string.
 *
 * @example
 * ```ts
 * isString('hello'); // true
 * isString(123);     // false
 * ```
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Checks if a value is a number (including `NaN` and `Infinity`).
 *
 * @example
 * ```ts
 * isNumber(42);   // true
 * isNumber(NaN);  // true
 * isNumber('42'); // false
 * ```
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

/**
 * Checks if a value is a boolean.
 *
 * @example
 * ```ts
 * isBoolean(true);  // true
 * isBoolean(0);     // false
 * ```
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Checks if a value is a function.
 *
 * @example
 * ```ts
 * isFunction(() => {});         // true
 * isFunction(class Foo {});     // true
 * isFunction('not a function'); // false
 * ```
 */
export function isFunction(value: unknown): value is (...args: any[]) => any {
  return typeof value === 'function';
}

/**
 * Checks if a value is an array.
 *
 * @example
 * ```ts
 * isArray([1, 2, 3]); // true
 * isArray('abc');      // false
 * ```
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Checks if a value is an object (non-null, non-array).
 * Includes class instances, `Date`, `Map`, etc.
 *
 * @example
 * ```ts
 * isObject({});          // true
 * isObject(new Date());  // true
 * isObject([]);          // false
 * isObject(null);        // false
 * ```
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Checks if a value is a plain object (created by `{}`, `Object.create(null)`,
 * or `new Object()`). Excludes class instances, arrays, and `null`.
 *
 * @example
 * ```ts
 * isPlainObject({});            // true
 * isPlainObject({ a: 1 });      // true
 * isPlainObject(new Date());    // false
 * isPlainObject([]);            // false
 * ```
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * Checks if a value is a `Date` instance.
 *
 * @example
 * ```ts
 * isDate(new Date());  // true
 * isDate('2024-01-01'); // false
 * ```
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

/**
 * Checks if a value is a `RegExp` instance.
 *
 * @example
 * ```ts
 * isRegExp(/abc/);           // true
 * isRegExp(new RegExp('x')); // true
 * isRegExp('abc');           // false
 * ```
 */
export function isRegExp(value: unknown): value is RegExp {
  return value instanceof RegExp;
}

/**
 * Checks if a value is a `Symbol`.
 *
 * @example
 * ```ts
 * isSymbol(Symbol('x'));  // true
 * isSymbol('x');          // false
 * ```
 */
export function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol';
}

/**
 * Checks if a value is a `Map` instance.
 *
 * @example
 * ```ts
 * isMap(new Map());  // true
 * isMap({});         // false
 * ```
 */
export function isMap(value: unknown): value is Map<unknown, unknown> {
  return value instanceof Map;
}

/**
 * Checks if a value is a `Set` instance.
 *
 * @example
 * ```ts
 * isSet(new Set());  // true
 * isSet([]);         // false
 * ```
 */
export function isSet(value: unknown): value is Set<unknown> {
  return value instanceof Set;
}
