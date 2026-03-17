/**
 * Trims specified characters from both ends of a string.
 *
 * When called without `chars`, behaves like `String.prototype.trim()`.
 * When `chars` is provided, removes only those characters from the
 * start and end of the string.
 *
 * @param str - The string to trim.
 * @param chars - Optional string of characters to remove. Each character
 *   in the string is treated individually (not as a substring).
 * @returns The trimmed string.
 *
 * @example
 * ```ts
 * trim('  hello  ');              // 'hello'
 * trim('--hello--', '-');         // 'hello'
 * trim('_-hello-_', '_-');        // 'hello'
 * trim('xxhelloxx', 'x');         // 'hello'
 * ```
 */
export function trim(str: string, chars?: string): string {
  if (chars === undefined) return str.trim();

  const charSet = new Set(chars);
  let start = 0;
  let end = str.length;

  while (start < end && charSet.has(str[start])) {
    start++;
  }
  while (end > start && charSet.has(str[end - 1])) {
    end--;
  }

  return str.slice(start, end);
}

/**
 * Trims specified characters from the start (left side) of a string.
 *
 * @param str - The string to trim.
 * @param chars - Optional string of characters to remove.
 * @returns The trimmed string.
 *
 * @example
 * ```ts
 * trimStart('  hello  ');         // 'hello  '
 * trimStart('--hello--', '-');    // 'hello--'
 * ```
 */
export function trimStart(str: string, chars?: string): string {
  if (chars === undefined) return str.trimStart();

  const charSet = new Set(chars);
  let start = 0;

  while (start < str.length && charSet.has(str[start])) {
    start++;
  }

  return str.slice(start);
}

/**
 * Trims specified characters from the end (right side) of a string.
 *
 * @param str - The string to trim.
 * @param chars - Optional string of characters to remove.
 * @returns The trimmed string.
 *
 * @example
 * ```ts
 * trimEnd('  hello  ');           // '  hello'
 * trimEnd('--hello--', '-');      // '--hello'
 * ```
 */
export function trimEnd(str: string, chars?: string): string {
  if (chars === undefined) return str.trimEnd();

  const charSet = new Set(chars);
  let end = str.length;

  while (end > 0 && charSet.has(str[end - 1])) {
    end--;
  }

  return str.slice(0, end);
}
