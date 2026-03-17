/**
 * Options for the {@link truncate} function.
 */
export interface TruncateOptions {
  /** Maximum length of the resulting string (including omission). Defaults to 30. */
  length?: number;
  /** The string to append when truncation occurs. Defaults to `'...'`. */
  omission?: string;
  /**
   * If provided, truncation will break at the last occurrence of this
   * separator that keeps the result within the length limit.
   */
  separator?: string;
}

/**
 * Truncates a string to the specified length, appending an omission string
 * (default `'...'`) when the input exceeds the limit.
 *
 * When a `separator` is provided, truncation breaks at the last occurrence
 * of that separator that fits within the length limit, avoiding mid-word cuts.
 *
 * @param str - The string to truncate.
 * @param options - Truncation options.
 * @returns The truncated string.
 *
 * @example
 * ```ts
 * truncate('This is a very long string', { length: 15 });
 * // 'This is a ve...'
 *
 * truncate('This is a very long string', { length: 15, omission: '---' });
 * // 'This is a ve---'
 *
 * truncate('This is a very long string', { length: 15, separator: ' ' });
 * // 'This is a...'
 *
 * truncate('short');
 * // 'short'
 * ```
 */
export function truncate(str: string, options: TruncateOptions = {}): string {
  const { length = 30, omission = '...', separator } = options;

  if (str.length <= length) return str;

  const maxContent = length - omission.length;
  if (maxContent <= 0) return omission.slice(0, length);

  let truncated = str.slice(0, maxContent);

  if (separator !== undefined) {
    const lastSep = truncated.lastIndexOf(separator);
    if (lastSep > 0) {
      truncated = truncated.slice(0, lastSep);
    }
  }

  return truncated + omission;
}
