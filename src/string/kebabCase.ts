/**
 * Converts a string to kebab-case.
 *
 * Handles camelCase, PascalCase, snake_case, and space-separated strings.
 *
 * @param str - The string to convert.
 * @returns The kebab-cased string.
 *
 * @example
 * ```ts
 * kebabCase('helloWorld');        // 'hello-world'
 * kebabCase('HelloWorld');        // 'hello-world'
 * kebabCase('hello_world');       // 'hello-world'
 * kebabCase('hello world');       // 'hello-world'
 * kebabCase('FOO_BAR');           // 'foo-bar'
 * kebabCase('__foo__bar__');      // 'foo-bar'
 * kebabCase('');                  // ''
 * ```
 */
export function kebabCase(str: string): string {
  const words = splitWords(str);
  return words.map((w) => w.toLowerCase()).join('-');
}

/**
 * Splits a string into words by detecting boundaries at non-alphanumeric
 * characters and uppercase/lowercase transitions.
 *
 * @internal
 */
function splitWords(str: string): string[] {
  const words: string[] = [];
  let current = '';

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const code = char.charCodeAt(0);
    const isUpper = code >= 65 && code <= 90;
    const isLower = code >= 97 && code <= 122;
    const isDigit = code >= 48 && code <= 57;

    if (!isUpper && !isLower && !isDigit) {
      if (current.length > 0) {
        words.push(current);
        current = '';
      }
      continue;
    }

    if (isUpper) {
      const prevCode = i > 0 ? str.charCodeAt(i - 1) : 0;
      const prevIsLower = prevCode >= 97 && prevCode <= 122;
      const prevIsDigit = prevCode >= 48 && prevCode <= 57;
      const prevIsUpper = prevCode >= 65 && prevCode <= 90;

      const nextCode = i + 1 < str.length ? str.charCodeAt(i + 1) : 0;
      const nextIsLower = nextCode >= 97 && nextCode <= 122;

      if (prevIsLower || prevIsDigit) {
        if (current.length > 0) {
          words.push(current);
          current = '';
        }
      } else if (prevIsUpper && nextIsLower && current.length > 1) {
        words.push(current.slice(0, -1));
        current = current.slice(-1);
      }
    }

    current += char;
  }

  if (current.length > 0) {
    words.push(current);
  }

  return words;
}
