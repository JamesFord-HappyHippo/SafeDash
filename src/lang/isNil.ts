/**
 * Checks if a value is `null` or `undefined`.
 *
 * @param value - The value to check
 * @returns `true` if the value is `null` or `undefined`
 *
 * @example
 * ```ts
 * isNil(null);      // true
 * isNil(undefined); // true
 * isNil(0);         // false
 * isNil('');        // false
 * ```
 */
export function isNil(value: unknown): value is null | undefined {
  return value == null;
}

/**
 * Checks if a value is strictly `null`.
 *
 * @param value - The value to check
 * @returns `true` if the value is `null`
 *
 * @example
 * ```ts
 * isNull(null);      // true
 * isNull(undefined); // false
 * isNull(0);         // false
 * ```
 */
export function isNull(value: unknown): value is null {
  return value === null;
}

/**
 * Checks if a value is strictly `undefined`.
 *
 * @param value - The value to check
 * @returns `true` if the value is `undefined`
 *
 * @example
 * ```ts
 * isUndefined(undefined); // true
 * isUndefined(null);      // false
 * isUndefined(0);         // false
 * ```
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}
