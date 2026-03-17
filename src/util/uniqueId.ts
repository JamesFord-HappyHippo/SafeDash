/**
 * Generates a unique string ID. If a `prefix` is given, the ID is appended
 * to it. Uses a deterministic incrementing counter (not `Math.random`),
 * making it safe for testing and reproducible output.
 *
 * @param prefix - An optional string prefix for the ID
 * @returns A unique string ID
 *
 * @example
 * ```ts
 * uniqueId();          // '1'
 * uniqueId();          // '2'
 * uniqueId('user_');   // 'user_3'
 * uniqueId('contact_'); // 'contact_4'
 * ```
 */

let counter = 0;

export function uniqueId(prefix: string = ''): string {
  counter += 1;
  return `${prefix}${counter}`;
}
