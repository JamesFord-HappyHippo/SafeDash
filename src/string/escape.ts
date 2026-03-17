/** Map of HTML characters to their entity replacements. */
const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Map of HTML entities back to their characters. */
const HTML_UNESCAPE_MAP: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
};

/**
 * Escapes HTML special characters in a string.
 *
 * Replaces `&`, `<`, `>`, `"`, and `'` with their corresponding HTML entities.
 *
 * @param str - The string to escape.
 * @returns The HTML-escaped string.
 *
 * @example
 * ```ts
 * escape('<div class="test">Tom & Jerry</div>');
 * // '&lt;div class=&quot;test&quot;&gt;Tom &amp; Jerry&lt;/div&gt;'
 *
 * escape("it's a test");
 * // 'it&#39;s a test'
 * ```
 */
export function escape(str: string): string {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    result += HTML_ESCAPE_MAP[char] ?? char;
  }
  return result;
}

/**
 * Unescapes HTML entities back to their corresponding characters.
 *
 * @param str - The string to unescape.
 * @returns The unescaped string.
 *
 * @example
 * ```ts
 * unescape('&lt;div&gt;Tom &amp; Jerry&lt;/div&gt;');
 * // '<div>Tom & Jerry</div>'
 * ```
 */
export function unescape(str: string): string {
  let result = '';
  let i = 0;
  while (i < str.length) {
    if (str[i] === '&') {
      let matched = false;
      for (const [entity, char] of Object.entries(HTML_UNESCAPE_MAP)) {
        if (str.startsWith(entity, i)) {
          result += char;
          i += entity.length;
          matched = true;
          break;
        }
      }
      if (!matched) {
        result += str[i];
        i++;
      }
    } else {
      result += str[i];
      i++;
    }
  }
  return result;
}

/**
 * Escapes special regular expression characters in a string so it can be
 * used safely as a literal pattern in a `RegExp` constructor.
 *
 * Characters escaped: `\ ^ $ . * + ? ( ) [ ] { } |`
 *
 * @param str - The string to escape for use in a regular expression.
 * @returns The regex-escaped string.
 *
 * @example
 * ```ts
 * escapeRegExp('[lodash](https://lodash.com/)');
 * // '\\[lodash\\]\\(https://lodash\\.com/\\)'
 *
 * escapeRegExp('price: $5.00');
 * // 'price: \\$5\\.00'
 * ```
 */
export function escapeRegExp(str: string): string {
  const special = new Set(['\\', '^', '$', '.', '*', '+', '?', '(', ')', '[', ']', '{', '}', '|']);
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (special.has(char)) {
      result += '\\';
    }
    result += char;
  }
  return result;
}
