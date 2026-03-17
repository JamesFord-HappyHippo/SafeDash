/**
 * Pads the start of a string to the given length with the specified
 * fill string (or spaces by default).
 *
 * If the string is already longer than or equal to the target length,
 * it is returned unchanged.
 *
 * @param str - The string to pad.
 * @param length - The target minimum length.
 * @param fillStr - The string used to fill the padding. Defaults to `' '`.
 * @returns The padded string.
 *
 * @example
 * ```ts
 * padStart('hello', 10);          // '     hello'
 * padStart('hello', 10, '.');     // '.....hello'
 * padStart('hello', 10, 'ab');    // 'ababahello'
 * padStart('hello', 3);           // 'hello'
 * ```
 */
export function padStart(str: string, length: number, fillStr: string = ' '): string {
  if (str.length >= length || fillStr.length === 0) return str;

  const needed = length - str.length;
  const fill = buildFill(fillStr, needed);
  return fill + str;
}

/**
 * Pads the end of a string to the given length with the specified
 * fill string (or spaces by default).
 *
 * @param str - The string to pad.
 * @param length - The target minimum length.
 * @param fillStr - The string used to fill the padding. Defaults to `' '`.
 * @returns The padded string.
 *
 * @example
 * ```ts
 * padEnd('hello', 10);            // 'hello     '
 * padEnd('hello', 10, '.');       // 'hello.....'
 * padEnd('hello', 10, 'ab');      // 'helloababa'
 * padEnd('hello', 3);             // 'hello'
 * ```
 */
export function padEnd(str: string, length: number, fillStr: string = ' '): string {
  if (str.length >= length || fillStr.length === 0) return str;

  const needed = length - str.length;
  const fill = buildFill(fillStr, needed);
  return str + fill;
}

/**
 * Pads both sides of a string to center it within the given length.
 *
 * When the padding amount is odd, the extra character is added to the end.
 *
 * @param str - The string to pad.
 * @param length - The target minimum length.
 * @param fillStr - The string used to fill the padding. Defaults to `' '`.
 * @returns The padded string.
 *
 * @example
 * ```ts
 * pad('hello', 11);               // '   hello   '
 * pad('hello', 10);               // '  hello   '
 * pad('hello', 10, '-');          // '--hello---'
 * pad('hello', 3);                // 'hello'
 * ```
 */
export function pad(str: string, length: number, fillStr: string = ' '): string {
  if (str.length >= length || fillStr.length === 0) return str;

  const needed = length - str.length;
  const leftLen = Math.floor(needed / 2);
  const rightLen = needed - leftLen;

  return buildFill(fillStr, leftLen) + str + buildFill(fillStr, rightLen);
}

/**
 * Builds a fill string of exactly the specified length by repeating
 * and trimming the fill pattern.
 *
 * @internal
 */
function buildFill(fillStr: string, length: number): string {
  if (length <= 0) return '';
  const repeats = Math.ceil(length / fillStr.length);
  return fillStr.repeat(repeats).slice(0, length);
}
