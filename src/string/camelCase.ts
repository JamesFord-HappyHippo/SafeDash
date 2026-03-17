/**
 * Converts a string to camelCase.
 *
 * Handles kebab-case, snake_case, PascalCase, and space-separated strings.
 * Splits on non-alphanumeric boundaries and uppercase transitions, then
 * lowercases the first word and capitalizes subsequent words.
 *
 * @param str - The string to convert.
 * @returns The camelCased string.
 *
 * @example
 * ```ts
 * camelCase('hello-world');       // 'helloWorld'
 * camelCase('hello_world');       // 'helloWorld'
 * camelCase('HelloWorld');        // 'helloWorld'
 * camelCase('hello world');       // 'helloWorld'
 * camelCase('FOO_BAR');           // 'fooBar'
 * camelCase('--foo--bar--');      // 'fooBar'
 * camelCase('');                  // ''
 * ```
 */
export function camelCase(str: string): string {
  const words = splitWords(str);
  if (words.length === 0) return '';

  return words
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index === 0) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join('');
}

/**
 * Splits a string into an array of words by detecting boundaries between
 * non-alphanumeric characters and uppercase/lowercase transitions.
 *
 * @param str - The string to split.
 * @returns An array of word segments.
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
      // Non-alphanumeric character acts as a separator
      if (current.length > 0) {
        words.push(current);
        current = '';
      }
      continue;
    }

    if (isUpper) {
      // Check if this starts a new word
      const prevChar = i > 0 ? str[i - 1] : '';
      const prevCode = prevChar.charCodeAt(0);
      const prevIsLower = prevCode >= 97 && prevCode <= 122;
      const prevIsDigit = prevCode >= 48 && prevCode <= 57;

      // Start new word if previous char was lowercase/digit, or if this is
      // an uppercase followed by a lowercase in a run of uppercase chars
      // (e.g., "FOOBar" -> ["FOO", "Bar"])
      const nextChar = i + 1 < str.length ? str[i + 1] : '';
      const nextCode = nextChar.charCodeAt(0);
      const nextIsLower = nextCode >= 97 && nextCode <= 122;

      const prevIsUpper = prevCode >= 65 && prevCode <= 90;

      if (prevIsLower || prevIsDigit) {
        if (current.length > 0) {
          words.push(current);
          current = '';
        }
      } else if (prevIsUpper && nextIsLower && current.length > 1) {
        // Handle "FOOBar" -> push "FO", start "O" for "OBar"
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
