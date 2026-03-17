/**
 * Capitalizes the first letter of a string and lowercases the rest.
 *
 * @param str - The string to capitalize.
 * @returns The capitalized string.
 *
 * @example
 * ```ts
 * capitalize('hello');            // 'Hello'
 * capitalize('HELLO');            // 'Hello'
 * capitalize('hELLO WORLD');      // 'Hello world'
 * capitalize('');                 // ''
 * capitalize('a');                // 'A'
 * ```
 */
export function capitalize(str: string): string {
  if (str.length === 0) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
